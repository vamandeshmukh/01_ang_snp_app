import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Params, Router } from '@angular/router';
import { Observable, of as observableOf } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { UserService } from '../../../services/user.service';
import { BaseComponent } from '../../base/base.component';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-create-password',
  templateUrl: './create-password.component.html',
  styleUrls: ['./create-password.component.css']
})
export class CreatePasswordComponent extends BaseComponent implements OnInit {
  form: FormGroup;
  existinUser: Params;
  isNewForm: Observable<Boolean>;

  constructor(private userService: UserService, private router: Router, private formBuilder: FormBuilder, private toastService: ToastrService) {
    super();
    this.existinUser = this.router.getCurrentNavigation().extras.queryParams;
  }

  ngOnInit() {
    this.isNewForm = observableOf(true);
    this.form = this.formBuilder.group({
      id: [this.existinUser.id],
      password: ['', [
        Validators.required,
        Validators.minLength(8)
      ]],
      confirmPassword: ['', [
        Validators.required,
        Validators.minLength(8)
      ]]
    });
  }

  isFieldInvalid(field: string) {
    return (this.form.controls[field].invalid && (this.form.controls[field].dirty || this.form.controls[field].touched));
  }

  onSubmit() {
    if (this.form.value.password !== this.form.value.confirmPassword) {
      this.toastService.error("Password entered do not match!");
      return;
    }
   
    this.userService.updateUser(this.form.value).pipe(takeUntil(this.unsubscribe)).subscribe();
    this.isNewForm = observableOf(false);
  }
}

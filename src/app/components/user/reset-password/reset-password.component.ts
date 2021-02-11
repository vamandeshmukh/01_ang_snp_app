import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';

import { UserService } from '../../../services/user.service';
import { UtilityService } from '../../../services/utility.service';
import { BaseComponent } from '../../base/base.component';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent extends BaseComponent implements OnInit {
  form: FormGroup;

  constructor(private formBuilder: FormBuilder, private toastService: ToastrService,
    private userService: UserService, private utility: UtilityService,
    private router: Router) {
    super();
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: ['', Validators.email],
      dob: ['', Validators.required]
    });
  }

  isFieldInvalid(field: string) {
    return (this.form.controls[field].invalid && (this.form.controls[field].dirty || this.form.controls[field].touched));
  }

  onSubmit() {
    this.userService.getUserByEmail(this.form.value.email).pipe(takeUntil(this.unsubscribe)).subscribe(userReturn => {

      if (!userReturn || userReturn.length <= 0) {
        this.toastService.error('Email does not exist!');
        return;
      }

      let existingUser = userReturn[0];

      let isDateMatch = this.utility.validateDob(existingUser.dob, this.form.value.dob);
      if (!isDateMatch) {
        this.toastService.error('Date of birth does not match');
        return;
      }

      this.router.navigate(['create-password'], { queryParams: { id: existingUser._id } });
    });
  }
}

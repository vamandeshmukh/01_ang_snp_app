import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import * as _ from 'underscore';
import { Observable, of as observableOf } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { takeUntil } from 'rxjs/operators';

import { UserService } from '../../../services/user.service';
import { BaseComponent } from '../../base/base.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent extends BaseComponent {
  form: FormGroup;
  formType: string;
  submitType: string;
  isNewForm: Observable<boolean>;
  genders: string[] = ['Male', 'Female'];

  constructor(private userService: UserService, private formBuilder: FormBuilder, private toastService: ToastrService) {
    super();
    this.registerNewUser();
  }

  private registerNewUser() {
    this.submitType = 'SAVE';
    this.formType = 'Registration';
    this.isNewForm = observableOf(true);
    this.form = this.formBuilder.group({
      id: [''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      gender: ['', Validators.required],
      dob: ['', Validators.required],
      phone: [''],
      city: [''],
      state: [''],
      country: [''],
      pincode: [''],
      profession: ['Developer'],
      email: ['', [
        Validators.required,
        Validators.pattern("[^ @]*@[^ @]*")
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(8)
      ]],
      isActive: [true]
    });
  }

  isFieldInvalid(field: string) {
    return (this.form.controls[field].invalid && (this.form.controls[field].dirty || this.form.controls[field].touched));
  }

  onSubmit() {
    this.userService.getUserByEmail(this.form.value.email).pipe(takeUntil(this.unsubscribe)).subscribe(users => {
      if (users && users.length > 0) {
        this.toastService.error('Email already exist!');
        return;
      }

      this.userService.register(this.form.value).pipe(takeUntil(this.unsubscribe)).subscribe(() => {
        this.isNewForm = observableOf(false);
      });
    })

  }
}

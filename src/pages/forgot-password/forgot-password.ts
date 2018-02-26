import { LoginPage } from './../login/login';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SignUpPage } from '../sign-up/sign-up';


import { LoginProvider } from '../../providers/login/login';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';


/**
 * Generated class for the ForgotPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
})
export class ForgotPasswordPage {

  form: FormGroup;
  requesting: boolean = false

  constructor(public navCtrl: NavController, public navParams: NavParams, private loginProvider: LoginProvider, private fb: FormBuilder) {
    this.InitializeForm()
  }

  InitializeForm() {
    let EMAIL_REGEXP = /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/;

    var data = {
      email: ['', [Validators.required, Validators.pattern(EMAIL_REGEXP)]]
    }

    this.form = this.fb.group(data);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  goSignUp(): void {
    this.navCtrl.push(SignUpPage);
  }

  Reset(): void {

    if (this.requesting)
      return;

    if (!this.form.valid) {
      this.form.get('email').markAsTouched()
      return;
    }

    this.requesting = true

    this.loginProvider.Forgot(this.form.value.email).subscribe(
      respond => {

        this.requesting = false

        if (respond == "Email sent")
          this.loginProvider.ShowAlert("Great", "Please check your email")
        else
          this.loginProvider.ShowAlert("Sorry", "Recover password service is not available")

        this.form.value.email = ''
      },
      error => {
        this.requesting = false
        this.loginProvider.ShowAlert("Sorry", "Recover password service is not available")
      },
      () => { }
    )
    //this.navCtrl.push(LoginPage);
  }
}


import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {ForgotPasswordPage} from '../forgot-password/forgot-password';
import {SignUpPage} from '../sign-up/sign-up';
import {HomePage} from '../home/home';

import {LoginProvider} from '../../providers/login/login';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';



/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  form: FormGroup;
  requesting:boolean=false

  constructor(public navCtrl: NavController, public navParams: NavParams,private loginProvider: LoginProvider,private fb: FormBuilder) {
    this.InitializeForm()
  }

  InitializeForm() {
    let EMAIL_REGEXP = /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/;

    var data = {
      email: ['', [Validators.required, Validators.pattern(EMAIL_REGEXP)]],
      password: ['', Validators.required],
    }

    this.form = this.fb.group(data);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  goForgot():void{
    this.navCtrl.push(ForgotPasswordPage);
  }

  goSignUp():void{
    this.navCtrl.push(SignUpPage);
  }

  goHome():void{
     
    if(this.requesting)
    return;

    if(!this.form.valid)
    {
      this.form.get('email').markAsTouched()
      this.form.get('password').markAsTouched()

      return;
    }

    this.requesting = true

    this.loginProvider.Sign(this.form.value.email, this.form.value.password).subscribe(
      respond => {

        this.Profile(respond.access_token)
      },
      error => {
        this.requesting = false

        if (typeof(error._body) !== 'undefined')
        {
           if(JSON.parse(error._body).error_description=="invalid_username_or_password")
           {
              this.loginProvider.ShowAlert("Error","Invalid username or password")
           }
           else
           this.loginProvider.ShowAlert("Error","Error trying to login")
        }
        else
        {
          this.loginProvider.ShowAlert("Error","Error trying to login")
        }
      },
      ()=> { }
    )
  
  }

  Profile(token: string) {
    this.loginProvider.Profile(token).subscribe(result => {

      this.requesting = false
      this.Save({ name: result[0].FirstName + " " + result[0].LastName, email: this.form.value.email, token: token, provider: "itorah" })
    }, error => {
      this.requesting = false
    }, () => { })
  }

  Save(data: any) {

    localStorage.setItem('userItorah', JSON.stringify({ name: data.name, email: data.email, token: data.token, provider: data.provider }))
    this.navCtrl.push(HomePage); // this is to navigate when the login is succesful
  }

}
import { HomePage } from './../home/home';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


import { LoginProvider } from '../../providers/login/login';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';

/**
 * Generated class for the SignUpPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html',
})
export class SignUpPage {

  form: FormGroup;
  requesting: boolean = false

  constructor(public navCtrl: NavController, public navParams: NavParams, private loginProvider: LoginProvider, private fb: FormBuilder) {
    this.InitializeForm()
  }

  InitializeForm() {
    let EMAIL_REGEXP = /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/;

    var data = {
      first: ['', Validators.required],
      last: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(EMAIL_REGEXP)]],
      password: ['', Validators.required],
      confirm: ['', Validators.required]
    }

    this.form = this.fb.group(data);
  }


  goHome(): void {
    

    if (this.requesting)
      return;

    if (!this.form.valid) {

      this.form.get('first').markAsTouched()
      this.form.get('last').markAsTouched()
      this.form.get('email').markAsTouched()
      this.form.get('password').markAsTouched()
      this.form.get('confirm').markAsTouched()

      return;
    }

    this.requesting=true

    this.loginProvider.Create({
      Email: this.form.value.email,
      FirstName: this.form.value.first,
      LastName: this.form.value.last,
      Password: this.form.value.password
    }).subscribe(
      data => {
        this.requesting = false
        if (data) {

          this.loginProvider.ShowAlert("Good!","Account Created")  
          this.navCtrl.pop()
        
        }
        else
        {
           this.loginProvider.ShowAlert('Sorry',"It was impossible to create the account")
        }
      }, error => {
        this.requesting = false
        this.loginProvider.ShowAlert('Sorry',"It was impossible to create the account")
      }, () => { })

    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignUpPage');
  }

}

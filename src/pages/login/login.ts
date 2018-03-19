
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ForgotPasswordPage } from '../forgot-password/forgot-password';
import { SignUpPage } from '../sign-up/sign-up';
import { HomePage } from '../home/home';

import { LoginProvider } from '../../providers/login/login';
import { SettingsProvider, Item, ItemPlayer, URL, Setting } from '../../providers/settings/settings';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { PlaylistPage } from "../playlist/playlist";

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
  requesting: boolean = false


  setting: Setting = { downloadDays: '0', downloadTime: "01:01:00", savedPlaylist: '0', wifiOnly: false }

  constructor(private afs: AngularFirestore, public navCtrl: NavController, public navParams: NavParams, private loginProvider: LoginProvider, private fb: FormBuilder, private settingsProvider: SettingsProvider) {
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

  goForgot(): void {
    this.navCtrl.push(ForgotPasswordPage);
  }

  goSignUp(): void {
    this.navCtrl.push(SignUpPage);
  }

  goHome(): void {

    if (this.requesting)
      return;

    if (!this.form.valid) {
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

        if (typeof (error._body) !== 'undefined') {
          if (JSON.parse(error._body).error_description == "invalid_username_or_password") {
            this.loginProvider.ShowToast( error._body)
          }
          else
            this.loginProvider.ShowAlert("Error", "Error trying to login")
        }
        else {
          this.loginProvider.ShowAlert("Error", "Error trying to login")
        }
      },
      () => { }
    )

  }

  Profile(token: string) {
    this.loginProvider.Profile(token).subscribe(result => {

      

      this.afs.collection("usuario").doc(this.form.value.email).ref.get().then(doc=> {
        
        if (doc.exists) 
        {
          this.setting.downloadDays= doc.data().downloadDays
          this.setting.downloadTime= doc.data().downloadTime
          this.setting.savedPlaylist= doc.data().savedPlaylist
          this.setting.wifiOnly= doc.data().wifiOnly
        } 

        this.LoadFromServer(token,result)
        
      }).catch(error=> {
        this.requesting = false
        console.log("Error getting document:", error);
      });


    }, error => {
      this.requesting = false
    }, () => { })
  }

  Save(data: any) {

    localStorage.setItem('userItorah', JSON.stringify({ name: data.name, email: data.email, token: data.token, provider: data.provider }))

  }


  LoadFromServer(token: string, data: any) {
    this.settingsProvider.getItems(token).subscribe(respond => {

      this.requesting = false

      var d = this.setting.savedPlaylist.split(',')

      respond.forEach(element => {
        if (element.id != 6 && d.indexOf(element.id.toString()) >= 0)
          this.Add(element)
      });

      var item = respond.find(i => i.title == "Parasha of the Week")

      item.subList.forEach(element => {
        if (d.indexOf(element.id.toString()) >= 0)
          this.Add(element)
      });

      localStorage.setItem("favorites", JSON.stringify(this.items))
      this.Save({ name: data[0].FirstName + " " + data[0].LastName, email: this.form.value.email, token: token, provider: "itorah" })
      this.SaveSettings()


    }, error => {  this.requesting = false}, () => { })
  }

  items: Array<ItemPlayer> = []

  Add(item: Item) {

    var newOne = new ItemPlayer()
    newOne.id = item.id
    newOne.color = "gris"

    newOne.nombre = item.title.split(" by ")[0]
    newOne.descripcion = "by " + item.title.split(" by ")[1]
    newOne.url = ''

    this.items.push(newOne)
  }

  SaveSettings() {
    this.settingsProvider.UpdateFireBase(this.setting).then(result => { }).catch(error => { })
    //this.navCtrl.push(HomePage); // this is to navigate when the login is succesful

    this.navCtrl.push(PlaylistPage).then(() => {                 //remove the current page from the stack
      const startIndex = this.navCtrl.getActive().index - 1;
      this.navCtrl.remove(startIndex, 1);
    });
  }

}

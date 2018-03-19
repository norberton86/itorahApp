import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { LoginProvider } from '../../providers/login/login';
/**
 * Generated class for the SignOutPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sign-out',
  templateUrl: 'sign-out.html',
})
export class SignOutPage {


  name:string=''

  father:string

  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl: ViewController,private loginProvider:LoginProvider) {
     this.father=this.navParams.data.father
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignOutPage');
    if (this.loginProvider.getToken() != '')  //to load the initials of the user's name
    {
     this.name = JSON.parse(localStorage.getItem('userItorah')).name;
    }

  }

  close() {
    localStorage.clear()
    this.loginProvider.setItemsLogOut(this.father)
    this.viewCtrl.dismiss();

  }

}

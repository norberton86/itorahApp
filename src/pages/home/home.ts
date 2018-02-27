import { SettingsPage } from './../settings/settings';
import { NoConnectionPage } from './../no-connection/no-connection';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {LoginProvider} from '../../providers/login/login';

import { Network } from '@ionic-native/network';
/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  name:string=''
  disconnectSubscription:any

  constructor(public navCtrl: NavController, public navParams: NavParams,private loginProvider:LoginProvider,private network: Network) {

     /*this.disconnectSubscription = this.network.onDisconnect().subscribe(() => {
        this.goNoConnection()
     });*/
     
    /* let self=this
     setTimeout(function(){
        self.goNoConnection()
     },5000)*/
  }


   
  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');

    if(this.loginProvider.getToken()!='')  //to load the initials of the user's name
    {
      this.name = JSON.parse(localStorage.getItem('userItorah')).name;
      this.name = this.name.split(" ")[0][0] + this.name.split(" ")[1][0] 
    }
  }

  goNoConnection(): void{
    this.navCtrl.push(NoConnectionPage)
  }

  goSettings():void{
    this.navCtrl.push(SettingsPage);
  }
}

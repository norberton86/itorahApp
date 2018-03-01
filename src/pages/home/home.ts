import { SettingsPage } from './../settings/settings';
import { NoConnectionPage } from './../no-connection/no-connection';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { LoginProvider } from '../../providers/login/login';

import { Network } from '@ionic-native/network';
import { LocalNotifications } from "@ionic-native/local-notifications";
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

  name: string = ''
  disconnectSubscription: any

  constructor(private localNotifications: LocalNotifications, public navCtrl: NavController, public navParams: NavParams, private loginProvider: LoginProvider, private network: Network, private platform: Platform) {

    this.disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      this.goNoConnection()
    });


    this.platform.ready().then((ready) => {

      this.localNotifications.cancelAll().then(() => {                     //first cancell all notification

        this.localNotifications.on('trigger', (notification, state) => {

          //notification.data

          if (this.network.type == 'wifi') //download only with wifi 
          {

          }
          else  //downlaod always
          {

          }

        })
      })


    })
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');

    if (this.loginProvider.getToken() != '')  //to load the initials of the user's name
    {
      this.name = JSON.parse(localStorage.getItem('userItorah')).name;
      this.name = this.name.split(" ")[0][0] + this.name.split(" ")[1][0]
    }
  }

  goNoConnection(): void {
    this.navCtrl.push(NoConnectionPage)
  }

  goSettings(): void {
    this.navCtrl.push(SettingsPage);
  }
}

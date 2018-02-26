import { SettingsPage } from './../settings/settings';
import { NoConnectionPage } from './../no-connection/no-connection';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }

  goNoConnection(): void{
    this.navCtrl.push(NoConnectionPage)
  }

  goSettings():void{
    this.navCtrl.push(SettingsPage);
  }
}

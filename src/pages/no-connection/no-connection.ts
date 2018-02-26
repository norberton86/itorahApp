import { SettingsPage } from './../settings/settings';
import { PlaylistPage } from './../playlist/playlist';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the NoConnectionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-no-connection',
  templateUrl: 'no-connection.html',
})
export class NoConnectionPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NoConnectionPage');
  }

  goPlayList():void{
    this.navCtrl.push(PlaylistPage);
  }

  goSettings():void{
    this.navCtrl.push(SettingsPage);
  }
}

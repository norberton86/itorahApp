import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,Platform} from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {SettingsProvider,Setting} from '../../providers/settings/settings';

import { Network } from '@ionic-native/network';



/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  form: FormGroup;
  requesting:boolean=false

  savedPlaylist:string="1,2"

  constructor(public navCtrl: NavController, public navParams: NavParams,private fb: FormBuilder,private settingsProvider:SettingsProvider, private platform: Platform,private network:Network) {
     this.InitializeForm()
  }

  InitializeForm() {

    var data = {
      wifiOnly: 'true',
      downloadTime: "2000-00-00T10:53:49-05:00",//new Date().toISOString(),
      downloadDays: [[1,2,3]],
    }

    this.form = this.fb.group(data);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');

   
  }

  checkNetwork() {
         this.platform.ready().then(() => {

           if( this.network.type=='wifi') //download only with wifi 
           {

           }
           else  //downlaod always
           {

           }
       
    });
  }

  

}


Date.prototype.toISOString = function() {
    var tzo = -this.getTimezoneOffset(),
        dif = tzo >= 0 ? '+' : '-',
        pad = function(num) {
            var norm = Math.floor(Math.abs(num));
            return (norm < 10 ? '0' : '') + norm;
        };
    return this.getFullYear() +
        '-' + pad(this.getMonth() + 1) +
        '-' + pad(this.getDate()) +
        'T' + pad(this.getHours()) +
        ':' + pad(this.getMinutes()) +
        ':' + pad(this.getSeconds()) +
        dif + pad(tzo / 60) +
        ':' + pad(tzo % 60);
}
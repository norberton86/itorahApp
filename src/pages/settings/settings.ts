import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams} from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {SettingsProvider,Setting} from '../../providers/settings/settings';

import { Network } from '@ionic-native/network';
import { LocalNotifications } from '@ionic-native/local-notifications';

import * as moment from 'moment';

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

  constructor(private localNotifications:LocalNotifications,public navCtrl: NavController, public navParams: NavParams,private fb: FormBuilder,private settingsProvider:SettingsProvider,private network:Network) {
     this.InitializeForm()
  }

  InitializeForm() {

    var data = {
      wifiOnly: 'false',
      downloadTime: "2000-00-00T00:00:00-05:00",//new Date().toISOString(),
      downloadDays: [[]],
    }

    this.form = this.fb.group(data);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
    
    this.settingsProvider.getSettings().subscribe(setting=>{
      
          var now =new Date().toISOString()

          var dateForForm="2000-00-00T"+setting.downloadTime+now.substr(now.length-6)

          this.form.patchValue({wifiOnly:setting.wifiOnly,downloadTime:dateForForm,downloadDays:setting.downloadDays.split('')})
          
    },error=>{},()=>{})

  }

  ScheduleTask(_connectionType:string,_url:string)
  {
    
    this.localNotifications.schedule({
      id:1,
      title:'Downloading',
      text:'',
      at:(new Date().getTime()+10000),
      data:{connectionType:_connectionType,url:_url}
    })
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
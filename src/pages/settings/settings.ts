import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SettingsProvider, Setting } from '../../providers/settings/settings';

import { Network } from '@ionic-native/network';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { NativeAudio } from '@ionic-native/native-audio';
import { Toast } from '@ionic-native/toast';
import * as moment from 'moment';
import * as $ from "jquery";
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';


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
  requesting: boolean = false

  constructor(private afs: AngularFirestore, private toast: Toast, private nativeAudio: NativeAudio, private localNotifications: LocalNotifications, public navCtrl: NavController, public navParams: NavParams, private fb: FormBuilder, private settingsProvider: SettingsProvider, private network: Network) {
    this.InitializeForm()

    this.settingsProvider.getItemsInTrue().subscribe(setting=>{
        this.LoadForm()
    })
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
    this.LoadForm()
  }

  LoadForm()
  {
    var setting=this.settingsProvider.getSettingsLocally()
    this.now = new Date().toISOString()
    var dateForForm = "2000-01-01T" + setting.downloadTime + this.now.substr(this.now.length - 6)

    this.form.patchValue({ wifiOnly: setting.wifiOnly, downloadTime: dateForForm, downloadDays: setting.downloadDays.split(',') })

    if (JSON.parse(localStorage.getItem('favorites')).length == 0) //check if exist elements
     this.settingsProvider.ShowAlert('Oops', "You need to add items to your list")
  }
 
  now: string

  Save() {

    if (this.requesting)
      return;

    this.requesting = true

    var setting = new Setting()
    setting.downloadTime = this.form.value.downloadTime.split('T')[1].split('-')[0]
    setting.wifiOnly = this.form.value.wifiOnly
    setting.downloadDays = this.form.value.downloadDays.join(",")
    setting.savedPlaylist = this.settingsProvider.getFavoritesIds()

    this.settingsProvider.UpdateFireBase(setting).then(result=>{

      this.requesting = false

      this.settingsProvider.Schedule(this.form.value.downloadDays,this.form.value.wifiOnly,setting.savedPlaylist,$('.datetime-text').text())


    }).catch(error=>{
      this.requesting = false
      this.settingsProvider.ShowAlert("Oops", "Error trying to save new settings")
    })

  }

}


Date.prototype.toISOString = function () {
  var tzo = -this.getTimezoneOffset(),
    dif = tzo >= 0 ? '+' : '-',
    pad = function (num) {
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
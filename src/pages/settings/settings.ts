import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SettingsProvider, Setting } from '../../providers/settings/settings';

import { Network } from '@ionic-native/network';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { NativeAudio } from '@ionic-native/native-audio';
import { Toast } from '@ionic-native/toast';
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
  requesting: boolean = false

  constructor(private toast: Toast, private nativeAudio: NativeAudio, private localNotifications: LocalNotifications, public navCtrl: NavController, public navParams: NavParams, private fb: FormBuilder, private settingsProvider: SettingsProvider, private network: Network) {
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

    this.settingsProvider.getSettings().subscribe(setting => {

      this.now = new Date().toISOString()

      var dateForForm = "2000-01-01T" + setting.downloadTime + this.now.substr(this.now.length - 6)

      this.form.patchValue({ wifiOnly: setting.wifiOnly, downloadTime: dateForForm, downloadDays: setting.downloadDays.split(',') })

    }, error => { }, () => { })


    if (JSON.parse(localStorage.getItem('favorites')).length == 0) //check if exist elements
      this.settingsProvider.ShowAlert('Oops', "You need to add items to your list")

  }
  now: string

  ScheduleTask() {

    this.Save()
  }

  getDays(): Array<Date> {
    var current = new Date().getDay() + 1

    var dateOnForm = new Date(this.form.value.downloadTime)
    var today = new Date()

    var arr = []
    this.form.value.downloadDays.forEach(element => {

      var ele = parseInt(element)

      var a;

      var horaToday = parseInt(today.toLocaleTimeString().split(':')[0])
      var minutosToday = parseInt(today.toLocaleTimeString().split(':')[1])

      var half = new Date().toLocaleTimeString().split(' ')[1]
      if (half == 'PM')
        horaToday += 12

      if (current == ele) {
        if (
          (horaToday > dateOnForm.getHours()) ||
          (horaToday == dateOnForm.getHours() && minutosToday > dateOnForm.getMinutes()) //if the time is over for today

        )
          a = moment().add(7, 'days')
        else
          a = moment().add(0, 'days')
      }
      else if (ele > current)
        a = moment().add(ele - current, 'days')
      else
        a = moment().add(7 - current + ele, 'days')

      var date = new Date(a.toString())
      date.setHours(dateOnForm.getHours())
      date.setMinutes(dateOnForm.getMinutes())

      arr.push(date)

    });

    return arr
  }

  Save() {

    if (this.requesting)
      return;

    this.requesting = true

    var setting = new Setting()
    setting.downloadTime = new Date(this.form.value.downloadTime).toTimeString().split(' ')[0]
    setting.wifiOnly = this.form.value.wifiOnly
    setting.downloadDays = this.form.value.downloadDays.join(",")
    setting.savedPlaylist = this.settingsProvider.getFavoritesIds()

    this.settingsProvider.setSettings(setting).subscribe(result => {
      this.requesting = false

      this.localNotifications.cancelAll().then(result => {
        this.getDays().forEach(element => {  //create schedule for any task
          this.Createtask(element, setting.savedPlaylist)
        });

        this.settingsProvider.SaveSettingsLocally(setting)
      })

    }, error => {
      this.requesting = false
      this.settingsProvider.ShowAlert("Oops", "Error trying to save new settings")
    }, () => { })
  }

  Createtask(time: Date, _ids: string) {


    this.localNotifications.schedule({
      id: 1,
      title: 'Downloading',
      text: '',
      at: time,
      data: { ids: _ids, connectionType: this.form.value.wifiOnly }
    })

    this.settingsProvider.ShowToast(time.toString())
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
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {SettingsProvider,Setting} from '../../providers/settings/settings';

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

  constructor(public navCtrl: NavController, public navParams: NavParams,private fb: FormBuilder,private settingsProvider:SettingsProvider) {
     this.InitializeForm()
  }

  InitializeForm() {

    var data = {
      wifiOnly: 'false',
      downloadTime: '00:00:00',
      downloadDays:"1,2",
      savedPlaylist:"1"
    }

    this.form = this.fb.group(data);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }

}

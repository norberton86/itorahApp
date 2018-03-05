import { SettingsPage } from './../settings/settings';
import { NoConnectionPage } from './../no-connection/no-connection';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { LoginProvider } from '../../providers/login/login';
import { SettingsProvider, URL, ItemPlayer } from '../../providers/settings/settings';

import { Network } from '@ionic-native/network';
import { LocalNotifications } from "@ionic-native/local-notifications";

import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';

import { Toast } from '@ionic-native/toast';




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


  fileTransfer: FileTransferObject
  constructor(private toast: Toast, private settingsProvider: SettingsProvider, private file: File, private transfer: FileTransfer, private localNotifications: LocalNotifications, public navCtrl: NavController, public navParams: NavParams, private loginProvider: LoginProvider, private network: Network, private platform: Platform) {

    this.disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      this.goNoConnection()
    });


    this.platform.ready().then((ready) => {

      this.fileTransfer = this.transfer.create();

      this.localNotifications.cancelAll().then(() => {                     //first cancell all notification

        this.localNotifications.on('trigger', (notification, state) => {

          let data = JSON.parse(notification.data)

          if (this.network.type == 'wifi' && data.connectionType == true) //download only with wifi 
          {
            this.settingsProvider.ShowToast('Please change your settings to allow download with any internet connection type')
          }
          else  //downlaod always
          {

            this.settingsProvider.getURL(data.ids).subscribe(result => {
              result.forEach(url => {
                if (this.CheckIfExist(url.PlaylistID))  //if is still on favorites
                {
                  
                  this.download(url)
                }
                  
              })
            })

          }

        })
      })

    })
  }

  download(url: URL) {

    var arr = url.AudioUrl.split('/')

    this.fileTransfer.download(url.AudioUrl, this.file.externalDataDirectory + arr[arr.length - 1]).then((entry) => {

        this.Update(url.PlaylistID,arr[arr.length - 1])
        this.settingsProvider.ShowToast('Downloaded')
    },
      (error) => {
        this.settingsProvider.ShowToast('Error trying to download the lectures')
      });
  }


  CheckIfExist(id: number) {
    var data = new Array<ItemPlayer>()
    data = JSON.parse(localStorage.getItem('favorites'))

    var exists = false
    data.forEach(element => {
      if (element.id == id)
        exists = true
    });

    return exists
  }

  Update(id:number,name:string)
  {
    var data = new Array<ItemPlayer>()
    data = JSON.parse(localStorage.getItem('favorites'))

    data.forEach(element=>{  
      if(element.id==id)
        element.url=name //update
    })

    localStorage.setItem('favorites',JSON.stringify(data))  //save
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

  FolderToSave() {
    if (this.platform.is('ios')) {
      return this.file.documentsDirectory;
    }
    else if (this.platform.is('android')) {
      return this.file.dataDirectory;
    }
  }
}

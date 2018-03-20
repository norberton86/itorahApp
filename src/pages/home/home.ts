import { SettingsPage } from './../settings/settings';
import { NoConnectionPage } from './../no-connection/no-connection';
import { SignOutPage } from './../sign-out/sign-out';
import { LoginPage } from './../login/login';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { LoginProvider } from '../../providers/login/login';
import { SettingsProvider, URL, ItemPlayer, Setting } from '../../providers/settings/settings';

import { Network } from '@ionic-native/network';
import { LocalNotifications } from "@ionic-native/local-notifications";

import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';

import { Toast } from '@ionic-native/toast';

import { AlertController } from 'ionic-angular';

import { PopoverController, LoadingController, Loading } from 'ionic-angular';


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

  loading: Loading

  constructor(public loadingCtrl: LoadingController, public popoverCtrl: PopoverController, private alertCtrl: AlertController, private toast: Toast, private settingsProvider: SettingsProvider, private file: File, private transfer: FileTransfer, private localNotifications: LocalNotifications, public navCtrl: NavController, public navParams: NavParams, private loginProvider: LoginProvider, private network: Network, private platform: Platform) {

    this.disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      
      this.goNoConnection()
    });


    this.platform.ready().then((ready) => {

      this.fileTransfer = this.transfer.create();

      this.localNotifications.on('trigger', (notification, state) => {

        let data = JSON.parse(notification.data)

        if (this.network.type == 'wifi' && data.connectionType == true) //download only with wifi 
        {

        }
        else  //downlaod always
        {



          this.settingsProvider.getURL(data.ids).subscribe(result => {
            result.forEach(url => {
              if (this.settingsProvider.CheckIfExist(url.PlaylistID))  //if is still on favorites
              {

                this.download(url)
              }

            })
          })

        }

      })


    })


    this.loginProvider.getItemsLogOut().subscribe(item => {
      if (item == "home")
        this.navCtrl.pop()
    })

  }

  download(url: URL) {

    var arr = url.AudioUrl.split('/')

    this.fileTransfer.download(url.AudioUrl, this.file.externalDataDirectory + url.MediaID).then((entry) => {

      this.settingsProvider.Update(url.PlaylistID, url.MediaID)  //arr[arr.length - 1]
      this.UpdateFavoritesURL(url)
      this.settingsProvider.ShowToast('Downloaded')
    },
      (error) => {
        this.settingsProvider.ShowToast('Error trying to download the lectures')
      });
  }

  UpdateFavoritesURL(url: URL) {
    var fabs = JSON.parse(localStorage.getItem('favorites'))
    var candidate = fabs.find(i => i.id == url.PlaylistID)
    if (candidate != undefined && candidate != null)
      candidate.url = url.MediaID

    localStorage.setItem('favorites', JSON.stringify(fabs))

    this.settingsProvider.setItemsURL(url)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');

    if (this.loginProvider.getToken() != '')  //to load the initials of the user's name
    {
      this.name = JSON.parse(localStorage.getItem('userItorah')).name;
      this.name = this.name.split(" ")[0][0] + this.name.split(" ")[1][0]
    }

    try {
      this.loading = this.loadingCtrl.create({
        content: 'Loading...',
        dismissOnPageChange:true
      });

      this.loading.present();
    } catch (e) {

    }

  }

 /* ionViewDidEnter() {
    
      this.navCtrl.pop()
    
  }*/

  goNoConnection(): void {

    this.disconnectSubscription.unsubscribe();
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

  Popover(myEvent) {
    let popover = this.popoverCtrl.create(SignOutPage, { father: "home" });
    popover.present({
      ev: myEvent
    });
  }

  onLoad() {
     if(this.loading!=null && this.loading!=undefined)
      this.loading.dismiss()
  }
}

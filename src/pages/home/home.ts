import { SettingsPage } from './../settings/settings';
import { NoConnectionPage } from './../no-connection/no-connection';
import { LoginPage } from './../login/login';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { LoginProvider } from '../../providers/login/login';
import { SettingsProvider, URL, ItemPlayer } from '../../providers/settings/settings';

import { Network } from '@ionic-native/network';
import { LocalNotifications } from "@ionic-native/local-notifications";

import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';

import { Toast } from '@ionic-native/toast';

import { AlertController } from 'ionic-angular';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';



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
  constructor(private afs: AngularFirestore, private alertCtrl: AlertController, private toast: Toast, private settingsProvider: SettingsProvider, private file: File, private transfer: FileTransfer, private localNotifications: LocalNotifications, public navCtrl: NavController, public navParams: NavParams, private loginProvider: LoginProvider, private network: Network, private platform: Platform) {

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

    this.afs.collection("usuario").doc(JSON.parse(localStorage.getItem('userItorah')).email ).snapshotChanges().subscribe(result => {
      console.log(result.payload.data())
      
    })
  }


  download(url: URL) {

    var arr = url.AudioUrl.split('/')

    this.fileTransfer.download(url.AudioUrl, this.file.externalDataDirectory + arr[arr.length - 1]).then((entry) => {

      this.settingsProvider.Update(url.PlaylistID, arr[arr.length - 1])
      this.settingsProvider.ShowToast('Downloaded')
    },
      (error) => {
        this.settingsProvider.ShowToast('Error trying to download the lectures')
      });
  }




  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');

    if (this.loginProvider.getToken() != '')  //to load the initials of the user's name
    {
      this.name = JSON.parse(localStorage.getItem('userItorah')).name;
      this.name = this.name.split(" ")[0][0] + this.name.split(" ")[1][0]
    }

  }

  ionViewDidEnter() {
    if (this.loginProvider.getToken() == '') {
      this.AutoPop()
    }
  }

  Logout() {

    let alert = this.alertCtrl.create({
      title: 'Confirm',
      message: 'Do you want to logout?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {

          }
        },
        {
          text: 'Yes',
          handler: () => {

            localStorage.removeItem('userItorah')
            this.AutoPop()

          }
        }
      ]
    });
    alert.present();


  }

  AutoPop() {
    this.navCtrl.push(LoginPage).then(() => {                 //remove the current page from the stack
      const startIndex = this.navCtrl.getActive().index - 1;
      this.navCtrl.remove(startIndex, 1);
    });
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

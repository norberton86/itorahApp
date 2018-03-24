import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { Subject } from "rxjs/Subject";
import { Toast } from '@ionic-native/toast';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { LocalNotifications } from "@ionic-native/local-notifications";

import * as moment from 'moment';
import * as $ from "jquery";

/*
  Generated class for the SettingsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SettingsProvider {

  ruta: string
  header: Headers

  private subjectItemsInTrue: Subject<Setting> = new Subject<Setting>();

  private subjectURL: Subject<URL> = new Subject<URL>();

  constructor(private afs: AngularFirestore, private http: Http, public alertCtrl: AlertController, private toast: Toast, private localNotifications: LocalNotifications) {
    this.ruta = "https://itorahapi.3nom.com/api/app/";
    this.header = new Headers({ "Content-Type": "application/json" });
  }


  public getItems(token: string): Observable<Array<Item>> {

    let h = new Headers();
    h.append('Authorization', 'bearer ' + token);
    h.append('Content-Type', 'application/json');

    return this.http.get(this.ruta + "playlists", { headers: h }).map(
      (response) => {
        let body = response.json();
        return body;
      }
    )
  }


  public getURL(ids: string): Observable<Array<URL>> {

    return this.http.get(this.ruta + "content?Playlists=" + ids).map(
      (response) => {
        let body = response.json();
        return body;
      }
    )
  }

  public getSettings(): Observable<Setting> {

    let h = new Headers();
    h.append('Authorization', 'bearer ' + this.getToken());
    h.append('Content-Type', 'application/json');

    return this.http.get(this.ruta + "settings", { headers: h }).map(
      (response) => {
        let body = response.json();
        return body;
      }
    )
  }


  public setSettings(data: Setting): Observable<any> {
    let h = new Headers();
    h.append('Content-Type', 'application/json');
    h.append('Authorization', 'bearer ' + this.getToken())

    return this.http.post(this.ruta + "settings", data, { headers: h }).map(
      (response) => {
        return response.toString();
      }
    )
  }

  UpdateFireBase(setting: Setting): Promise<any> {

    this.SaveSettingsLocally(setting)

    return this.afs.collection("usuario")
      .doc(this.getEmail())
      .set(JSON.parse(JSON.stringify(setting)))
  }

  ShowAlert(title: string, content: string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: content,
      buttons: ['OK']
    });
    alert.present();
  }

  ShowToast(message: string) {
    this.toast.show(message, '3000', 'center').subscribe(
      toast => {
        console.log(toast);
      }
    );
  }

  getToken(): string {
    if (localStorage.getItem('userItorah') != null && localStorage.getItem('userItorah') != "") {
      return JSON.parse(localStorage.getItem('userItorah')).token
    }
    else
      return ""
  }

  getEmail(): string {
    if (localStorage.getItem('userItorah') != null && localStorage.getItem('userItorah') != "") {
      return JSON.parse(localStorage.getItem('userItorah')).email
    }
    else
      return ""
  }

  setItemsInTrue(items: Setting) {
    this.subjectItemsInTrue.next(items)
  }

  getItemsInTrue(): Observable<Setting> {
    return this.subjectItemsInTrue.asObservable();
  }

  setItemsURL(url: URL) {
    this.subjectURL.next(url)
  }

  getItemsInURL(): Observable<URL> {
    return this.subjectURL.asObservable();
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

  Update(id: number, url: string) {
    var data = new Array<ItemPlayer>()
    data = JSON.parse(localStorage.getItem('favorites'))

    data.forEach(element => {
      if (element.id == id)
        element.url = url //update
    })

    localStorage.setItem('favorites', JSON.stringify(data))  //save
  }

  SaveSettingsLocally(setting: Setting) {
    localStorage.setItem('setting', JSON.stringify(setting))
  }

  getSettingsLocally(): Setting {
    return JSON.parse(localStorage.getItem('setting'))
  }

  getFavoritesIds(): string {
    var arr = []
    JSON.parse(localStorage.getItem('favorites')).forEach(element => {
      arr.push(element.id)
    });

    return arr.join(',')
  }

  //------------------------------------------------------------------------------------------------------------------------------------------------

  getDays(downloadDays: Array<string>,time:string): Array<Date> {
    var current = new Date().getDay() + 1


    var today = new Date()

    var arr = []
    downloadDays.forEach(element => {

      var ele = parseInt(element)

      var a;

      var horaToday = parseInt(today.toLocaleTimeString().split(':')[0])
      var minutosToday = parseInt(today.toLocaleTimeString().split(':')[1])
      var half = new Date().toLocaleTimeString().split(' ')[1]

      if (horaToday == 12 && half == 'AM')
        horaToday = 0


      var formHalf = time.split(" ")[1].toUpperCase()   //$('.datetime-text').text()
      var formHour = parseInt(time.split(" ")[0].split(':')[0])
      var formMinute = parseInt(time.split(" ")[0].split(':')[1])

      if (formHour == 12 && formHalf == 'AM')
        formHour = 0

      if (current == ele) {
        if (
          (horaToday > formHour) ||
          (horaToday == formHour && minutosToday > formMinute) //if the time is over for today

        ) {
          //this.settingsProvider.ShowToast("With 7: "+horaToday+":"+minutosToday+"  "+dateOnForm.getHours()+":"+dateOnForm.getMinutes())
          a = moment().add(7, 'days')
        }
        else {
          //this.settingsProvider.ShowToast("With 0: "+horaToday+":"+minutosToday+"  "+dateOnForm.getHours()+":"+dateOnForm.getMinutes())
          a = moment().add(0, 'days')
        }

      }
      else if (ele > current)
        a = moment().add(ele - current, 'days')
      else
        a = moment().add(7 - current + ele, 'days')

      var date = new Date(a.toString())

      if (formHalf == 'PM')
        date.setHours(formHour + 12)
      else
        date.setHours(formHour)

      date.setMinutes(formMinute)

      arr.push(date)

    });

    return arr
  }

  Createtask(time: Date, _ids: string, wifiOnly: boolean) {

    this.localNotifications.schedule({
      id: 1,
      title: 'Downloading',
      text: '',
      at: time,
      data: { ids: _ids, connectionType: wifiOnly }
    })
    //this.settingsProvider.ShowToast(time.toString())
  }

  Schedule(downloadDays: Array<string>, wifiOnly: boolean, savedPlaylist: string,time:string) {

    this.localNotifications.cancelAll().then(result => {    //cancell all notifications

      this.getDays(downloadDays,time).forEach(element => {  //create schedule for any task
        this.Createtask(element, savedPlaylist, wifiOnly)
      });

      this.ShowToast("Saved")

    })
  }

}

export class Item {
  id: number
  title: string
  isSavedPlaylist: boolean
  subList: Array<Item>

  nombre: string
  descripcion: string
  color: string
}


export class ItemPlayer {
  id: number
  nombre: string
  descripcion: string
  color: string
  url: string
  readed: boolean = false
}

export class Setting {
  wifiOnly: boolean
  downloadTime: string
  downloadDays: string
  savedPlaylist: string
}

export class URL {
  PlaylistID: number
  AudioUrl: string
  MediaID: string
}
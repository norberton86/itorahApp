import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';

/*
  Generated class for the SettingsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SettingsProvider {

  ruta: string
  header: Headers

  constructor(private http: Http, public alertCtrl: AlertController) {
    this.ruta = "https://itorahid.3nom.com/app/";
    this.header = new Headers({ "Content-Type": "application/json" });
  }


  public getItems(): Observable<Array<Item>> {

    let h = new Headers();
    h.append('Authorization', 'bearer ' + this.getToken());
    h.append('Content-Type', 'application/json');

    return this.http.get(this.ruta+"playlists", { headers: h }).map(
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

    return this.http.get(this.ruta+"settings", { headers: h }).map(
      (response) => {
        let body = response.json();
        return body;
      }
    )
  }

  
  public setSettings(data: Setting): Observable<any> {
    let h = new Headers();
    h.append('Content-Type', 'application/json');

    return this.http.post(this.ruta+"settings", data, { headers: h }).map(
      (response) => {
        return response.toString();
      }
    )
  }

  ShowAlert(title: string, content: string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: content,
      buttons: ['OK']
    });
    alert.present();
  }

  getToken(): string {
    if (localStorage.getItem('userItorah') != null && localStorage.getItem('userItorah') != "") {
      return JSON.parse(localStorage.getItem('userItorah')).token
    }
    else
      return ""
  }
}

export class Item{
  id:number
  title:string
  isSavedPlaylist:boolean
  subList: Array<Item>
}

export class Setting{
  wifiOnly: boolean
  downloadTime: string
  downloadDays:string
  savedPlaylist:string
}
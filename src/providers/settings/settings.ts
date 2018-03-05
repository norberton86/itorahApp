import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { Subject } from "rxjs/Subject";
import { Toast } from '@ionic-native/toast';

/*
  Generated class for the SettingsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SettingsProvider {

  ruta: string
  header: Headers

  private subjectItemsInTrue: Subject<string> = new Subject<string>();

  constructor(private http: Http, public alertCtrl: AlertController,private toast:Toast) {
    this.ruta = "https://itorahapi.3nom.com/api/app/";
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


  public getURL(ids:string): Observable<Array<URL>> {

    return this.http.get(this.ruta+"content?Playlists="+ids).map(
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
    h.append('Authorization', 'bearer ' + this.getToken())
    
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

  ShowToast(message: string) {
    this.toast.show(message, '10000', 'center').subscribe(
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

  setItemsInTrue(items: string) {
    this.subjectItemsInTrue.next(items)
  }

  getItemsInTrue(): Observable<string> {
    return this.subjectItemsInTrue.asObservable();
  }
}

export class Item{
  id:number
  title:string
  isSavedPlaylist:boolean
  subList: Array<Item>

  nombre:string
  descripcion:string
  color:string
}


export class ItemPlayer{
   id: number
   nombre: string 
   descripcion:string 
   color: string 
   url:string
}

export class Setting{
  wifiOnly: boolean
  downloadTime: string
  downloadDays:string
  savedPlaylist:string
}

export class URL{
  PlaylistID: number
  AudioUrl:string
}
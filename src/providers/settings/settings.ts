import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { Subject } from "rxjs/Subject";
import { Toast } from '@ionic-native/toast';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

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

  constructor(private afs: AngularFirestore, private http: Http, public alertCtrl: AlertController,private toast:Toast) {
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

  UpdateFireBase(setting:Setting):Promise<any> {

   this.SaveSettingsLocally(setting)

   return this.afs.collection("usuario")
          .doc(JSON.parse(localStorage.getItem('userItorah')).email)
          .set( setting )
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

  setItemsInTrue(items: string) {
    this.subjectItemsInTrue.next(items)
  }

  getItemsInTrue(): Observable<string> {
    return this.subjectItemsInTrue.asObservable();
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

  SaveSettingsLocally(setting:Setting)
  {
     localStorage.setItem('setting',JSON.stringify(setting))
  }

  getSettingsLocally():Setting
  {
     return JSON.parse( localStorage.getItem('setting') )
  }

  getFavoritesIds():string
  {
    var arr=[]
    JSON.parse(localStorage.getItem('favorites')).forEach(element => {
      arr.push(element.id)
    });

    return arr.join(',')
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
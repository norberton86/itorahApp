import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';

/*
  Generated class for the LoginProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LoginProvider {

  ruta: string
  header: Headers

  constructor(private http: Http, public alertCtrl: AlertController) {
    this.ruta = "https://itorahid.3nom.com/connect/token";
    this.header = new Headers({ "Content-Type": "application/x-www-form-urlencoded" });
  }

  public Sign(email: string, pass: string): Observable<any> {

    let body = `grant_type=password&username=${email}&password=${pass}&client_id=resourceOwner&client_secret=secret`;

    return this.http.post(this.ruta, body, { headers: this.header }).map(
      (response) => {
        let body = response.json();
        return body;
      }
    )
  }

  public Profile(token: string): Observable<any> {

    let h = new Headers();
    h.append('Authorization', 'bearer ' + token);
    h.append('Content-Type', 'application/json');

    return this.http.get("http://itorahapi.3nom.com/api/UserProfile", { headers: h }).map(
      (response) => {
        let body = response.json();
        return body;
      }
    )
  }

  public Forgot(email: string): Observable<any> {

    return this.http.post("http://itorahapi.3nom.com/api/Password/forgot?email=" + email, {}).map(
      (response) => {
        let body = response.json();
        return body;
      }
    )
  }

  public Create(data: any): Observable<string> {
    let h = new Headers();
    h.append('Content-Type', 'application/json');

    return this.http.post("http://itorahapi.3nom.com/api/Users", data, { headers: h }).map(
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

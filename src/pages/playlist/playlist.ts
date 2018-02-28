import { HomePage } from './../home/home';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SettingsPage } from '../settings/settings'

import { SettingsProvider, Item } from '../../providers/settings/settings';

/**
 * Generated class for the PlaylistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-playlist',
  templateUrl: 'playlist.html',
})
export class PlaylistPage {

  // Arreglo de la lista 1 
  Listas = [{ id: "1", nombre: "Daily Halacha", descripcion: "by Rabbi Eli Mansour", color: "gris" },
  { id: "2", nombre: "Daf Yomi", descripcion: "by Rabbi Eli Mansour", color: "gris" },
  { id: "3", nombre: "Daily Tehillim - Chapter of the day", descripcion: "Recited by Hacham Baruch BenHaim ZT'L", color: "gris" },
  { id: "4", nombre: "Daily Emunah", descripcion: "by Rabbi David Asher", color: "gris" }];
  // Arreglo de la lista 2
  browseList: Array<Item> = [
    {
      id: 1,
      title: "Daily Halacha by Rabbi Eli Mansour",
      isSavedPlaylist: false,
      subList: [],
      nombre: "Daily Halacha",
      descripcion: "by Rabbi Eli Mansour",
      color: "gris"
    },
    {
      id: 2,
      title: "Daf Yomi by Rabbi Eli Mansour",
      isSavedPlaylist: false,
      subList: [],
      nombre: "Daf Yomi",
      descripcion: "by Rabbi Eli Mansour",
      color: "gris"
    },
    {
      id: 3,
      title: 'Daily Tehillim (Chapter of the Day) by Chacham Baruch Ben-Haim Z"TL"',
      isSavedPlaylist: false,
      subList: [],
      nombre: "Daily Tehillim (Chapter of the Day)",
      descripcion: 'Recited by Chacham Baruch Ben-Haim Z"TL"',
      color: "gris"
    },
    {
      id: 4,
      title: 'Daily Emunah by Rabbi David Ashear',
      isSavedPlaylist: false,
      subList: [],
      nombre: "Daily Emunah",
      descripcion: 'by Rabbi David Ashear',
      color: "gris"
    },
  ]
  // Arreglo de la lista 2
  broweSubList: Array<Item> = [{ id: 7, nombre: "Parasha of the Week by Rabbi Eli Mansour", descripcion: "Updated 12/22/2017", color: "gris", isSavedPlaylist: false, subList: [], title: "" },
  { id: 8, nombre: "DParasha of the Week by Rabbi Meyer Yedid", descripcion: "Updated 12/22/2017", color: "gris", isSavedPlaylist: false, subList: [], title: "" },
  { id: 9, nombre: "Parasha of the Week by Rabbi Duvi BenSoussan", descripcion: "Updated 12/22/2017", color: "gris", isSavedPlaylist: false, subList: [], title: "" },
  { id: 10, nombre: "Parasha of the Week by Rabbi David Sutton", descripcion: "Updated 12/22/2017", color: "gris", isSavedPlaylist: false, subList: [], title: "" },
  { id: 11, nombre: "Parasha of the Week by Rabbi Shlomo Diamond", descripcion: "Updated 12/22/2017", color: "gris", isSavedPlaylist: false, subList: [], title: "" },
  { id: 12, nombre: "Parasha of the Week by Rabbi Eliezer Zeytouneh", descripcion: "Updated 12/22/2017", color: "gris", isSavedPlaylist: false, subList: [], title: "" },
  { id: 13, nombre: "Parasha of the Week by Rabbi Joey Haber", descripcion: "Updated 12/22/2017", color: "gris", isSavedPlaylist: false, subList: [], title: "" }];

  //Variables para cambiar de contexto
  reproductor: boolean;
  content_bro: boolean = false;
  content_play: boolean = true;
  positivo: boolean = true;//Vamriable para activar y desactivar los botones (playlist y browse)
  content_sig: boolean = false;
  id: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private settingsProvider: SettingsProvider) {

    this.settingsProvider.getItemsInTrue().subscribe(items => {  //to refresh the items

    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PlaylistPage');

    this.settingsProvider.getItems().subscribe(respond => {

      this.InitializeList(this.browseList, respond)

      var item = respond.find(i => i.title == "Parasha of the Week")

      this.InitializeList(this.broweSubList, item.subList)

    })
  }

  InitializeList(list: Array<Item>, source: Array<Item>) {
    source.forEach(element => {

      list.forEach(item => {

        if (element.id == item.id) {
          item.color = element.isSavedPlaylist ? "azulMenu" : "gris"
          item.isSavedPlaylist = element.isSavedPlaylist
        }
      })

    });
  }

  //Metodo que te envia a la pagina Settings
  goSettings(): void {
    this.navCtrl.push(SettingsPage);
  }

  //Metodo que te envia a la pagina principal la que tiene el PaginaWeb
  goHome(): void {
    this.navCtrl.push(HomePage);
  }

  //cambia las variables deacuedo a la vista que queremos mostrar al dar click en los botones PlayList y Browse
  //en este caso se muestra la lista2 
  //La variable Aux es la que contiene el boton que se esta seleccionando
  cambiaContent(aux): void {
    if (aux == 1) {
      this.content_play = true;
      this.content_bro = false;
      this.positivo = true;
      this.content_sig = false;
    }
    else {
      this.content_bro = true;
      this.content_play = false;
      this.positivo = false;
      this.reproductor = false;
      this.content_sig = false
    }
  }

  //cambia las variables deacuedo a la vista que queremos mostrar
  //en este caso se muestra la lista3
  siguienteLista(): void {
    this.content_bro = false;
    this.content_play = false;
    this.positivo = false;
    this.reproductor = false;
    this.content_sig = true
  }

  ///Metodo del playList para seleccionar y deseleccionar las filas 
  //Es lo mismo que el metodo de la lista dos y tres pero este no se queda seleccionado 
  //este no tiene la variable isSavedPlaylist....
  cambiarColor(id, color): void {

    for (var i = 0; i < this.Listas.length; i++) {
      let vandera: string = "0";

      if (this.Listas[i].id == id && this.Listas[i].color == "gris") {
        this.Listas[i].color = "amarillo";
        this.reproductor = true;
        vandera = "1";
      }
      if (this.Listas[i].id != id && this.Listas[i].color == "gris") {
        this.Listas[i].color = "gris";
      }
      if (this.Listas[i].id == id && this.Listas[i].color == "amarillo") {
        if (vandera == "1") {
          this.Listas[i].color = "amarillo";
          this.reproductor = true;
        } else {
          this.Listas[i].color = "gris";
          this.reproductor = false;
        }
      }
      if (this.Listas[i].id != id && this.Listas[i].color == "amarillo") {
        this.Listas[i].color = "gris";
      }
    }
  }
  /*Metodo del Browse para seleccionar y deseleccionar las filas
  el arreglo tiene dos variables, color y isSavedPlaylist.. 
  las cuales al dar click en una fila cambian de acuerdo a su estado...*/
  cambiarColorAzul(id, color): void {

    //variable id es global es como un $scope en angualr 1 la puedes utilizar en la vista 
    //la creo para saber cual es el id que tengo seleccionado cuando doy Click en una fila
    this.id = id;

    //Recorro el arreglo lista2 y voy chequeado el id y el color que tiene para cambiarlo o mantenerlo
    //creo una variable Vandera la cual si esta en 1 es pq el color se acaba de cambiar a Azul
    //por lo que no hay que cambiarlo el elemento isSavedPlaylist simplemente hace que mientras que este isSavedPlaylist se mantenga el color azul 
    // y la palomita verde... Significando que esta seleccionado...
    for (var i = 0; i < this.browseList.length; i++) {
      let vandera: string = "0";

      if (this.browseList[i].id == id && this.browseList[i].color == "gris") {
        this.browseList[i].color = "azulMenu";
        this.browseList[i].isSavedPlaylist = true;
        vandera = "1";
      }
      if (this.browseList[i].id != id && this.browseList[i].color == "gris") {
        this.browseList[i].color = "gris";
      }
      if (this.browseList[i].id == id && this.browseList[i].color == "azulMenu") {
        if (vandera == "1") {
          this.browseList[i].color = "azulMenu";
        } else {
          this.browseList[i].color = "gris";
          this.id = "0";
          this.browseList[i].isSavedPlaylist = false;
        }
      }
      if (this.browseList[i].id != id && this.browseList[i].color == "azulMenu") {
        this.browseList[i].color = "azulMenu";
      }
    }
  }

  //Recorro el arreglo lista3 y voy chequeado el id y el color que tiene para cambiarlo o mantenerlo
  //creo una variable Vandera la cual si esta en 1 es pq el color se acaba de cambiar a Azul
  //por lo que no hay que cambiarlo el elemento isSavedPlaylist simplemente hace que mientras que este isSavedPlaylist se mantenga el color azul 
  // y la palomita verde... Significando que esta seleccionado...
  cambiarColorAzulSig(id, color): void {

    //variable id es global es como un $scope en angualr 1 la puedes utilizar en la vista 
    //la creo para saber cual es el id que tengo seleccionado cuando doy Click en una fila
    this.id = id;

    for (var i = 0; i < this.broweSubList.length; i++) {
      let vandera: string = "0";

      if (this.broweSubList[i].id == id && this.broweSubList[i].color == "gris") {
        this.broweSubList[i].color = "azulMenu";
        this.broweSubList[i].isSavedPlaylist = true;
        vandera = "1";
      }
      if (this.broweSubList[i].id != id && this.broweSubList[i].color == "gris") {
        this.broweSubList[i].color = "gris";
      }
      if (this.broweSubList[i].id == id && this.broweSubList[i].color == "azulMenu") {
        if (vandera == "1") {
          this.broweSubList[i].color = "azulMenu";
        } else {
          this.broweSubList[i].color = "gris";
          this.id = "0";
          this.broweSubList[i].isSavedPlaylist = false;
        }
      }
      if (this.broweSubList[i].id != id && this.broweSubList[i].color == "azulMenu") {
        this.broweSubList[i].color = "azulMenu";
      }
    }
  }
}

import { HomePage } from './../home/home';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SettingsPage } from '../settings/settings'

import { SettingsProvider, Item,ItemPlayer } from '../../providers/settings/settings';

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
  favorites:Array<ItemPlayer> = [];

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
  { id: 8, nombre: "Parasha of the Week by Rabbi Meyer Yedid", descripcion: "Updated 12/22/2017", color: "gris", isSavedPlaylist: false, subList: [], title: "" },
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
  

  constructor(public navCtrl: NavController, public navParams: NavParams, private settingsProvider: SettingsProvider) {

    this.settingsProvider.getItemsInTrue().subscribe(items => {  //to refresh the items

    })
  }



  RemoveinFavorites(item:ItemPlayer)
  {

     var element=this.browseList.find(i=>i.id==item.id)
     
     if(element!=undefined && element!=null)  //if is in the first list
     {
      this.changeColor(element)
     }
     else{
       element=this.broweSubList.find(i=>i.id==item.id) ////if is in the second list
       
       if(element!=undefined && element!=null)
       this.changeColor(element)
     }
     
  }

  Add(item:Item)
  {
      if(this.favorites.findIndex(i=>i.id==item.id)>=0)  //if already exits
        return
      else
      {
        var newOne = new ItemPlayer()
        newOne.id=item.id
        newOne.color="gris"
        
        if(item.nombre.indexOf("by")<0)  //if it is the browlist
        {
          newOne.nombre=item.nombre
          newOne.descripcion=item.descripcion
        }
        else                          //else it is the subBrowseList
        {
          newOne.nombre=item.nombre.split(" by ")[0]
          newOne.descripcion="by "+item.nombre.split(" by ")[1]
        }

        this.favorites.push(newOne) //add to the favorite list
        this.SaveOnPhone()
        
      }
  }

  Remove(item:Item)
  {
    var index =this.favorites.findIndex(i=>i.id==item.id)
    this.favorites.splice(index, 1) //remove from favorite list
    this.SaveOnPhone()

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PlaylistPage');

    this.settingsProvider.getItems().subscribe(respond => {

      this.InitializeList(this.browseList, respond)

      var item = respond.find(i => i.title == "Parasha of the Week")

      this.InitializeList(this.broweSubList, item.subList)

    },error=>{},()=>{})

    //load the favorite list
    this.favorites= JSON.parse(localStorage.getItem('favorites'))
  }

  InitializeList(list: Array<Item>, source: Array<Item>) {
    source.forEach(element => {

      list.forEach(item => {

        if (element.id == item.id) {
          item.color = element.isSavedPlaylist ? "azulMenu" : "gris"
          item.isSavedPlaylist = element.isSavedPlaylist
          
          if(localStorage.getItem('firsTime')=='true' &&  item.isSavedPlaylist)  //only the first time when the app is loaded we add the items from the server instead to loas locally
           this.Add(item)
        }
      })

    });

    localStorage.setItem('firsTime','false')  //remove the first time condition
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


  changeColor(item:Item): void 
  {

    item.isSavedPlaylist=!item.isSavedPlaylist
    item.color=item.isSavedPlaylist?"azulMenu":"gris"

    if(item.isSavedPlaylist)
    this.Add(item)
    else
    this.Remove(item)

  }

  changeColorWithPlayer(item:ItemPlayer):void
  {
     if(item.color=="gris")
     {
       item.color="amarillo"
       this.reproductor=true
     }
     else
     {
       item.color="gris"
       this.reproductor=false
     }

  }
  
  SaveOnPhone()
  {
    localStorage.setItem('favorites',JSON.stringify(this.favorites))
  }
}

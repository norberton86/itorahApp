import { HomePage } from './../home/home';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SettingsPage } from '../settings/settings'
import { Media, MediaObject } from '@ionic-native/media';
import { SettingsProvider, Item, ItemPlayer, URL, Setting } from '../../providers/settings/settings';
import { LoginProvider } from '../../providers/login/login';
import { File } from '@ionic-native/file';
import { SignOutPage } from './../sign-out/sign-out';

import { AlertController, PopoverController } from 'ionic-angular';

import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';

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

  lastUpdated:string = ''

  // Arreglo de la lista 1 
  favorites: Array<ItemPlayer> = [];

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
  broweSubList: Array<Item> = [{ id: 7, nombre: "Parasha of the Week", descripcion: "by Rabbi Eli Mansour", color: "gris", isSavedPlaylist: false, subList: [], title: "" },
  { id: 8, nombre: "Parasha of the Week", descripcion: "by Rabbi Meyer Yedid", color: "gris", isSavedPlaylist: false, subList: [], title: "" },
  { id: 9, nombre: "Parasha of the Week", descripcion: "by Rabbi Duvi BenSoussan", color: "gris", isSavedPlaylist: false, subList: [], title: "" },
  { id: 10, nombre: "Parasha of the Week", descripcion: "by Rabbi David Sutton", color: "gris", isSavedPlaylist: false, subList: [], title: "" },
  { id: 11, nombre: "Parasha of the Week", descripcion: "by Rabbi Shlomo Diamond", color: "gris", isSavedPlaylist: false, subList: [], title: "" },
  { id: 12, nombre: "Parasha of the Week", descripcion: "by Rabbi Eliezer Zeytouneh", color: "gris", isSavedPlaylist: false, subList: [], title: "" },
  { id: 13, nombre: "Parasha of the Week", descripcion: "by Rabbi Joey Haber", color: "gris", isSavedPlaylist: false, subList: [], title: "" }];

  //Variables para cambiar de contexto

  content_bro: boolean = false;
  content_play: boolean = true;
  positivo: boolean = true;//Vamriable para activar y desactivar los botones (playlist y browse)
  content_sig: boolean = false;

  fileTransfer: FileTransferObject

  constructor(public popoverCtrl: PopoverController,private alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, private settingsProvider: SettingsProvider, private media: Media, private loginProvider: LoginProvider, private file: File, private transfer: FileTransfer) {

    this.settingsProvider.getItemsInTrue().subscribe(setting => {  //to refresh the items
     
     this.itemPlaying=null
     this.Stop()
      
     this.favorites=[]

      var d = setting.savedPlaylist.split(',')

      this.browseList.forEach(element => {
        if (element.id != 6 && d.indexOf(element.id.toString()) >= 0)
          this.Add(element,false)
      });


      this.broweSubList.forEach(element => {
        if (d.indexOf(element.id.toString()) >= 0)
          this.Add(element,false)
      });
     
     localStorage.setItem('favorites', JSON.stringify(this.favorites))

 
     //------------------------------------------------- 
        this.ionViewDidLoad()
    })

    try{
      this.fileTransfer = this.transfer.create();
    }
    catch(e)
    {
      this.settingsProvider.ShowToast('Error creating file reader')
    }

    
  }



  RemoveinFavorites(item: ItemPlayer) {

    if (this.itemPlaying != null && item.id == this.itemPlaying.id) {
      this.stopedByUser = true
      this.myfile.stop()
      this.itemPlaying = null
    }

    var element = this.browseList.find(i => i.id == item.id)

    if (element != undefined && element != null)  //if is in the first list
    {
      this.changeColor(element)
    }
    else {
      element = this.broweSubList.find(i => i.id == item.id) ////if is in the second list

      if (element != undefined && element != null)
        this.changeColor(element)
    }

  }

  Add(item: Item,save:boolean=true) {
    if (this.favorites.findIndex(i => i.id == item.id) >= 0)  //if already exits
      return
    else {
      var newOne = new ItemPlayer()
      newOne.id = item.id
      newOne.color = "gris"

      //if (item.nombre.indexOf("by") < 0)  //if it is the browlist
      //{
        newOne.nombre = item.nombre
        newOne.descripcion = item.descripcion
      /*}
      else                          //else it is the subBrowseList
      {
        newOne.nombre = item.nombre.split(" by ")[0]
        newOne.descripcion = "by " + item.nombre.split(" by ")[1]
      }*/

      newOne.url = ''

      this.favorites.push(newOne) //add to the favorite list
      if(save)
      this.SaveOnPhone()
      

    }
  }

  IsSyncPosible(): boolean {
    return this.favorites.findIndex(i => i.url == '') >= 0
  }

  Remove(item: Item) {
    var index = this.favorites.findIndex(i => i.id == item.id)
    this.favorites.splice(index, 1) //remove from favorite list
    this.SaveOnPhone()

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PlaylistPage');

    try {

      this.favorites = JSON.parse(localStorage.getItem('favorites'))
      this.InitializeListLocalData(this.browseList)
      this.InitializeListLocalData(this.broweSubList)

      if (this.loginProvider.getToken() != '')  //to load the initials of the user's name
      {
        this.name = JSON.parse(localStorage.getItem('userItorah')).name;
        this.name = this.name.split(" ")[0][0] + this.name.split(" ")[1][0]
      }

      this.getLastUpdate()
    }
    catch (e) {
      this.settingsProvider.ShowToast(e)
    }
  }

  name: string = ''


  InitializeListLocalData(list: Array<Item>) {

    list.forEach(item => {

      if (this.favorites.findIndex(s => s.id == item.id) >= 0) {
        item.color = "azulMenu"
        item.isSavedPlaylist = true
      }
      else {
        item.color = "gris"
        item.isSavedPlaylist = false
      }

    })

  }

  //Metodo que te envia a la pagina Settings
  goSettings(): void {
    this.navCtrl.push(SettingsPage);
  }

  //Metodo que te envia a la pagina principal la que tiene el PaginaWeb
  goHome(): void {
    this.Stop()
    this.navCtrl.pop();
  }

  //cambia las variables deacuedo a la vista que queremos mostrar al dar click en los botones PlayList y Browse
  //en este caso se muestra la lista2 
  //La variable Aux es la que contiene el boton que se esta seleccionando

  aux: number
  cambiaContent(aux): void {
    this.aux = aux
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
      this.content_sig = false
    }
  }

  //cambia las variables deacuedo a la vista que queremos mostrar
  //en este caso se muestra la lista3
  siguienteLista(): void {
    this.content_bro = false;
    this.content_play = false;
    this.positivo = false;
    this.content_sig = true
  }


  changeColor(item: Item): void {

    item.isSavedPlaylist = !item.isSavedPlaylist
    item.color = item.isSavedPlaylist ? "azulMenu" : "gris"

    if (item.isSavedPlaylist)
      this.Add(item)
    else
      this.Remove(item)

  }

  itemPlaying: ItemPlayer = null

  changeColorWithPlayer(item: ItemPlayer): void {

    this.UpdateReaded(item)

    if (this.itemPlaying == null) {  //if nobody is playing 

      this.itemPlaying = item
      this.Play()
    }
    else if (this.itemPlaying != null && this.itemPlaying.id == item.id) {  //if is the same element then means that needs to stop

      this.itemPlaying = null
      this.Stop()
    }
    else {  //if its a different element needs change to the new one
      this.Stop()
      this.itemPlaying = item
      this.Play()
    }
  }

  UpdateReaded(item:ItemPlayer)
  {
     item.readed=true
     localStorage.setItem('favorites', JSON.stringify(this.favorites))
  }

  ColorInFavorites(item: ItemPlayer) {
    if (this.itemPlaying != null && this.itemPlaying.id == item.id)
      return "amarillo"
    else
      return "gris"
  }

  SaveOnPhone() {
    localStorage.setItem('favorites', JSON.stringify(this.favorites))
    this.UpdateSettingsLocallyServer()
  }

  myfile: MediaObject


  Play() {
    var favoritesTemp = new Array<ItemPlayer>()
    favoritesTemp = JSON.parse(localStorage.getItem('favorites'))

    var url = ''

    favoritesTemp.forEach(element => {  //find the url for this element
      if (element.id == this.itemPlaying.id) {
        url = element.url
      }
    });

    if (url != '') {
      try {
        this.myfile = this.media.create(this.file.externalDataDirectory + url); //load the file
        this.myfile.play();
        this.status = "play"
        this.stopedByUser = false

         /*
        this.myfile.onStatusUpdate.subscribe(status => {
          if (status == this.media.MEDIA_STOPPED && !this.stopedByUser) {
            this.Forward()


          }
          else if (status == this.media.MEDIA_STOPPED && this.stopedByUser) {
            this.stopedByUser = false

          }
        });*/


      }
      catch (e) {
        this.settingsProvider.ShowToast(e)
      }
    }
    else {
      this.settingsProvider.ShowAlert("Warning", "Please Sync All")
    }

  }

  stopedByUser: boolean = false

  Stop() {
    if (this.myfile != undefined && this.myfile != null) {

      try {
        this.stopedByUser = true
        this.myfile.stop()

      }
      catch (e) {
        this.settingsProvider.ShowToast(e)
      }

    }
  }

  Popover(myEvent) {
    let popover = this.popoverCtrl.create(SignOutPage);
    popover.present({
      ev: myEvent
    });
  }

  Sync() {

    if (this.requesting)
      return

    var favoritesTemp = new Array<ItemPlayer>()
    favoritesTemp = JSON.parse(localStorage.getItem('favorites'))

    var candidates = []

    favoritesTemp.forEach(element => {
      if (element.url == '')                         //if doesn't have the url
      {
        candidates.push(element.id)
      }
    });

    if (candidates.length == 0)
      return

    this.requesting = true
    this.settingsProvider.getURL(candidates.join(',')).subscribe(result => { //get the url
      this.requesting = false
      result.forEach(url => {
        this.download(url)
      })

      this.setLastUpdate()
    }, error => {
      this.requesting = false
      this.settingsProvider.ShowToast("Error trying to get URLs")
    }, () => { })
  }

  setLastUpdate()
  {
      var d=new Date().toISOString().split('T')
      this.lastUpdated=d[0] + " " + d[1].split('-')[0]
      localStorage.setItem('sync',this.lastUpdated)
  }

  getLastUpdate()
  {
    this.lastUpdated=localStorage.getItem('sync')==null || localStorage.getItem('sync')==undefined?"":localStorage.getItem('sync')
  }


  requesting: boolean = false

  download(url: URL) {

    var arr = url.AudioUrl.split('/')

    this.requesting = true
    this.fileTransfer.download(url.AudioUrl, this.file.externalDataDirectory + arr[arr.length - 1]).then((entry) => {
      this.requesting = false
      this.settingsProvider.Update(url.PlaylistID, arr[arr.length - 1])  //update the url on local data
      this.UpdateFavoritesURL(url.PlaylistID, arr[arr.length - 1])       //update the object favorite(is loaded in ram memory)
    },
      (error) => {
        this.requesting = false
        this.settingsProvider.ShowToast('Error trying to download the lecture')
      });
  }

  UpdateSettingsLocallyServer() {

    var setting = this.settingsProvider.getSettingsLocally()
    setting.savedPlaylist = this.settingsProvider.getFavoritesIds() //updates the favorites ids
    
    this.settingsProvider.UpdateFireBase(setting).then(result=>{

    }).catch(error=>{

      this.settingsProvider.ShowToast("Error saving settings") 
    })

  }

  UpdateFavoritesURL(id: number, url: string) {
    var candidate = this.favorites.find(i => i.id == id)
    if (candidate != undefined && candidate != null)
      candidate.url = url
  }
  //----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  status: string

  PlayFromUI() {
    if (this.myfile != undefined && this.myfile != null) {
      this.myfile.play()
      this.status = 'play'
    }
  }

  PauseFromUI() {
    if (this.myfile != undefined && this.myfile != null) {
      this.myfile.pause()
      this.status = 'pause'
    }
  }

  Forward() {
    this.Stop()

    if (this.randomList.length > 0) {                                         //if the random list is active
      var index = this.randomList.findIndex(i => i.id == this.itemPlaying.id)
      if (index == this.randomList.length - 1) //if is the last one
      {
        this.itemPlaying = this.randomList[0]
      }
      else {
        this.itemPlaying = this.randomList[index + 1]
      }

    }
    else {

      var index = this.favorites.findIndex(i => i.id == this.itemPlaying.id)
      if (index == this.favorites.length - 1) //if is the last one
      {
        this.itemPlaying = this.favorites[0]
      }
      else {
        this.itemPlaying = this.favorites[index + 1]
      }

    }

    this.Play()

  }

  Back() {
    this.Stop()

    if (this.randomList.length > 0) {
      var index = this.randomList.findIndex(i => i.id == this.itemPlaying.id)
      if (index == 0) //if is the first one
      {
        this.itemPlaying = this.randomList[this.randomList.length - 1]
      }
      else {
        this.itemPlaying = this.randomList[index - 1]
      }
    }
    else {
      var index = this.favorites.findIndex(i => i.id == this.itemPlaying.id)
      if (index == 0) //if is the first one
      {
        this.itemPlaying = this.favorites[this.favorites.length - 1]
      }
      else {
        this.itemPlaying = this.favorites[index - 1]
      }
    }
    this.Play()
  }

  ReloadFromUI() {
    this.Stop()
    this.Play()
  }

  randomList: Array<ItemPlayer> = []
  Random() {

    if (this.randomList.length > 0)  //if active
    {
      this.randomList = []                        //deactivate
    }
    else {
      var randomPositions = []
      while (randomPositions.length != this.favorites.length) {            //to generate the numbers random
        var random = Math.floor(Math.random() * this.favorites.length);
        if (randomPositions.findIndex(i => i == random) < 0)
        {
           randomPositions.push(random)
           this.settingsProvider.ShowToast(randomPositions.length.toString())
        }
          
      }

      this.randomList = []
      randomPositions.forEach(element => {
        this.randomList.push(this.favorites[element])                     //populate the list 
      });

      if (this.itemPlaying == null)  //if nobody is playing 
      {
        this.itemPlaying = this.randomList[0]  //play the first element in the ramdom list
        this.Play()
      }
    }

  }

  ColorRandom(){
    return this.randomList.length==0?"light":"random"
  }

}

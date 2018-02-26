import { HomePage } from './../home/home';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {SettingsPage} from '../settings/settings'

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
   Listas = [{id:"1",nombre:"Daily Halacha",descripcion:"by Rabbi Eli Mansour",color:"gris"},
        {id:"2",nombre:"Daf Yomi",descripcion:"by Rabbi Eli Mansour",color:"gris"},
        {id:"3",nombre:"Daily Tehillim - Chapter of the day",descripcion:"Recited by Hacham Baruch BenHaim ZT'L",color:"gris"},
        {id:"4",nombre:"Daily Emunah",descripcion:"by Rabbi David Asher",color:"gris"}];
  // Arreglo de la lista 2
  Listas2 = [{id:"1",nombre:"Daily Halacha by Rabbi Eli Mansour",descripcion:"Updated 12/22/2017",color:"gris",activo:false},
        {id:"2",nombre:"Daf Yomi by Rabbi Eli Mansour",descripcion:"Updated 12/22/2017",color:"gris",activo:false},
        {id:"3",nombre:"Daily Tehillim - Chapter of the day",descripcion:"Updated 12/22/2017",color:"gris",activo:false},
        {id:"4",nombre:"Daily Emunah by Rabbi Davi Asher",descripcion:"Updated 12/22/2017",color:"gris",activo:false},
        {id:"5",nombre:"Weekly inspire by Rabbi Joey Haber",descripcion:"Updated 12/22/2017",color:"gris",activo:false}];
// Arreglo de la lista 2
  Listas3 = [{id:"1",nombre:"Daily Halacha by Rabbi Eli Mansour",descripcion:"Updated 12/22/2017",color:"gris",activo:false},
        {id:"2",nombre:"Daf Yomi by Rabbi Eli Mansour",descripcion:"Updated 12/22/2017",color:"gris",activo:false},
        {id:"3",nombre:"Daily Tehillim - Chapter of the day",descripcion:"Updated 12/22/2017",color:"gris",activo:false},
        {id:"4",nombre:"Daily Emunah by Rabbi Davi Asher",descripcion:"Updated 12/22/2017",color:"gris",activo:false},
        {id:"5",nombre:"Weekly inspire by Rabbi Joey Haber",descripcion:"Updated 12/22/2017",color:"gris",activo:false}];

  //Variables para cambiar de contexto
  reproductor:boolean;
  content_bro: boolean = false;
  content_play:boolean = true;
  positivo:boolean = true;//Vamriable para activar y desactivar los botones (playlist y browse)
  content_sig:boolean = false;
  id:string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PlaylistPage');
  }

  //Metodo que te envia a la pagina Settings
  goSettings():void{
    this.navCtrl.push(SettingsPage);
  }

  //Metodo que te envia a la pagina principal la que tiene el PaginaWeb
  goHome():void{
    this.navCtrl.push(HomePage);
  }

  //cambia las variables deacuedo a la vista que queremos mostrar al dar click en los botones PlayList y Browse
  //en este caso se muestra la lista2 
  //La variable Aux es la que contiene el boton que se esta seleccionando
  cambiaContent(aux):void{
    if (aux==1) {
      this.content_play = true;
      this.content_bro = false;
      this.positivo = true;
      this.content_sig = false;
    }
    else{
      this.content_bro=true;
      this.content_play=false;
      this.positivo = false;
      this.reproductor = false;
      this.content_sig = false
    }
  }

  //cambia las variables deacuedo a la vista que queremos mostrar
  //en este caso se muestra la lista3
  siguienteLista():void{
    this.content_bro=false;
    this.content_play=false;
    this.positivo = false;
    this.reproductor = false;
    this.content_sig = true
  }
  
///Metodo del playList para seleccionar y deseleccionar las filas 
//Es lo mismo que el metodo de la lista dos y tres pero este no se queda seleccionado 
//este no tiene la variable activo....
  cambiarColor(id,color):void{

    for (var i = 0; i < this.Listas.length; i++) {
      let vandera:string="0";
      
      if(this.Listas[i].id == id && this.Listas[i].color=="gris"){
        this.Listas[i].color="amarillo";
        this.reproductor=true;
        vandera = "1";
      }
      if(this.Listas[i].id != id && this.Listas[i].color=="gris"){
        this.Listas[i].color="gris";
      }
      if(this.Listas[i].id == id && this.Listas[i].color=="amarillo"){
        if(vandera=="1"){
          this.Listas[i].color="amarillo";
          this.reproductor=true;
        }else{
        this.Listas[i].color="gris";
        this.reproductor=false;
      }
      } 
      if(this.Listas[i].id != id && this.Listas[i].color=="amarillo"){
      this.Listas[i].color="gris";
      }
    }
  }
/*Metodo del Browse para seleccionar y deseleccionar las filas
el arreglo tiene dos variables, color y activo.. 
las cuales al dar click en una fila cambian de acuerdo a su estado...*/
  cambiarColorAzul(id,color):void{

    //variable id es global es como un $scope en angualr 1 la puedes utilizar en la vista 
    //la creo para saber cual es el id que tengo seleccionado cuando doy Click en una fila
    this.id=id;

    //Recorro el arreglo lista2 y voy chequeado el id y el color que tiene para cambiarlo o mantenerlo
    //creo una variable Vandera la cual si esta en 1 es pq el color se acaba de cambiar a Azul
    //por lo que no hay que cambiarlo el elemento activo simplemente hace que mientras que este activo se mantenga el color azul 
    // y la palomita verde... Significando que esta seleccionado...
        for (var i = 0; i < this.Listas2.length; i++) {
          let vandera:string="0";
          
          if(this.Listas2[i].id == id && this.Listas2[i].color=="gris"){
            this.Listas2[i].color="azulMenu";
            this.Listas2[i].activo=true;
            vandera = "1";
          }
          if(this.Listas2[i].id != id && this.Listas2[i].color=="gris"){
            this.Listas2[i].color="gris";
          }
          if(this.Listas2[i].id == id && this.Listas2[i].color=="azulMenu"){
            if(vandera=="1"){
              this.Listas2[i].color="azulMenu";
            }else{
            this.Listas2[i].color="gris";
            this.id="0";
            this.Listas2[i].activo=false;
          }
          } 
          if(this.Listas2[i].id != id && this.Listas2[i].color=="azulMenu"){
          this.Listas2[i].color="azulMenu";
          }
        }
      }

      //Recorro el arreglo lista3 y voy chequeado el id y el color que tiene para cambiarlo o mantenerlo
    //creo una variable Vandera la cual si esta en 1 es pq el color se acaba de cambiar a Azul
    //por lo que no hay que cambiarlo el elemento activo simplemente hace que mientras que este activo se mantenga el color azul 
    // y la palomita verde... Significando que esta seleccionado...
      cambiarColorAzulSig(id,color):void{

        //variable id es global es como un $scope en angualr 1 la puedes utilizar en la vista 
    //la creo para saber cual es el id que tengo seleccionado cuando doy Click en una fila
            this.id=id;
            
                for (var i = 0; i < this.Listas3.length; i++) {
                  let vandera:string="0";
                  
                  if(this.Listas3[i].id == id && this.Listas3[i].color=="gris"){
                    this.Listas3[i].color="azulMenu";
                    this.Listas3[i].activo=true;
                    vandera = "1";
                  }
                  if(this.Listas3[i].id != id && this.Listas3[i].color=="gris"){
                    this.Listas3[i].color="gris";
                  }
                  if(this.Listas3[i].id == id && this.Listas3[i].color=="azulMenu"){
                    if(vandera=="1"){
                      this.Listas3[i].color="azulMenu";
                    }else{
                    this.Listas3[i].color="gris";
                    this.id="0";
                    this.Listas3[i].activo=false;
                  }
                  } 
                  if(this.Listas3[i].id != id && this.Listas3[i].color=="azulMenu"){
                  this.Listas3[i].color="azulMenu";
                  }
                }
              }
}

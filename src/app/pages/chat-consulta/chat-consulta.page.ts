import { AuthService } from 'src/app/servicios/auth.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ChatService } from 'src/app/servicios/chat.service';
import { MesasService } from 'src/app/servicios/mesas.service';
@Component({
  selector: 'app-chat-consulta',
  templateUrl: './chat-consulta.page.html',
  styleUrls: ['./chat-consulta.page.scss'],
})
export class ChatConsultaPage implements OnInit {


  mensajes:any[];
  mensaje:string;

  chatroom = 'mensajes-pps4a';
  constructor(public mesasSrv:MesasService,private toastController: ToastController,public router:Router,public chatService: ChatService,public authService:AuthService) 
  {
    window.scrollTo(0, document.body.scrollHeight);
  }

  ngOnInit() {
   
    this.chatService.cargarMensajes();
  }

  atras()
  {
    if(this.authService.UsuarioActivo.perfil == "cliente")
    {
      this.router.navigate(['menu-mesa'])
    }
    else
    {
      this.router.navigate(['home-mozo'])
    }
  }

  enviarMensaje()
  {
    let nombre =""
    if(this.authService.UsuarioActivo.perfil == "empleado")
    {
      nombre = "mozo"
    }
    else
    {
      nombre = "mesa " + this.mesasSrv.numeroMesa
    }
    console.log(this.authService.UsuarioActivo.uid)
    var nuevoMensaje=
    {
      uid:this.authService.UsuarioActivo.uid,
      nombre : nombre,
      texto : this.mensaje,
    }
    this.chatService.agregarMensaje(nuevoMensaje)
    this.mensaje='';
  }

  async presentToast(mensaje:string, color:string, icono:string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 1500,
      icon: icono,
      color:color
    });

    await toast.present();
  }

}

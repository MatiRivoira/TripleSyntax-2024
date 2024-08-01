import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ChatService } from 'src/app/services/chat.service';
import { MesasService } from 'src/app/services/mesas.service';
import { Subscription } from 'rxjs';
import { element } from 'protractor';
@Component({
  selector: 'app-chat-consulta',
  templateUrl: './chat-consulta.page.html',
  styleUrls: ['./chat-consulta.page.scss'],
})
export class ChatConsultaPage implements OnInit {

  observable: Subscription = new Subscription();
  mensajes:any[];
  mensaje:string;

  constructor(public mesasSrv:MesasService,private toastController: ToastController,public router:Router,public chatService: ChatService,public authService:AuthService) {
    window.scrollTo(0, document.body.scrollHeight);
  }

  ngOnInit() {
    this.chatService.cargarMensajes();
    console.log("Usuario Activo:", this.authService.UsuarioActivo)
    console.log("MENSAJES: ")
    this.chatService.mensajes.forEach(element => {
      console.log(element);
    })
  }

  atras() {
    if(this.authService.UsuarioActivo.perfil == "cliente")
    {
      this.router.navigate(['menu-mesa']);
    }
    else
    {
      this.router.navigate(['home-mozo']);
    }
  }

  formatearFecha() {
    let now = new Date();
    let day = ("0" + now.getDate()).slice(-2);
    let month = ("0" + (now.getMonth() + 1)).slice(-2);
    let year = now.getFullYear();
    let hours = ("0" + now.getHours()).slice(-2);
    let minutes = ("0" + now.getMinutes()).slice(-2);
    let seconds = ("0" + now.getSeconds()).slice(-2);

    const fechaFormateada = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    return fechaFormateada;
  }

  enviarMensaje() { 
    let mensaje = {
      texto: this.mensaje,
      fecha: this.formatearFecha(),
      uid: this.authService.UsuarioActivo.uid,
      nombre: this.authService.UsuarioActivo.nombre,
    };

    if(this.mensaje.trim() !== '') {
      this.chatService.agregarMensaje(mensaje)
      this.mensaje = '';
    }
  }

  convertToDate(dateString: string): Date {
    const [day, month, year, hour, minute, second] = dateString.split(/[\s/:]/);
    return new Date(+year, +month - 1, +day, +hour, +minute, +second);
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

  ngOnDestroy(): void {
    this.observable.unsubscribe();
  }

}

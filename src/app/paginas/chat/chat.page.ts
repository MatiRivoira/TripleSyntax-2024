import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/servicios/auth.service';
import { ChatService } from 'src/app/servicios/chat.service';
import { FirebaseCloudMessagingService } from 'src/app/servicios/fcm.service';
import { FirebaseService } from 'src/app/servicios/firebase.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  popup: boolean = false;
  mensajePopup: string = "";
  mensajes: any[] = [];
  usuario: any;
  mesa: any;
  usuarioAnonimo: any;
  nuevoMensaje: string = "";

  constructor(
    private firestore: FirebaseService,
    private auth: AuthService,
    private chat: ChatService,
    private router: Router,
    private fcmService: FirebaseCloudMessagingService
  ) { }

  ngOnInit() {
    this.chat.obtenerMensajes().subscribe((data: any) => {
      if (data !== null) {
        this.mensajes = data;
        console.log(this.mensajes);
        setTimeout(() => {
          this.deslizarPantallaHaciaAbajo();
        }, 100);
      }
    });

    this.usuario = this.firestore.obtenerClienteAnonimo();

    if (this.usuario == null) {
      this.firestore.obtenerColeccion('usuarios-aceptados').subscribe((res) => {
        res.forEach(async (usuario) => {
          if (usuario.email == this.auth.obtenerEmailUsuarioLogueado()) {
            this.usuario = usuario;
            this.firestore.obtenerColeccion("mesas").subscribe((data) => {
              data.forEach((mesa) => {
                if (mesa.cliente != undefined && mesa.cliente.id == usuario.id) {
                  this.mesa = mesa;
                  console.log(this.mesa);
                }
              })
            })
          }
        });
      });
    }
  }

  enviarMensaje() {

    if (this.nuevoMensaje.trim() == '') {
      this.mensajePopup = "No puede enviar mensajes vacíos";
      this.popup = true;
      return;
    }
    //
    const fecha = new Date();
    const hora = fecha.getHours().toString().padStart(2, '0');
    const minutos = fecha.getMinutes().toString().padStart(2, '0');
    const segundos = fecha.getSeconds().toString().padStart(2, '0');

    const horaMensaje = `${hora}:${minutos}:${segundos}`;
    let mensaje = {
      // usuario: this.usuario ? this.usuario.perfil : this.usuarioAnonimo.perfil,
      usuario: this.usuario.perfil,
      texto: this.nuevoMensaje,
      hora: horaMensaje,
      //mesaId: "",
    };
    // if (this.usuario.perfil != 'mozo') {
    //   mensaje.mesaId = this.mesa.id;
    // }

    this.chat.crearMensaje(mensaje);
    this.nuevoMensaje = '';
    this.deslizarPantallaHaciaAbajo();

    if (this.usuario.perfil === 'cliente' || this.usuario.perfil === 'anónimo') {
      // enviar push notification mensaje consulta
      this.fcmService.nuevoMensajePushNotification(this.usuario.nombre + " " + this.usuario.apellido, mensaje.texto, 'mozo');
    }
    else {
      // enviar push notification mensaje respuesta chat
      this.fcmService.nuevoMensajePushNotification('Soporte', mensaje.texto, '');
    }
  }

  deslizarPantallaHaciaAbajo() {
    const elements = document.getElementsByClassName('mensajes');
    const lastElement: any = elements[elements.length - 1];
    const contenedorMensajes = document.querySelector('pantalla');
    let toppos: any = [];
    if (lastElement != null) {
      toppos = lastElement.offsetTop;
    }
    if (contenedorMensajes != null) {
      contenedorMensajes.scrollTop = toppos;
    }
  }

  verificarPerfil() {
    if (this.usuario.perfil == "mozo") {
      this.router.navigateByUrl("/mozo");
    }
    else {
      this.router.navigateByUrl("/inicio-cliente/mesa");
    }

  }

}

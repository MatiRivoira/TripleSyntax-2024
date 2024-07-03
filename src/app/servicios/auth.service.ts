import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import { FirebaseService } from './firebase.service';
import { of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { Firestore, collection, getDocs, updateDoc, doc } from '@angular/fire/firestore';
import { AudioService } from './audio.service';
import { FirebaseCloudMessagingService } from './fcm.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  usuarioAceptado: any;
  listaUsuario: any[] = [];
  constructor(
    private router: Router,
    private angularFireAuth: AngularFireAuth,
    private firebaseServ: FirebaseService,
    private firestore2: Firestore,
    private audioService: AudioService
  ) {
    this.firebaseServ.obtenerColeccion('usuarios-aceptados').subscribe((res) => {
      this.listaUsuario = res;
    });
  }

  async iniciarSesion(email: string, contraseña: string) {
    return new Promise((resolve, rejected) => {
      this.angularFireAuth.signInWithEmailAndPassword(email, contraseña).then(async usuario => {
        console.log("for");
        this.obtenerUsuarioPorEmail(email);

        this.audioService.playAudio('../../assets/audio/login.mp3');

        //setTimeout(()=>{
        this.redirigirPorUsuario(this.usuarioAceptado.perfil);

        //},1500);   
        resolve(usuario);
      })
        .catch(error => rejected(error));
    });
  }

  obtenerUsuarioPorEmail(email: string) {
    for (let i = 0; i < this.listaUsuario.length; i++) {
      if (this.listaUsuario[i].email == email) {
        this.usuarioAceptado = this.listaUsuario[i];
        console.log(this.listaUsuario[i]);
        break;
      }
    }
  }

  async obtenerUsuarioPorEmail2(email: string) {
    const usersCol = collection(this.firestore2, 'usuarios-aceptados');
    const usersSnapshot = await getDocs(usersCol);
    const users = usersSnapshot.docs.map(doc => doc.data());

    return users.find(user => user['email'] === email);
  }

  redirigirPorUsuario(perfil: string) {
    switch (perfil) {
      case "cliente":
        this.router.navigate(['/inicio-cliente']);
        break;
      case "dueño":
      case "supervisor":
        this.router.navigate(['/dueno-supervisor']);
        break;
      case "metre":
        this.router.navigate(['/metre']);
        break;
      case "mozo":
        this.router.navigate(['/mozo']);
        break;
      case "bartender":
        this.router.navigate(['bartender']);
        break;
      case "cocinero":
        this.router.navigate(['cocinero']);
        break;
    }
  }

  cerrarSesion() {
    try {
      this.angularFireAuth.signOut().then(() => {
        setTimeout(() => {
          console.log("Sesión cerrada exitosamente.");
          this.audioService.playAudio('../../assets/audio/logout.mp3');
          this.router.navigate(['/login']);
        }, 2000);
      });
    } catch (error: any) {
      console.log(error.message);
    }
  }

  registrarUsuario(nuevoUsuario: any) {
    this.angularFireAuth.createUserWithEmailAndPassword(nuevoUsuario.email, nuevoUsuario.password)
      .then(() => {
        console.log(`Usuario ${nuevoUsuario.nombre} registrado exitosamente`);
        //this.cerrarSesion();
        this.iniciarSesion('duenio@duenio.com', 'duenio');
      })
      .catch((error) => {
        console.log(error.code);
      })
  }

  crearMensaje(errorCode: string): string {
    let mensaje: string = '';
    switch (errorCode) {
      case 'auth/operation-not-allowed':
        mensaje = 'La operación no está permitida.';
        break;
      case 'auth/email-already-in-use':
        mensaje = 'El email ya está registrado.';
        break;
      case 'auth/user-not-found':
        mensaje = 'No existe ningún usuario con estos datos';
        break;
      default:
        mensaje = 'Dirección de email y/o contraseña incorrectos';
        break;
    }

    return mensaje;
  }

  obtenerEmailUsuarioLogueado() {
    return firebase.auth().currentUser?.email;
  }
}



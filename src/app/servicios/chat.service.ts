import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private angularFirestore: AngularFirestore, private firestore: FirebaseService) { }

  obtenerMensajes() {
    return this.firestore.obtenerColeccion("chat");
  }

  crearMensaje(mensaje: any) {
    console.log("Mensaje en servicio 1: ", mensaje);
    this.angularFirestore.collection<any>('chat').add(mensaje);
    console.log("Mensaje en servicio 2: ", mensaje);
  }
}

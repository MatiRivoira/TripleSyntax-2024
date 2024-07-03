import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private angularFirestore: AngularFirestore) { }

  obtenerMensajes() {
    const collection = this.angularFirestore.collection<any>('chat', (ref) =>
      ref.orderBy('hora', 'asc').limit(25)
    );
    return collection.valueChanges();
  }

  crearMensaje(mensaje: any) {
    this.angularFirestore.collection<any>('chat').add(mensaje);
  }
}

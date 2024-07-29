import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private itemsCollection?: AngularFirestoreCollection<any>;
  public mensajes$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public userLog: any = {};
  elements: any;

  constructor(private authService: AuthService,private afs: AngularFirestore) {
    }

    cargarMensajes() {

      this.itemsCollection = this.afs.collection<any>('mensajes-chat', ref => ref.limit(20));
      return this.itemsCollection.valueChanges().subscribe((mensajes): void =>
        {
          mensajes.sort((a: any, b: any) => {
            const dateA = a.fecha;
            const dateB = b.fecha;
            if (dateA > dateB) {
              return 1;
            } else if (dateA < dateB) {
              return -1;
            } else {
              return 0;
            }
          });
          this.mensajes$.next(mensajes);
        })
    }

    agregarMensaje(message: any) {
      console.log(message);
     
      let newMessage: any = {
        nombre: message.nombre,
        texto: message.texto,
        fecha: this.formatDate(new Date()),
        uid:message.uid,
      };
      if(message.hasOwnProperty("mesaQueSeLeEnviaMensaje"))
      {
        newMessage.mesaQueSeLeEnviaMensaje = message.mesaQueSeLeEnviaMensaje;
      }
  
      return this.afs.collection('mensajes-chat').add(newMessage);
    }

  formatDate = (date: any) => {
    return date.toLocaleString('es-AR')
  }
}
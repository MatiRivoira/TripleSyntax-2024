import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private itemsCollection?: AngularFirestoreCollection<any>;
  public mensajes: any[] = [];
  public userLog: any = {};
  elements: any;

  constructor(private authService: AuthService, private afs: AngularFirestore) {}

  cargarMensajes() {
    this.itemsCollection = this.afs.collection<any>('chat', ref => ref.limit(20));
    return this.itemsCollection.valueChanges().subscribe(mensajes => {
      this.mensajes = [];
      mensajes.forEach(mensaje => {
        console.info(mensaje);
        this.mensajes.unshift(mensaje);
      });
      this.mensajes.sort((a: any, b: any) => {
        const dateA = this.parseDate(a.fecha);
        const dateB = this.parseDate(b.fecha);
        return dateA.getTime() - dateB.getTime();
      });
    });
  }

  agregarMensaje(message: any) {
    let newMessage: any = {
      nombre: message.nombre,
      texto: message.texto,
      fecha: this.formatDate(new Date()),
      uid: message.uid
    };

    return this.afs.collection('chat').add(newMessage);
  }

  formatDate(date: any): string {
    return date.toLocaleString('es-AR');
  }

  parseDate(dateString: string): Date {
    const [datePart, timePart] = dateString.split(' ');
    const [day, month, year] = datePart.split('/').map(Number);
    const [hours, minutes, seconds] = timePart.split(':').map(Number);
    return new Date(year, month - 1, day, hours, minutes, seconds);
  }
}

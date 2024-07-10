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
    this.itemsCollection = this.afs.collection<any>('chats4', ref => ref.limit(20));
    return this.itemsCollection.valueChanges().subscribe(mensajes => {
      this.mensajes = [];
      // Ordena los mensajes por la fecha 'time' en formato DD/MM/YYYY HH:MM:SS
      this.mensajes = mensajes.sort((a: any, b: any) => {
        const dateA = this.convertToDate(a.fecha);
        const dateB = this.convertToDate(b.fecha);
        return dateA.getTime() - dateB.getTime();
      });
    });
  }

  convertToDate(dateString: string): Date {
    const [day, month, year, hour, minute, second] = dateString.split(/[\s/:]/);
    return new Date(+year, +month - 1, +day, +hour, +minute, +second);
  }

  agregarMensaje(message: any) {
    let newMessage: any = {
      nombre: message.nombre,
      texto: message.texto,
      fecha: this.formatearFecha(),
      uid: message.uid
    };

    return this.afs.collection('chats4').add(newMessage);
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


  parseDate(dateString: string): Date {
    const [datePart, timePart] = dateString.split(' ');
    const [day, month, year] = datePart.split('/').map(Number);
    const [hours, minutes, seconds] = timePart.split(':').map(Number);
    return new Date(year, month - 1, day, hours, minutes, seconds);
  }
}

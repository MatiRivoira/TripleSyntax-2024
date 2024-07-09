import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  constructor(private angularFirestore: AngularFirestore) {}

  traerClientes() {
    const coleccion = this.angularFirestore.collection('usuarios', (ref) =>
      ref.where('perfil', '==', 'cliente')
    );
    return coleccion.valueChanges();
  }

  actualizarUsuario(usuario: any) {
    return this.angularFirestore
      .doc<any>(`usuarios/${usuario.uid}`)
      .update(usuario);
  }

  traerSupervisores() {
    const coleccion = this.angularFirestore.collection('usuarios', (ref) =>
      ref.where('perfil', 'in', ['supervisor', 'dueño'])
    );
    return coleccion.valueChanges();
  }
  traerMetres() {
    const coleccion = this.angularFirestore.collection('usuarios', (ref) =>
      ref.where('tipo', '==', 'metre')
    );
   
    return coleccion.valueChanges();
  }

  traerEmpleados() {
    const coleccion = this.angularFirestore.collection('usuarios', (ref) =>
      ref.where('perfil', '==', 'empleado')
    );
    return coleccion.valueChanges();
  }

  traerEncuestasClientes() {
    const coleccion = this.angularFirestore.collection<any>(
      'encuestaSobreClientes'
    );
    return coleccion.valueChanges();
  }

  traerEncuestasEmpleados() {
    const coleccion = this.angularFirestore.collection<any>(
      'encuestaSobreEmpleados'
    );
    return coleccion.valueChanges();
  }

  crearEncuestaSobreClientes(encuesta: any) {
    return this.angularFirestore
      .collection<any>('encuestaSobreClientes')
      .add(encuesta);
  }

  crearEncuestaSobreEmpleados(encuesta: any) {
    return this.angularFirestore
      .collection<any>('encuestaSobreEmpleados')
      .add(encuesta);
  }

  async agregarAListaDeEspera(cliente: any) {
    return await this.angularFirestore.collection('lista-de-espera').doc(cliente.uid).set(cliente);
  }
}

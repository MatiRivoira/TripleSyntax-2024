import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import { QuerySnapshot } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private visitado :boolean = false;
  private usuarioAnonimo:any = null;
  private usuarioRegistrado:any = null;

  constructor(private angularFirestore: AngularFirestore) { }

  obtenerColeccion(nombreColeccion:string)
  {
    const coleccion = this.angularFirestore.collection<any>(nombreColeccion);
    return coleccion.valueChanges();
  }

  agregarDocumento(dato:any,nombreColeccion:string)
  {
    return new Promise<void> ((resolve, rejected) => {
      this.angularFirestore.collection(nombreColeccion).doc(dato.dni + '.' + dato.hora).set({
      id: dato.dni + '.' + dato.hora,
      nombre: dato.nombre,
      apellido: dato.apellido,
      dni: dato.dni,
      email: dato.email,
      password: dato.password,
      hora: dato.hora,
      rutaFoto: dato.rutaFoto,
      perfil: dato.perfil,
    })
    .then(()=>{
      resolve();
    })
    .catch(error=>rejected(error))
  });
  }

  guardarEncuestaCliente(datos:any){
    return new Promise((resolve, rejected) => {
      this.angularFirestore.collection("encuestas-clientes").add({
        fecha: Date.now(),
        rangoEdad: datos.rangoEdad,
        gustosDelLocal: datos.gustosDelLocal,
        limpieza: datos.limpieza,
        recomendados: datos.recomendados,
        sugerencia: datos.comentario,
        fotos: datos.fotos
      }).catch(error => {
        alert(error);
        rejected(error)
      });
  });
   }

  eliminarClientePorCampo(nombreVariable:string,valorVariable:string,nombreColeccion:string)
  {
    this.angularFirestore.collection(nombreColeccion, ref => ref.where(nombreVariable,'==',valorVariable)).get()
    .subscribe(QuerySnapshot => {
      QuerySnapshot.forEach(doc =>{
        doc.ref.delete();
      });
    });
  }

  actualizarClientePorId(nombreColeccion:string,clienteActualizado:any)
  {
    this.angularFirestore.collection(nombreColeccion,ref => ref.where('id','==',clienteActualizado.id)).get()
    .subscribe(QuerySnapshot => {
      QuerySnapshot.forEach(doc =>{
        doc.ref.update(clienteActualizado);
      });
    })
  }

  actualizarMesaPorId(mesaActualizada:any)
  {
    this.angularFirestore.collection('mesas',ref => ref.where('id','==',mesaActualizada.id)).get()
    .subscribe(QuerySnapshot => {
      QuerySnapshot.forEach(doc =>{
        doc.ref.update(mesaActualizada);
      });
    })
  }


  actualizarPedidoPorId(pedidoActualizado:any,nombreColeccion:string)
  {
    this.angularFirestore.collection(nombreColeccion,ref => ref.where('id','==',pedidoActualizado.id)).get()
    .subscribe(QuerySnapshot => {
      QuerySnapshot.forEach(doc =>{
        doc.ref.update(pedidoActualizado);
      });
    })
  }

  agregarDocumentoAnonimo(dato:any,nombreColeccion:string)
  {
    return new Promise<void> ((resolve, rejected) => {
      this.angularFirestore.collection(nombreColeccion).doc(dato.id).set({
      id: dato.id,
      apellido: dato.apellido,
      nombre: dato.nombre,
      hora: dato.hora,
      rutaFoto: dato.rutaFoto,
      perfil: dato.perfil,
    })
    .then(()=>{
      this.usuarioAnonimo = dato;
      resolve();
    })
    .catch(error=>rejected(error))
  });
  }

  obtenerClienteAnonimo()
  {
    return this.usuarioAnonimo;
  }
  
  agregarDocumentoGenerico(datos:any,nombreColeccion:string)
  {
    return this.angularFirestore.collection(nombreColeccion).add(datos);
  }

  eliminarDocumento(datoAEliminar:any,nombreColeccion:string)
  {
    this.angularFirestore
    .doc<any>(`${nombreColeccion}/${datoAEliminar.id}`)
    .delete()
    .then(() =>{
      console.log(`Se eliminó ${datoAEliminar.nombre} de la lista ${nombreColeccion}`);
    })
    .catch((error) =>{
      console.log(error.code);
    })
  }

  borrarFoto(rutaFoto:string){
    let storageRef = firebase.storage().ref();

    if (rutaFoto != "../../../assets/icon/foto-avatar-avif"){
    
      storageRef.listAll().then((lista)=>{
        lista.items.forEach(f => {
          f.getDownloadURL().then((link)=>{
            if (link == rutaFoto){    
              f.delete();
              console.log("foto borrada");
            }
          });
        });
      }).catch(e=>{
        console.log(e);
      });
    }
  }

  elimiarColeccionChat() {
    this.angularFirestore.collection('chat').snapshotChanges().subscribe(documents => {
      documents.forEach(document => {
        const id = document.payload.doc.id;
        this.angularFirestore.collection('chat').doc(id).delete();
      });
    });
  }

  
  seteatVisita(visitado: boolean) {
    this.visitado = visitado;
  }

  getVisitaEstado(): boolean {
    return this.visitado;
  }
}

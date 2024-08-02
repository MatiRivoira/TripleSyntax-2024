import { getFirestore } from '@angular/fire/firestore';
import { Injectable, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/compat/firestore';
import { FirebaseStorage, getDownloadURL, getStorage, ref, uploadBytes, uploadBytesResumable, uploadString } from 'firebase/storage';
import { Router } from '@angular/router';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import * as firebase from 'firebase/compat';
import { ToastController } from '@ionic/angular';
import { Vibration } from '@awesome-cordova-plugins/vibration/ngx';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class MesasService {

  numeroMesa: any;
  constructor(
    private vibration: Vibration,public afAuth: AngularFireAuth,
    public afs: AngularFirestore,
    private router: Router,
    private toastController: ToastController
  ) { }

  async hacerPedido(pedido: any): Promise<string> {
    try {
      pedido.uid = await this.afs.createId();
      await this.afs.collection('pedidos').doc(pedido.uid).set(pedido).then(async () => {
        console.log("SRV:", pedido)
        await this.presentToast('Pedido realizado!', 'success', 'thumbs-up-outline')
        return pedido.uid
      })
    }
    catch (err) {
      this.presentToast(
        'Error! Hubo un error',
        'danger',
        'alert-circle-outline'
      );
      this.vibration.vibrate(1000);

      console.log("error:", err)
      return null;
    }
  }

  TraerPedidos(estado: string, estado2?: string) {
    if (estado2) {
      const coleccion1 = this.afs.collection('pedidos', (ref) => ref.where('estado', '==', estado));
      const coleccion2 = this.afs.collection('pedidos', (ref) => ref.where('estado', '==', estado2));
      
      return combineLatest([
        coleccion1.valueChanges(),
        coleccion2.valueChanges()
      ]).pipe(
        map(([res1, res2]) => [...res1, ...res2])
      );
    } else {
      const coleccion = this.afs.collection('pedidos', (ref) => ref.where('estado', '==', estado));
      return coleccion.valueChanges();
    }
  }

  TraerTodosLosPedidos() {
    const coleccion = this.afs.collection('pedidos');
    return coleccion.valueChanges();
  }

  traerPedido(IdPedido: string) {
    return this.afs
      .collection('pedidos')
      .doc(IdPedido)
      .valueChanges()
  }

  actualizarPedido(pedido:any)
  {
    this.afs.collection("pedidos").doc(pedido.uid).update(pedido).catch((err)=>
    {
      this.presentToast(
        'Error! Hubo un error',
        'danger',
        'alert-circle-outline'
      );
      this.vibration.vibrate(1000);

    }).then(()=>
    {
      
    })
  }

  traerProductos() {
    const coleccion = this.afs.collection('productos');
    return coleccion.valueChanges();
  }

  traerMesasDisponibles() {
    const coleccion = this.afs.collection('mesas', (ref) => ref.where('ocupada', '==', false));
    return coleccion.valueChanges();
  }

  traerListaEspera() {
    const coleccion = this.afs.collection('lista-de-espera');
    return coleccion.valueChanges();
  }

  async borrarDeListaEspera(cliente: any) {
    // Asumiendo que tienes una colección llamada 'lista-de-espera'
    var listaEsperaRef;
    if (cliente.uid) {
      listaEsperaRef = this.afs.collection('lista-de-espera', ref => 
        ref.where('uid', '==', cliente.uid)
           .where('horario', '==', cliente.horario)
           .where('dia', '==', cliente.dia)
      );
    } else {
      listaEsperaRef = this.afs.collection('lista-de-espera', ref => 
        ref.where('id', '==', cliente.id)
           .where('horario', '==', cliente.horario)
           .where('dia', '==', cliente.dia)
      );
    }
  
    // Obtener los documentos que coincidan con las condiciones
    const snapshot = await listaEsperaRef.get().toPromise();
  
    snapshot.forEach(doc => {
      // Borrar cada documento que coincida
      this.afs.collection('lista-de-espera').doc(doc.id).delete();
    });
  
    console.log(`Cliente con ID ${cliente.id}, horario ${cliente.horario} y día ${cliente.dia} ha sido borrado de la lista de espera.`);
  }

  async AsignarMesa(cliente: any, mesa: number) {
    const coleccion = await this.afs.collection('lista-de-espera', (ref) => ref.where('uid', '==', cliente.uid));
    await (await coleccion.get().toPromise()).docs.forEach(async (cliente) => {
      let clienteEncontrado: any = cliente.data()
      await this.afs.collection('lista-de-espera').doc(cliente.id).update({ mesaAsignada: mesa }).catch((err) => {
        this.presentToast('Ocurrio un error al asignar', 'danger', 'qr-code-outline');
        this.vibration.vibrate(1000);

      }).finally(async() => {
        this.presentToast('Mesa asignada', 'success', 'qr-code-outline');
        await this.borrarDeListaEspera(cliente);
      })

    })
  }

  async CambiarEstadoPedido(pedido:any, estado:string)
  {
    this.afs.collection('pedidos').doc(pedido.uid).update({ estado: estado }).catch((err) => {
      this.presentToast('Ocurrio un error al aprobar', 'danger', 'qr-code-outline');
      this.vibration.vibrate(1000);

    }).finally(() => {
      this.presentToast('Pedido modificado', 'success', 'qr-code-outline');
    })
  }

  
  async DesaprobarPedido(pedido:any)
  {
    this.afs.collection('pedidos').doc(pedido.uid).delete().catch((err) => {
      this.presentToast('Ocurrio un error al rechazar', 'danger', 'qr-code-outline');
      this.vibration.vibrate(1000);

    }).finally(() => {
      this.presentToast('Pedido Rechazado', 'success', 'qr-code-outline');
    })
  }

  async ConsultarMesaActiva(numeroMesa: number): Promise<Boolean> {
    let flagOcupada = false;
    const coleccion = await this.afs.collection('mesas', (ref) => ref.where('numero', '==', numeroMesa));
    await (await coleccion.get().toPromise()).docs.forEach(async (mesa: any) => {
      if (mesa.data().numero == numeroMesa) {
        flagOcupada = mesa.data().ocupada;
      }
    })
    return flagOcupada;
  }

  async asignarCliente(numeroMesa: number, cliente: any) {
    //Busco la mesa con ese numero
    const coleccion = await this.afs.collection('mesas', (ref) => ref.where('numero', '==', numeroMesa));
    await (await coleccion.get().toPromise()).docs.forEach(async (mesa) => {
      let mesaEncontrada: any = mesa.data()
      if (mesaEncontrada.numero == numeroMesa) {
        //al encontrarla agrego al usuario y la marco como ocupada
        await this.afs.collection('mesas').doc(mesa.id).update({ clienteActivo: cliente, ocupada: true }).catch((err) => {
          this.presentToast('Ocurrio un error al asignar', 'danger', 'qr-code-outline');
          this.vibration.vibrate(1000);

        }).finally(async () => {
          //borro al cliente de la lista de espera
          const coleccion = await this.afs.collection('lista-de-espera', (ref) => ref.where('uid', '==', cliente.uid));
          await (await coleccion.get().toPromise()).docs.forEach(async (cliente) => {
            let clienteEncontrado: any = cliente.data()
            await this.afs.collection('lista-de-espera').doc(cliente.id).delete().catch((err) => {
              this.presentToast('Ocurrio un error al asignar', 'danger', 'qr-code-outline');
              this.vibration.vibrate(1000);

            }).finally(() => {
              this.presentToast('Mesa asignada', 'success', 'qr-code-outline');
            })
          })
        })
      }
    })
  }

  traerMesas() {
    const coleccion = this.afs.collection('mesas');
    return coleccion.valueChanges();
  }

  async AsignarMesaReserva(lista: any, mesa: any) {
    if (lista) {
      try {
        // Actualizar la mesa
        await this.afs.collection('mesas').doc(mesa.id).update({ ...mesa, clienteActivo: "cliente@cliente.com" });
  
        // Buscar y actualizar la entrada correspondiente en la lista de espera
        console.log(lista.uid);

        var listaEsperaRef;
        if (lista.uid) {
          listaEsperaRef = this.afs.collection('lista-de-espera', ref => 
            ref.where('uid', '==', lista.uid)
               .where('horario', '==', lista.horario)
               .where('dia', '==', lista.dia)
          );
        } else {
          listaEsperaRef = this.afs.collection('lista-de-espera', ref => 
            ref.where('id', '==', lista.id)
               .where('horario', '==', lista.horario)
               .where('dia', '==', lista.dia)
          );
        }
        
  
        // Obtener los documentos que coincidan con las condiciones
        const snapshot = await listaEsperaRef.get().toPromise();
        console.log(mesa.numero);
        
        snapshot.forEach(async doc => {
          console.log(doc);
          
          // Actualizar el documento encontrado
          await this.afs.collection('lista-de-espera').doc(doc.id).set({
            estado: lista.estado,
            mesaAsignada: mesa.numero,
            estaEnLaLista: true,
            escanioQrLocal: true
          }, { merge: true });
        });
  
        this.presentToast('Mesa asignada Reserva', 'success', 'qr-code-outline');
      } catch (err) {
        this.presentToast(err, 'danger', 'qr-code-outline');
        this.vibration.vibrate(1000);
      }
    } else {
      this.presentToast('Error al asignar mesa para la reserva', 'danger', '');
    }
  }
  

  async desasignarCliente(numeroMesa: number) {
    const coleccion = await this.afs.collection('mesas', (ref) => ref.where('numero', '==', numeroMesa));
    await (await coleccion.get().toPromise()).docs.forEach(async (mesa) => {
      let mesaEncontrada: any = mesa.data()
      if (mesaEncontrada.numero == numeroMesa) {
        this.afs.collection('mesas').doc(mesa.id).update({ clienteActivo: null, ocupada: false }).catch((err) => {
          this.presentToast('Ocurrio un error al desasignar', 'danger', 'qr-code-outline');
          this.vibration.vibrate(1000);

        }).finally(() => {
          this.presentToast('Mesa desasignada', 'success', 'qr-code-outline');
        })
      }
    })
  }

  traerMozos() {
    const coleccion = this.afs.collection('usuarios', (ref) =>
      ref.where('perfil', '==', 'empleado').where('tipo', '==', 'mozo')
    );
    return coleccion.valueChanges();
  }

  traerCocineros() {
    const coleccion = this.afs.collection('usuarios', (ref) =>
      ref.where('perfil', '==', 'empleado').where('tipo', 'in', ['cocinero', "bartender"])
    );
    return coleccion.valueChanges();
  }

  async presentToast(mensaje: string, color: string, icono: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 1500,
      icon: icono,
      color: color,
    });

    await toast.present();
  }

  TraerMesaPorNumero(numeroMesa: number) {
    try {
      console.log("entre consulta");
      console.log(numeroMesa);
      const coleccion = this.afs.collection('mesas', (ref) => ref.where('numero', '==', numeroMesa).limit(1));
      return coleccion.valueChanges();
      
    } catch (error) {
      console.log(error)
    }
  }

  async LiberarMesa(mesa: any, lista:any) {
    console.log("estado de la lista: "+lista.estado);
   if(mesa.ocupada==true && mesa.clienteActivo!=null && lista.estado=="aprobadaConMesaAsignada")
   {
     this.afs.collection('mesas').doc(mesa.id).set({ ...mesa, clienteActivo: null, ocupada: false });
   }
  }

   // Método para borrar todos los documentos de una colección
   BorrarCollection(collection: string): any {
    const subscription = this.getDocuments(collection).subscribe(documents => {
      console.log(documents);
      documents.forEach(doc => {
        console.log(doc.id);
        this.deleteDocument(collection, doc.id);
      });
      subscription.unsubscribe(); // Desuscribirse después de completar la eliminación
    });

    return subscription;
  }

  addDocument(collection: string, data: any, id?: string): Promise<void> {
    const docId = id || this.afs.createId();
    return this.afs.collection(collection).doc(docId).set({ id: docId, ...data });
  }

  addDocumentReturnID(collection: string, data: any, id?: string): Promise<string> {
    const docId = id || this.afs.createId();
    return this.afs.collection(collection).doc(docId).set({ id: docId, ...data })
        .then(() => docId);  // Retorna el docId después de agregar el documento
}

  // Read a document by ID
  getDocument(collection: string, id: string): Observable<any> {
    return this.afs.collection(collection).doc(id).valueChanges();
  }

  // Read all documents in a collection
  getDocuments(collection: string): Observable<any[]> {
    return this.afs.collection(collection).valueChanges();
  }

  // Update a document by ID
  updateDocument(collection: string, id: string, data: any): Promise<void> {
    return this.afs.collection(collection).doc(id).update(data);
  }

  // Delete a document by ID
  deleteDocument(collection: string, id: string): Promise<void> {
    return this.afs.collection(collection).doc(id).delete();
  }

}
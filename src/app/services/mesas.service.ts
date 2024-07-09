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

  TraerPedidos(estado:string)
  {
    const coleccion = this.afs.collection('pedidos', (ref) => ref.where('estado', '==', estado));
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
    await this.afs.collection('lista-de-espera').doc(cliente.uid).delete().catch((err) => {
      this.presentToast('Ocurrio un error al borrar de la lista de espera', 'danger', 'alert-circle-outline');
      this.vibration.vibrate(1000);

    });
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
}

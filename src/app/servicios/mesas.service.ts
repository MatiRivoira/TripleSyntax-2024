import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Vibration } from '@awesome-cordova-plugins/vibration/ngx';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class MesasService {

  numeroMesa: any;
  constructor(
    private vibration: Vibration, public afAuth: AngularFireAuth,
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

  TraerPedidos(estado: string) {
    const coleccion = this.afs.collection('pedidos', (ref) => ref.where('estado', '==', estado));
    return coleccion.valueChanges();
  }

  TraerPedidosNoPreparadoCocinero() {
    const coleccion = this.afs.collection('pedidos', (ref) => ref.where('estado', '==', 'aceptado').where('estaListoCocinero', '==', false));
    return coleccion.valueChanges();
  }

  TraerPedidosNoPreparadoBartender() {
    const coleccion = this.afs.collection('pedidos', (ref) => ref.where('estado', '==', 'aceptado').where('estaListoBartender', '==', false));
    return coleccion.valueChanges();
  }

  /////////////////////////////////////////////////////
  TraerPedidosPreparadosCocineroBartender() {
    const coleccion = this.afs.collection('pedidos', (ref) => ref.where('estaListoCocinero', '==', true).where('estaListoBartender', '==', true));
    return coleccion.valueChanges();
  }

  TraerPedidosPreparadosCocinero() {
    const coleccion = this.afs.collection('pedidos', (ref) => ref.where('estaListoCocinero', '==', true));
    return coleccion.valueChanges();
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

  TraerPedidosPreparadosBartender() {
    const coleccion = this.afs.collection('pedidos', (ref) => ref.where('estaListoBartender', '==', true));
    return coleccion.valueChanges();
  }
  ////////////////////////////////////////////

  traerPedido(IdPedido: string) {
    return this.afs
      .collection('pedidos')
      .doc(IdPedido)
      .valueChanges()
  }

  actualizarPedido(pedido: any) {
    this.afs.collection("pedidos").doc(pedido.uid).update(pedido).catch((err) => {
      this.presentToast(
        'Error! Hubo un error',
        'danger',
        'alert-circle-outline'
      );
      this.vibration.vibrate(1000);

    }).then(() => {

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
  traerMesas() {
    const coleccion = this.afs.collection('mesas');
    return coleccion.valueChanges();
  }


  traerListaEspera() {
    const coleccion = this.afs.collection('lista-de-espera');
    return coleccion.valueChanges();
  }
  traerDatosEspera(clienteEmail: string) {
    const coleccion = this.afs.collection('lista-de-espera', (ref) => ref.where('email', '==', clienteEmail));
    return coleccion.valueChanges();
  }
  traerListadosReservasAprobadas() {
    const coleccion = this.afs.collection('lista-de-espera', (ref) => ref.where('tipoLista', '==', 'reserva').where('estado', '==', 'aprobadaReserva'));
    return coleccion.valueChanges();
  }
  async borrarDeListaEspera(cliente: any) {
    await this.afs.collection('lista-de-espera').doc(cliente.uid).delete().catch((err) => {
      this.presentToast('Ocurrio un error al borrar de la lista de espera', 'danger', 'alert-circle-outline');
      this.vibration.vibrate(1000);

    });
  }

  async AsignarMesa(listadoEspera: any, mesa: any) {
    if (listadoEspera != null) {
      const clienteActivoValue = listadoEspera.email || listadoEspera.nombre;
      console.log(mesa[0])
      console.log(mesa[0].id)
      try {
        await this.afs.collection('mesas').doc(mesa[0].id).update({ocupada: mesa[0].ocupada, clienteActivo: clienteActivoValue });
        await this.afs.collection('lista-de-espera').doc(listadoEspera.uid).set({...listadoEspera, mesaAsignada: mesa[0].numero, estaEnLaLista: true, estado:listadoEspera.estado }, { merge: true });
        this.presentToast('Mesa asignada', 'success', '');
      } catch (err) {
        this.presentToast('Ocurrio un error al asignar', 'danger', 'qr-code-outline');
        console.log(err);
        this.vibration.vibrate(1000);
      }
    }
    else {
      this.presentToast('Error Asignar Mesa', 'danger', '');
    }
  }

  async AsignarMesaRecorridoNormalMetre(cliente: any, mesa: any) {
    if (cliente != null) {
      const clienteActivoValue = cliente.email || cliente.nombre;
      try {
        await this.afs.collection('mesas').doc(mesa.id).set({ ...mesa, ocupada: true, clienteActivo: clienteActivoValue });
        await this.afs.collection('lista-de-espera').doc(cliente.uid).set({ mesaAsignada: mesa.numero, estaEnLaLista: true }, { merge: true });
        this.presentToast('Mesa asignada', 'success', '');
      } catch (err) {
        this.presentToast('Ocurrio un error al asignar', 'danger', 'qr-code-outline');
        this.vibration.vibrate(1000);
      }
    }
    else {
      this.presentToast('Error Asignar Mesa', 'danger', '');
    }
  }

  async LiberarMesaPorNumero(mesaNumero: any) {
    this.TraerMesaPorNumero(mesaNumero).subscribe((mesa:any) => {
      // this.afs.collection('mesas').doc(mesa.id).set({ ...mesa, clienteActivo: null, ocupada: false });
      this.afs.collection('mesas').doc(mesa[0].id).update({...mesa[0], clienteActivo: null, ocupada: false});
    });
  }
  async LiberarMesa(mesa: any, lista:any) {
    console.log("estado de la lista: "+lista.estado);
   if(mesa.ocupada==true && mesa.clienteActivo!=null && lista.estado=="aprobadaConMesaAsignada")
   {
     this.afs.collection('mesas').doc(mesa.id).set({ ...mesa, clienteActivo: null, ocupada: false });
   }
    
  }



  async AsignarMesaReserva(lista: any, mesa: any) {
    if (lista) {
      const clienteActivoValue = lista.email || lista.nombre;
      try {
        await this.afs.collection('mesas').doc(mesa.id).update({ ...mesa, clienteActivo: clienteActivoValue });
        await this.afs.collection('lista-de-espera').doc(lista.uid).set({ estado: lista.estado, mesaAsignada: mesa.numero, estaEnLaLista: true, escanioQrLocal: true }, { merge: true });
        this.presentToast('Mesa asignada Reserva', 'success', 'qr-code-outline');
      } catch (err) {
        this.presentToast(err, 'danger', 'qr-code-outline');
        this.vibration.vibrate(1000);
      }
    } else {
      this.presentToast('Error al asignar mesa para la reserva', 'danger', '');
    }
  }


  async CambiarEstadoPedido(pedido: any, estado: string) {
    this.afs.collection('pedidos').doc(pedido.uid).update({ estado: estado }).catch((err) => {
      this.presentToast('Ocurrio un error al aprobar', 'danger', 'qr-code-outline');
      this.vibration.vibrate(1000);

    }).finally(() => {
      this.presentToast('Pedido modificado', 'success', 'qr-code-outline');
    })
  }

  async CambiarEstadoPropina(pedido: any, propina:any, porcentaje:any) {
    this.afs.collection('pedidos').doc(pedido.uid).update({ propina: propina, porcentajePropina: porcentaje}).catch((err) => {
      this.presentToast('Ocurrio un error al aprobar', 'danger', 'qr-code-outline');
      this.vibration.vibrate(1000);
    });
  }

  async CambiarEstadoPedidoCocinero(pedido: any, nuevoEstado: boolean) {
    this.afs.collection('pedidos').doc(pedido.uid).update({ estaListoCocinero: nuevoEstado }).catch((err) => {
      this.presentToast('Ocurrio un error al aprobar', 'danger', 'qr-code-outline');
      this.vibration.vibrate(1000);

    }).finally(() => {
      this.presentToast('Pedido modificado', 'success', 'qr-code-outline');
    })
  }

  async CambiarEstadoPedidoBartender(pedido: any, nuevoEstado: boolean) {
    this.afs.collection('pedidos').doc(pedido.uid).update({ estaListoBartender: nuevoEstado }).catch((err) => {
      this.presentToast('Ocurrio un error al aprobar', 'danger', 'qr-code-outline');
      this.vibration.vibrate(1000);

    }).finally(() => {
      this.presentToast('Pedido modificado', 'success', 'qr-code-outline');
    })
  }


  async DesaprobarPedido(pedido: any) {
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
    const coleccion = await this.afs.collection('mesas', (ref) => ref.where('numero', '==', numeroMesa));
    const mesaSnapshots = await coleccion.get().toPromise();

    mesaSnapshots.docs.forEach(async (mesa) => {
      const mesaEncontrada: any = mesa.data();
      if (mesaEncontrada.numero === numeroMesa) {
        await this.afs.collection('mesas').doc(mesa.id).update({ clienteActivo: cliente, ocupada: true })
          .then(() => {

            this.presentToast('Mesa asignada', 'success', 'qr-code-outline');
          })
          .catch((err) => {
            this.presentToast('Ocurrió un error al asignar', 'danger', 'qr-code-outline');
            this.vibration.vibrate(1000);
          });
      }
    });
  }


  async desasignarCliente(numeroMesa: number) {
    const coleccion = await this.afs.collection('mesas', (ref) => ref.where('numero', '==', numeroMesa));
    await (await coleccion.get().toPromise()).docs.forEach(async (mesa) => {
      let mesaEncontrada: any = mesa.data()
      if (mesaEncontrada.numero == numeroMesa) {
        this.afs.collection('mesas').doc(mesa.id).update({ clienteActivo: null, ocupada: false }).catch((err) => {
          this.presentToast('Ocurrio un error al desasignar', 'danger', 'qr-code-outline');
          this.vibration.vibrate(1000);

        });
      }
    })
  }

  listaDeEsperaLimpiada(numeroDeMesa: number) {
    const listaEspera = this.afs.collection('lista-de-espera', ref =>
      ref.where('mesaAsignada', '==', numeroDeMesa)
    );

    listaEspera.get().subscribe(snapshot => {
      snapshot.docs.forEach(doc => {
        doc.ref.delete().then(() => {
          this.presentToast('Lista de espera completada', 'success', 'qr-code-outline');
        }).catch((err) => {
          this.presentToast('Ocurrio un error al borrar lista', 'danger', 'qr-code-outline');
          this.vibration.vibrate(1000);
        });
      });
    });
  }

  eliminarListaDeEsperaPorIdCliente(idCliente: any) {
    const listaEspera = this.afs.collection('lista-de-espera', ref =>
      ref.where('uid', '==', idCliente)
    );

    listaEspera.get().subscribe(snapshot => {
      snapshot.docs.forEach(doc => {
        doc.ref.delete().then(() => {
          this.presentToast('Saliste', 'success', 'qr-code-outline');
        }).catch((err) => {
          this.presentToast('Ocurrio un error al salir', 'danger', 'qr-code-outline');
          this.vibration.vibrate(1000);
        });
      });
    });
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

  traerMesasOcupadas() {
    const coleccion = this.afs.collection('mesas', (ref) => ref.where('ocupada', '==', true).orderBy("numero", "asc"));
    return coleccion.valueChanges();
  }

  limpiarMensajes(numeroMesa: string) {
    const mensajesChatMesa = this.afs.collection('mensajes-chat', ref =>
      ref.where('mesaQueSeLeEnviaMensaje', '==', numeroMesa)
    ).get();
  
    const mensajesChatNombre = this.afs.collection('mensajes-chat', ref =>
      ref.where('nombre', '==', numeroMesa)
    ).get();
  
    combineLatest([mensajesChatMesa, mensajesChatNombre])
      .pipe(
        map(([mensajesMesaSnapshot, mensajesNombreSnapshot]) => {
          const mensajesMesaDocs = mensajesMesaSnapshot.docs;
          const mensajesNombreDocs = mensajesNombreSnapshot.docs;
  
          const allDocs = mensajesMesaDocs.concat(mensajesNombreDocs);
  
          return allDocs;
        })
      )
      .subscribe(docs => {
        docs.forEach(doc => {
          doc.ref.delete().then(() => {
            this.presentToast('Mensajes eliminados', 'success', 'chatbox-outline');
          }).catch((err) => {
            this.presentToast('Ocurrió un error al borrar mensajes', 'danger', 'chatbox-outline');
            this.vibration.vibrate(1000);
          });
        });
      });
  }
}

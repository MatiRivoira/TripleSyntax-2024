import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/servicios/auth.service';
import { FirebaseCloudMessagingService } from 'src/app/servicios/fcm.service';
import { FirebaseService } from 'src/app/servicios/firebase.service';

@Component({
  selector: 'app-bartender',
  templateUrl: './bartender.page.html',
  styleUrls: ['./bartender.page.scss'],
})
export class BartenderPage implements OnInit {
  listaPedidosBartender: any[] = [];
  listaPedidosGenerales: any[] = [];
  spinner: any;
  popup: boolean = false;
  constructor(private firebaseServ: FirebaseService,
    private authServ: AuthService,
    private fcmService: FirebaseCloudMessagingService) { }

  async ngOnInit() {
    this.firebaseServ.obtenerColeccion('pedidos').subscribe((pedidos) => {
      this.listaPedidosGenerales = pedidos;
    });
    this.firebaseServ.obtenerColeccion('pedidos-bartender').subscribe((pedidosBartender) => {
      this.listaPedidosBartender = pedidosBartender;
    });

    // Init push notifications listener
    await this.fcmService.initPush();
  }

  activarSpinner() {
    this.spinner = true;
    setTimeout(() => {
      this.spinner = false;
    }, 2000);
  }

  cerrarSesion() {
    this.popup = false;
    this.activarSpinner();
    this.authServ.cerrarSesion();
  }

  terminarPedido(pedidosBartender: any) {
    this.cambiarEstadoItem(pedidosBartender);
    pedidosBartender.terminado = true;
    this.firebaseServ.actualizarPedidoPorId(pedidosBartender, 'pedidos-bartender');
    this.actualizarPedidoMozo(pedidosBartender);
    this.activarSpinner();
    //SOLO LA PARTE DEL PEDIDO DEL COCINERO SE TERMINA

    const pedidoGeneral = this.listaPedidosGenerales.find(pedido => pedido.id === pedidosBartender.id);
    if (this.verificarItems(pedidoGeneral)) {
      this.fcmService.pedidoListoPushNotification();
    }
  }

  verificarItems(pedido: any) {
    let pedidoTerminado = false;
    if (pedido.estado == 'En preparación') {
      pedidoTerminado = true;
      for (let i = 0; i < pedido.items.length; i++) {
        if (!pedido.items[i].terminado) {
          pedidoTerminado = false;
        }
      }
    }
    return pedidoTerminado;
  }

  cambiarEstadoItem(pedido: any) {
    pedido.items.forEach((item: any) => {
      item.terminado = true;
    });
  }

  actualizarPedidoMozo(pedidoBartender: any) {
    this.listaPedidosGenerales.forEach((pedido: any) => {
      if (pedido.id == pedidoBartender.id) {
        pedido.items.forEach((item: any) => {
          if (item.tipo == 'bebida') {
            item.terminado = true;
          }
        });
        this.firebaseServ.actualizarPedidoPorId(pedido, 'pedidos');
      }
    })
  }
}

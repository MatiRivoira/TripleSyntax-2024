import { Component, OnInit } from '@angular/core';
import { QrscannerService } from '../../servicios/qrscanner.service';
import { MesasService } from 'src/app/servicios/mesas.service';
import { AuthService } from 'src/app/servicios/auth.service';
import { PushService } from 'src/app/servicios/push.service';
import { FirestoreService } from 'src/app/servicios/firestore.service';
import { Router } from '@angular/router';
import { NotificacionesService } from 'src/app/servicios/notificaciones.service';



@Component({
  selector: 'app-menu-mesa',
  templateUrl: './opciones-mesa.page.html',
  styleUrls: ['./opciones-mesa.page.scss'],
})
export class OpcionesMesaPage implements OnInit {
  constructor(private firestoreService: FirestoreService,
    public scaner: QrscannerService,
    public mesaSrv: MesasService,
    public auth: AuthService,
    private pushService: PushService,
    private router: Router,
    private notificaciones: NotificacionesService) { }

  // spinner:boolean=false;
  scanActivo = false;
  esconderse: boolean = false;
  numeroMesa: number = 0;
  respondio: boolean = false;;
  tokenMozos: string[] = [];
  llegoComida = false
  scannerCorrecto: boolean = true;
  MostrarMenu = false;
  MostrarCarta = false;
  MostrarDetallePedido = false;
  MostrarPagar = false;
  MostrarJuego = false;
  MostrarJuego15 = false;

  pedido: any = { estado: "no iniciado" };

  verMiPedido = false;
  comienzoDate:any;

  ngOnInit() {
    this.numeroMesa = this.mesaSrv.numeroMesa
    this.mesaSrv.traerMozos().subscribe((mozos: any) => {
      this.tokenMozos = []
      mozos.forEach(element => {
        if (element.token != '') {
          this.tokenMozos.push(element.token);
        }
      });
    })
  }

  verEncuesta() {
    //redireccionar Encuesta
    this.router.navigate(['encuesta-cliente']);
  }

  pago() {
    this.scanActivo = false;
    this.MostrarPagar = false;
    this.scannerCorrecto = true;
    this.mesaSrv.CambiarEstadoPedido(this.pedido, "pagado");
    // this.router.navigate(['home-cliente']);
  }
  // cerrarMesa() {
  //   this.mesaSrv.desasignarCliente(this.pedido.mesa);
  //   this.mesaSrv.listaDeEsperaLimpiada(this.pedido.mesa);
  //   this.router.navigate(['home-cliente']);
  // }


  consultarMozo() {
    this.enviarPushMozos()
    this.router.navigate(['chat-consulta'])
  }

  verMenu() {
    this.notificaciones.hideSpinner();
    this.scannerCorrecto = false;
    this.MostrarMenu = true;
  }

  verCarta() {
    this.notificaciones.hideSpinner();
    this.scannerCorrecto = false;
    this.MostrarCarta = true;
  }

  volverMenuMesa($event: any) {
    this.MostrarMenu = false;
    this.scannerCorrecto = $event;
    this.MostrarJuego = false;
    this.MostrarJuego15 = false;
    this.MostrarCarta = false;
  }

  quitarBotonEncuesta($event: any) {
    this.respondio = $event;
  }

  // atras()
  // {
  //   if(this.auth.UsuarioActivo.value.perfil == "cliente")
  //   {
  //     this.router.navigate(['menu-mesa'])
  //     this.scannerCorrecto = false;
  //   }
  // }

  recibirPedido($event: any) {
    this.MostrarMenu = false
    this.scannerCorrecto = true
    this.pedido = $event;
    this.mesaSrv.traerPedido(this.pedido.uid).subscribe((pedido: any) => {
      this.pedido = pedido;
      if (pedido.estado == "terminado") {
        this.notificaciones.showSpinner();
        this.auth.UsuarioActivo.value.escanioQrLocal = false;
        this.auth.UsuarioActivo.value.hizoEncuesta = false;
        this.auth.UsuarioActivo.value.mostrarMenu = false;
        this.auth.UsuarioActivo.value.estaEnLaLista = false;
        this.firestoreService.actualizarCliente(this.auth.UsuarioActivo.value, "");
        this.mesaSrv.listaDeEsperaLimpiada(pedido.mesa);
        this.mesaSrv.desasignarCliente(pedido.mesa);
        this.mesaSrv.limpiarMensajes("mesa "+pedido.mesa);
        this.notificaciones.presentToast('Mesa desasignada', 'success', 'qr-code-outline');
        setTimeout(() => {
          this.router.navigate(['home-cliente']);
          this.notificaciones.hideSpinner();
        },1500)
      }
      if (pedido.estado == "pagoRechazado") {
        this.notificaciones.presentToast("Su pago fue rechazado vuelva a pagar", "danger");
        this.mesaSrv.CambiarEstadoPedido(this.pedido, "confirmado");
        this.pedido = this.pedido;
      }
      if(pedido.estado == "no iniciado")
      {
        if(pedido.hasOwnProperty("tiempoPreparacion"))
        {
          this.notificaciones.presentToast("Su pedido fue rechazado vuelva a pedir", "danger");
          // this.mesaSrv.CambiarEstadoPedido(this.pedido, "no iniciado");
          this.pedido = pedido;
        }
      }
    })
  }

  consultarPedido() {
    this.MostrarDetallePedido = true;
    //nuevooooooooooooooooooooo
    this.comienzoDate = new Date(this.pedido.comienzo * 1000);
  }

  Jugar() {
    this.scannerCorrecto = false;
    this.MostrarJuego = true;
  }

  Jugar15() {
    this.scannerCorrecto = false;
    this.MostrarJuego15 = true;
  }

  Pagar() {
    this.MostrarMenu = false
    this.MostrarDetallePedido = false;
    this.scanActivo = true
    this.MostrarPagar = true;
    this.scannerCorrecto = false;
    //pagar
  }

  LlegoComida() {
    this.llegoComida = true
    this.mesaSrv.CambiarEstadoPedido(this.pedido, "confirmado");
  }

  cerrarDetallePedido() {
    this.MostrarDetallePedido = false;
  }

  terminarJuego($event) {
    this.mesaSrv.actualizarPedido($event);
    this.MostrarJuego = false;
    this.scannerCorrecto = true;
    this.esconderse = true;
  }

  terminarJuego15($event) {
    this.mesaSrv.actualizarPedido($event);
    this.MostrarJuego15 = false;
    this.scannerCorrecto = true;
    this.esconderse = true;
  }

  enviarPushMozos() {
    console.log(this.tokenMozos);
    this.pushService
      .sendPushNotification({
        registration_ids: this.tokenMozos,
        notification: {
          title: 'Ayuda requerida',
          body: '¡El cliente en la mesa ' + this.numeroMesa + ' necesita ayuda!',
        },
      })
      .subscribe((data) => {
        this.notificaciones.presentToast('Sera atendido en un segundo!', 'success', 'thumbs-up-outline');
        console.log(data);
      });
  }


  verMiPedidoYaRealizado() {
    this.verMiPedido = true;
  }

  volverDelPedido() {
    this.verMiPedido = false;
  }

}

import { AuthService } from '../../servicios/auth.service';
import { Component, OnInit } from '@angular/core';
import { PushService } from 'src/app/servicios/push.service';
import { MesasService } from 'src/app/servicios/mesas.service';
import { FirestoreService } from 'src/app/servicios/firestore.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-mozo',
  templateUrl: './inicio-mozo.page.html',
  styleUrls: ['./inicio-mozo.page.scss'],
})
export class InicioMozoPage implements OnInit {
  constructor(
    public mesasSrv: MesasService,
    private pushService: PushService,
    public auth: AuthService,
    public fire: FirestoreService,
    private router: Router
  ) { }

  option:number = 1;
  listadoPedidosNoAprobados: any[] = [];
  listadoPedidosPreparados: any[] = [];
  listadoPedidosPagados: any[] = [];
  listadoDePedidos: any[] = [];
  tokenCocinerosBartenders: string[] = [];
  title:string = "Pedidos solicitados";
  MostrarNoAprobados: boolean = true;
  MostrarPreparados: boolean = false;
  MostrarPagados: boolean = false;

  ngOnInit() {

    this.pushService.getUser();
    this.mesasSrv.TraerPedidos('no aceptado').subscribe((pedidos) => {
      this.listadoPedidosNoAprobados = pedidos;
    });
    this.mesasSrv.TraerPedidos('pagado').subscribe((pedidos) => {
      this.listadoPedidosPagados = pedidos;
    });

    this.mesasSrv.TraerPedidos("aceptado").subscribe((pedidos) => {
      let auxArray = [];
      this.listadoDePedidos = pedidos;
      this.listadoDePedidos.forEach((unPedido) => {
        if ((unPedido.hasOwnProperty("estaListoBartender") && unPedido.hasOwnProperty("estaListoCocinero")) && (unPedido.estaListoBartender && unPedido.estaListoCocinero)) {
          auxArray.push(unPedido);
        } else if (unPedido.hasOwnProperty("estaListoBartender") && unPedido.estaListoBartender && !unPedido.hasOwnProperty("estaListoCocinero")) {
          auxArray.push(unPedido);

        } else if (unPedido.hasOwnProperty("estaListoCocinero") && unPedido.estaListoCocinero && !unPedido.hasOwnProperty("estaListoBartender")) {
          auxArray.push(unPedido);
        }
      })
      this.listadoPedidosPreparados = auxArray;
    });

    this.mesasSrv.traerCocineros().subscribe((mozos: any) => {
      this.tokenCocinerosBartenders = [];
      mozos.forEach((element) => {
        if (element.token != '') {
          this.tokenCocinerosBartenders.push(element.token);
        }
      });
    });
  }

  chatear() {
    this.router.navigate(['chat-consulta']);
  }

  MostrarVistaPreparados() {
    this.MostrarPreparados = true;
    this.MostrarNoAprobados = false;
    this.MostrarPagados = false;
  }

  MostrarVistaNoAprobados() {
    this.MostrarPreparados = false;
    this.MostrarNoAprobados = true;
    this.MostrarPagados = false;
  }
  MostrarVistaPagados() {
    this.MostrarPreparados = false;
    this.MostrarNoAprobados = false;
    this.MostrarPagados = true;
  }

  AprobarPedido(pedido: any) {
    this.mesasSrv.CambiarEstadoPedido(pedido, 'aceptado').then(() => {
      this.enviarPushCocineros();
    });
  }
  AprobarPagosPedido(pedido: any) {
    this.mesasSrv.CambiarEstadoPedido(pedido, 'terminado').then(() => {
    
    });
  }

  enviarPushCocineros() {
    try {
      console.log(this.tokenCocinerosBartenders);
      this.pushService
        .sendPushNotification({
          registration_ids: this.tokenCocinerosBartenders,
          notification: {
            title: 'Nuevo Pedido',
            body: '¡Se aprobo un nuevo pedido!',
          },
        })
        .subscribe((data) => {
          console.log(data);
        });

    } catch (error) {
      console.error(error);
    }
  }

  EntregarPedido(pedido: any) {
    this.mesasSrv.CambiarEstadoPedido(pedido, 'entregado');
    this.mesasSrv.CambiarEstadoPedidoCocinero(pedido, false);
    this.mesasSrv.CambiarEstadoPedidoBartender(pedido, false);
  }

  // RechazarPedido(pedido: any) {
  //   this.mesasSrv.DesaprobarPedido(pedido);
  // }

  RechazarPedido(pedido: any) {
    this.mesasSrv.CambiarEstadoPedido(pedido, "no iniciado");
  }
  
  RechazarPagoPedido(pedido: any) {
    this.mesasSrv.CambiarEstadoPedido(pedido, "pagoRechazado");
  }

  cerrarSesion() {
    this.auth.LogOut();
  }
}

import { AuthService } from '../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { PushService } from 'src/app/services/push.service';
import { MesasService } from 'src/app/services/mesas.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home-mozo',
  templateUrl: './home-mozo.page.html',
  styleUrls: ['./home-mozo.page.scss'],
})
export class HomeMozoPage implements OnInit {
  constructor(
    public mesasSrv: MesasService,
    private pushService: PushService,
    public auth: AuthService,
    public fire: FirestoreService,
    private router:Router
  ) {}

  listadoPedidosNoAprobados: any[] = [];
  listadoPedidosAceptados: any[] = [];

  listadoPedidosPagados: any[] = [];

  listadoPedidosPreparados: any[] = [];
  tokenCocinerosBartenders: string[] = [];

  option:number = 1;

  ngOnInit() {

    this.pushService.getUser();
    this.mesasSrv.TraerPedidos('no aceptado').subscribe((pedidos) => {
      this.listadoPedidosNoAprobados = pedidos;
    });

    this.mesasSrv.TraerPedidos('aceptado').subscribe((pedidos) => {
      this.listadoPedidosAceptados = pedidos;
    });

    this.mesasSrv.TraerPedidos('cocinado').subscribe((pedidos) => {
      this.listadoPedidosPreparados = pedidos;
    });

    this.mesasSrv.TraerPedidos('pagado').subscribe((pedidos) => {
      this.listadoPedidosPagados = pedidos;
    });


    this.mesasSrv.traerCocineros().subscribe((mozos: any) => {
      this.tokenCocinerosBartenders = [];
      mozos.forEach((element) => {
        if (element.token != '') {
          this.tokenCocinerosBartenders.push(element.token);
        }
      });
      console.log(this.tokenCocinerosBartenders);
    });
  }

  chatear()
  {
    this.router.navigate(['chat-consulta'])
  }

  AprobarPedido(pedido: any) {
    this.mesasSrv.CambiarEstadoPedido(pedido, 'aceptado').then(() => {
      this.enviarPushCocineros();
    });
  }

  enviarPushCocineros() {
    console.log(this.tokenCocinerosBartenders);
    this.pushService
      .sendPushNotification({
        registration_ids: this.tokenCocinerosBartenders,
        notification: {
          title: 'Nuevo Pedido',
          body: '¡Hay un nuevo pedido por ser preparado!',
        },
      })
      .subscribe((data) => {
        console.log(data);
      });
  }

  EntregarPedido(pedido: any) {
    this.mesasSrv.CambiarEstadoPedido(pedido, 'entregado');
  }

  RechazarPedido(pedido: any) {
    this.mesasSrv.DesaprobarPedido(pedido);
  }

  cerrarSesion(){
    this.auth.LogOut();
  }
}

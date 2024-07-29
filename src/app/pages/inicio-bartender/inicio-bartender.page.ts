import { Component, OnInit } from '@angular/core';
import { PushService } from 'src/app/servicios/push.service';
import { MesasService } from 'src/app/servicios/mesas.service';
import { AuthService } from 'src/app/servicios/auth.service';
import { FirestoreService } from 'src/app/servicios/firestore.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio-bartender',
  templateUrl: './inicio-bartender.page.html',
  styleUrls: ['./inicio-bartender.page.scss'],
})
export class InicioBartenderPage implements OnInit {

  constructor(public mesasSrv: MesasService,
    private pushService: PushService,
    public auth: AuthService,
    public fire: FirestoreService,
    private router: Router) { }

  listadoPedidosAprobados: any[] = [];
  tokenMozos: string[] = [];


  ngOnInit() {

    this.pushService.getUser();
    this.mesasSrv.TraerPedidosNoPreparadoBartender().subscribe((pedidos: any) => {
      this.listadoPedidosAprobados = pedidos;
      console.log(this.listadoPedidosAprobados);
    })

    this.mesasSrv.traerMozos().subscribe((mozos: any) => {
      this.tokenMozos = []
      mozos.forEach(element => {
        if (element.token != '') {
          this.tokenMozos.push(element.token);
        }
      });
    })
  }

  EntregarPedido(pedido: any) {
    this.mesasSrv.CambiarEstadoPedidoBartender(pedido, true).then(() => {
      this.enviarPushMozos(pedido);
    })
  }

  altaProducto() {
    console.log("entro")
    this.router.navigate(['alta-productos'])
  }

  enviarPushMozos(pedido: any) {
    console.log(this.tokenMozos)
    this.pushService
      .sendPushNotification({
        registration_ids: this.tokenMozos,
        notification: {
          title: 'Productos de Bartender listos!',
          body: '¡Las bebidas de la mesa ' + pedido.mesa + ' estan listas!',
        },
      })
      .subscribe((data) => {
        console.log(data);
      });
  }
}

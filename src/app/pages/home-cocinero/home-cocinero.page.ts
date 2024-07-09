import { Component, OnInit } from '@angular/core';
import { PushService } from 'src/app/services/push.service';
import { MesasService } from 'src/app/services/mesas.service';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home-cocinero',
  templateUrl: './home-cocinero.page.html',
  styleUrls: ['./home-cocinero.page.scss'],
})
export class HomeCocineroPage implements OnInit {

  constructor( public mesasSrv : MesasService,
     private pushService: PushService,
      public auth:AuthService,
       public fire:FirestoreService,
       private router:Router) { }

  listadoPedidosAprobados: any[] = [];
  tokenMozos: string[] = [];


  ngOnInit() {

    this.pushService.getUser(); 
    this.mesasSrv.TraerPedidos("aceptado").subscribe((pedidos:any)=>
    {
      this.listadoPedidosAprobados = pedidos;
    })

    this.mesasSrv.traerMozos().subscribe((mozos:any)=>
    {
      this.tokenMozos = []
      mozos.forEach(element => {
        if (element.token != '') {
          this.tokenMozos.push(element.token);
        }
      });
    })
  }

  EntregarPedido(pedido:any)
  {
    this.mesasSrv.CambiarEstadoPedido(pedido, "cocinado").then(()=>
    {
      this.enviarPushMozos(pedido)
    })
  }

  altaProducto()
  {
    console.log("entro")
    this.router.navigate(['alta-productos'])
  }

  enviarPushMozos(pedido:any) {
    console.log(this.tokenMozos)
    this.pushService
      .sendPushNotification({
        registration_ids: this.tokenMozos,
        notification: {
          title: 'Pedido Listo!',
          body: '¡El pedido de la mesa '+pedido.mesa+' esta listo!',
        },
      })
      .subscribe((data) => {
        console.log(data);
      });
  }

  cerrarSesion(){
    this.auth.LogOut();
  }


}

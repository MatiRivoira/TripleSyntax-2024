import { Component, OnInit } from '@angular/core';
import { PushService } from 'src/app/servicios/push.service';
import { MesasService } from 'src/app/servicios/mesas.service';
import { AuthService } from 'src/app/servicios/auth.service';
import { FirestoreService } from 'src/app/servicios/firestore.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home-cocinero',
  templateUrl: './inicio-cocinero.page.html',
  styleUrls: ['./inicio-cocinero.page.scss'],
})
export class InicioCocineroPage implements OnInit {

  constructor( public mesasSrv : MesasService,
     private pushService: PushService,
      public auth:AuthService,
       public fire:FirestoreService,
       private router:Router) { }

  listadoPedidosAprobados: any[] = [];
  tokenMozos: string[] = [];


  ngOnInit() {

    this.pushService.getUser(); 
    this.mesasSrv.TraerPedidosNoPreparadoCocinero().subscribe((pedidos:any)=>
    {
      this.listadoPedidosAprobados = pedidos;
      console.log(this.listadoPedidosAprobados);
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
    this.mesasSrv.CambiarEstadoPedidoCocinero(pedido, true).then(()=>
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
          title: 'Productos de cocina listos!',
          body: '¡La comida que pidio la mesa '+pedido.mesa+' esta lista!',
        },
      })
      .subscribe((data) => {
        console.log(data);
      });
  }

}

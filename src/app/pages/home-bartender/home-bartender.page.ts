import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { MesasService } from 'src/app/services/mesas.service';
import { PushService } from 'src/app/services/push.service';

@Component({
  selector: 'app-home-bartender',
  templateUrl: './home-bartender.page.html',
  styleUrls: ['./home-bartender.page.scss'],
})
export class HomeBartenderPage implements OnInit {
  constructor(public mesasSrv: MesasService,
    private pushService: PushService,
    public auth: AuthService,
    public fire: FirestoreService,
    private router: Router) { }

  listadoPedidosAprobados: any[] = [];
  tokenMozos: string[] = [];


  ngOnInit() {

    this.pushService.getUser(); 
    this.mesasSrv.TraerPedidos("aceptado", "cocinado-c").subscribe((pedidos:any)=>
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
    if (pedido.estado == "cocinado-c") {
      this.mesasSrv.CambiarEstadoPedido(pedido, "cocinado").then(()=>
      {
        this.enviarPushMozos(pedido);
      })
    } else {
      this.mesasSrv.CambiarEstadoPedido(pedido, "cocinado-b").then(()=>
        {
          this.enviarPushMozos(pedido);
        })
    }
  }

  altaProducto() {
    console.log("entro");
    this.router.navigate(['alta-productos']);
  }

  enviarPushMozos(pedido: any) {
    console.log(this.tokenMozos);
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

  isLoading: boolean = false;
  cerrarSesion(){
    this.isLoading = true;
    this.auth.LogOut();
  }

}

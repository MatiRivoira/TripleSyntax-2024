import { Component, OnDestroy, OnInit } from '@angular/core';
import { QrscannerService } from '../../services/qrscanner.service';
import { ToastController } from '@ionic/angular';
import { MesasService } from 'src/app/services/mesas.service';
import { AuthService } from 'src/app/services/auth.service';
import { PushService } from 'src/app/services/push.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-menu-mesa',
  templateUrl: './menu-mesa.page.html',
  styleUrls: ['./menu-mesa.page.scss'],
})
export class MenuMesaPage implements OnInit, OnDestroy {

  constructor(private firestoreService: FirestoreService,
    private toastController: ToastController,
     public scaner: QrscannerService,
      public mesaSrv: MesasService,
       public auth: AuthService,
       private pushService: PushService,
       private router: Router) { }

  spinner:boolean=false;
  scanActivo=false;
  numeroMesa:number = 0;
  tokenMozos: string[] = [];
  llegoComida = false
  scannerCorrecto:boolean = true;
  MostrarMenu=false;
  MostrarDetallePedido=false;
  MostrarPagar = false;
  MostrarJuego = false;
  MostrarJuego15 = false;

  pedido : any = {estado:"no iniciado"};

  private subscriptions: Subscription[] = [];

  ngOnInit() {
    this.numeroMesa = this.mesaSrv.numeroMesa
    this.subscriptions.push(
      this.mesaSrv.traerMozos().subscribe((mozos:any)=>
        {
          this.tokenMozos = []
          mozos.forEach(element => {
            if (element.token != '') {
              this.tokenMozos.push(element.token);
            }
          });
        })
    );

    // -----------------------------------------------
    // BORRAR ESTO
    
    // -----------------------------------------------
  }

  ver() {
    console.log("TIEMPO: ", this.pedido.comienzo)
  }

  verEncuesta()
  {
    //redireccionar Encuesta
    this.router.navigate(['encuesta-cliente']);
  }

  pago()
  {
    this.scanActivo = false;
    this.MostrarPagar = false;
    this.scannerCorrecto = true;
    this.mesaSrv.desasignarCliente(this.pedido.mesa);
    this.mesaSrv.CambiarEstadoPedido(this.pedido, "pagado");
  }

  consultarMozo()
  {
    this.enviarPushMozos();
    this.router.navigate(['chat-consulta']);
  }

  verMenu()
  {
    this.scannerCorrecto = false;
    this.MostrarMenu=true;
  }

  recibirPedido($event: any)
  {
    this.MostrarMenu = false;
    this.scannerCorrecto = true;
    this.pedido = $event;
    this.subscriptions.push(
      this.mesaSrv.traerPedido(this.pedido.uid).subscribe((pedido)=>
        {
          this.pedido = pedido;
        })
    )
  }

  consultarPedido()
  {
    this.MostrarDetallePedido = true;
  }



  jugar() {
    this.scannerCorrecto = false;
    this.MostrarJuego = true;
  }

 jugar15() {
    this.scannerCorrecto = false;
    this.MostrarJuego15 = true;
  }

  Pagar()
  {
    this.MostrarMenu = false
    this.MostrarDetallePedido = false;
    this.scanActivo = true
    this.MostrarPagar= true;
    this.scannerCorrecto = false;    
    //pagar
  }

  LlegoComida()
  {
    this.llegoComida = true
    this.mesaSrv.CambiarEstadoPedido(this.pedido, "confirmado");
  }

  cerrarDetallePedido()
  {
    this.MostrarDetallePedido = false
  }

  terminarJuego($event)
  {
    this.mesaSrv.actualizarPedido($event)
    this.MostrarJuego = false;
    this.scannerCorrecto = true
  }

  terminarJuego15($event)
  {
    this.mesaSrv.actualizarPedido($event)
    this.MostrarJuego15 = false;
    this.scannerCorrecto = true
  }

  enviarPushMozos() {
    console.log(this.tokenMozos)
    this.subscriptions.push(
      this.pushService
      .sendPushNotification({
        registration_ids: this.tokenMozos,
        notification: {
          title: 'Ayuda requerida',
          body: '¡El cliente en la mesa '+this.numeroMesa+' necesita ayuda!',
        },
      })
      .subscribe((data) => {
        this.presentToast('Sera atendido en un segundo!', 'success', 'thumbs-up-outline');
        console.log(data);
      })
    )
  }

  async presentToast(mensaje:string, color:string, icono:string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 1500,
      icon: icono,
      color:color
    });

    await toast.present();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}

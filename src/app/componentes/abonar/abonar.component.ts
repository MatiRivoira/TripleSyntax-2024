import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { QrscannerService } from '../../servicios/qrscanner.service';
import { MesasService } from 'src/app/servicios/mesas.service';
import { NotificacionesService } from 'src/app/servicios/notificaciones.service';


@Component({
  selector: 'app-pagar',
  templateUrl: './abonar.component.html',
  styleUrls: ['./abonar.component.scss'],
})
export class AbonarComponent implements OnInit {

  constructor(private notificacionesS: NotificacionesService,public scaner : QrscannerService, public mesasSrv : MesasService) { }
  @Input() pedido:any;
  @Output() pago?: EventEmitter<boolean> = new EventEmitter<boolean>();

  propina : number= 0;
  // MostrarPropina=false
  // MostrarPagar=true
  scanActivo=false;


  ngOnInit() {
    // this.mesasSrv.traerPedido('sk8rgw2JLcyoh6NPh8QN').subscribe((unPedido) => {
    //   this.pedido = unPedido;
    // });
    // console.log(this.pedido);
  }


  // agregarPropina()
  // {
  //   this.MostrarPropina = true;
  //   this.MostrarPagar = false;
  // }

  // recibirPropina($event: any)
  // {
  //   this.pedido = $event;
  //   this.MostrarPropina = false;
  //   this.MostrarPagar = true;
  // }

  async Pagar()
  {
    this.mesasSrv.CambiarEstadoPedido(this.pedido, "pagado").then(()=>
    {
      this.notificacionesS.presentToast(`Pago exitoso!`,'success');
      this.pago.emit(true);
    })
  }
  pararScan()
  {
    this.scanActivo=false;
    document.querySelector('body').classList.remove('scanner-active');
    this.scaner.stopScanner()
  }

  async escanear() {
    document.querySelector('body').classList.add('scanner-active');
    this.scanActivo = true;
    this.scaner.startScan().then((result) => {
      switch (result) {
        case "propinaVeinte":
          this.pedido.propina = this.pedido.total * 0.2;
          this.pedido.porcentajePropina = 20;
          this.scanActivo = false;
          this.notificacionesS.presentToast(`Propina seleccionada de `+this.pedido.porcentajePropina+"%",'success');
          break;
        case "propinaQuince":
          this.pedido.propina = this.pedido.total * 0.15;
          this.pedido.porcentajePropina = 15;
          this.scanActivo = false;
          this.notificacionesS.presentToast(`Propina seleccionada de `+this.pedido.porcentajePropina+"%",'success');
          break;
        case "propinaDiez":
          this.pedido.propina = this.pedido.total * 0.1;
          this.pedido.porcentajePropina = 10;
          this.scanActivo = false;
          this.notificacionesS.presentToast(`Propina seleccionada de `+this.pedido.porcentajePropina+"%",'success');
          break;
        case "propinaCinco":
          this.pedido.propina = this.pedido.total * 0.05;
          this.pedido.porcentajePropina = 5;
          this.scanActivo = false;
          this.notificacionesS.presentToast(`Propina seleccionada de `+this.pedido.porcentajePropina+"%",'success');
          break;
        case "propinaCero":
          this.pedido.propina = this.pedido.total * 0;
          this.pedido.porcentajePropina = 0;
          this.scanActivo = false;
          this.notificacionesS.presentToast(`Propina seleccionada de `+this.pedido.porcentajePropina+"%",'success');
          break;
        default:
          this.notificacionesS.presentToast(`QR incorrecto!`,'danger');
          this.notificacionesS.vibrarError(1000);
          this.scanActivo = false;
          break;
      }  
      this.mesasSrv.CambiarEstadoPropina(this.pedido,this.pedido.propina,this.pedido.porcentajePropina)

    }).catch((err)=>{console.log("Erorr: ", err.message)});
  }
}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { QrscannerService } from '../../services/qrscanner.service';
import { MesasService } from 'src/app/services/mesas.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';


@Component({
  selector: 'app-pagar',
  templateUrl: './pagar.component.html',
  styleUrls: ['./pagar.component.scss'],
})
export class PagarComponent implements OnInit {

  constructor(public scaner : QrscannerService, public mesasSrv : MesasService, private router:Router, private toastController: ToastController) { }

  @Input() pedido:any;
  @Output() pago?: EventEmitter<boolean> = new EventEmitter<boolean>();

  propina : number= 0;
  porcentajePropina : number= 0;

  MostrarPropina=false
  MostrarPagar=true
  scanActivo=false;


  ngOnInit() {
  }

  async Pagar()
  {
    this.mesasSrv.CambiarEstadoPedido(this.pedido, "pagado").then(()=>
    {
      this.presentToast(
        `Pago exitoso!`,
        'success',
        'cash-outline'
       
        
      );
      this.MostrarPagar = false
      this.pago.emit(true);
    })
  }
  
  async escanear() {
    document.querySelector('body').classList.add('scanner-active');
    this.scanActivo = true;
    this.scaner.startScan().then((result) => {
      this.porcentajePropina = parseInt(result);
      this.propina = (this.pedido.total/100)*this.porcentajePropina;
      this.scanActivo = false;
      // if(result == "propina")
      // {
      //   this.scanActivo = false;
      //   this.MostrarPagar = false
      // }
      // else
      // {
      //   this.presentToast(
      //     `QR incorrecto!`,
      //     'danger',
      //     'cash-outline'
      //   );

      //   this.scanActivo = false;
      // }      
    }).catch((err)=>{console.log("Erorr: ", err.message)});
  }

  pararScan()
  {
    this.scanActivo=false;
    document.querySelector('body').classList.remove('scanner-active');
    this.scaner.stopScanner()
  }

  
  async presentToast(mensaje: string, color: string, icono: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 1500,
      icon: icono,
      color: color,
    });

    await toast.present();
  }

}

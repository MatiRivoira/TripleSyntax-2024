import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-qr-propina',
  templateUrl: './qr-propina.component.html',
  styleUrls: ['./qr-propina.component.scss'],
})
export class QrPropinaComponent implements OnInit {
  @Input() pedidoRecibido?: any;
  @Output() PasamosPedidoConPropina: EventEmitter<any> =
    new EventEmitter<any>();

  spinner: boolean = false;

  constructor(private toastController: ToastController) {}

  ngOnInit() {

  }

  agregarPropina(opcion: number) {
    this.spinner = true;
    setTimeout(() => {
      switch (opcion) {
        case 4:
          this.pedidoRecibido.propina = this.pedidoRecibido.total * 0.2;
          this.pedidoRecibido.porcentajePropina = 20;
          break;
        case 3:
          this.pedidoRecibido.propina = this.pedidoRecibido.total * 0.15;
          this.pedidoRecibido.porcentajePropina = 15;
          break;
        case 2:
          this.pedidoRecibido.propina = this.pedidoRecibido.total * 0.1;
          this.pedidoRecibido.porcentajePropina = 10;
          break;
        case 1:
          this.pedidoRecibido.propina = this.pedidoRecibido.total * 0.05;
          this.pedidoRecibido.porcentajePropina = 5;
          break;
        case 0:
          this.pedidoRecibido.propina = this.pedidoRecibido.total * 0;
          this.pedidoRecibido.porcentajePropina = 0;
          break;
      }
      // console.log(this.pedidoRecibido);
      this.PasamosPedidoConPropina.emit(this.pedidoRecibido);
      this.presentToast(
        `Propina cargada: $${this.pedidoRecibido.propina}`,
        'success',
        'cash-outline'
      );
      this.spinner = false;
    }, 1000);
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

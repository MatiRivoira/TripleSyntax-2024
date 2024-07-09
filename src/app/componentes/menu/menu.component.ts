import { Cliente } from './../../clases/cliente';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MesasService } from 'src/app/servicios/mesas.service';
import {ToastController } from '@ionic/angular';
import { PushService } from 'src/app/servicios/push.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  listadoProductos: any[] = [];
  pedido: any[] = [];
  total=0
  MostrarMenu = true
  MostrarPedido = false
  spinner = false
  tiempoMaximo=0;
  tokenMozos: string[] = [];

  @Input() numeroMesa:any;
  @Output() pedidoFinal?: EventEmitter<any> = new EventEmitter<any>();

  constructor(private toastController: ToastController,public mesasSrv : MesasService,private pushService: PushService) { }

  ngOnInit() 
  {
    this.mesasSrv.traerProductos().subscribe((productos) => {
      this.listadoProductos = productos;
    });

    this.spinner = true
    setTimeout(() => {
      this.spinner = false
    }, 2000);

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

  enviarPushMozos() {
    this.pushService
      .sendPushNotification({
        registration_ids: this.tokenMozos,
        notification: {
          title: 'Nuevo Pedido',
          body: '¡El cliente en la mesa '+this.numeroMesa+' hizo un pedido!',
        },
      })
      .subscribe((data) => {
        console.log(data);
      });
  }
  
  async hacerPedido()
  {
    this.spinner = true;

    let pedidoFormato=
    {
      productos:this.pedido,
      estado:"no aceptado",
      total:this.total,
      mesa: this.numeroMesa,
      tiempoPreparacion: this.tiempoMaximo,
      comienzo: new Date(),
      propina:0,
      descuentoJuego:0,
      jugo:false,
      porcentajePropina:0,
      uid:""
    }
    await this.mesasSrv.hacerPedido(pedidoFormato)
    this.spinner = false
    this.pedidoFinal.emit(pedidoFormato)
    this.enviarPushMozos()
    
  }

  agregarAlPedido(Producto:any)
  {
    this.pedido.push(Producto);
    this.actualizarTotal()
  }

  quitarDelPedido(Producto:any)
  {
    let index;
    index = this.pedido.find(prod => prod.uid == Producto.uid)
    if(index)
    {
      this.pedido.splice(index,1)
    }
    this.actualizarTotal()
  }

  actualizarTotal()
  {
    this.total =0
    let banderaPrime = true;
    this.pedido.forEach(prod => {

    if(banderaPrime)
    {
      this.tiempoMaximo = prod.tiempoElaboracion
      banderaPrime = false
    }
    else
    {
      if(prod.tiempoElaboracion > this.tiempoMaximo){this.tiempoMaximo = prod.tiempoElaboracion}
    }
    this.total = this.total + parseFloat( prod.precio)
    });
  }

  verPedido()
  {
    this.MostrarMenu = false
    this.MostrarPedido = true
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


}

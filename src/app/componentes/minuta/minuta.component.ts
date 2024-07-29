import { Cliente } from './../../clases/cliente';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MesasService } from 'src/app/servicios/mesas.service';
import { ToastController } from '@ionic/angular';
import { PushService } from 'src/app/servicios/push.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/servicios/auth.service';
import { NotificacionesService } from 'src/app/servicios/notificaciones.service';

@Component({
  selector: 'app-menu',
  templateUrl: './minuta.component.html',
  styleUrls: ['./minuta.component.scss'],
})
export class MinutasComponent implements OnInit {

  listadoProductos: any[] = [];
  pedido: any[] = [];
  total = 0
  MostrarMenu = true
  MostrarPedido = false
  spinner = false
  tiempoMaximo = 0;
  tokenMozos: string[] = [];
  pidioComida = false;
  pidioBebida = false;

  @Input() numeroMesa: any;
  @Output() pedidoFinal?: EventEmitter<any> = new EventEmitter<any>();
  @Output() volverAtras?: EventEmitter<any> = new EventEmitter<any>();

  constructor(private toastController: ToastController,private notificaciones: NotificacionesService, public mesasSrv: MesasService, private pushService: PushService, public router: Router, public authService: AuthService) { }

  ngOnInit() {
    this.mesasSrv.traerProductos().subscribe((productos) => {
      this.listadoProductos = productos;
    });

    this.spinner = true
    setTimeout(() => {
      this.spinner = false
    }, 2000);

    this.mesasSrv.traerMozos().subscribe((mozos: any) => {
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
          body: '¡El cliente en la mesa ' + this.numeroMesa + ' hizo un pedido!',
        },
      })
      .subscribe((data) => {
        console.log(data);
      });
  }

  // atras()
  // {
  //   if(this.authService.UsuarioActivo.value.perfil == "cliente")
  //   {
  //     this.MostrarMenu=false;
  //     this.router.navigate(['menu-mesa']);
  //   }
  // }

  async hacerPedido() {
    // this.spinner = true;
    this.notificaciones.showSpinner();
    let pedidoFormato =
    {
      productos: this.pedido,
      estado: "no aceptado",
      total: this.total,
      mesa: this.numeroMesa,
      tiempoPreparacion: this.tiempoMaximo,
      comienzo: new Date(),
      propina: 0,
      descuentoJuego: 0,
      jugo: false,
      porcentajePropina: 0,
      uid: ""
    }
    console.log(this.hacerFormatoObjeto(pedidoFormato));
    await this.mesasSrv.hacerPedido(pedidoFormato).then(()=>{
      this.notificaciones.hideSpinner();
    })
    // this.spinner = false
    this.pedidoFinal.emit(pedidoFormato)
    this.enviarPushMozos()
  }

  hacerFormatoObjeto(formatoBase:any) {
    let hayComida = false;
    let hayBebida = false;
    this.pedido.forEach((unProductoDelPedido) => {
      if (unProductoDelPedido.tipo == 'cocinero') {
        hayComida = true;
      }
      if (unProductoDelPedido.tipo == 'bartender') {
        hayBebida = true;
      }
    })


    if (hayBebida && hayComida) {
      formatoBase.estaListoCocinero = false;
      formatoBase.estaListoBartender = false;
      }
    else if(hayComida){
      formatoBase.estaListoCocinero = false;

    }
    else if(hayBebida)
    {
      formatoBase.estaListoBartender = false;
    }

    return formatoBase;
  }

  volverAlMenu() {
    let scannerTrue = true;
    this.volverAtras.emit(scannerTrue)
  }

  agregarAlPedido(Producto: any) {
    // Verificar si el producto ya está en el pedido
    const index = this.pedido.findIndex((prod) => prod.nombre === Producto.nombre && prod.descripcion === Producto.descripcion);

    if (index !== -1) {
      // Si el producto ya existe en el pedido, incrementar la cantidad
      this.pedido[index].cantidad++;
    } else {
      // Si el producto no existe en el pedido, agregarlo con cantidad 1
      Producto.cantidad = 1;
      this.pedido.push(Producto);
    }

    this.actualizarTotal();
  }

  quitarDelPedido(Producto: any) {
    const index = this.pedido.findIndex((prod) => prod.nombre === Producto.nombre && prod.descripcion === Producto.descripcion);

    if (index !== -1) {
      // Si el producto existe en el pedido, disminuir la cantidad
      this.pedido[index].cantidad--;

      if (this.pedido[index].cantidad === 0) {
        // Si la cantidad llega a 0, eliminar el producto del pedido COMO ME COSTO ESTE VERGAAAAAAAAAA
        this.pedido.splice(index, 1);
      }
    }

    this.actualizarTotal();
  }

  // actualizarTotal() {
  //   this.total = 0
  //   let banderaPrime = true;
  //   console.log(this.pedido);
  //   this.pedido.forEach(prod => {

  //     if (banderaPrime) {
  //       this.tiempoMaximo = prod.tiempoElaboracion
  //       banderaPrime = false
  //     }
  //     else {
  //       if (prod.tiempoElaboracion > this.tiempoMaximo) { this.tiempoMaximo = prod.tiempoElaboracion }
  //     }
  //     this.total = this.total + (prod.precio * prod.cantidad)
  //   });
  // }

  actualizarTotal() {
    this.total = 0;
    let tiempoMaximo = 0; // Inicializar tiempoMaximo en 0
    console.log(this.pedido);
  
    this.pedido.forEach(prod => {
      const numero1 = parseInt(prod.tiempoElaboracion);
      if (numero1 > tiempoMaximo) {
        tiempoMaximo = numero1;
      }
      this.total = this.total + (prod.precio * prod.cantidad);
    });
  
    this.tiempoMaximo = tiempoMaximo; // Asignar el tiempoMaximo al this.tiempoMaximo
  }
  
  verPedido() {
    this.MostrarMenu = false
    this.MostrarPedido = true
  }

  volverSeleccionPedido() {
    this.MostrarMenu = true
    this.MostrarPedido = false
  }


  async presentToast(mensaje: string, color: string, icono: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 1500,
      icon: icono,
      color: color
    });

    await toast.present();
  }

}
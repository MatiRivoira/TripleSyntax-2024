import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Vibration } from '@awesome-cordova-plugins/vibration/ngx';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { AuthService } from 'src/app/servicios/auth.service';
import { FirebaseCloudMessagingService } from 'src/app/servicios/fcm.service';
import { FirebaseService } from 'src/app/servicios/firebase.service';

@Component({
  selector: 'app-mesa',
  templateUrl: './mesa.page.html',
  styleUrls: ['./mesa.page.scss'],
})
export class MesaPage implements OnInit {

  spinner: boolean = false;
  popup: boolean = false;
  mensajePopup: string = "";
  logout: boolean = false;
  listaProductos: any[] = [];
  listaComidas: any[] = [];
  listaBebidas: any[] = [];
  listaPostres: any[] = [];
  precioTotal: number = 0;
  carrito: boolean = false;
  menu: boolean = false;
  pedidos: any[] = [];
  pedido: any[] = [];
  pedidoActual: any = {};
  hayPedido: boolean = false;
  chequearPedido: boolean = false;
  maxDuracion = 0;
  pedirCuenta: boolean = false;
  cuentaPagada: boolean = false;
  propina = 0;
  porcentajePropina = 0;
  mensajePropina: string = "";
  escaneoPropina: boolean = false;
  usuarioLogueado: any = null;
  usuarioAnonimo: any = null;
  mesa: any;
  mesas: any;
  titulo: string = "";
  scannerActive: boolean = false;

  mostrarBtn : boolean = false;

  // imagenesComida: any = [
  //   [
  //     "/assets/mesa/milanesa.jpg",
  //     "/assets/mesa/milanesa_2.jpg",
  //     "/assets/mesa/milanesa_3.jpg"
  //   ],
  //   [
  //     "/assets/mesa/pancho.png",
  //     "/assets/mesa/pancho2.png",
  //     "/assets/mesa/pancho3.png"
  //   ],
  //   [
  //     "/assets/mesa/bg.jpeg",
  //     "/assets/mesa/bg_2.jpg",
  //     "/assets/mesa/bg_3.png"
  //   ]
  // ];

  // imagenesBebida: any = [
  //   [
  //     "/assets/mesa/agua1.jpeg",
  //     "/assets/mesa/agua2.png",
  //     "/assets/mesa/agua3.jpeg"
  //   ],

  // ];

  // imagenesPostre: any = [
  //   [
  //     "/assets/mesa/flan1.png",
  //     "/assets/mesa/flan2.png",
  //     "/assets/mesa/flan3.png"
  //   ],
  // ];
  imagenesComida: any = [
    [
      "/assets/mesa/sushi1.jpeg",
      "/assets/mesa/sushi2.jpg",
      "/assets/mesa/sushi3.jpg"
    ],
    [
      "/assets/mesa/onigiri1.jpeg",
      "/assets/mesa/onigiri2.jpg",
      "/assets/mesa/onigiri3.jpg"
    ],
    [
      "/assets/mesa/ramen1.jpg",
      "/assets/mesa/ramen2.jpg",
      "/assets/mesa/ramen3.jpg"
    ]
  ];

  imagenesBebida: any = [
    [
      "/assets/mesa/leche-banana1.jpg",
      "/assets/mesa/leche-banana2.jpeg",
      "/assets/mesa/leche-banana3.jpg"
    ],
    [
      "/assets/mesa/sake1.jpg",
      "/assets/mesa/sake2.jpg",
      "/assets/mesa/sake3.jpg"
    ],
    [
      "/assets/mesa/matcha1.jpg",
      "/assets/mesa/matcha2.jpg",
      "/assets/mesa/matcha3.jpg"
    ]
  ];

  imagenesPostre: any = [
    [
      "/assets/mesa/dorayaki1.jpg",
      "/assets/mesa/dorayaki2.jpg",
      "/assets/mesa/dorayaki3.jpg"
    ],
    [
      "/assets/mesa/mochi1.jpeg",
      "/assets/mesa/mochi2.jpg",
      "/assets/mesa/mochi3.jpg"
    ],
    [
      "/assets/mesa/taiyaki1.jpg",
      "/assets/mesa/taiyaki2.jpg",
      "/assets/mesa/taiyaki3.jpg"
    ]
  ];

  constructor(private auth: AuthService, private firestore: FirebaseService, private vibration: Vibration, private router: Router, private fcmService: FirebaseCloudMessagingService) {
    this.firestore.obtenerColeccion('usuarios-aceptados').subscribe((res) => {
      res.forEach((usuario) => {

        if (usuario.email != undefined && usuario.email == this.auth.obtenerEmailUsuarioLogueado()) {
          this.usuarioLogueado = usuario;

          this.firestore.obtenerColeccion("mesas").subscribe((data) => {
            data.forEach((mesa) => {
              if (mesa.cliente != undefined && mesa.cliente.id == usuario.id) {
                this.mesa = mesa;
                this.titulo = `MESA ${this.mesa.id} - ${this.usuarioLogueado.nombre}`;
              }
            })
          });
        }

      });
    });

    this.usuarioAnonimo = this.firestore.obtenerClienteAnonimo();
    if (this.usuarioAnonimo != null) {
      this.usuarioLogueado = null;
      this.firestore.obtenerColeccion("mesas").subscribe((data) => {
        data.forEach((mesa) => {
          if (mesa.cliente != undefined && mesa.cliente.id == this.usuarioAnonimo.id) {
            this.mesa = mesa;
            this.titulo = `MESA ${this.mesa.id} - ${this.usuarioAnonimo.nombre}`;
          }
        });
      });
    }

  }

  pedirCuenta2(){
    this.fcmService.sendPedirCuentaNotification();
  }

  ngOnInit() {
    this.mensajePopup = "Bienvenido a su mesa. Ya puede hacer sus pedidos.";
    this.popup = true;

    this.firestore.obtenerColeccion("productos").subscribe((data) => {
      this.listaProductos = data;
      this.separarProductos(this.listaProductos);
    });

    this.actualizarPedidos();

    this.mostrarBtn = !this.firestore.getVisitaEstado();
  }

  ngOnDestroy() {
    this.cerrarSesion();
  }

  cerrarSesion() {
    this.logout = false;
    this.usuarioLogueado = null;
    this.usuarioAnonimo = null;
    this.activarSpinner();
    this.auth.cerrarSesion();
  }

  
  irAEncuesta(){
    this.mostrarBtn = true;
    this.router.navigate(["/encuesta-cliente"])
  }

  activarSpinner() {
    this.spinner = true;
    setTimeout(() => {
      this.spinner = false;
    }, 2000);
  }

  restarCantidad(producto: any) {
    if (producto.cantidad > 0) {
      producto.cantidad--;
    }

    this.precioTotal -= producto.precio;
  }

  sumarCantidad(producto: any) {
    producto.cantidad++;

    this.precioTotal += producto.precio;
  }

  separarProductos(productos: any) {
    for (let i = 0; i < productos.length; i++) {

      switch (productos[i].tipo) {
        case "comida":
          this.listaComidas.push(productos[i]);
          break;
        case "bebida":
          this.listaBebidas.push(productos[i]);
          break;
        case "postre":
          this.listaPostres.push(productos[i]);
          break;
      }
    }
  }

  generarDetallePedido() {
    this.activarSpinner();
    this.carrito = true;
    this.menu = false;
    this.pedido = [];

    this.listaComidas.forEach((comida) => {
      if (comida.cantidad > 0) {
        let itemPedido = {
          nombre: comida.nombre,
          cantidad: comida.cantidad,
          precio: comida.precio * comida.cantidad,
          tipo: comida.tipo,
          terminado: false
        };

        this.pedido.push(itemPedido);
        if (this.maxDuracion < comida.duracion) {
          this.maxDuracion = comida.duracion;
        }
      }
    });

    this.listaBebidas.forEach((bebida) => {
      if (bebida.cantidad > 0) {
        let itemPedido = {
          nombre: bebida.nombre,
          cantidad: bebida.cantidad,
          precio: bebida.precio * bebida.cantidad,
          tipo: bebida.tipo,
          terminado: false
        };

        this.pedido.push(itemPedido);
        if (this.maxDuracion < bebida.duracion) {
          this.maxDuracion = bebida.duracion;
        }
      }
    });

    this.listaPostres.forEach((postre) => {
      if (postre.cantidad > 0) {
        let itemPedido = {
          nombre: postre.nombre,
          cantidad: postre.cantidad,
          precio: postre.precio * postre.cantidad,
          tipo: postre.tipo,
          terminado: false
        };

        this.pedido.push(itemPedido);
        if (this.maxDuracion < postre.duracion) {
          this.maxDuracion = postre.duracion;
        }
      }
    });

  }

  confirmarPedido(detallePedido: any) {
    this.activarSpinner();
    this.carrito = false;
    this.menu = false;

    const fecha = new Date().getTime();
    let nombre = "";

    if (this.usuarioAnonimo) {
      nombre = this.usuarioAnonimo.nombre;
    }
    else {
      nombre = this.usuarioLogueado.nombre + " " + this.usuarioLogueado.apellido;
    }

    const pedido = {
      precio: this.precioTotal,
      items: detallePedido,
      estado: "Solicitado",
      id: this.mesa.id + "." + fecha,
      mesa: this.mesa.id,
      nombre: nombre,
      pagado: false,
      demora: this.maxDuracion
    };

    this.firestore.agregarDocumentoGenerico(pedido, "pedidos");
    this.hayPedido = true;
    this.resetearCantidades();

    // push pedido realizado
    this.fcmService.nuevoPedidoPushNotification();

    this.mensajePopup = "El pedido se realizó con éxito";
    setTimeout(() => {
      this.popup = true;
    }, 2000);
  }

  resetearCantidades() {
    this.precioTotal = 0;

    this.listaComidas.forEach((comida) => {
      if (comida.cantidad > 0) {
        comida.cantidad = 0;
      }
    });

    this.listaBebidas.forEach((bebida) => {
      if (bebida.cantidad > 0) {
        bebida.cantidad = 0;
      }
    });

    this.listaPostres.forEach((postre) => {
      if (postre.cantidad > 0) {
        postre.cantidad = 0;
      }
    });
  }

  async checkPermission() {
    return new Promise(async (resolve, reject) => {
      const status = await BarcodeScanner.checkPermission({ force: true });
      if (status.granted) {
        resolve(true);
      } else if (status.denied) {
        BarcodeScanner.openAppSettings();
        resolve(false);
      }
    });
  }

  async startScanner() {
    this.scannerActive = true;
    const allowed = await this.checkPermission();
    if (allowed) {
      BarcodeScanner.hideBackground();
      const resultado = await BarcodeScanner.startScan();
      if (resultado.hasContent) {
        this.vibration.vibrate(300);
        this.stopScan();

        if (resultado.content.startsWith("mesa"))
        {
          if(!this.pedidoActual.pagado)
          {
            let idMesa = resultado.content.split('-')[1];
            
            if (idMesa == this.mesa.id) {
              this.actualizarPedidos();
              for (let i = 0; i < this.pedidos.length; i++) {
                if (this.pedidos[i].mesa == idMesa) {
                  this.pedidoActual = this.pedidos[i];
                  this.chequearPedido = true;
                }
              }
            } else {
              this.mensajePopup = "Ese QR no es el de la mesa";
              this.popup = true;
            }
            
          }
          else
          {
            this.mensajePopup = "Ya no puede darle seguimiento a un pedido finalizado";
            this.popup = true;
          }
        }
        else if (resultado.content.startsWith("propina"))
        {
          if(this.pedirCuenta && !this.pedidoActual.pagado)
          {
            this.porcentajePropina = parseInt(resultado.content.split('-')[1]);
            this.propina = this.pedidoActual.precio * this.porcentajePropina / 100;
  
            switch (this.porcentajePropina) {
              case 0:
                this.mensajePropina = "Malo";
                break;
              case 5:
                this.mensajePropina = "Regular";
                break;
              case 10:
                this.mensajePropina = "Bueno";
                break;
              case 15:
                this.mensajePropina = "Muy bueno";
                break;
              case 20:
                this.mensajePropina = "Excelente";
                break;
            }
            this.escaneoPropina = true;
          }
          else if(this.pedidoActual.pagado)
          {
            this.mensajePopup = "La propina ya se escaneó";
            this.popup = true;
          }
          else
          {
            this.mensajePopup = "La propina se escanea luego de pedir la cuenta";
            this.popup = true;
          }
        }
        else if (resultado.content == "lista-espera") {
          
          if(this.pedidoActual.pagado)
          {
            this.router.navigateByUrl("/graficos");
          }
          else
          {
            this.mensajePopup = "Solo puede acceder a las estadísticas de encuestas después de pagar";
            this.popup = true;
          }
        }

      } else {
        alert('NO DATA FOUND!');
      }
    } else {
      alert('NOT ALLOWED!');
    }
  }

  stopScan() {
    this.scannerActive = false;
    BarcodeScanner.showBackground();
    BarcodeScanner.stopScan();
  }

  actualizarPedidos() {
    this.firestore.obtenerColeccion("pedidos").subscribe((data) => {
      this.pedidos = data;
    });
  }

  confirmarRecepcionPedido() {
    this.pedidoActual.estado = "Recibido";
    this.firestore.actualizarPedidoPorId(this.pedidoActual, "pedidos");

    this.activarSpinner();
    this.chequearPedido = false;
    this.menu = false;
    this.carrito = false;
  }

  pagarPedido() {
    this.pedidoActual.pagado = true;
    this.firestore.actualizarPedidoPorId(this.pedidoActual, "pedidos");

    this.activarSpinner();
    this.pedirCuenta = false;
    this.cuentaPagada = true;
  }
}

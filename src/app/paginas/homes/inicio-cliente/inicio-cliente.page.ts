import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/servicios/auth.service';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { Vibration } from '@awesome-cordova-plugins/vibration/ngx';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { Subscription, interval } from 'rxjs';
import { Router } from '@angular/router';
import { FirebaseCloudMessagingService } from 'src/app/servicios/fcm.service';

@Component({
  selector: 'app-inicio-cliente',
  templateUrl: './inicio-cliente.page.html',
  styleUrls: ['./inicio-cliente.page.scss'],
})
export class InicioClientePage implements OnInit {
  contadorPersonas: number = 1;
  popup: boolean = false;
  logOut: boolean = false;
  listaEspera: any[] = [];
  listaMesas: any[] = [];
  mensajePopUp: string = "";
  scannerActive: boolean = false;
  resultadoQR: string = "";
  usuarioLogueado: any;
  clienteEsperando: any = {};
  email: string = "";
  spinnerActivo: boolean = false;
  seEnlisto: boolean = false;
  pantalla: number = 1;
  // PANTALLA 2
  mensajeToolBar = "BIENVENIDO";
  clienteSentado = false;

  mesa: any = {};
  //@ts-ignore
  private verificacionSubscripcion: Subscription;
  // PANTALLA 3
  constructor(private authServ: AuthService,
    private vibration: Vibration,
    private firebaseServ: FirebaseService,
    private router: Router,
    private fcmService: FirebaseCloudMessagingService) {
    this.verificarEstadoMesa();
  }

  async ngOnInit() {
    this.firebaseServ.obtenerColeccion('usuarios-aceptados').subscribe((res) => {
      res.forEach((usuario) => {
        if (usuario.email == this.authServ.obtenerEmailUsuarioLogueado()) {
          this.usuarioLogueado = usuario;
        }
      })
    });
    this.firebaseServ.obtenerColeccion('lista-espera').subscribe((usuarios) => {
      this.listaEspera = usuarios;
    });
    this.firebaseServ.obtenerColeccion('mesas').subscribe((mesas) => {
      this.listaMesas = mesas;
    });

    // Init push notifications listener
    await this.fcmService.initPush();
  }

  verificarEstadoMesa() {
    const intervalo = interval(2000);
    this.verificacionSubscripcion = intervalo.subscribe(() => {
      this.firebaseServ.obtenerColeccion('lista-espera').subscribe((usuarios) => {
        usuarios.forEach((usuario) => {
          if (usuario.id == this.clienteEsperando.id) {
            this.clienteEsperando.sentado = usuario.sentado;
          }
        });
      });
    });
  }

  ngOnDestroy() {
    if (this.verificacionSubscripcion) {
      this.verificacionSubscripcion.unsubscribe();
    }
  }

  activarSpinner() {
    this.spinnerActivo = true;
    setTimeout(() => {
      this.spinnerActivo = false;
    }, 2000);
  }
  cerrarSesion() {
    this.logOut = false;
    this.activarSpinner();
    this.authServ.cerrarSesion();
  }

  sumarPersonas() {
    if (this.contadorPersonas < 10) {
      this.contadorPersonas++;
    }
    else {
      this.popup = true;
      this.mensajePopUp = "El máximo permitido es de 10 personas.";
    }
  }

  restarPersonas() {
    if (this.contadorPersonas > 1) {
      this.contadorPersonas--;
    }
    else {
      this.popup = true;
      this.mensajePopUp = "Debe haber mínimo una persona.";
    }
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
        alert(resultado.content);
        if (resultado.content == "lista-espera") {
          if (!this.seEnlisto)
          {
            this.ponerseEnListaEspera();
            this.seEnlisto = true;
            
            // enviar push notification list de espera a metres
            this.fcmService.clienteEnListaDeEsperaPushNotification();
          }
          else
          {
            this.mensajePopUp = "Ya fue aceptado de la lista de espera.";
            this.popup = true;
            this.stopScan();
          }
        }
        else if (resultado.content.includes("mesa")) {
          if (this.seEnlisto) {
            this.obtenerMesa(resultado.content.split('-')[1]);
            this.stopScan();
            this.activarSpinner();
            setTimeout(() => {
              if (true) {
                this.asignarDatosMesa(parseInt(resultado.content.split('-')[1]));
                this.activarSpinner();
                this.router.navigate(['/inicio-cliente/mesa']);
              }
              else {
                this.mensajePopUp = "La mesa está ocupada.";
                this.popup = true;
              }
            }, 2000);
          }
          else {
            this.mensajePopUp = "Para escanear la mesa, debe estar en lista de espera.";
            this.popup = true;
            this.stopScan();
          }
        }
        else if(resultado.content.includes("propina"))
        {
          this.mensajePopUp = "No puede acceder a la propina sin un pago pendiente.";
          this.popup = true;
          this.stopScan();
        }
        else {
          this.mensajePopUp = "Debe utilizar un QR válido de la empresa.";
          this.popup = true;
          this.stopScan();
        }
      } else {
        console.log('NO DATA FOUND!');
      }
    } else {
      console.log('NOT ALLOWED!');
    }
  }

  async obtenerMesa(idMesa: any) {

    for (let i = 0; i < this.listaMesas.length; i++) {
      if (this.listaMesas[i].id == idMesa) {
        this.mesa = this.listaMesas[i];
      }
    }
  }

  asignarDatosMesa(idMesa: number) {
    this.mesa.cliente = this.clienteEsperando;
    this.mesa.ocupada = true;
    this.mesa.id = idMesa;
    this.firebaseServ.actualizarMesaPorId(this.mesa);
  }

  ponerseEnListaEspera() {
    this.clienteEsperando.comenzales = this.contadorPersonas;
    if (this.usuarioLogueado.perfil == "cliente") {
      if (!this.verificarListaEspera()) {
        this.asignarDatos(this.usuarioLogueado);
        this.firebaseServ.agregarDocumentoGenerico(this.clienteEsperando, 'lista-espera');
      }
      else {
        this.mensajePopUp = "Ya está ingresado en la lista de espera.";
        this.popup = true;
      }
    }
    else {
      this.asignarDatos(this.firebaseServ.obtenerClienteAnonimo());
      this.firebaseServ.agregarDocumentoGenerico(this.clienteEsperando, 'lista-espera');
    }
    this.stopScan();
    this.contadorPersonas = 1;
    this.pantalla = 2;
    this.activarSpinner();
  }

  verificarListaEspera() {
    let estaEnLista = false;
    for (let i = 0; i < this.listaEspera.length; i++) {
      if (this.usuarioLogueado.id == this.listaEspera[i].id) {
        estaEnLista = true;
        break;
      }
    }
    return estaEnLista;
  }

  asignarDatos(cliente: any) {
    this.clienteEsperando = {
      id: cliente.id,
      nombre: cliente.nombre,
      apellido: cliente.apellido,
      hora: cliente.hora,
      perfil: cliente.perfil,
      rutaFoto: cliente.rutaFoto,
      comenzales: this.contadorPersonas,
      sentado: false,
    };
  }

  stopScan() {
    this.scannerActive = false;
    BarcodeScanner.showBackground();
    BarcodeScanner.stopScan();
  }
}

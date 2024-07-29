import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/servicios/auth.service';
import { FirestoreService } from 'src/app/servicios/firestore.service';
import { MesasService } from 'src/app/servicios/mesas.service';
import { NotificacionesService } from 'src/app/servicios/notificaciones.service';
import { PushService } from 'src/app/servicios/push.service';
import { QrscannerService } from 'src/app/servicios/qrscanner.service';
import { map, mergeMap, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-home-cliente',
  templateUrl: './inicio-cliente.page.html',
  styleUrls: ['./inicio-cliente.page.scss'],
})
export class InicioClientePage implements OnInit , OnDestroy {
  private onDestroy$ = new Subject<void>();

  scanActivo: boolean = false;
  contenido: any;
  verEncuestas: boolean = false;
  mostrarMenu: boolean = false;
  numeroMesaQR: number = null;
  estaEnLaLista: boolean = false;
  esperando: boolean = false;
  ingreso: boolean = false;
  tokenMetres: string[] = [];
  numeroMesa: number = 0;
  escanerMesaOk: boolean = false;
  escanioQrLocal: boolean = false;
  verReserva: boolean = false;
  yaNotifique:boolean=false;


  constructor(public scaner: QrscannerService,
    private firestoreService: FirestoreService,
    public auth: AuthService,
    private mesasService: MesasService,
    private notificaciones: NotificacionesService,
    public afs: AngularFirestore,
    private pushService: PushService,
    private router: Router) {
    this.scaner.scanPrepare();
  }

  ngOnInit() {
    this.esperando = false;
    this.mesasService.traerListaEspera().pipe(
      takeUntil(this.onDestroy$),
      map(lista => lista.find((unaListaDeEspera: any) => unaListaDeEspera.uid === this.auth.UsuarioActivo.value.uid))
    ).subscribe(() => {
      this.cargarEstados();
    });
  
    this.firestoreService.traerMetres().subscribe((metres: any) => {
      this.tokenMetres = metres.filter((metre) => metre.token !== '').map((metre) => metre.token);
      console.log('TOKENS', this.tokenMetres);
    });
  }
  
  

  cargarEstados() {
    this.auth.UsuarioActivo.pipe(
      mergeMap((usuarioActivo) => {
        const activeUserUid = usuarioActivo?.uid;
        return this.mesasService.traerListaEspera().pipe(
          map((listasDeEspera) => {
            const activeUser: any = listasDeEspera.find((unaListaDeEspera: any) => unaListaDeEspera.uid === activeUserUid);
            return activeUser;
          })
        );
      })
    ).subscribe((activeUser) => {
      console.log(activeUser);
      if (this.numeroMesa > 0 && !this.yaNotifique) {
      
        this.notificaciones.presentToast('Se le asignó la mesa ' + this.numeroMesa + '!', 'success', 'thumbs-up-outline');
        this.yaNotifique=true;
      }
      if(activeUser!=undefined)
      {
        this.actualizarEstadosUsuario(activeUser);
      }
      if (this.ingreso) {
        this.router.navigateByUrl('menu-mesa');
      }

      if(activeUser==undefined)
      {
        console.log("no hay lista de espera");
        this.scanActivo=false;
        this.contenido=undefined;
        this.verEncuestas=false;
        this.mostrarMenu=false;
        this.numeroMesaQR=null;
        this.estaEnLaLista=false;
        this.esperando=false;
        this.ingreso=false;
        this.tokenMetres=[];
        this.numeroMesa=0;
        this.escanerMesaOk=false;
        this.escanioQrLocal=false;
        this.verReserva=false;
      }
    });
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
  actualizarEstadosUsuario(activeUser:any){
    if(activeUser)
    {
      this.numeroMesa = activeUser.mesaAsignada || null;
      this.mostrarMenu = activeUser.mostrarMenu || false;
      this.escanioQrLocal = activeUser.escanioQrLocal || false;
      this.escanerMesaOk = activeUser.escanerMesaOk || false;
      this.estaEnLaLista = activeUser.estaEnLaLista || false;
      this.ingreso = activeUser.ingreso || false;
      this.esperando = activeUser.esperando || false;

    }else{
      this.numeroMesa =  null;
      this.mostrarMenu =  false;
      this.escanioQrLocal =  false;
      this.escanerMesaOk =  false;
      this.estaEnLaLista = false;
      this.ingreso =  false;
      this.esperando =  false;
    }
  }

  entrarListaReserva(){
    this.verReserva = true;
  }

  async escanearDocumento() {
    document.querySelector('body').classList.add('scanner-active');
    this.scanActivo = true;
    this.scaner.startScan().then(async (result) => {
      this.contenido = result;
      if (result == "qrlocal") {

        this.scanActivo = false;
        this.escanioQrLocal = true;
        this.mostrarMenu = true;
        let usuarioActual = await this.auth.UsuarioActivo.value;
        usuarioActual.mostrarMenu = true;
        usuarioActual.enEspera = false;
        usuarioActual.escanioQrLocal = true;

        this.firestoreService.actualizarEstadosCliente(usuarioActual);
      }
      else {
        this.notificaciones.presentToast('El código QR escaneado no pertenece al local!', 'danger', 'qr-code-outline');
        this.scanActivo = false;
        this.notificaciones.vibrarError(1000);
      }
    }).catch((error) => {
      console.log('ERROR ESCANER HOME-CLIENTE: ', error);
      this.notificaciones.vibrarError(1000);
    })
  }


  async entrarListaEspera() {
    this.notificaciones.showSpinner();
    if (!this.estaEnLaLista) {
      let usuarioActual = await this.auth.UsuarioActivo.value;
      usuarioActual = {
        ...usuarioActual,
        enEspera: true
      }
      this.esperando = true;
      await this.firestoreService.agregarAListaDeEspera(usuarioActual).catch(() => {
        this.notificaciones.presentToast('Ocurrió un error al ingresar a la lista de espera.', 'danger', 'alert-circle-outline');
        this.notificaciones.vibrarError(1000);
      }).then(() => {
        this.enviarPushAMetre();
        this.notificaciones.presentToast('Ingreso en la lista de espera!', 'success', 'thumbs-up-outline');
      });
      this.notificaciones.hideSpinner();

    } else {
      this.notificaciones.presentToast('Ya esta en la lista de espera', 'warning', 'alert-circle-outline');
      this.notificaciones.vibrarError(1000);
    }

    this.notificaciones.hideSpinner();
  }

  pararScan() {
    this.scanActivo = false;
    document.querySelector('body').classList.remove('scanner-active');
    this.scaner.stopScanner();
  }

  mostrarEncuestas() {
    this.verEncuestas = true;
  }
  esconderEncuestas() {
    this.verEncuestas = false;
  }
  esconderReserva() {
    this.verReserva = false;
  }

  /////////////////algo nuevo
  async escanearQRmesa() {
    document.querySelector('body').classList.add('scanner-active');
    this.scanActivo = true;
    await this.scaner.startScan().then(async (result) => {
      this.numeroMesaQR = parseInt(result);
      if (this.numeroMesaQR == 1 || this.numeroMesaQR == 2 || this.numeroMesaQR == 3) {
        if (!this.ingreso) {
          if (this.numeroMesa != 0) {
            if (this.numeroMesaQR == this.numeroMesa) {
              this.scanActivo = false;
              this.notificaciones.showSpinner();
              await this.mesasService.asignarCliente(this.numeroMesa, this.auth.UsuarioActivo).then(async () => {
                this.escanerMesaOk = true;
                this.ingreso = true;
                this.mesasService.numeroMesa = this.numeroMesa;
                this.mostrarMenu = false;
                let usuarioActual = await this.auth.UsuarioActivo.value;
                usuarioActual = {
                  ...usuarioActual,
                  escanerMesaOk: true,
                  ingreso: true,
                  mostrarMenu: false,
                  mesaAsignada: this.mesasService.numeroMesa,
                }
                this.firestoreService.actualizarEstadosCliente(usuarioActual);
                this.firestoreService.actualizarEstadosListaEspera(usuarioActual, "yaEscaneoLaMesaAsignada");
                ///nuevooooooooooooooo
               this.firestoreService.actualizarCliente(this.auth.UsuarioActivo.value, this.mesasService.numeroMesa);
                setTimeout(() => {
                  this.notificaciones.hideSpinner();
                  this.router.navigateByUrl('menu-mesa');
                }, 1000);
                this.notificaciones.presentToast('Mesa escaneada', 'success', 'qr-code-outline');
                this.scanActivo = false;
              })
            }
            else {
              this.notificaciones.presentToast('Escanee la mesa correcta', 'danger', 'qr-code-outline');
              this.scanActivo = false;
              this.notificaciones.vibrarError(1000);
            }
          }
          else {
            if (!await this.mesasService.ConsultarMesaActiva(this.numeroMesaQR)) {
              this.notificaciones.presentToast('Mesa disponible', 'success', 'thumbs-up-outline');
              this.scanActivo = false;
            } else {
              this.notificaciones.presentToast('Error mesa no disponible!', 'danger', 'alert-circle-outline');
              this.scanActivo = false;
              this.notificaciones.vibrarError(1000);
            }
            this.scanActivo = false;
          }
        }
        else {
          if (!await this.mesasService.ConsultarMesaActiva(this.numeroMesaQR)) {
            this.notificaciones.presentToast('Mesa disponible', 'success', 'thumbs-up-outline');
            this.scanActivo = false;
          } else {
            this.notificaciones.presentToast('Error mesa no disponible!', 'danger', 'alert-circle-outline');
            this.scanActivo = false;
            this.notificaciones.vibrarError(1000);
          }
        }
      }
      else {
        this.notificaciones.presentToast('Error el QR no pertenece a una mesa.', 'danger', 'qr-code-outline');
        this.notificaciones.vibrarError(1000);
        this.scanActivo = false;
      }
    }).catch((error) => {
      this.notificaciones.presentToast('Error al escanear el QR de la mesa', 'danger', 'qr-code-outline');
      this.notificaciones.hideSpinner();
      this.scanActivo = false;
      this.notificaciones.vibrarError(1000);
    });

  }

  enviarPushAMetre() {

    this.pushService
      .sendPushNotification({
        registration_ids: this.tokenMetres,
        notification: {
          title: 'Lista de espera',
          body: '¡Hay un nuevo cliente esperando una mesa!',
        },
      })
      .subscribe((data) => {
        console.log(data);
      });
  }

  volverAlLocal(){
    this.mesasService.eliminarListaDeEsperaPorIdCliente(this.auth.UsuarioActivo.value.uid);
  }

}


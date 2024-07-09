import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { Camera, CameraResultType } from '@capacitor/camera';
import { LoadingController, ToastController } from '@ionic/angular';
import { ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { QrscannerService } from 'src/app/servicios/qrscanner.service';
import { AuthService } from 'src/app/servicios/auth.service';
import { Router } from '@angular/router';
import { FirestoreService } from 'src/app/servicios/firestore.service';
import { PushService } from 'src/app/servicios/push.service';
@Component({
  selector: 'app-alta-cliente',
  templateUrl: './alta-cliente.page.html',
  styleUrls: ['./alta-cliente.page.scss'],
})
export class AltaClientePage implements OnInit {
  @ViewChild(IonSlides) slides: IonSlides;
  public formularioAlta: FormGroup;
  cliente: any = {};
  scanActivo = false;
  foto: any;
  faltaFoto: boolean = false;
  spinner: boolean = false;
  user: any = null;

  tokenSupervisores: string[] = [];

  src_imagen = '../../../assets/anonimo.png';
  contenido: string[] = [];

  constructor(
    public formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private loadingController: LoadingController,
    public scaner: QrscannerService,
    private toastController: ToastController,
    private firestoreService: FirestoreService,
    private pushService: PushService
  ) {
    this.scaner.scanPrepare();
    this.formularioAlta = this.formBuilder.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      tipo: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      contrasena: ['', Validators.required],
      repetirContrasena: ['', Validators.required],
      dni: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
    });
    this.cliente.tipo = 'registrado';
  }

  ngOnInit() {
    console.log(this.cliente.tipo);
    this.firestoreService.traerSupervisores().subscribe((supervisores: any) => {
      this.tokenSupervisores = [];
      supervisores.forEach((sup) => {
        if (sup.token != '') {
          this.tokenSupervisores.push(sup.token);
        }
      });
      // console.log(this.tokenSupervisores);
    });
  }

  async registrar() {
    console.log(this.cliente);
    
      if (!this.foto) {
        this.presentToast(
          'Error! Debe agregar una foto',
          'danger',
          'alert-circle-outline'
        );
        this.faltaFoto = true;
        setTimeout(() => {
          this.faltaFoto = false;
        }, 1000);
      } else {
        this.presentToast('Registrando!', 'success', 'thumbs-up-outline');
        this.cliente.nombre = this.formularioAlta.get('nombre')!.value;
        this.cliente.perfil = 'cliente';
        this.cliente.tipo = this.formularioAlta.get('tipo')!.value;
        this.cliente.foto = this.foto;

        this.spinner = true;

        if (this.formularioAlta.get('tipo')!.value === 'registrado') {
          this.cliente.aprobado = false;
          this.cliente.apellido = this.formularioAlta.get('apellido')!.value;
          this.cliente.dni = this.formularioAlta.get('dni')!.value;
          this.cliente.email = this.formularioAlta.get('email')!.value;
          if (
            this.formularioAlta.get('contrasena')!.value ===
            this.formularioAlta.get('repetirContrasena')!.value
          ) {
            this.cliente.contrasena =
              this.formularioAlta.get('contrasena')!.value;
            console.log('Si registra');
            this.user = await this.authService.onRegister(this.cliente, true);
          } else {
            console.log('No registra');
            this.presentToast(
              'Error! Las contraseñas deben coincidir.',
              'danger',
              'alert-circle-outline'
            );
          }
          
        } else {
          this.user = await this.authService.onRegisterAnonimo(
            this.cliente,
            true
          );

          this.router.navigate(['home-cliente']);
        }

        //habria que poner un tiempo para que muestre cuando las contraseñas no coinciden
        this.spinner = false;
        if (this.user) {
          if (this.cliente.tipo == 'registrado') {
            this.enviarPushASupervisores(); // enviamos push a los supervisores / dueños
            this.router.navigate(['login']);
          }
          else {
            this.router.navigate(['home-cliente']);
          }
          this.presentToast(
            'Usuario registrado!',
            'success',
            'thumbs-up-outline'
          );

        } else {
          /*this.presentToast(
            'Error! Hubo un error',
            'danger',
            'alert-circle-outline'
          );*/
        }
      }
   
  }

  async sacarFoto() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      promptLabelPhoto: 'Elegir de la galeria',
      promptLabelPicture: 'Sacar foto',
      promptLabelHeader: 'Foto',
      resultType: CameraResultType.DataUrl,
    }).then(
      (result) => {
        this.src_imagen = result.dataUrl;
        this.foto = result.dataUrl;
      },
      (err) => {
        this.presentToast(
          'Error! Ocurrio un error al sacar la foto',
          'danger',
          'alert-circle-outline'
        );
      }
    );
  }

  async escanearDocumento() {
    document.querySelector('body').classList.add('scanner-active');
    this.scanActivo = true;
    this.scaner
      .startScan()
      .then((result) => {
        this.contenido = result.split('@');
        if (this.contenido.length === 1) {
          this.contenido = result.split(',');
        }
        let apellidos;
        let nombres;
        let dni;
        if (result[0] == '@' || result[0] == ',') {
          apellidos = this.formatearCadena(this.contenido[4]);
          nombres = this.formatearCadena(this.contenido[5]);
          dni = this.contenido[1].trim();
        } else {
          apellidos = this.formatearCadena(this.contenido[1]);
          nombres = this.formatearCadena(this.contenido[2]);
          dni = this.contenido[4];
        }

        this.formularioAlta.setValue({
          nombre: nombres,
          apellido: apellidos,
          dni: dni,
          tipo: this.formularioAlta.getRawValue().tipo,
          contrasena: this.formularioAlta.getRawValue().contrasena,
          email: this.formularioAlta.getRawValue().email,
          repetirContrasena: this.formularioAlta.getRawValue().repetirContrasena
        });
        this.presentToast('DNI escaneado', 'success', 'qr-code-outline');
        this.scanActivo = false;
      })
      .catch((error) => {
        this.presentToast(error, 'error', 'qr-code-outline');
      });
  }

  async presentToast(mensaje: string, color: string, icono: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      icon: icono,
      color: color,
    });

    await toast.present();
  }

  formatearCadena(cadena: string) {
    let rtn = '';
    if (cadena.split(' ').length === 1) {
      rtn = cadena.charAt(0) + cadena.slice(1).toLocaleLowerCase();
    } else {
      rtn =
        cadena.split(' ')[0].charAt(0) +
        cadena.split(' ')[0].slice(1).toLocaleLowerCase() +
        ' ' +
        cadena.split(' ')[1].charAt(0) +
        cadena.split(' ')[1].slice(1).toLocaleLowerCase();
    }
    return rtn;
  }

  goToSlide() {
    let indice;
    this.slides.getActiveIndex().then((i) => {
      indice = i;
      if (indice == 0) {
        this.slides.slideTo(1, 500);
      } else {
        this.slides.slideTo(0, 500);
      }
      this.presentToast(
        'Completa todos los campos',
        'primary',
        'information-circle-outline'
      );
    });
  }

  goToSlide2() {
    let indice;
    this.slides.getActiveIndex().then((i) => {
      indice = i;
      if (indice == 0) {
        this.slides.slideTo(1, 500);
      } else {
        this.slides.slideTo(0, 500);
      }
    });
  }

  pararScan() {
    this.scanActivo = false;
    document.querySelector('body').classList.remove('scanner-active');
    this.scaner.stopScanner();
  }

  enviarPushASupervisores() {
    this.pushService
      .sendPushNotification({
        registration_ids: this.tokenSupervisores,
        notification: {
          title: 'Nuevo Cliente',
          body: '¡Hay un Cliente con su aprobación pendiente!',
        },
      })
      .subscribe((data) => {
        console.log(data);
      });
  }
}

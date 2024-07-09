import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Camera, CameraResultType } from '@capacitor/camera';
import { QrscannerService } from '../../servicios/qrscanner.service';
import { ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/servicios/auth.service';
import { Router } from '@angular/router';
// SLIDES
import { ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-alta-supervisor',
  templateUrl: './alta-supervisor.page.html',
  styleUrls: ['./alta-supervisor.page.scss'],
})
export class AltaSupervisorPage implements OnInit {
  @ViewChild(IonSlides) slides: IonSlides;

  public forma!: FormGroup;
  scanActivo = false;
  foto: any;
  faltaFoto: boolean = false;
  spinner: boolean = false;
  supervisor: any = {};

  constructor(
    private fb: FormBuilder,
    public scaner: QrscannerService,
    private toastController: ToastController,
    public authService: AuthService,
    private router: Router
  ) {
    this.scaner.scanPrepare();
    this.forma = this.fb.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      dni: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      cuil: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      email: ['', [Validators.required]],
      contrasena1: ['', Validators.required],
      contrasena2: ['', Validators.required],
      perfil: ['', Validators.required],
    });
  }

  src_imagen = '../../../assets/anonimo.png';
  email: string;
  clave: string;
  contenido: string[] = [];

  ngOnInit() {}

  async registrar() {
    if (this.forma.get('contrasena1').value != this.forma.get('contrasena2').value)
    {
      this.presentToast(
        'Las contraseñas deben ser iguales!',
        'danger',
        'alert-circle-outline'
      );
    } else {
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
        this.spinner = true;
        this.presentToast('Registrando!', 'success', 'thumbs-up-outline');
        this.supervisor.nombre = this.forma.get('nombre')!.value;
        this.supervisor.apellido = this.forma.get('apellido')!.value;
        this.supervisor.dni = this.forma.get('dni')!.value;
        this.supervisor.cuil = this.forma.get('cuil')!.value;
        this.supervisor.perfil = this.forma.get('perfil')!.value;
        this.supervisor.email = this.forma.get('email')!.value;
        this.supervisor.contrasena = this.forma.get('contrasena1')!.value;
        this.supervisor.foto = this.foto;
console.log(this.supervisor);/*  */
        const user = await this.authService.onRegister(this.supervisor, true);
        this.spinner = false;

        if (user) {
          this.presentToast(
            'Usuario registrado!',
            'success',
            'thumbs-up-outline'
          );
          this.router.navigate(['login']);
        } else {
          this.presentToast(
            'Error! Hubo un error',
            'danger',
            'alert-circle-outline'
          );
        }
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

    //this.showLoading()
    //this.fotoService.upload(image.dataUrl)
  }

  async escanearDocumento() {
    document.querySelector('body').classList.add('scanner-active');
    this.scanActivo = true;
    this.scaner.startScan().then((result) => {
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

      this.forma.setValue({
        nombre: nombres,
        apellido: apellidos,
        dni: dni,
        cuil: this.forma.getRawValue().cuil,
        email: this.forma.getRawValue().email,
        contrasena1: this.forma.getRawValue().contrasena1,
        contrasena2: this.forma.getRawValue().contrasena2,
        perfil: this.forma.getRawValue().perfil,
      });
      this.presentToast('DNI escaneado', 'success', 'qr-code-outline');
      this.scanActivo = false;
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

  pararScan() {
    this.scanActivo = false;
    document.querySelector('body').classList.remove('scanner-active');
    this.scaner.stopScanner();
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
}

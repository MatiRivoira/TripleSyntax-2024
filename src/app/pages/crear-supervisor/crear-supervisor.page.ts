import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Camera, CameraResultType } from '@capacitor/camera';
import { QrscannerService } from '../../servicios/qrscanner.service';
import { AuthService } from 'src/app/servicios/auth.service';
import { NotificacionesService } from 'src/app/servicios/notificaciones.service';


@Component({
  selector: 'app-alta-supervisor',
  templateUrl: './crear-supervisor.page.html',
  styleUrls: ['./crear-supervisor.page.scss'],
})
export class CrearSupervisorPage implements OnInit {

  public forma!: FormGroup;
  scanActivo = false;
  foto: any;
  faltaFoto: boolean = false;
  supervisor: any = {};

  constructor(
    private fb: FormBuilder,
    public scaner: QrscannerService,
    private notificacionesS: NotificacionesService,
    public authService: AuthService,
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

  ngOnInit() { }

  async registrar() {
    if (this.forma.get('contrasena1').value != this.forma.get('contrasena2').value) {
      this.notificacionesS.presentToast(
        'Las contraseñas deben ser iguales!',
        'danger',
        'alert-circle-outline'
      );
    } else {
      if (!this.foto) {
        this.notificacionesS.presentToast(
          'Error! Debe agregar una foto',
          'danger',
          'alert-circle-outline'
        );
        this.faltaFoto = true;
        setTimeout(() => {
          this.faltaFoto = false;
        }, 1000);
      } else {
        this.notificacionesS.showSpinner();
        let user:any;
        try {
          this.notificacionesS.presentToast('Registrando!', 'success', 'thumbs-up-outline');
          this.supervisor.nombre = this.forma.get('nombre')!.value;
          this.supervisor.apellido = this.forma.get('apellido')!.value;
          this.supervisor.dni = this.forma.get('dni')!.value;
          this.supervisor.cuil = this.forma.get('cuil')!.value;
          this.supervisor.perfil = this.forma.get('perfil')!.value;
          this.supervisor.email = this.forma.get('email')!.value;
          this.supervisor.contrasena = this.forma.get('contrasena1')!.value;
          this.supervisor.foto = this.foto;
          user = await this.authService.onRegister(this.supervisor, true);

        } catch (error) {

        } finally {
          this.notificacionesS.hideSpinner();
        }

        if (user) {
          this.notificacionesS.presentToast(
            'Usuario registrado!',
            'success',
            'thumbs-up-outline'
          );
          this.forma.reset();
          this.src_imagen = '../../../assets/anonimo.png';
        } else {
          this.notificacionesS.presentToast(
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
        this.notificacionesS.presentToast(
          'Error! Ocurrio un error al sacar la foto',
          'danger',
          'alert-circle-outline'
        );
      }
    );

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
      this.notificacionesS.presentToast('DNI escaneado', 'success', 'qr-code-outline');
      this.scanActivo = false;
    });
  }


  pararScan() {
    this.scanActivo = false;
    document.querySelector('body').classList.remove('scanner-active');
    this.scaner.stopScanner();
  }


}

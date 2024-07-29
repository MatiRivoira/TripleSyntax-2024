import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Camera, CameraResultType } from '@capacitor/camera';
import { QrscannerService } from '../../servicios/qrscanner.service';
import { AuthService } from 'src/app/servicios/auth.service';
import { Router } from '@angular/router';
import { NotificacionesService } from 'src/app/servicios/notificaciones.service';


@Component({
  selector: 'app-register-empleado',
  templateUrl: './crear-empleado.page.html',
  styleUrls: ['./crear-empleado.page.scss'],
})
export class CrearEmpleadoPage implements OnInit {

  public forma!: FormGroup;
  scanActivo=false;
  foto:any="https://firebasestorage.googleapis.com/v0/b/pps-segundoparcial.appspot.com/o/usuario-outline.png?alt=media&token=2f207f55-caa6-42ee-8ace-756714128548";
  subioFoto:boolean = false;
  empleado:any={}
  spinner: boolean = false;


  constructor(private fb: FormBuilder,
     public scaner : QrscannerService,
     private notificacionesS: NotificacionesService,
     public authService:AuthService,
     private router: Router) 
  {
    this.scaner.scanPrepare()
    this.forma = this.fb.group({
      'nombre': ['', [Validators.required]],
      'apellido': ['', [Validators.required]],
      'cuil': ['', [Validators.required,Validators.pattern("^[0-9]*$")]],
      'email': ['', [Validators.required, Validators.email]],
      'dni': ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      'contrasena': ['',[ Validators.required]],
      'repetirContrasena': ['', [Validators.required]],
      'tipo': ['',[ Validators.required]]
    });
  }

  

  src_imagen="../../../assets/anonimo.png"
  email:string;
  clave:string;
  contenido:any = {}
  ngOnInit() {
  }

  async registrar()
  {
      if(this.forma.invalid)
      {
        this.notificacionesS.presentToast('Complete todos los campos correctamente','primary','alert-circle-outline')
        this.notificacionesS.vibrarError(1000);

      }
      else
      {
        if( this.forma.get('contrasena')!.value != this.forma.get('repetirContrasena')!.value)
        {
          this.notificacionesS.presentToast('Las contraseñas deben coincidir','primary','alert-circle-outline')
          this.notificacionesS.vibrarError(1000);

        }
        else
        {
          this.spinner = true;
          this.notificacionesS.presentToast('Registrando!','success','thumbs-up-outline')
          this.empleado = {
            email:this.forma.get('email')!.value,
            contrasena : this.forma.get('contrasena')!.value,
            nombre : this.forma.get('nombre')!.value,
            apellido : this.forma.get('apellido')!.value,
            cuil : this.forma.get('cuil')!.value,
            dni : this.forma.get('dni')!.value,
            foto : this.foto,
            perfil : "empleado",
            tipo : this.forma.get('tipo')!.value,
            token:""
          }
          const user = await this.authService.onRegister(this.empleado, this.subioFoto)
          this.spinner = false;
          if(user)
          {
            this.notificacionesS.presentToast('El empleado fue registrado correctamente!','success','thumbs-up-outline')
            this.forma.reset();
            this.src_imagen= '../../../assets/anonimo.png';
          }
        }
        
      }
  }

  async sacarFoto()
  {
        const image = await Camera.getPhoto({
          quality: 90,
          allowEditing: false,
          promptLabelPhoto: 'Elegir de la galeria',
          promptLabelPicture: 'Sacar foto',
          promptLabelHeader:'Foto',
          resultType: CameraResultType.DataUrl
        }).then((result) =>
        {
          this.subioFoto = true;
          this.src_imagen = result.dataUrl
          this.foto = result.dataUrl
        }, (err)=>
        {
          this.notificacionesS.presentToast('Error! Ocurrio un error al sacar la foto','danger','alert-circle-outline')
          this.notificacionesS.vibrarError(1000);

        })
  };

  async escanearDocumento() {
    document.querySelector('body').classList.add('scanner-active');
    this.scanActivo = true;
    this.scaner.startScan().then((result) => {
      console.log(result)
      this.contenido = result.split('@');
      if (this.contenido.length === 1) {
        this.contenido = result.split(',');
      }


      const apellidos = this.formatearCadena(this.contenido[1]);
      const nombres = this.formatearCadena(this.contenido[2]);
      const dni = this.contenido[4];

      this.forma.setValue({
        nombre: nombres,
        apellido: apellidos,
        dni: dni,
        cuil: this.forma.getRawValue().cuil,
        email: this.forma.getRawValue().email,
        contrasena: this.forma.getRawValue().contrasena,
        tipo: this.forma.getRawValue().tipo,
      });

      this.notificacionesS.presentToast('DNI escaneado', 'success', 'qr-code-outline');
      this.scanActivo = false;
    }).catch((err)=>{console.log("Erorr: ", err.message)});
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

  pararScan()
  {
    this.scanActivo=false;
    document.querySelector('body').classList.remove('scanner-active');
    this.scaner.stopScanner()
  }

}

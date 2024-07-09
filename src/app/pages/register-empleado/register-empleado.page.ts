import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Camera, CameraResultType } from '@capacitor/camera';
import { QrscannerService } from '../../servicios/qrscanner.service';
import { IonSlides, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/servicios/auth.service';
import { Router } from '@angular/router';
import { Vibration } from '@awesome-cordova-plugins/vibration/ngx';

@Component({
  selector: 'app-register-empleado',
  templateUrl: './register-empleado.page.html',
  styleUrls: ['./register-empleado.page.scss'],
})
export class RegisterEmpleadoPage implements OnInit {

  @ViewChild(IonSlides) slides:IonSlides;

  public forma!: FormGroup;
  scanActivo=false;
  foto:any="https://firebasestorage.googleapis.com/v0/b/pps-segundoparcial.appspot.com/o/usuario-outline.png?alt=media&token=2f207f55-caa6-42ee-8ace-756714128548";
  subioFoto:boolean = false;
  empleado:any={}
  spinner: boolean = false;


  constructor(private vibration: Vibration,private fb: FormBuilder,
     public scaner : QrscannerService,
     private toastController: ToastController,
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

  
  goToSlides()
  {
    let indice;
    this.slides.getActiveIndex().then((i)=>
    {
      indice = i;
      if(indice == 0)
      {
        this.slides.slideTo(1, 500)
      }
      else
      {
        this.slides.slideTo(0, 500)
      }
    })
  }

  goToSlides1()
  { 
    this.slides.slideTo(0, 500)
  }

  goToSlides2()
  {
    this.slides.slideTo(1, 500)
  }

  async registrar()
  {
      if(this.forma.invalid)
      {
        this.presentToast('Complete todos los campos correctamente','primary','alert-circle-outline')
        this.vibration.vibrate(1000);

      }
      else
      {
        if( this.forma.get('contrasena')!.value != this.forma.get('repetirContrasena')!.value)
        {
          this.presentToast('Las contraseñas deben coincidir','primary','alert-circle-outline')
          this.vibration.vibrate(1000);

        }
        else
        {
          this.spinner = true;
          this.presentToast('Registrando!','success','thumbs-up-outline')
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
            this.presentToast('El empleado fue registrado correctamente!','success','thumbs-up-outline')
            this.router.navigate(['login'])
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
          this.presentToast('Error! Ocurrio un error al sacar la foto','danger','alert-circle-outline')
          this.vibration.vibrate(1000);

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

      this.presentToast('DNI escaneado', 'success', 'qr-code-outline');
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

  async presentToast(mensaje:string, color:string, icono:string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 1500,
      icon: icono,
      color:color
    });

    await toast.present();
  }

  pararScan()
  {
    this.scanActivo=false;
    document.querySelector('body').classList.remove('scanner-active');
    this.scaner.stopScanner()
  }

}

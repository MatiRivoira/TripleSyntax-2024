import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonSlides, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/servicios/auth.service';
import { Router } from '@angular/router';
import { Camera, CameraResultType } from '@capacitor/camera';
import { EncuestasService } from 'src/app/servicios/encuestas.service';

@Component({
  selector: 'app-empleado-encuesta',
  templateUrl: './empleado-encuesta.page.html',
  styleUrls: ['./empleado-encuesta.page.scss'],
})
export class EmpleadoEncuestaPage implements OnInit {

  
  @ViewChild(IonSlides) slides:IonSlides;
  foto:any;
  public forma!: FormGroup;
  respuesta:any={}
  constructor(private fb: FormBuilder,
     private toastController: ToastController,
     public authService:AuthService,
     private router: Router,
     private encuestas: EncuestasService ) 
  {
    this.forma = this.fb.group({
      'satisfaccion': ['', [Validators.required]],
      'comentario': [''],
      'aTiempo': ['', [Validators.required]],
      'companeros': ['', [Validators.required]],
      'clientes': ['', [Validators.required]]
    });
  }

  src_imagen="../../../assets/img/logopng.png"
  si:boolean
  no:boolean
  valorRespuesta:boolean;
  respondio:boolean = false;

  ngOnInit() {
  }

  agregarRespuesta()
  { 
    if(!this.foto)
    {
      this.presentToast('Debe agregar una foto','danger','alert-circle-outline')
    }
    else
    {
      let acomodados;
      this.respuesta= 
      {
        satisfaccion:this.forma.get('satisfaccion')!.value,
        comentario:this.forma.get('comentario')!.value,
        aTiempo:this.forma.get('aTiempo')!.value,
        companeros:this.forma.get('companeros')!.value,
        clientes: this.valorRespuesta,
        foto:this.foto,
        empleado: this.authService.UsuarioActivo
      }
      if(this.encuestas.agregarRespuestaEmpleados(this.respuesta))
      {
        this.presentToast('La respuesta fue registrada correctamente!','success','thumbs-up-outline')
        this.encuestas.respondio = true;
        switch(this.authService.UsuarioActivo.tipo)
        {
          case "mozo":
            this.router.navigate(["home-mozo"])
            break;

          case "mestre":
            this.router.navigate(["home-mestre"])

            break;

          case "bartender":
            this.router.navigate(["home"])

            break;

          case "cocinero":
            this.router.navigate(["home"])

            break;
        }
      }
    }
  }

  Saltear()
  {
    this.encuestas.respondio = true;
    switch(this.authService.UsuarioActivo.tipo)
    {
      case "mozo":
        this.router.navigate(["home-mozo"])
        break;

      case "metre":
        this.router.navigate(["home-mestre"])

        break;

      case "bartender":
        this.router.navigate(["home-bartender"])

        break;

      case "cocinero":
        this.router.navigate(["home-cocinero"])

        break;
    }
  }

  onValorCapturado(value: any){
    if(value == 1){
      this.si=true
      this.no = false;
      this.valorRespuesta = true;
    }
    else
    {
      this.no=true
      this.si = false;
      this.valorRespuesta = false;
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
          this.src_imagen = result.dataUrl
          this.foto = result.dataUrl
        }, (err)=>
        {
          this.presentToast('Error! Ocurrio un error al sacar la foto','danger','alert-circle-outline')
        })
  };

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

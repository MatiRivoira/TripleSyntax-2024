import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  Validators,
  FormBuilder
} from '@angular/forms';
import { AuthService } from 'src/app/servicios/auth.service';
import { Camera, CameraResultType } from '@capacitor/camera';
import { Producto } from 'src/app/clases/producto';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { NotificacionesService } from 'src/app/servicios/notificaciones.service';

@Component({
  selector: 'app-alta-productos',
  templateUrl: './crear-producto.page.html',
  styleUrls: ['./crear-producto.page.scss'],
})
export class CrearProductoPage implements OnInit {
  formularioAlta: FormGroup;
  producto: any = {};
  src_imagen = "../../../assets/altaProductos.png";
  numeroImagen: number = 0;
  fotos_urls: any[] = [];
  fotos: any[] = [];

  constructor(public formBuilder: FormBuilder, private notificacionesS: NotificacionesService, private firestore: AngularFirestore, private authService: AuthService, private router: Router) {
    this.producto = new Producto();
    this.formularioAlta = this.formBuilder.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      tiempoElaboracion: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      precio: ['', [Validators.required, Validators.pattern("^[0-9]*$")]]
    });
  }

  ngOnInit() {
  }

  get nombre() {
    return this.formularioAlta.get('nombre');
  }
  get descripcion() {
    return this.formularioAlta.get('descripcion');
  }
  get tiempoElaboracion() {
    return this.formularioAlta.get('tiempoElaboracion');
  }
  get precio() {
    return this.formularioAlta.get('precio');
  }

  async registrar() {
    if (!(this.fotos.length === 3)) {
      this.notificacionesS.presentToast(
        'Error! Debe agregar las tres fotos',
        'danger',
        'alert-circle-outline'
      );
      this.notificacionesS.vibrarError(1000);
    } else {
      this.notificacionesS.presentToast('Registrando!', 'success', 'thumbs-up-outline');
      this.notificacionesS.showSpinner();
      try {
        for (let index = 0; index < this.fotos.length; index++) {
          var foto_url = await this.authService.subirArchivosString(this.fotos[index]);
          this.fotos_urls.push(foto_url);
        }
        if (this.fotos_urls.length === 3) {
          await this.firestore.collection('productos').doc().set({
            nombre: this.formularioAlta.get('nombre')!.value,
            descripcion: this.formularioAlta.get('descripcion')!.value,
            tiempoElaboracion: this.formularioAlta.get('tiempoElaboracion')!.value,
            precio: this.formularioAlta.get('precio')!.value,
            fotos: this.fotos_urls,
            tipo: this.authService.UsuarioActivo.value.tipo,
          }).then(() => {
            this.numeroImagen = 0;
            this.notificacionesS.presentToast('Producto Registrado!', 'success', 'thumbs-up-outline');
            this.volverAtras();
          });
        } else {
          this.notificacionesS.presentToast('Error! La cantidad de fotos es incorrecta', 'danger', 'alert-circle-outline');
          this.notificacionesS.vibrarError(1000);
        }
      } catch (error) {
        this.notificacionesS.presentToast('Error! Ocurrió un error al registrar', 'danger', 'alert-circle-outline');
        this.notificacionesS.vibrarError(1000);
      } finally {
        this.notificacionesS.hideSpinner();
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
      resultType: CameraResultType.DataUrl
    }).then((result) => {
      if (this.numeroImagen < 3) {
        this.numeroImagen++;
        this.fotos.push(result.dataUrl);
        console.log(this.numeroImagen);
      }
    }, (err) => {
      this.notificacionesS.presentToast('Error! Ocurrio un error al sacar la foto', 'danger', 'alert-circle-outline')
      this.notificacionesS.vibrarError(1000);
    })
  };


  volverAtras(){
    if(this.authService.UsuarioActivo.value.tipo=="cocinero"){
      this.router.navigate(['home-cocinero']);
    }else if(this.authService.UsuarioActivo.value.tipo=="bartender"){
      this.router.navigate(['home-bartender']);
    }
  }


}

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { Camera, CameraResultType, CameraSource, CameraPhoto } from '@capacitor/camera';

@Component({
  selector: 'app-modo-anonimo',
  templateUrl: './modo-anonimo.component.html',
  styleUrls: ['./modo-anonimo.component.scss'],
})
export class ModoAnonimoComponent implements OnInit {
  @Output() activarSpinner: EventEmitter<any> = new EventEmitter<any>();

  //@ts-ignore
  formAnonimo:FormGroup;
  spinner:boolean = false;
  clienteAnonimo:any = {};

  currentImage: any;
  imagenCargada: boolean = false;

  constructor(private formBuilder: FormBuilder, private firestore: FirebaseService, private router: Router)
  {
    this.formAnonimo = this.formBuilder.group({
      nombre: ['', [Validators.required]]});
  }

  ngOnInit() {}

  async takePicture() {
    const image = await Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera
    });

    this.currentImage = image.dataUrl;
    this.imagenCargada = true;

    if(!this.currentImage) {
      this.imagenCargada = false;
    }
  }

  ingresar()
  {
    if(this.formAnonimo.valid)
    {
      const fecha = new Date().getTime();
      
      this.clienteAnonimo.nombre = this.formAnonimo.value.nombre;
      this.clienteAnonimo.apellido = "";
      this.clienteAnonimo.perfil = "anónimo";
      this.clienteAnonimo.hora = fecha;
      this.clienteAnonimo.id = `${this.clienteAnonimo.nombre}.${this.clienteAnonimo.hora}`;
      this.clienteAnonimo.rutaFoto = this.currentImage;

      this.activarSpinner.emit();
  
      setTimeout(() => {
        this.firestore.agregarDocumentoAnonimo(this.clienteAnonimo, "usuarios-aceptados");
        this.formAnonimo.reset();
        this.router.navigateByUrl("/inicio-cliente");
      }, 3000);
    }
  } 

}

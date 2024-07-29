import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType } from '@capacitor/camera';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { AuthService } from 'src/app/servicios/auth.service';
import { NotificacionesService } from 'src/app/servicios/notificaciones.service';

@Component({
  selector: 'app-register-mesa',
  templateUrl: './crear-mesa.page.html',
  styleUrls: ['./crear-mesa.page.scss'],
})
export class CrearMesaPage implements OnInit {

  public forma!: FormGroup;
  src_imagen = "../../../assets/img/mesa.png"
  foto: any;

  constructor(public authService: AuthService,
    public afs: AngularFirestore,
    private fb: FormBuilder,
    private notificacionesS: NotificacionesService,
    private router: Router) {
    this.forma = this.fb.group({
      'comensales': ['', [Validators.required, Validators.min(1), Validators.max(12), Validators.pattern("^[0-9]*$")]],
      'numero': ['', [Validators.required, Validators.min(1), Validators.pattern("^[0-9]*$")]],
      'tipo': ['', Validators.required]
    });
  }

  ngOnInit() {
  }

  async registrar() {
    console.log(this.forma.invalid);
    if (!this.foto) {
      this.notificacionesS.presentToast('Error! Debe agregar una foto', 'danger', 'alert-circle-outline');
    } else {
      try {
        this.notificacionesS.presentToast('Registrando!', 'success', 'thumbs-up-outline');
        const foto_url = await this.authService.subirArchivosString(this.foto);
        if (foto_url) {
          const mesaDocRef: AngularFirestoreDocument<any> = this.afs.collection('mesas').doc(); // Specify the type as AngularFirestoreDocument<any>

          await mesaDocRef.set({
            id: mesaDocRef.ref.id, // Save the UID as a field in the document using mesaDocRef.ref.id
            comensales: this.forma.get('comensales')!.value,
            numero: this.forma.get('numero')!.value,
            tipo: this.forma.get('tipo')!.value,
            foto: foto_url,
            clienteActivo: null,
            ocupada: false
          });

          this.notificacionesS.presentToast('Mesa Registrada!', 'success', 'thumbs-up-outline');
        }
      } catch (error) {
        this.notificacionesS.presentToast('Error! Ocurrió un error al registrar', 'danger', 'alert-circle-outline');
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
      this.src_imagen = result.dataUrl
      this.foto = result.dataUrl
    }, (err) => {
      this.notificacionesS.presentToast('Error! Ocurrio un error al sacar la foto', 'danger', 'alert-circle-outline')
    })
  };


}

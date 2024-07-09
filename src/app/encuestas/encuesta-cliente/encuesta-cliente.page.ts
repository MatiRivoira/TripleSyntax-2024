import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonSlides, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/servicios/auth.service';
import { Router } from '@angular/router';
import { Camera, CameraResultType } from '@capacitor/camera';
import { EncuestasService } from 'src/app/servicios/encuestas.service';
import { Vibration } from '@awesome-cordova-plugins/vibration/ngx';

import {
  Chart,
  BarElement,
  BarController,
  CategoryScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip,
  LinearScale,
  registerables,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-encuesta-cliente',
  templateUrl: './encuesta-cliente.page.html',
  styleUrls: ['./encuesta-cliente.page.scss'],
})
export class EncuestaClientePage implements OnInit {



  @ViewChild(IonSlides) slides: IonSlides;
  foto: any;
  public forma!: FormGroup;
  numeroImagen: number = 0;
  respuesta: any = {}
  fotos_urls: any[] = [];
  fotos: any[] = [];
  spinner: boolean = false;
  realizoEncuesta: boolean = false;
  mostrarGraficos: boolean = false;
  /**CHARTS*/
  chart: Chart;
  listadoEncuestasClientes: any[] = [];
  clienteActivo: any = null;

  constructor(private fb: FormBuilder,
    private toastController: ToastController,
    public authService: AuthService,
    private router: Router,
    private encuestas: EncuestasService,   private vibration: Vibration) {
    this.forma = this.fb.group({
      'satisfaccion': ['5', [Validators.required]],
      'comentario': [''],
      'precioAdecuado': ['', [Validators.required]],
      'variedadMenu': ['0', [Validators.required]],
      'recomendarias': ['', [Validators.required]]
    });
    Chart.register(
      BarElement,
      BarController,
      CategoryScale,
      Decimation,
      Filler,
      Legend,
      Title,
      Tooltip,
      LinearScale,
      ChartDataLabels
    );
    Chart.register(...registerables);
  }

  si: boolean
  no: boolean
  valorRespuesta: boolean;
  respondio: boolean = false;

  ngOnInit() {
    
  }

  async agregarRespuesta() {
    console.log(this.respuesta);
    if (this.fotos.length > 0) {
      this.spinner = true;
      for (let index = 0; index < this.fotos.length; index++) {
        var foto_url = await this.authService.subirArchivosString(this.fotos[index]);
        this.fotos_urls.push(foto_url);
      }
      this.spinner = false;
    }
    this.respuesta =
    {
      satisfaccion: this.forma.get('satisfaccion')!.value,
      comentario: this.forma.get('comentario')!.value,
      precioAdecuado: this.forma.get('precioAdecuado')!.value,
      variedadMenu: this.forma.get('variedadMenu')!.value,
      recomendarias: this.forma.get('recomendarias')!.value,
      cliente: this.authService.UsuarioActivo,
      foto: this.fotos_urls

    }

    console.log(this.respuesta);
    if (await this.encuestas.agregarRespuestaClientes(this.respuesta)) {
      this.realizoEncuesta = true;
      this.presentToast('La respuesta fue registrada correctamente!', 'success', 'thumbs-up-outline');
      this.router.navigateByUrl('home-cliente');
      //this.encuestas.respondio = true;
    }
  }


  onValorCapturado(value: any) {
    if (value == 1) {
      this.si = true
      this.no = false;
      this.valorRespuesta = true;
    } else {
      this.no = true
      this.si = false;
      this.valorRespuesta = false;
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
      this.presentToast('Error! Ocurrio un error al sacar la foto', 'danger', 'alert-circle-outline')
      this.vibration.vibrate(1000);
    })
  };

  async presentToast(mensaje: string, color: string, icono: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 1500,
      icon: icono,
      color: color
    });

    await toast.present();
  }
  navegarMenuMesa() { 
    this.router.navigateByUrl('menu-mesa');
  }
}
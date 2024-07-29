import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/servicios/auth.service';
import { Router } from '@angular/router';
import { Camera, CameraResultType } from '@capacitor/camera';
import { EncuestasService } from 'src/app/servicios/encuestas.service';

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
import { NotificacionesService } from 'src/app/servicios/notificaciones.service';

@Component({
  selector: 'app-encuesta-cliente',
  templateUrl: './devolucion-de-cliente.page.html',
  styleUrls: ['./devolucion-de-cliente.page.scss'],
})
export class DevolucionDeClientePage implements OnInit {
  // @Output() respuestaEncuesta?: EventEmitter<any> = new EventEmitter<any>();


  foto: any;
  public forma!: FormGroup;
  respuesta: any = {}
  realizoEncuesta: boolean = false;
  mostrarGraficos: boolean = false;
  chart: Chart;
  listadoEncuestasClientes: any[] = [];
  clienteActivo: any = null;

  constructor(private fb: FormBuilder,
    private notificacionesS: NotificacionesService,
    public authService: AuthService,
    private router: Router,
    private encuestas: EncuestasService) {
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

  // respuestaDeLaEncuesta() {
  //   let respondio = true;
  //   this.respuestaEncuesta.emit(respondio)
  // }

    atras()
  {
    if(this.authService.UsuarioActivo.value.perfil == "cliente")
    {
      this.router.navigate(['menu-mesa'])
    }
  }

  async agregarRespuesta() {

    this.notificacionesS.showSpinner();
    try {
      this.respuesta =
      {
        satisfaccion: this.forma.get('satisfaccion')!.value,
        comentario: this.forma.get('comentario')!.value,
        precioAdecuado: this.forma.get('precioAdecuado')!.value,
        variedadMenu: this.forma.get('variedadMenu')!.value,
        recomendarias: this.forma.get('recomendarias')!.value,
        cliente: this.authService.UsuarioActivo.value,
        // foto: this.fotos_urls

      }
      let clienteActualizado = this.authService.UsuarioActivo.value;
      clienteActualizado.hizoEncuesta = true;
      this.authService.UsuarioActivo.next(clienteActualizado);

      console.log(this.respuesta);
      if (await this.encuestas.agregarRespuestaClientes(this.respuesta)) {
        this.realizoEncuesta = true;
        this.notificacionesS.presentToast('La respuesta fue registrada correctamente!', 'success', 'thumbs-up-outline');
        this.router.navigateByUrl('menu-mesa');
        //this.encuestas.respondio = true;
      }
    } catch (error) {

    } finally {
      this.notificacionesS.hideSpinner();
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



  navegarMenuMesa() {
    this.router.navigateByUrl('menu-mesa');
  }
}
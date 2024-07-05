import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Vibration } from '@awesome-cordova-plugins/vibration/ngx';
import { AuthService } from 'src/app/servicios/auth.service';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { FotoService } from 'src/app/servicios/foto.service';

@Component({
  selector: 'app-encuesta-cliente',
  templateUrl: './encuesta-cliente.page.html',
  styleUrls: ['./encuesta-cliente.page.scss'],
})
export class EncuestaClientePage implements OnInit {
  nivelLimpieza:string = "0";
  valorSelect:string = "";
  rangoEdad:string = "";
  comentario:string = "";
  recomendadosCumpleanios:boolean = false;
  recomendadosFamilia:boolean = false;
  recomendadosTrabajo:boolean = false;
  error:string = "";
  errorFotos = false;
  arrayFotos:any = new Array();
  spinner:any;
  popup:boolean=false;
  constructor(private vibracion:Vibration,
    private fotoServ:FotoService,
    private firestore:FirebaseService,
    private router: Router) {
     }

  ngOnInit() {
    this.firestore.seteatVisita(true);
  }


  cammbiarValorLimpieza(e:any) {
    this.nivelLimpieza = e.detail.value;
  }

  cambiarValorSelect(e:any)
  {
    this.valorSelect = e.detail.value;
  }

  cambiarEdad(e:any)
  {
    switch (e.detail.value) {
      case "13a20":
        this.rangoEdad = "13 a 20";
        break;
      case "20a30":
        this.rangoEdad = "20 a 30";
        break;
      case "30a40":
        this.rangoEdad = "30 a 40";
        break;
      case "40mas":
        this.rangoEdad = "40+";
        break;
      default:
        break;
    }
  }

  cambiarValorRecomendadosCumpleanios(e:any) {
    if (!this.recomendadosCumpleanios) {
      this.recomendadosCumpleanios = true;
    }
    else {
      this.recomendadosCumpleanios = false;
    }
  }

  cambiarValorRecomendadosFamilia(e:any) {
    if (!this.recomendadosFamilia) {
      this.recomendadosFamilia = true;
    }
    else {
      this.recomendadosFamilia = false;
    }
  }

  cambiarValorRecomendadosTrabajo(e:any) {
    if (!this.recomendadosTrabajo) {
      this.recomendadosTrabajo = true;
    }
    else {
      this.recomendadosTrabajo = false;
    }
  }

  vibrar()
  {
    this.vibracion.vibrate(5000);
    setTimeout (() => {
      this.vibracion.vibrate(0);
   }, 2000);
  }

  validarRespuestas()
  {
    if(this.rangoEdad == "")
    {
      this.error = "Debe seleccionar una edad.";
      this.vibrar();
    }
    else if(this.valorSelect == "")
    {
      this.error = "Debe seleccionar que le gusto del local.";
      this.vibrar();
    }
    else if(this.errorFotos)
    {
      this.error = "Puede seleccionar 3 fotos como máximo.";
      this.vibrar();
    }
  }

  async obtenerFotosEncuesta()
  {
    this.arrayFotos = new Array();
    let foto = {
      hora: ''
    }
    this.spinner = true;
    await this.fotoServ.obtenerImagenes(foto);
    this.spinner = false;
      this.arrayFotos = this.fotoServ.obtenerArrayFotos();
      if(this.arrayFotos.length > 3)
      {
        this.errorFotos = true;
        this.arrayFotos = new Array();
      }
      else
      {
        this.errorFotos = false;
      }
      this.fotoServ.limpiarArrayFotos();
  }

  activarSpinner()
  {
    this.spinner = true;
    setTimeout(() => {
      this.spinner = false;
    }, 2000);
  }

  async enviarRespuestas()
  {
    this.error = "";
    this.validarRespuestas();

    if(this.error == "")
    {
      let arrayRecomendados = new Array();
      if(this.recomendadosCumpleanios)
      {
        arrayRecomendados.push("Cumpleaños");
      }
      if(this.recomendadosFamilia)
      {
        arrayRecomendados.push("Familia");
      }
      if(this.recomendadosTrabajo)
      {
        arrayRecomendados.push("Trabajo");
      }
      this.spinner = true;
      setTimeout(()=>{
        let datos =
        {
          recomendados: arrayRecomendados,
          rangoEdad: this.rangoEdad,
          gustosDelLocal: this.valorSelect,
          limpieza: this.nivelLimpieza,
          comentario: this.comentario,
          fotos: this.arrayFotos 
        }
        this.firestore.guardarEncuestaCliente(datos);
        this.limpiarDatos();
        this.spinner = false;
        this.popup = true;
      },2000);
    }
  }

  limpiarDatos()
  {
   this.nivelLimpieza = "0";
   this.valorSelect = "Elegir";
   this.rangoEdad = "";
   this.comentario = "";
   this.recomendadosCumpleanios = false;
   this.recomendadosFamilia = false;
   this.recomendadosTrabajo = false;
  }
}

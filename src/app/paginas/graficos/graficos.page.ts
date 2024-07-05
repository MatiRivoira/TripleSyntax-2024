import { Component, OnInit } from '@angular/core';
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
import { log } from 'console';
import { FirebaseService } from 'src/app/servicios/firebase.service';
@Component({
  selector: 'app-graficos',
  templateUrl: './graficos.page.html',
  styleUrls: ['./graficos.page.scss'],
})
export class GraficosPage implements OnInit {
  valoraciones = [0,0,0,0,0,0,0,0,0,0];
  valoracionGustos = [0,0,0];
  listaEncuestas:any = new Array();
  barChart:any;
  pieChart:any;
  pieChart2:any;
  pieChart3:any;
  spinner:boolean = false;

  galeriaFotos:any;

  constructor(private firebaseServ:FirebaseService) {
    Chart.register(
      BarElement,
      BarController,
      CategoryScale,
      Decimation,
      Filler,
      Legend,
      Title,
      Tooltip,
      LinearScale
    );
    Chart.register(...registerables);
   }


  ngOnInit() {
    this.firebaseServ.obtenerColeccion('encuestas-clientes').subscribe((encuestas)=>{
      this.listaEncuestas = encuestas;
      this.galeriaFotos = encuestas.filter(encuesta => encuesta.fotos.length > 0)
      
    });
    
    setTimeout(()=>{
      this.cargarValoresLimpieza();
      this.cargarValoresGustos();
      this.cargarRecomendados();
      this.cargarEdad();
    },2000)
    console.log(this.valoracionGustos);
  }

  ngAfterViewInit()
  {
    this. activarSpinner();
  }

  activarSpinner()
  {
    this.spinner = true;
    setTimeout(()=>{
      this.spinner = false;
    },2000);
  }

  cargarValoresGustos()
  {
    for(let i = 0; i < this.listaEncuestas.length; i++)
    {
      switch(this.listaEncuestas[i].gustosDelLocal)
      {
        case 'Decoracion':
          this.valoracionGustos[0]++;
          break;
        case 'Personal':
          this.valoracionGustos[1]++;
          break;
        case 'Musica':
          this.valoracionGustos[2]++;
          break;
      }
    }
    this.generarGraficoCircular(1, ['Decoración', 'Personal', 'Música']);
  }

  recomendados = [0,0,0];
  cargarRecomendados()
  {
    for(let i = 0; i < this.listaEncuestas.length; i++)
    {
      
      switch(this.listaEncuestas[i].recomendados[0])
      {
        case 'Familia':
          this.recomendados[0]++;
          break;
        case 'Trabajo':
          this.recomendados[1]++;
          break;
        case 'Cumpleaños':
          this.recomendados[2]++;
          break;
      }
    }
    
    this.generarGraficoCircular(2, ['Familia', 'Trabajo', 'Cumpleños']);
  }

  rangoEdad = [0,0,0];
  cargarEdad()
  {
    for(let i = 0; i < this.listaEncuestas.length; i++)
    {
      
      switch(this.listaEncuestas[i].rangoEdad)
      {
        case '13 a 20':
          this.rangoEdad[0]++;
          break;
        case '20 a 30':
          this.rangoEdad[1]++;
          break;
        case '30 a 40':
          this.rangoEdad[2]++;
          break;
      }
    }
    
    this.generarGraficoCircular(3, ['13 a 20', '20 a 30', '30 a 40']);
  }

  cargarValoresLimpieza()
  {
    for(let i = 0; i < this.listaEncuestas.length; i++)
    {
      switch(this.listaEncuestas[i].limpieza)
      {
        case 1:
          this.valoraciones[0]++;
          break;
        case 2:
          this.valoraciones[1]++;
          break;
        case 3:
          this.valoraciones[2]++;
          break;
        case 4:
          this.valoraciones[3]++;
          break;
        case 5:
          this.valoraciones[4]++;
          break;
        case 6:
          this.valoraciones[5]++;
          break;
        case 7:
          this.valoraciones[6]++;
          break;
        case 8:
          this.valoraciones[7]++;
          break;
        case 9:
          this.valoraciones[8]++;
          break;
        case 10:
          this.valoraciones[9]++;
          break;
      }
    }
    this.generarGraficoBarras();
  }

  generarGraficoBarras()
  {
    if (this.barChart) {
      this.barChart.destroy(); // Destruir el gráfico existente antes de crear uno nuevo
    }
    const ctx = (<any>document.getElementById('barChart')).getContext('2d');
    const colors = [
      '#FCC85B',
      '#DB5F00',
      '#F08D62',
      '#DB2816',
      '#FA0065',
    ];
    let i = 0;
    const coloresPuntaje = this.valoraciones.map(
      (_:any) => colors[(i = (i + 1) % colors.length)]
    );
    //@ts-ignore
    this.barChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
        datasets: [{
          label: 'Condiciones de limpieza',
          data: this.valoraciones,
          backgroundColor: coloresPuntaje,
          borderColor: coloresPuntaje,
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            max: 10 // Define el rango máximo en el eje Y
          }
        }
      }
    });
  }

  generarGraficoCircular(chartOption:number , labels:string[]):void {
    let grafic = "pieChart";
    switch(chartOption ) {
      case 1:
        if (this.pieChart) {
          this.pieChart.destroy(); // Destruir el gráfico existente antes de crear uno nuevo
        }
        grafic = "pieChart"
        break;
      case 2:
        if (this.pieChart2) {
          this.pieChart2.destroy(); // Destruir el gráfico existente antes de crear uno nuevo
        }
        grafic = "pieChart2"
        break;
      case 3:
        if (this.pieChart3) {
          this.pieChart3.destroy(); // Destruir el gráfico existente antes de crear uno nuevo
        }
        grafic = "pieChart3"
        break;
    }
    
    const ctx = (<any>document.getElementById(grafic)).getContext('2d');
    const colores = [
      '#FCC85B',
      '#DB5F00',
      '#F08D62'  
    ];

    let i = 0;
    
    let data;
    let coloresGrafico;
    let label;
    switch (chartOption) {
      case 1:
         coloresGrafico = this.valoracionGustos.map(
          (_: any) => colores[(i = (i + 1) % colores.length)]
        );
        data = this.valoracionGustos;
        label = 'Preferencias de la gente';
        break;
      case 2:
         coloresGrafico = this.recomendados.map(
          (_: any) => colores[(i = (i + 1) % colores.length)]
        );
        data = this.recomendados;
        
        label = 'Recomendaciones de la gente';
        break;
        case 3:
          coloresGrafico = this.rangoEdad.map(
           (_: any) => colores[(i = (i + 1) % colores.length)]
         );
         data = this.rangoEdad;
         
         label = 'Rango de edad';
         break;
    }
   


    this.pieChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          label: label,
          data: data,
          backgroundColor: coloresGrafico,
          borderColor: coloresGrafico,
          borderWidth: 1
        }]
      },
    });
  }

}

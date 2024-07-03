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
  spinner:boolean = false;
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
    });
    
    setTimeout(()=>{
      this.cargarValoresLimpieza();
      this.cargarValoresGustos();
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
    this.generarGraficoCircular();
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

  generarGraficoCircular()
  {
    if (this.pieChart) {
      this.pieChart.destroy(); // Destruir el gráfico existente antes de crear uno nuevo
    }
    const ctx = (<any>document.getElementById('pieChart')).getContext('2d');
    const colores = [
      '#FCC85B',
      '#DB5F00',
      '#F08D62'  
    ];

    let i = 0;
    const coloresGrafico = this.valoracionGustos.map(
      (_: any) => colores[(i = (i + 1) % colores.length)]
    );

    this.pieChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Decoración', 'Personal', 'Música'],
        datasets: [{
          label: 'Preferencias de la gente',
          data: this.valoracionGustos,
          backgroundColor: coloresGrafico,
          borderColor: coloresGrafico,
          borderWidth: 1
        }]
      },
    });
  }

}

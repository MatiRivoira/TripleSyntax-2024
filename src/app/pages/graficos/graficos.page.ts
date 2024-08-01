import { Location } from '@angular/common';
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
import { FirestoreService } from 'src/app/services/firestore.service';
@Component({
  selector: 'app-graficos',
  templateUrl: './graficos.page.html',
  styleUrls: ['./graficos.page.scss'],
})
export class GraficosPage implements OnInit {

  valoraciones = Array(10).fill(0);
  precioAdecuado = Array(2).fill(0);
  recomendarias = Array(2).fill(0);
  variedadMenu = Array(2).fill(0);

  listaEncuestas: any[] = [];

  barChart: any;
  pieChart: any;
  pieChart2: any;
  pieChart3: any;

  spinner: boolean = false;

  galeriaFotos: any;

  constructor(private firebaseServ:FirestoreService, private location: Location) {
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
    this.firebaseServ.getDocuments('respuestas-encuesta-clientes').subscribe((encuestas) => {
      this.listaEncuestas = encuestas;
      this.galeriaFotos = encuestas.filter(encuesta => encuesta.foto && encuesta.foto.length > 0);
      
      console.log(this.galeriaFotos);
      

      this.cargarValoracion();
      this.cargarPrecioAdecuado();
      this.cargarVariedadMenu();
      this.cargarRecomedarias();
    });
  }

  goBack() {
    this.location.back();
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


  cargarValoracion()
  {
    for(let i = 0; i < this.listaEncuestas.length; i++)
    {
      switch(this.listaEncuestas[i].satisfaccion)
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

  cargarPrecioAdecuado()
  {
    for(let i = 0; i < this.listaEncuestas.length; i++)
    {
      switch(this.listaEncuestas[i].precioAdecuado)
      {
        case 'Si':
          this.precioAdecuado[0]++;
          break;
        default:
          this.precioAdecuado[1]++;
          break;
      }
    }
    this.generarGraficoCircular(1, ['Si', 'No']);
  }

  cargarVariedadMenu()
  {
    for(let i = 0; i < this.listaEncuestas.length; i++)
    {
      this.variedadMenu[this.listaEncuestas[i].variedadMenu]++;
    }
    this.generarGraficoCircular(3, ['0', '1', '3']);
  }

  cargarRecomedarias()
  {
    for(let i = 0; i < this.listaEncuestas.length; i++)
    {
      if (this.listaEncuestas[i].recomendarias) {
        this.recomendarias[0]++;
      } else {
        this.recomendarias[1]++;
      }
    }
    this.generarGraficoCircular(2, ['Si', 'No']);
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
          label: 'Valoraciones',
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
         coloresGrafico = this.precioAdecuado.map(
          (_: any) => colores[(i = (i + 1) % colores.length)]
        );
        data = this.precioAdecuado;
        label = 'El precio es adecuado';
        break;
      case 2:
         coloresGrafico = this.recomendarias.map(
          (_: any) => colores[(i = (i + 1) % colores.length)]
        );
        data = this.recomendarias;
        
        label = 'Recomendarias';
        break;
        case 3:
          coloresGrafico = this.variedadMenu.map(
           (_: any) => colores[(i = (i + 1) % colores.length)]
         );
         data = this.variedadMenu;
         
         label = 'Variedad del menu';
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

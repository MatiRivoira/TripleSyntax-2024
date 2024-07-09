import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';import {
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
import { EncuestasService } from 'src/app/servicios/encuestas.service';

@Component({
  selector: 'app-empleado-graficos',
  templateUrl: './empleado-graficos.page.html',
  styleUrls: ['./empleado-graficos.page.scss'],
})
export class EmpleadoGraficosPage implements OnInit {

  constructor(private fb: FormBuilder,
    private router: Router,
    private toastController: ToastController,
    private encuestasSrv: EncuestasService) 
    {
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
    chart: Chart;

    listadoEncuestasEmpleados: any[] = [];


  spinner:Boolean=false
  ngOnInit() {
    this.spinner = true
    this.encuestasSrv
      .traerRespuestasEmpleados()
      .subscribe((encuestas) => {
        this.listadoEncuestasEmpleados = encuestas;
        this.generarChartTiempo()
        this.generarChartAcomodados()
        this.generarChartComportamiento()
        this.generarChartCondiciones()
      });
      setTimeout(() => {
          this.spinner = false
      }, 3000);
  }

  generarChartTiempo() {

    setTimeout(() => {
      this.spinner = true;
      this.spinner = false;
      const ctx = (<any>document.getElementById('chart1')).getContext(
        '2d'
      );
      let listaTiempo = [0, 0];
      this.listadoEncuestasEmpleados.forEach((e) => 
      {
        if (e.aTiempo == 'Si') 
        {
          listaTiempo[0]++;
        } else 
        {
          listaTiempo[1]++;
        }
      });

      const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Si', 'No'],
            datasets: [{
                label: 'Votos',
                data: listaTiempo,
                backgroundColor: [

                  '#ffc409',
                  '#eb445a',
                  '#3dc2ff',
                  '#55ff9c',
                  '#2fdf75',
                  '#0044ff',
                  '#ee55ff',
                ],
                borderColor: [

                    '#000'
                ],
                borderWidth: 1, 
            }],
            
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                      color: "black",
                      stepSize:1
                    }
                },
                x: {
                  beginAtZero: true,
                  ticks: {
                    color: "black",
                    stepSize:1
                  }
              },
            },
            plugins: {
              legend: {
                labels: {
                  color: "black", 
                  font: {
                    size: 18
                  }
                }
              }
            }
        }
    });
    }, 500);

  }

  generarChartAcomodados() {

    setTimeout(() => {
      this.spinner = true;
      this.spinner = false;
      const ctx = (<any>document.getElementById('chart2')).getContext(
        '2d'
      );
      let listaAcomodados = [0, 0];
      this.listadoEncuestasEmpleados.forEach((e) => 
      {
        if (e.clientes == true) 
        {
          listaAcomodados[0]++;
        } 
        else 
        {
          listaAcomodados[1]++;
        }
      });

      const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Si', 'No'],
            datasets: [{
                label: 'Votos',
                data: listaAcomodados,
                backgroundColor: [

                  '#ffc409',
                  '#eb445a',
                  '#3dc2ff',
                  '#55ff9c',
                  '#2fdf75',
                  '#0044ff',
                  '#ee55ff',
                ],
                borderColor: [
                  '#000'
                ],
                borderWidth: 1
            }]
        },
        options: {
          scales: {
              y: {
                  beginAtZero: true,
                  ticks: {
                    color: "black",
                    stepSize:1
                  }
              },
              x: {
                beginAtZero: true,
                ticks: {
                  color: "black",
                  stepSize:1
                }
            },
          },
          plugins: {
            legend: {
              labels: {
                color: "black", 
                font: {
                  size: 18
                }
              }
            }
          }
      }
    });
    }, 500);

  }
  
  generarChartComportamiento() {

    setTimeout(() => {
      this.spinner = true;
      this.spinner = false;
      const ctx = (<any>document.getElementById('chart3')).getContext(
        '2d'
      );
      let listaAcomodados = [0, 0, 0];
      this.listadoEncuestasEmpleados.forEach((e) => 
      {
        if (e.companeros == 'excelente') 
        {
          listaAcomodados[0]++;
        } else if(e.companeros == 'adecuada')
        {
          listaAcomodados[1]++;
        }
        else
        {
          listaAcomodados[2]++;

        }
      });

      const myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Excelente', 'Adecuado', 'Malo'],
            datasets: [{
                label: 'Respuestas',
                data: listaAcomodados,
                backgroundColor: [

                  '#ffc409',
                  '#eb445a',
                  '#3dc2ff',
                  '#55ff9c',
                  '#2fdf75',
                  '#0044ff',
                  '#ee55ff',
                ],
                borderColor: [
                  '#000'
                ],
                borderWidth: 1
            }]
        },
        options: {
          
          plugins: {
            legend: {
              labels: {
                color: "black", 
                font: {
                  size: 18
                }
              }
            }
          }
      }
    });
    }, 500);

  }

  generarChartCondiciones() {

    setTimeout(() => {
      this.spinner = true;
      this.spinner = false;
      const ctx = (<any>document.getElementById('chart4')).getContext(
        '2d'
      );
      let listaAcomodados = [0,0,0,0,0,0,0,0,0,0];
      this.listadoEncuestasEmpleados.forEach((e) => 
      {
        switch(e.satisfaccion)
        {
          case 0:
            listaAcomodados[0]++;
            break;

            case 1:
            listaAcomodados[1]++;
            break;

            case 2:
            listaAcomodados[2]++;
            break;

            case 3:
            listaAcomodados[3]++;
            break;

            case 4:
            listaAcomodados[4]++;
            break;

            case 5:
            listaAcomodados[5]++;
            break;

            case 6:
            listaAcomodados[6]++;
            break;

            case 7:
            listaAcomodados[7]++;
            break;

            case 8:
            listaAcomodados[8]++;
            break;

            case 9:
            listaAcomodados[9]++;
            break;
        }

      });

      const myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
            datasets: [{
                label: 'Respuestas',
                data: listaAcomodados,
                backgroundColor: [
                  '#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080', '#ffffff', '#000000'
                ],
                borderColor: [
                  '#000'
                ],
                borderWidth: 1
            }]
        },
        options: {
          scales: {
              
          },
          plugins: {
            
          }
      }
    });
    }, 500);

  }
}

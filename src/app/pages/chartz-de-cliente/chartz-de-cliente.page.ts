import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/servicios/auth.service';
import { Router } from '@angular/router';
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
import { IonSlides } from '@ionic/angular';
@Component({
  selector: 'app-charts-encuesta-clientes',
  templateUrl: './chartz-de-cliente.page.html',
  styleUrls: ['./chartz-de-cliente.page.scss'],
})
export class ChartzDeClientePage implements OnInit {
  @ViewChild(IonSlides) slides: IonSlides;
  chart: any;
  public chartActivo = 1;
  listadoEncuestasClientes: any[] = [];
  clienteActivo: any = null;
  spinner: boolean = false;

  mostrarGraficos: boolean = false;
  constructor(
    public authService: AuthService,
    private router: Router,
    private encuestas: EncuestasService) {
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
    this.spinner = true;
    Chart.register(...registerables);
    this.encuestas
      .traerEncuestasClientes()
      .subscribe((encuestasClientes) => {
        this.listadoEncuestasClientes = encuestasClientes;
        console.log('ENCUESTAS CLIENTES: ', this.listadoEncuestasClientes);
      });
  }


  ngOnInit() {
    this.spinner = true;
    setTimeout(() => {
      this.generarChartClienteSatisfaccion();
      this.generarChartClienteVariedadMenu();
      this.generarChartClientePrecioAdecuado();
      this.generarChartClienteRecomendarias();
      this.spinner = false;
    }, 4000);



  }



  generarChartClienteSatisfaccion() {
    this.spinner = true;
    setTimeout(() => {
      this.spinner = false;
      const ctx = (<any>document.getElementById('chartClienteSatisfaccion')).getContext(
        '2d'
      );
      const encuestas = this.listadoEncuestasClientes
      Chart.defaults.font.weight = "boldness";
      const colors = [
        '#ffc409',
        '#eb445a',
        '#3dc2ff',
        '#55ff9c',
        '#2fdf75',
        '#0044ff',
        '#ee55ff',
      ];

      let i = 0;
      const encuestasColors = encuestas.map(
        (_) => colors[(i = (i + 1) % colors.length)]
      );

      let listaSatisfaccion = [0, 0, 0];
      encuestas.forEach((e) => {
        if (e.satisfaccion < 4) {
          listaSatisfaccion[0]++;
        } else if (e.satisfaccion >= 4 && e.satisfaccion < 7) {
          listaSatisfaccion[1]++;
        } else {
          listaSatisfaccion[2]++;
        }
      });
      this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Malo', 'Bueno', 'Excelente'],

          datasets: [
            {
              label: 'Valoración del servicio',
              data: listaSatisfaccion,
              backgroundColor: encuestasColors,
              borderColor: ['#000'],
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              display: true,
              grid: {
                display: false,
                color: '#fff',
                drawBorder: true,
              },
              ticks: {
                color: '#fff',
                font: {
                  family: "'Pretendard', sans-serif",
                  weight: 'bold',
                },
                stepSize: 1,
              },
            },
            x: {
              grid: {
                display: false,
                color: '#fff',
                drawBorder: true,
              },
              ticks: {
                color: '#fff',
                font: {
                  family: "'Pretendard', sans-serif",
                  weight: 'bold',
                },
              },
            },
          },
          layout: {
            padding: 20,
          },
          plugins: {
            tooltip: {
              usePointStyle: true,
              borderColor: '#ffffff',
              borderWidth: 3,
              cornerRadius: 20,
              displayColors: true,
              bodyAlign: 'center',
              callbacks: {
                //@ts-ignore
                labelPointStyle: (context) => {
                  // console.log(context);
                  // context.formattedValue = '';
                  const total = encuestas.length;
                  if (context.dataIndex == 0) {
                    const totalMalo = listaSatisfaccion[0];
                    const porcentajeMalo = ((totalMalo * 100) / total).toFixed(
                      2
                    );
                    context.label = '  ' + porcentajeMalo + '% ';
                    context.formattedValue = 'Malo';
                  } else if (context.dataIndex == 1) {
                    const totalBueno = listaSatisfaccion[1];
                    const porcentajeBueno = (
                      (totalBueno * 100) /
                      total
                    ).toFixed(2);
                    context.label = '  ' + porcentajeBueno + '% ';
                    context.formattedValue = 'Bueno';
                  } else {
                    const totalExcelente = listaSatisfaccion[2];
                    const porcentajeExcelente = (
                      (totalExcelente * 100) /
                      total
                    ).toFixed(2);
                    context.label = '  ' + porcentajeExcelente + '% ';
                    context.formattedValue = 'Excelente';
                  }
                  return {
                    pointStyle: context.dataIndex,
                  };
                },
              },
            },
            legend: {
              display: false,
            },
            datalabels: {
              color: '#fff',
              anchor: 'center',
              align: 'center',
              font: {
                size: 15,
                weight: 'bold',
              },
              formatter(value, context) {
                const total = encuestas.length;
                if (context.dataIndex == 0) {
                  const totalMalo = listaSatisfaccion[0];
                  const porcentajeMalo = ((totalMalo * 100) / total).toFixed(2);
                  return porcentajeMalo + '% ';
                } else if (context.dataIndex == 1) {
                  const totalBueno = listaSatisfaccion[1];
                  const porcentajeBueno = ((totalBueno * 100) / total).toFixed(
                    2
                  );
                  return porcentajeBueno + '% ';
                } else {
                  const totalExcelente = listaSatisfaccion[2];
                  const porcentajeExcelente = (
                    (totalExcelente * 100) /
                    total
                  ).toFixed(2);
                  return porcentajeExcelente + '% ';
                }
              },
              offset: 5,
              backgroundColor: ['#000'],
              borderColor: '#000',
              borderWidth: 1,
              borderRadius: 10,
              padding: 5,
              textShadowBlur: 5,
              textShadowColor: '#000000',
            },
          },
        },
      });
    }, 1000);
  }


  generarChartClienteVariedadMenu() {
    this.spinner = true;
    setTimeout(() => {
      this.spinner = false;
      const ctx = (<any>document.getElementById('chartClienteVariedadMenu')).getContext(
        '2d'
      );

      const encuestas = this.listadoEncuestasClientes;

      const colors = [
        '#ffc409',
        '#eb445a',
        '#3dc2ff',
        '#55ff9c',
        '#2fdf75',
        '#0044ff',
        '#ee55ff',
      ];

      let i = 0;
      const encuestasColors = encuestas.map(
        (_) => colors[(i = (i + 1) % colors.length)]
      );

      let listaVariedadMenu = [0, 0, 0];
      encuestas.forEach((e) => {
        if (e.variedadMenu == 0) {
          listaVariedadMenu[0]++;
        } else if (e.variedadMenu == 1) {
          listaVariedadMenu[1]++;
        } else {
          listaVariedadMenu[2]++;
        }
      });

      this.chart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Adecuado', 'Muy pocas opciones', 'Excelente'],
          datasets: [
            {
              label: 'Humor',
              data: listaVariedadMenu,
              backgroundColor: encuestasColors,
              borderColor: ['#000'],
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          layout: {
            padding: 20,
          },
          plugins: {
            tooltip: {
              usePointStyle: true,
              borderColor: '#ffffff',
              borderWidth: 3,
              cornerRadius: 20,
              displayColors: true,
              bodyAlign: 'center',
              callbacks: {
                //@ts-ignore
                labelPointStyle: (context) => {
                  // console.log(context);
                  // context.formattedValue = '';
                  const total = encuestas.length;
                  if (context.dataIndex == 0) {
                    const totalAdecuada = listaVariedadMenu[0];
                    const porcentajeAdecuada = (
                      (totalAdecuada * 100) /
                      total
                    ).toFixed(2);
                    context.label = '  ' + porcentajeAdecuada + '% ';
                    context.formattedValue = 'Adecuado';
                  } else if (context.dataIndex == 1) {
                    const totalMuyPocasOpciones = listaVariedadMenu[1];
                    const porcentajeMuyPocasOpciones = (
                      (totalMuyPocasOpciones * 100) /
                      total
                    ).toFixed(2);
                    context.label = '  ' + porcentajeMuyPocasOpciones + '% ';
                    context.formattedValue = 'Muy pocas opciones';
                  } else {
                    const totalExcelente = listaVariedadMenu[2];
                    const porcentajeExcelente = (
                      (totalExcelente * 100) /
                      total
                    ).toFixed(2);
                    context.label = '  ' + porcentajeExcelente + '% ';
                    context.formattedValue = 'Excelente';
                  }
                  return {
                    pointStyle: context.dataIndex,
                  };
                },
              },
            },
            legend: {
              display: false,
            },
            datalabels: {
              color: '#fff',
              anchor: 'center',
              align: 'center',
              font: {
                size: 15,
                weight: 'bold',
              },
              formatter(value, context) {
                const total = encuestas.length;
                if (context.dataIndex == 0) {
                  const totalAdecuada = listaVariedadMenu[0];
                  const porcentajeAdecuada = (
                    (totalAdecuada * 100) /
                    total
                  ).toFixed(2);
                  return porcentajeAdecuada + '% ';
                } else if (context.dataIndex == 1) {
                  const totalMuyPocasOpciones = listaVariedadMenu[1];
                  const porcentajeMuyPocasOpciones = (
                    (totalMuyPocasOpciones * 100) /
                    total
                  ).toFixed(2);
                  return porcentajeMuyPocasOpciones + '% ';
                } else {
                  const totalExcelente = listaVariedadMenu[2];
                  const porcentajeExcelente = (
                    (totalExcelente * 100) /
                    total
                  ).toFixed(2);
                  return porcentajeExcelente + '% ';
                }
              },
              offset: 5,
              backgroundColor: ['#000'],
              borderColor: '#000',
              borderWidth: 1,
              borderRadius: 10,
              padding: 5,
              textShadowBlur: 5,
              textShadowColor: '#000000',
            },
          },
        },
      });
    }, 1000);

  }

  generarChartClientePrecioAdecuado() {
    this.spinner = true;
    setTimeout(() => {
      this.spinner = false;
      const ctx = (<any>document.getElementById('chartClientePrecioAdecuado')).getContext(
        '2d'
      );

      const encuestas = this.listadoEncuestasClientes;
      const colors = [
        '#ffc409',
        '#eb445a',
        '#3dc2ff',
        '#55ff9c',
        '#2fdf75',
        '#0044ff',
        '#ee55ff',
      ];

      let i = 0;
      const encuestasColors = encuestas.map(
        (_) => colors[(i = (i + 1) % colors.length)]
      );

      let listaPrecioAdecuado = [0, 0];
      encuestas.forEach((e) => {
        if (e.precioAdecuado === "Si") {
          listaPrecioAdecuado[0]++;
        } else {
          listaPrecioAdecuado[1]++;
        }
      });

      this.chart = new Chart(ctx, {
        type: 'polarArea',
        data: {
          labels: ['Si', 'No'],
          datasets: [
            {
              label: 'Humor',
              data: listaPrecioAdecuado,
              backgroundColor: encuestasColors,
              borderColor: ['#000'],
              borderWidth: 2,
            },
          ],
        },
        options: {
          scales: {
            r: {
              pointLabels: {
                display: false,
                centerPointLabels: true,
                color: "#fff",
                font: {
                  family: "'Pretendard', sans-serif",
                  weight: 'bold',
                },
              },
              grid: {
                display: false,
                color: '#fff',
                drawBorder: true,
              },
              ticks: {
                color: '#fff',
                backdropColor: "#000",
                font: {
                  family: "'Pretendard', sans-serif",
                  weight: 'bold',
                },
                z: 100,
                stepSize: 1,
              },
            }
          },
          responsive: true,
          layout: {
            padding: 20,
          },
          plugins: {
            tooltip: {
              usePointStyle: true,
              borderColor: '#ffffff',
              borderWidth: 3,
              cornerRadius: 20,
              displayColors: true,
              bodyAlign: 'center',
              callbacks: {
                //@ts-ignore
                labelPointStyle: (context) => {
                  // console.log(context);
                  // context.formattedValue = '';
                  const total = encuestas.length;
                  if (context.dataIndex == 0) {
                    const totalSi = listaPrecioAdecuado[0];
                    const porcentajeSi = (
                      (totalSi * 100) /
                      total
                    ).toFixed(2);
                    context.label = '  ' + porcentajeSi + '% ';
                    context.formattedValue = 'Si';
                  } else {
                    const totalNo = listaPrecioAdecuado[1];
                    const porcentajeNo = (
                      (totalNo * 100) /
                      total
                    ).toFixed(2);
                    context.label = '  ' + porcentajeNo + '% ';
                    context.formattedValue = 'No';
                  }
                  return {
                    pointStyle: context.dataIndex,
                  };
                },
              },
            },
            legend: {
              display: false,
            },
            datalabels: {
              color: '#fff',
              anchor: 'center',
              align: 'center',
              font: {
                size: 15,
                weight: 'bold',
              },
              formatter(value, context) {
                const total = encuestas.length;
                if (context.dataIndex == 0) {
                  const totalSi = listaPrecioAdecuado[0];
                  const porcentajeSi = (
                    (totalSi * 100) /
                    total
                  ).toFixed(2);
                  return porcentajeSi + '% ';
                } else {
                  const totalNo = listaPrecioAdecuado[1];
                  const porcentajeNo = (
                    (totalNo * 100) /
                    total
                  ).toFixed(2);
                  return porcentajeNo + '% ';
                }
              },
              offset: 5,
              backgroundColor: ['#000'],
              borderColor: '#000',
              borderWidth: 1,
              borderRadius: 10,
              padding: 5,
              textShadowBlur: 5,
              textShadowColor: '#000000',
            },
          },
        },
      });
    }, 1000);
  }

  generarChartClienteRecomendarias() {
    this.spinner = true;
    setTimeout(() => {
      this.spinner = false;
      const ctx = (<any>document.getElementById('chartClienteRecomendaria')).getContext(
        '2d'
      );

      const encuestas = this.listadoEncuestasClientes;
      const colors = [
        '#ffc409',
        '#eb445a',
        '#3dc2ff',
        '#55ff9c',
        '#2fdf75',
        '#0044ff',
        '#ee55ff',
      ];

      let i = 0;
      const encuestasColors = encuestas.map(
        (_) => colors[(i = (i + 1) % colors.length)]
      );

      let listaRecomendaciones = [0, 0];
      encuestas.forEach((e) => {
        if (e.recomendarias === true) {
          listaRecomendaciones[0]++;
        } else {
          listaRecomendaciones[1]++;
        }
      });

      this.chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Si', 'No'],
          datasets: [
            {
              label: 'Humor',
              data: listaRecomendaciones,
              backgroundColor: encuestasColors,
              borderColor: ['#000'],
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          layout: {
            padding: 20,
          },
          plugins: {
            tooltip: {
              usePointStyle: true,
              borderColor: '#ffffff',
              borderWidth: 3,
              cornerRadius: 20,
              displayColors: true,
              bodyAlign: 'center',
              callbacks: {
                //@ts-ignore
                labelPointStyle: (context) => {
                  // console.log(context);
                  // context.formattedValue = '';
                  const total = encuestas.length;
                  if (context.dataIndex == 0) {
                    const totalSi = listaRecomendaciones[0];
                    const porcentajeSi = (
                      (totalSi * 100) /
                      total
                    ).toFixed(2);
                    context.label = '  ' + porcentajeSi + '% ';
                    context.formattedValue = 'Si';
                  } else {
                    const totalNo = listaRecomendaciones[1];
                    const porcentajeNo = (
                      (totalNo * 100) /
                      total
                    ).toFixed(2);
                    context.label = '  ' + porcentajeNo + '% ';
                    context.formattedValue = 'No';
                  }
                  return {
                    pointStyle: context.dataIndex,
                  };
                },
              },
            },
            legend: {
              display: false,
            },
            datalabels: {
              color: '#fff',
              anchor: 'center',
              align: 'center',
              font: {
                size: 15,
                weight: 'bold',
              },
              formatter(value, context) {
                const total = encuestas.length;
                if (context.dataIndex == 0) {
                  const totalSi = listaRecomendaciones[0];
                  const porcentajeSi = (
                    (totalSi * 100) /
                    total
                  ).toFixed(2);
                  return porcentajeSi + '% ';
                } else {
                  const totalNo = listaRecomendaciones[1];
                  const porcentajeNo = (
                    (totalNo * 100) /
                    total
                  ).toFixed(2);
                  return porcentajeNo + '% ';
                }
              },
              offset: 5,
              backgroundColor: ['#000'],
              borderColor: '#000',
              borderWidth: 1,
              borderRadius: 10,
              padding: 5,
              textShadowBlur: 5,
              textShadowColor: '#000000',
            },
          },
        },
      });
    }, 1000);
  }
  cambiarChart(numero: number) {
    this.chartActivo = numero;
    
  }

  irAEncuesta() {
    this.mostrarGraficos = false;
  }
}
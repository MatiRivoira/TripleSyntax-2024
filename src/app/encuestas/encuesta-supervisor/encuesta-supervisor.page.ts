import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { FirestoreService } from 'src/app/servicios/firestore.service';
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
// SLIDES
import { ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';

import { AuthService } from 'src/app/servicios/auth.service';

@Component({
  selector: 'app-encuesta-supervisor',
  templateUrl: './encuesta-supervisor.page.html',
  styleUrls: ['./encuesta-supervisor.page.scss'],
})
export class EncuestaSupervisorPage implements OnInit {
  @ViewChild(IonSlides) slides: IonSlides;
  respuestaEncuestaCliente: any = {};
  respuestaEncuestaEmpleado: any = {};
  encuestaCliente: boolean = false;
  encuestaEmpleado: boolean = false;
  clienteActivo: any = null;
  empleadoActivo: any = null;
  listadoClientes: any[] = [];
  listadoEmpleados: any[] = [];
  listadoEncuestasClientes: any[] = [];
  listadoEncuestasEmpleados: any[] = [];

  spinner: boolean = false;

  public forma!: FormGroup;
  public formaEmpleado!: FormGroup;

  chart: Chart;
  vistasChartsCliente: boolean = false;
  vistasChartsEmpleado: boolean = false;
  clienteTieneAlgunaEncuesta: boolean = false;
  empleadoTieneAlgunaEncuesta: boolean = false;

  constructor(
    private fb: FormBuilder,
    private firestoreService: FirestoreService,
    private router: Router,
    private toastController: ToastController,
    public authService: AuthService
  ) {
    this.forma = this.fb.group({
      humor: ['5', [Validators.required]],
      frecuencia: ['1', [Validators.required]],
      usaAplicacion: ['', [Validators.required]],
      deliverySi: ['si'],
      deliveryNo: [''],
      detalle: [''],
    });
    this.formaEmpleado = this.fb.group({
      eficiencia: ['5', [Validators.required]],
      inasistencia: ['1', [Validators.required]],
      esCompanero: ['', [Validators.required]],
      deliverySi: ['si'],
      deliveryNo: [''],
      detalle: [''],
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

  ngOnInit() {
    this.firestoreService.traerClientes().subscribe((clientes) => {
      this.listadoClientes = [];
      clientes.forEach((c: any) => {
        if (c.tipo == 'registrado') {
          this.listadoClientes.push(c);
        }
      });
      console.log('CLIENTES: ', this.listadoClientes);
    });
    this.firestoreService.traerEmpleados().subscribe((empleados) => {
      this.listadoEmpleados = empleados;
      console.log('EMPLEADOS: ', empleados);
    });
    this.firestoreService
      .traerEncuestasClientes()
      .subscribe((encuestasClientes) => {
        this.listadoEncuestasClientes = encuestasClientes;
        console.log('ENCUESTAS CLIENTES: ', this.listadoEncuestasClientes);
      });
    this.firestoreService
      .traerEncuestasEmpleados()
      .subscribe((encuestasEmpleados) => {
        this.listadoEncuestasEmpleados = encuestasEmpleados;
        console.log('ENCUESTAS EMPLEADOS: ', this.listadoEncuestasEmpleados);
      });
  }

  irAEncuestaCliente() {
    this.spinner = true;
    setTimeout(() => {
      this.encuestaCliente = true;
      this.spinner = false;
    }, 1000);
  }

  irAEncuestaEmpleado() {
    this.spinner = true;
    setTimeout(() => {
      this.encuestaEmpleado = true;
      this.spinner = false;
    }, 1000);
  }

  irAMenuEncuestas() {
    this.spinner = true;
    setTimeout(() => {
      this.spinner = false;
      this.clienteTieneAlgunaEncuesta = false;
      this.empleadoTieneAlgunaEncuesta = false;
      this.encuestaCliente = false;
      this.encuestaEmpleado = false;
      this.vistasChartsCliente = false;
      this.vistasChartsEmpleado = false;
      this.clienteActivo = null;
      this.empleadoActivo = null;
    }, 1000);
  }

  irAListadoClientes() {
    this.spinner = true;
    setTimeout(() => {
      this.clienteActivo = null;
      this.vistasChartsCliente = false;
      this.clienteTieneAlgunaEncuesta = false;
      this.spinner = false;
    }, 1000);
  }

  irAListadoEmpleados() {
    this.spinner = true;
    setTimeout(() => {
      this.empleadoActivo = null;
      this.vistasChartsEmpleado = false;
      this.empleadoTieneAlgunaEncuesta = false;
      this.spinner = false;
    }, 1000);
  }

  seleccionarDeliverySi() {
    const deliverySi = <HTMLInputElement>document.getElementById('deliverySi');
    const deliveryNo = <HTMLInputElement>document.getElementById('deliveryNo');
    if (deliverySi.checked && deliveryNo.checked) {
      deliveryNo.checked = false;
    } else if (deliverySi.checked && !deliveryNo.checked) {
      deliverySi.checked = true;
    } else if (!deliverySi.checked && !deliveryNo.checked) {
      deliverySi.checked = false;
      deliveryNo.checked = true;
    }
  }

  seleccionarDeliveryNo() {
    const deliverySi = <HTMLInputElement>document.getElementById('deliverySi');
    const deliveryNo = <HTMLInputElement>document.getElementById('deliveryNo');
    if (deliverySi.checked && deliveryNo.checked) {
      deliverySi.checked = false;
    } else if (!deliverySi.checked && deliveryNo.checked) {
      deliveryNo.checked = true;
    } else if (!deliverySi.checked && !deliveryNo.checked) {
      deliverySi.checked = true;
      deliveryNo.checked = false;
    }
  }

  mostrarEncuestaCliente(cliente: any) {
    this.spinner = true;
    setTimeout(() => {
      this.spinner = false;
      this.clienteActivo = cliente;
    }, 1000);
    console.log(cliente);
  }

  crearEncuestaCliente() {
    if (this.forma.valid) {
      const deliverySi = <HTMLInputElement>(
        document.getElementById('deliverySi')
      );
      this.respuestaEncuestaCliente.humor = this.forma.get('humor')!.value;
      this.respuestaEncuestaCliente.frecuencia =
        this.forma.get('frecuencia')!.value;
      if (this.forma.get('usaAplicacion')!.value == 'si') {
        this.respuestaEncuestaCliente.usaAplicacion = true;
      } else {
        this.respuestaEncuestaCliente.usaAplicacion = false;
      }
      if (deliverySi.checked) {
        this.respuestaEncuestaCliente.delivery = true;
      } else {
        this.respuestaEncuestaCliente.delivery = false;
      }
      this.respuestaEncuestaCliente.detalle = this.forma.get('detalle')!.value;
      this.respuestaEncuestaCliente.cliente = this.clienteActivo;

      this.spinner = true;
      this.firestoreService
        .crearEncuestaSobreClientes(this.respuestaEncuestaCliente)
        .then(() => {
          this.presentToast(
            'La encuesta fue registrada',
            'success',
            'checkmark-outline'
          );
          this.spinner = false;
          this.respuestaEncuestaCliente = {};
          this.clienteActivo = null;
        })
        .catch(() => {
          this.spinner = false;
        });
    } else {
      this.presentToast(
        'Debes completar todos los campos',
        'warning',
        'alert-circle-outline'
      );
    }
  }

  mostrarEncuestaEmpleado(empleado: any) {
    this.spinner = true;
    setTimeout(() => {
      this.spinner = false;
      this.empleadoActivo = empleado;
    }, 1000);
    console.log(empleado);
  }

  crearEncuestaEmpleado() {
    if (this.formaEmpleado.valid) {
      const deliverySi = <HTMLInputElement>(
        document.getElementById('deliverySi')
      );
      this.respuestaEncuestaEmpleado.eficiencia =
        this.formaEmpleado.get('eficiencia')!.value;
      this.respuestaEncuestaEmpleado.inasistencia =
        this.formaEmpleado.get('inasistencia')!.value;
      if (this.formaEmpleado.get('esCompanero')!.value == 'si') {
        this.respuestaEncuestaEmpleado.esCompanero = true;
      } else {
        this.respuestaEncuestaEmpleado.esCompanero = false;
      }
      if (deliverySi.checked) {
        this.respuestaEncuestaEmpleado.esLimpio = true;
      } else {
        this.respuestaEncuestaEmpleado.esLimpio = false;
      }
      this.respuestaEncuestaEmpleado.detalle =
        this.formaEmpleado.get('detalle')!.value;
      this.respuestaEncuestaEmpleado.empleado = this.empleadoActivo;

      this.spinner = true;
      this.firestoreService
        .crearEncuestaSobreEmpleados(this.respuestaEncuestaEmpleado)
        .then(() => {
          this.presentToast(
            'La encuesta fue registrada',
            'success',
            'checkmark-outline'
          );
          this.spinner = false;
          this.respuestaEncuestaEmpleado = {};
          this.empleadoActivo = null;
        })
        .catch(() => {
          this.spinner = false;
        });
    } else {
      this.presentToast(
        'Debes completar todos los campos',
        'warning',
        'alert-circle-outline'
      );
    }
  }

  async presentToast(mensaje: string, color: string, icono: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 1500,
      icon: icono,
      color: color,
    });
    await toast.present();
  }

  irASlideAdelante() {
    this.slides.getActiveIndex().then((i) => {
      this.slides.slideTo(i + 1, 500);
    });
  }

  irASlideAtras() {
    this.slides.getActiveIndex().then((i) => {
      this.slides.slideTo(i - 1, 500);
    });
  }

  cerrarSesion(){
    this.spinner = true;
    this.authService.LogOut().then(()=>{
      this.spinner = false;
    });
  }

  //******************************* CHARTS DE CLIENTES ********************************

  generarChartsCliente(cliente: any) {
    this.clienteActivo = cliente;
    const encuestas = this.listadoEncuestasClientes.filter(
      (e) => e.cliente.email == this.clienteActivo.email
    );
    this.vistasChartsCliente = true;
    if (encuestas.length) {
      this.clienteTieneAlgunaEncuesta = true;
      this.generarChartClienteHumor();
      this.generarChartClienteFrecuencia();
      this.generarChartClienteUsaAplicacion();
      this.generarChartClienteDelivery();
    }
  }

  generarChartClienteHumor() {
    this.spinner = true;
    setTimeout(() => {
      this.spinner = false;
      const ctx = (<any>document.getElementById('chartCliente1')).getContext(
        '2d'
      );

      const encuestas = this.listadoEncuestasClientes.filter(
        (e) => e.cliente.email == this.clienteActivo.email
      );

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

      let listaHumor = [0, 0, 0];
      encuestas.forEach((e) => {
        if (e.humor < 4) {
          listaHumor[0]++;
        } else if (e.humor >= 4 && e.humor < 7) {
          listaHumor[1]++;
        } else {
          listaHumor[2]++;
        }
      });

      this.chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Malo', 'Bueno', 'Muy Bueno'],
          datasets: [
            {
              label: 'Humor',
              data: listaHumor,
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
                    const totalMalo = listaHumor[0];
                    const porcentajeMalo = ((totalMalo * 100) / total).toFixed(
                      2
                    );
                    context.label = '  ' + porcentajeMalo + '% ';
                    context.formattedValue = 'Malo';
                  } else if (context.dataIndex == 1) {
                    const totalBueno = listaHumor[1];
                    const porcentajeBueno = (
                      (totalBueno * 100) /
                      total
                    ).toFixed(2);
                    context.label = '  ' + porcentajeBueno + '% ';
                    context.formattedValue = 'Bueno';
                  } else {
                    const totalMuyBueno = listaHumor[2];
                    const porcentajeMuyBueno = (
                      (totalMuyBueno * 100) /
                      total
                    ).toFixed(2);
                    context.label = '  ' + porcentajeMuyBueno + '% ';
                    context.formattedValue = 'Muy Bueno';
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
                  const totalMalo = listaHumor[0];
                  const porcentajeMalo = ((totalMalo * 100) / total).toFixed(2);
                  return porcentajeMalo + '% ';
                } else if (context.dataIndex == 1) {
                  const totalBueno = listaHumor[1];
                  const porcentajeBueno = ((totalBueno * 100) / total).toFixed(
                    2
                  );
                  return porcentajeBueno + '% ';
                } else {
                  const totalMuyBueno = listaHumor[2];
                  const porcentajeMuyBueno = (
                    (totalMuyBueno * 100) /
                    total
                  ).toFixed(2);
                  return porcentajeMuyBueno + '% ';
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

  generarChartClienteFrecuencia() {
    this.spinner = true;
    this.vistasChartsCliente = true;
    setTimeout(() => {
      this.spinner = false;
      const ctx = (<any>document.getElementById('chartCliente2')).getContext(
        '2d'
      );

      const encuestas = this.listadoEncuestasClientes.filter(
        (e) => e.cliente.email == this.clienteActivo.email
      );

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

      let listaFrecuencia = [0, 0, 0];
      encuestas.forEach((e) => {
        if (e.frecuencia == 0) {
          listaFrecuencia[0]++;
        } else if (e.frecuencia == 1) {
          listaFrecuencia[1]++;
        } else {
          listaFrecuencia[2]++;
        }
      });

      this.chart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Malo', 'Bueno', 'Muy Bueno'],
          datasets: [
            {
              label: 'Humor',
              data: listaFrecuencia,
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
                    const totalNoAMenudo = listaFrecuencia[0];
                    const porcentajeNoAMenudo = (
                      (totalNoAMenudo * 100) /
                      total
                    ).toFixed(2);
                    context.label = '  ' + porcentajeNoAMenudo + '% ';
                    context.formattedValue = 'No a menudo';
                  } else if (context.dataIndex == 1) {
                    const totalUnaVez = listaFrecuencia[1];
                    const porcentajeUnaVez = (
                      (totalUnaVez * 100) /
                      total
                    ).toFixed(2);
                    context.label = '  ' + porcentajeUnaVez + '% ';
                    context.formattedValue = 'Una vez';
                  } else {
                    const totalMasDeUnaVez = listaFrecuencia[2];
                    const porcentajeMasDeUnaVez = (
                      (totalMasDeUnaVez * 100) /
                      total
                    ).toFixed(2);
                    context.label = '  ' + porcentajeMasDeUnaVez + '% ';
                    context.formattedValue = 'Más de una vez';
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
                  const totalNoAMenudo = listaFrecuencia[0];
                  const porcentajeNoAMenudo = (
                    (totalNoAMenudo * 100) /
                    total
                  ).toFixed(2);
                  return porcentajeNoAMenudo + '% ';
                } else if (context.dataIndex == 1) {
                  const totalUnaVez = listaFrecuencia[1];
                  const porcentajeUnaVez = (
                    (totalUnaVez * 100) /
                    total
                  ).toFixed(2);
                  return porcentajeUnaVez + '% ';
                } else {
                  const totalMasDeUnaVez = listaFrecuencia[2];
                  const porcentajeMasDeUnaVez = (
                    (totalMasDeUnaVez * 100) /
                    total
                  ).toFixed(2);
                  return porcentajeMasDeUnaVez + '% ';
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

  generarChartClienteUsaAplicacion() {
    this.spinner = true;
    this.vistasChartsCliente = true;
    setTimeout(() => {
      this.spinner = false;
      const ctx = (<any>document.getElementById('chartCliente3')).getContext(
        '2d'
      );

      const encuestas = this.listadoEncuestasClientes.filter(
        (e) => e.cliente.email == this.clienteActivo.email
      );

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

      let listaUsaAplicacion = [0, 0];
      encuestas.forEach((e) => {
        if (e.usaAplicacion == false) {
          listaUsaAplicacion[0]++;
        } else {
          listaUsaAplicacion[1]++;
        }
      });

      this.chart = new Chart(ctx, {
        type: 'polarArea',
        data: {
          labels: ['No', 'Si'],
          datasets: [
            {
              label: 'Humor',
              data: listaUsaAplicacion,
              backgroundColor: encuestasColors,
              borderColor: ['#000'],
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            r: {
              pointLabels: {
                display: false,
                centerPointLabels: true,
                color: '#fff',
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
                backdropColor: '#000',
                font: {
                  family: "'Pretendard', sans-serif",
                  weight: 'bold',
                },
                z: 100,
                stepSize: 1,
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
                    const totalNo = listaUsaAplicacion[0];
                    const porcentajeNo = ((totalNo * 100) / total).toFixed(2);
                    context.label = '  ' + porcentajeNo + '% ';
                    context.formattedValue = 'No';
                  } else {
                    const totalSi = listaUsaAplicacion[1];
                    const porcentajeSi = ((totalSi * 100) / total).toFixed(2);
                    context.label = '  ' + porcentajeSi + '% ';
                    context.formattedValue = 'Si';
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
                  const totalNo = listaUsaAplicacion[0];
                  const porcentajeNo = ((totalNo * 100) / total).toFixed(2);
                  return porcentajeNo + '% ';
                } else {
                  const totalSi = listaUsaAplicacion[1];
                  const porcentajeSi = ((totalSi * 100) / total).toFixed(2);
                  return porcentajeSi + '% ';
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

  generarChartClienteDelivery() {
    this.spinner = true;
    this.vistasChartsCliente = true;
    setTimeout(() => {
      this.spinner = false;
      const ctx = (<any>document.getElementById('chartCliente4')).getContext(
        '2d'
      );

      const encuestas = this.listadoEncuestasClientes.filter(
        (e) => e.cliente.email == this.clienteActivo.email
      );

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

      let listaDelivery = [0, 0];
      encuestas.forEach((e) => {
        if (e.delivery == false) {
          listaDelivery[0]++;
        } else {
          listaDelivery[1]++;
        }
      });

      this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['No', 'Si'],
          datasets: [
            {
              label: 'Delivery',
              data: listaDelivery,
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
                    const totalNo = listaDelivery[0];
                    const porcentajeNo = ((totalNo * 100) / total).toFixed(2);
                    context.label = '  ' + porcentajeNo + '% ';
                    context.formattedValue = 'No';
                  } else {
                    const totalSi = listaDelivery[1];
                    const porcentajeSi = ((totalSi * 100) / total).toFixed(2);
                    context.label = '  ' + porcentajeSi + '% ';
                    context.formattedValue = 'Si';
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
                  const totalNo = listaDelivery[0];
                  const porcentajeNo = ((totalNo * 100) / total).toFixed(2);
                  return porcentajeNo + '% ';
                } else {
                  const totalSi = listaDelivery[1];
                  const porcentajeSi = ((totalSi * 100) / total).toFixed(2);
                  return porcentajeSi + '% ';
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

  // ***********************************************************************************

  //******************************* CHARTS DE EMPLEADOS ********************************

  generarChartsEmpleado(empleado: any) {
    this.empleadoActivo = empleado;
    const encuestas = this.listadoEncuestasEmpleados.filter(
      (e) => e.empleado.email == this.empleadoActivo.email
    );
    this.vistasChartsEmpleado = true;
    if (encuestas.length) {
      this.empleadoTieneAlgunaEncuesta = true;
      this.generarChartEmpleadoEficiencia();
      this.generarChartEmpleadoInasistencia();
      this.generarChartEmpleadoEsCompanero();
      this.generarChartEmpleadoLimpieza();
    }
  }

  generarChartEmpleadoEficiencia() {
    this.spinner = true;
    setTimeout(() => {
      this.spinner = false;
      const ctx = (<any>document.getElementById('chartEmpleado1')).getContext(
        '2d'
      );

      const encuestas = this.listadoEncuestasEmpleados.filter(
        (e) => e.empleado.email == this.empleadoActivo.email
      );

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

      let listaEficiencia = [0, 0, 0];
      encuestas.forEach((e) => {
        if (e.eficiencia < 4) {
          listaEficiencia[0]++;
        } else if (e.eficiencia >= 4 && e.eficiencia < 7) {
          listaEficiencia[1]++;
        } else {
          listaEficiencia[2]++;
        }
      });

      this.chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Mala', 'Buena', 'Muy Buena'],
          datasets: [
            {
              label: 'Eficiencia',
              data: listaEficiencia,
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
                    const totalMala = listaEficiencia[0];
                    const porcentajeMala = ((totalMala * 100) / total).toFixed(
                      2
                    );
                    context.label = '  ' + porcentajeMala + '% ';
                    context.formattedValue = 'Mala';
                  } else if (context.dataIndex == 1) {
                    const totalBuena = listaEficiencia[1];
                    const porcentajeBuena = (
                      (totalBuena * 100) /
                      total
                    ).toFixed(2);
                    context.label = '  ' + porcentajeBuena + '% ';
                    context.formattedValue = 'Buena';
                  } else {
                    const totalMuyBuena = listaEficiencia[2];
                    const porcentajeMuyBuena = (
                      (totalMuyBuena * 100) /
                      total
                    ).toFixed(2);
                    context.label = '  ' + porcentajeMuyBuena + '% ';
                    context.formattedValue = 'Muy Buena';
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
                  const totalMala = listaEficiencia[0];
                  const porcentajeMala = ((totalMala * 100) / total).toFixed(2);
                  return porcentajeMala + '% ';
                } else if (context.dataIndex == 1) {
                  const totalBuena = listaEficiencia[1];
                  const porcentajeBuena = ((totalBuena * 100) / total).toFixed(
                    2
                  );
                  return porcentajeBuena + '% ';
                } else {
                  const totalMuyBuena = listaEficiencia[2];
                  const porcentajeMuyBuena = (
                    (totalMuyBuena * 100) /
                    total
                  ).toFixed(2);
                  return porcentajeMuyBuena + '% ';
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

  generarChartEmpleadoInasistencia() {
    this.spinner = true;
    setTimeout(() => {
      this.spinner = false;
      const ctx = (<any>document.getElementById('chartEmpleado2')).getContext(
        '2d'
      );

      const encuestas = this.listadoEncuestasEmpleados.filter(
        (e) => e.empleado.email == this.empleadoActivo.email
      );

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

      let listaInasistencia = [0, 0, 0];
      encuestas.forEach((e) => {
        if (e.inasistencia == 2) {
          listaInasistencia[0]++;
        } else if (e.inasistencia == 1) {
          listaInasistencia[1]++;
        } else {
          listaInasistencia[2]++;
        }
      });

      console.log(listaInasistencia);

      this.chart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Nunca', 'Muy Poco', 'Demasiado'],
          datasets: [
            {
              label: 'Eficiencia',
              data: listaInasistencia,
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
                    const totalDemasiado = listaInasistencia[0];
                    const porcentajeDemasiado = (
                      (totalDemasiado * 100) /
                      total
                    ).toFixed(2);
                    context.label = '  ' + porcentajeDemasiado + '% ';
                    context.formattedValue = 'Demasiado';
                  } else if (context.dataIndex == 1) {
                    const totalMuyPoco = listaInasistencia[1];
                    const porcentajeMuyPoco = (
                      (totalMuyPoco * 100) /
                      total
                    ).toFixed(2);
                    context.label = '  ' + porcentajeMuyPoco + '% ';
                    context.formattedValue = 'Muy poco';
                  } else {
                    const totalNunca = listaInasistencia[2];
                    const porcentajeNunca = (
                      (totalNunca * 100) /
                      total
                    ).toFixed(2);
                    context.label = '  ' + porcentajeNunca + '% ';
                    context.formattedValue = 'Nunca';
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
                  const totalDemasiado = listaInasistencia[0];
                  const porcentajeDemasiado = (
                    (totalDemasiado * 100) /
                    total
                  ).toFixed(2);
                  return porcentajeDemasiado + '% ';
                } else if (context.dataIndex == 1) {
                  const totalMuyPoco = listaInasistencia[1];
                  const porcentajeMuyPoco = (
                    (totalMuyPoco * 100) /
                    total
                  ).toFixed(2);
                  return porcentajeMuyPoco + '% ';
                } else {
                  const totalNunca = listaInasistencia[2];
                  const porcentajeNunca = ((totalNunca * 100) / total).toFixed(
                    2
                  );
                  return porcentajeNunca + '% ';
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

  generarChartEmpleadoEsCompanero() {
    this.spinner = true;
    setTimeout(() => {
      this.spinner = false;
      const ctx = (<any>document.getElementById('chartEmpleado3')).getContext(
        '2d'
      );

      const encuestas = this.listadoEncuestasEmpleados.filter(
        (e) => e.empleado.email == this.empleadoActivo.email
      );

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

      let listaEsCompanero = [0, 0];
      encuestas.forEach((e) => {
        if (e.esCompanero == false) {
          listaEsCompanero[0]++;
        } else {
          listaEsCompanero[1]++;
        }
      });

      this.chart = new Chart(ctx, {
        type: 'polarArea',
        data: {
          labels: ['No', 'Si'],
          datasets: [
            {
              label: 'Es Compañero',
              data: listaEsCompanero,
              backgroundColor: encuestasColors,
              borderColor: ['#000'],
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            r: {
              pointLabels: {
                display: false,
                centerPointLabels: true,
                color: '#fff',
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
                backdropColor: '#000',
                font: {
                  family: "'Pretendard', sans-serif",
                  weight: 'bold',
                },
                z: 100,
                stepSize: 1,
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
                    const totalNo = listaEsCompanero[0];
                    const porcentajeNo = ((totalNo * 100) / total).toFixed(2);
                    context.label = '  ' + porcentajeNo + '% ';
                    context.formattedValue = 'No';
                  } else {
                    const totalSi = listaEsCompanero[1];
                    const porcentajeSi = ((totalSi * 100) / total).toFixed(2);
                    context.label = '  ' + porcentajeSi + '% ';
                    context.formattedValue = 'Si';
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
                  const totalNo = listaEsCompanero[0];
                  const porcentajeNo = ((totalNo * 100) / total).toFixed(2);
                  return porcentajeNo + '% ';
                } else {
                  const totalSi = listaEsCompanero[1];
                  const porcentajeSi = ((totalSi * 100) / total).toFixed(2);
                  return porcentajeSi + '% ';
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

  generarChartEmpleadoLimpieza() {
    this.spinner = true;
    setTimeout(() => {
      this.spinner = false;
      const ctx = (<any>document.getElementById('chartEmpleado4')).getContext(
        '2d'
      );

      const encuestas = this.listadoEncuestasEmpleados.filter(
        (e) => e.empleado.email == this.empleadoActivo.email
      );

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

      let listaLimpieza = [0, 0];
      encuestas.forEach((e) => {
        if (e.esLimpio == false) {
          listaLimpieza[0]++;
        } else {
          listaLimpieza[1]++;
        }
      });

      this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['No', 'Si'],
          datasets: [
            {
              label: 'Limpieza',
              data: listaLimpieza,
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
                    const totalNo = listaLimpieza[0];
                    const porcentajeNo = ((totalNo * 100) / total).toFixed(2);
                    context.label = '  ' + porcentajeNo + '% ';
                    context.formattedValue = 'No';
                  } else {
                    const totalSi = listaLimpieza[1];
                    const porcentajeSi = ((totalSi * 100) / total).toFixed(2);
                    context.label = '  ' + porcentajeSi + '% ';
                    context.formattedValue = 'Si';
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
                  const totalNo = listaLimpieza[0];
                  const porcentajeNo = ((totalNo * 100) / total).toFixed(2);
                  return porcentajeNo + '% ';
                } else {
                  const totalSi = listaLimpieza[1];
                  const porcentajeSi = ((totalSi * 100) / total).toFixed(2);
                  return porcentajeSi + '% ';
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
}

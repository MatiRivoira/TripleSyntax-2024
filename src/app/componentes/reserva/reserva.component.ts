import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/servicios/auth.service';
import { FirestoreService } from 'src/app/servicios/firestore.service';
import { NotificacionesService } from 'src/app/servicios/notificaciones.service';
import { PushService } from 'src/app/servicios/push.service';
@Component({
  selector: 'app-reserva',
  templateUrl: './reserva.component.html',
  styleUrls: ['./reserva.component.scss'],
})
export class ReservaComponent implements OnInit {

  public diaSeleccionado: any;
  public cachedImages: { [key: string]: Promise<string> } = {};
  public diasTurnos: any;
  public diaHorarios: any;
  public numeroMesa: any;
  public horaSeleccionada: string;
  tokenSupervisor: string[] = [];
  constructor(private auth: AuthService, private firebase: FirestoreService, private notificationS: NotificacionesService, private push: PushService) { }


  async pedirCitaA() {

    let clienteAux = this.auth.UsuarioActivo.value;

    if (clienteAux != null && this.horaSeleccionada) {


      let hora = this.horaSeleccionada;
     
      console.log(hora);

      const diaActual = new Date();
      // Comparar solo el año, mes y día de la fecha actual y la fecha seleccionada
      const esMismoDia = diaActual.getFullYear() === this.diaSeleccionado.getFullYear() &&
        diaActual.getMonth() === this.diaSeleccionado.getMonth() &&
        diaActual.getDate() === this.diaSeleccionado.getDate();
        const [hours, minutes] = this.horaSeleccionada.split(":").map(Number);
        this.diaSeleccionado.setHours(hours);
        this.diaSeleccionado.setMinutes(minutes);
        this.diaSeleccionado.setSeconds(0);
        let diaReserva= this.diaSeleccionado;
      const cita = {
        ...clienteAux,
        dia: diaReserva,
        horario: this.horaSeleccionada,
        estado: "sinAprobar",
        tipoLista: "reserva"
      }
      if (esMismoDia) {
        let horaActual = diaActual.getHours() + ":" + diaActual.getMinutes();

        console.log("horas completas " + horaActual)
        if (this.compararHoras(horaActual, this.horaSeleccionada)) {
          this.notificationS.presentToast('Selecione un horario de reserva posible', "danger");
        } else {
          this.notificationS.presentToast('Se ha reserva su turno ', "success");
          this.firebase.agregarAListaDeEspera(cita);
          this.enviarPushASupervisor();
        }
      } else {
        this.notificationS.presentToast('Se ha reserva su turno ', "success");
        this.firebase.agregarAListaDeEspera(cita);
        this.enviarPushASupervisor();
      }

      const opcionesFecha = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      const dia = cita.dia.toLocaleDateString('es-ES', opcionesFecha);
      //this.selecionadoDia(this.diaSeleccionado);
      console.log("hora selecionada " +this.horaSeleccionada);
     
    }
    else{
      if (this.horaSeleccionada == undefined) {
        this.notificationS.presentToast('Selecione un horario es obligatorio', "danger");
      }
      else{
        this.notificationS.presentToast("Error cliente vacio al registrar reserva.ts","danger");
      }
    }
  }

  compararHoras(horaActual: string, horaReserva: string): boolean {
    const partesHora1 = horaActual.split(':');
    const partesHora2 = horaReserva.split(':');

    const fechaActual = new Date();
    fechaActual.setHours(parseInt(partesHora1[0], 10), parseInt(partesHora1[1], 10), 0);

    const fechaReserva = new Date();
    fechaReserva.setHours(parseInt(partesHora2[0], 10), parseInt(partesHora2[1], 10), 0);

    return fechaActual.getTime() > fechaReserva.getTime();
  }

  async selecionadoDia(dia: any) {
    this.notificationS.showSpinner();
    try {
      this.diaSeleccionado = dia;
      const duracion = 40;
      let horarioDelDia = await this.divideDayIntoSegments(duracion);
      this.diaHorarios = horarioDelDia;
      console.log(this.diaHorarios);
    }
    catch {
    }
    finally {
      this.notificationS.hideSpinner();
    }
  }


  obtenerNombreDia(diaSemana: number): string {
    const dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    return dias[diaSemana];
  }
  restarFechas(listaFechas: Date[], fechasARestar: Date[]): Date[] {
    const fechasRestantes = listaFechas.filter(fecha => !fechasARestar.some(fechaARestar => fecha.getTime() === fechaARestar.getTime()));
    return fechasRestantes;
  }
  async ngOnInit(): Promise<void> {
    this.diasTurnos = this.obtenerSiguientesSieteDias();
    this.firebase.traerSupervisores().subscribe((supervisores: any) => {
      this.tokenSupervisor = supervisores.filter((supervisor) => supervisor.token !== '').map((supervisor) => supervisor.token);
      console.log('TOKENS', this.tokenSupervisor);
    });
  }

  divideDayIntoSegments(segmentDuration: number): string[] {
    const startHour = 8; // Start hour of the day
    const endHour = 19; // End hour of the day
    const segments: string[] = [];

    // Calculate the total number of segments based on the duration
    const totalSegments = Math.floor((endHour - startHour) * 60 / segmentDuration);

    // Iterate over the segments and calculate the start time for each segment
    for (let i = 0; i < totalSegments; i++) {
      const segmentStartHour = startHour + Math.floor(i * segmentDuration / 60);
      const segmentStartMinute = (i * segmentDuration) % 60;

      // Format the start time as a string with leading zeros if necessary
      const startTime = `${segmentStartHour.toString().padStart(2, '0')}:${segmentStartMinute.toString().padStart(2, '0')}`;

      // Calculate the end time by adding the segment duration to the start time
      const endTime = new Date(0, 0, 0, segmentStartHour, segmentStartMinute + segmentDuration).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      // Add the time range to the segments array
      segments.push(`${startTime} - ${endTime}`);
    }
    console.log(segments);
    return segments;
  }

  obtenerSiguientesSieteDias(): Date[] {
    const listaFechas: Date[] = [];
    const hoy = new Date();

    for (let i = 0; i < 7; i++) {
      const fecha = new Date();
      fecha.setDate(hoy.getDate() + i);
      listaFechas.push(fecha);
    }

    return listaFechas;
  }

  enviarPushASupervisor() {

    this.push
      .sendPushNotification({
        registration_ids: this.tokenSupervisor,
        notification: {
          title: 'Reserva Entreante',
          body: '¡Hay una nueva reserva cliente esperando una aprobación!',
        },
      })
      .subscribe((data) => {
        console.log(data);
      });
  }

}

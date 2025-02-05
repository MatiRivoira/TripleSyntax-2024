import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { NotificacionesService } from 'src/app/services/notificaciones.service';
import { PushService } from 'src/app/services/push.service';
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

  reservasHechas:any[] = [{hora: 0}];
  reservasAprobadas:any;

  constructor(private auth: AuthService, private firebase: FirestoreService, private notificationS: NotificacionesService, private push: PushService) { }

  async pedirCitaA() {
    if (`${this.reservasHechas[this.reservasHechas.length - 1].hora}` != this.horaSeleccionada) {
      let clienteAux = this.auth.UsuarioActivo;
      console.log("usuario act:", this.auth.UsuarioActivo);
      
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
          var diaReserva= this.diaSeleccionado;
        const cita = {
          ...clienteAux,
          dia: diaReserva,
          horario: this.horaSeleccionada,
          estado: "sinAprobar",
          tipoLista: "reserva"
        }
        if (esMismoDia) {
          var horaActual = diaActual.getHours() + ":" + diaActual.getMinutes();
  
          console.log("horas completas " + horaActual)
          if (this.compararHoras(horaActual, this.horaSeleccionada)) {
            this.notificationS.presentToast('Selecione un horario de reserva posible', "danger");
          } else {
            this.reservasHechas.push({hora: this.horaSeleccionada, fecha: this.diaSeleccionado}); 
            this.notificationS.presentToast('Se ha reserva su turno ', "success");
            this.firebase.agregarAListaDeEspera(cita);
            this.enviarPushASupervisor();
          }
        } else {
          this.reservasHechas.push({hora: this.horaSeleccionada, fecha: this.diaSeleccionado}); 
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
    } else {
      this.notificationS.presentToast('Ya pediste una reserva en ese horario', "danger");
    }
 
  }

  compararHoras(horaActual: string, horaReserva: string): boolean {
    if (horaActual == "0") {
      return true;
    }
    const partesHora1 = horaActual.split(':');
    const partesHora2 = horaReserva.split(':');

    const fechaActual = new Date();
    fechaActual.setHours(parseInt(partesHora1[0], 10), parseInt(partesHora1[1], 10), 0);

    const fechaReserva = new Date();
    fechaReserva.setHours(parseInt(partesHora2[0], 10), parseInt(partesHora2[1], 10), 0);

    return fechaActual.getTime() > fechaReserva.getTime();
  }

  async selecionadoDia(dia: any) {
    try {
      this.diaSeleccionado = dia;
      const duracion = 40;
      let horarioDelDia = await this.divideDayIntoSegments(duracion);
      this.diaHorarios = horarioDelDia;
    }
    catch {
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
    console.log("usuario act:", this.auth.UsuarioActivo);
    this.diasTurnos = this.obtenerSiguientesSieteDias();
    
    this.firebase.traerSupervisores().subscribe((supervisores: any) => {
      this.tokenSupervisor = supervisores.filter((supervisor) => supervisor.token !== '').map((supervisor) => supervisor.token);
      console.log('TOKENS', this.tokenSupervisor);
    });

    this.firebase.getDocumentsWhere("lista-de-espera", "estado", "aprobadaReserva").subscribe(res => {
      this.reservasAprobadas = res;
    })
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
    console.log(this.tokenSupervisor);
    
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

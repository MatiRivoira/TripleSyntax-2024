import { Component, OnInit } from '@angular/core';
import { element } from 'protractor';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { MesasService } from 'src/app/services/mesas.service';
import { PushService } from 'src/app/services/push.service';

@Component({
  selector: 'app-home-mestre',
  templateUrl: './home-mestre.page.html',
  styleUrls: ['./home-mestre.page.scss'],
})
export class HomeMestrePage implements OnInit {

  constructor(private pushService: PushService, public mesasSrv : MesasService, public auth:AuthService, public fire:FirestoreService) { }

  listadoClientes: any[] = [];
  mesasDisponibles: any[] = [];
  
  mesasDisponiblesReservas: any[] = [];
  mesasOcupadasPorReservasTiempo: any[] = [];

  listadoClientesReservas: any[] = [];

  ngOnInit() {
    // this.mesasSrv.desasignarCliente(1);

    // this.mesasSrv.desasignarCliente(2);

    // this.mesasSrv.desasignarCliente(3);
    
    //this.fire.BorrarCollection("lista-de-espera");
    //   this.mesasSrv.borrarDeListaEspera(
    //     {
    //         "estado": "aprobadaReserva",
    //         "horario": "20:59",
    //         "tipoLista": "reserva",
    //         "escanioQrLocal": true,
    //         "dia": {
    //             "seconds": 1722988740,
    //             "nanoseconds": 844000000
    //         },
    //         "estaEnLaLista": true,
    //         "perfil": "cliente",
    //         "id": "SFscOaJR2KPHDASqSnOOEfTu2BS2",
    //         "mesaAsignada": 1
    //     }
    // );
    this.pushService.getUser(); 
    this.mesasSrv.traerListaEspera().subscribe((clientes)=>
    {
      this.listadoClientes = clientes;
      console.log(this.listadoClientes);
      
    })

    this.mesasSrv.traerMesasDisponibles().subscribe((mesas)=>
    {
      this.mesasDisponibles = mesas;
    })
    this.mesasSrv.traerMesas().subscribe((mesas) => {
      this.mesasDisponiblesReservas = mesas.sort((mesaA: any, mesaB: any) => {
        return mesaA.numero - mesaB.numero;
      })
    })

    this.mesasSrv.traerListaEspera().subscribe((listasEsperas) => {
      this.listadoClientesReservas = listasEsperas.filter((espera: any) => {
        return (espera.tipoLista == "reserva");
      });
      console.log(this.listadoClientesReservas);
      
      this.listadoClientesReservas.forEach(unaLista => {
        const diaActual = new Date();
        const diaPedido = new Date(unaLista.dia.seconds * 1000 + unaLista.dia.nanoseconds / 1000000);
        const esMismoDia = (diaActual.getFullYear() === diaPedido.getFullYear() &&
          diaActual.getMonth() === diaPedido.getMonth() &&
          diaActual.getDate() === diaPedido.getDate());
        const diferenciaMinutos = Math.abs(diaActual.getTime() - diaPedido.getTime()) / (1000 * 60);
        const esMenorA5Min = diferenciaMinutos <= 2;

        if (esMismoDia && esMenorA5Min && unaLista.estado == "aprobadaReserva") {
          console.log("ocupe mesas de  Reservas");
          this.mesasSrv.TraerMesaPorNumero(unaLista.mesaAsignada).subscribe((mesa:any) => {
            if(unaLista.estado == "aprobadaReserva")
            {
              unaLista.estado="aprobadaConMesaAsignada";
              if(mesa[0].ocupada==false)
              {
               mesa[0].ocupada=true;
               this.asignarMesa(unaLista, mesa);
              }
            }
          });
        }
        // console.log(((diaActual.getTime() - diaPedido.getTime()) / (1000 * 60)));
        //console.log(((diaActual.getTime() - diaPedido.getTime()) / (1000 * 60)) > 1);
        // if (((diaActual.getTime() - diaPedido.getTime()) / (1000 * 60)) > 2 && unaLista.estado != "usada") {
        //   console.log("limpie Reservas ya vencidas");
        //   if (unaLista.estado == "aprobadaConMesaAsignada") {
        //     console.log("limpie aprobadaConMesaAsignada ");
        //     this.mesasSrv.TraerMesaPorNumero(unaLista.mesaAsignada).subscribe((mesa: any) => {
        //       if(mesa[0].ocupada && unaLista.estado == "aprobadaConMesaAsignada")
        //       {
        //         // mesa[0].ocupada = false;
        //         this.mesasSrv.LiberarMesa(mesa[0],unaLista).then(()=>{
        //           this.rechazarReserva(unaLista);
        //           this.listadoClientesReservas=[];
        //           unaLista={};
        //           console.log(this.listadoClientesReservas);
        //         });
        //       }
        //     })
        //   }else{
        //     if(unaLista.estado!="yaEscaneoLaMesaAsignada")
        //     {
        //       this.rechazarReserva(unaLista);
        //       this.listadoClientesReservas=[];
        //       unaLista={};
        //       console.log(this.listadoClientesReservas);
        //     }
        //   }
        // }

      });
    })
  }

  async asignarMesa(cliente:any, numeroMesa:number)
  {
    await this.mesasSrv.AsignarMesa(cliente, numeroMesa)
  }

  isLoading: boolean = false;
  cerrarSesion(){
    this.isLoading = true;
    this.auth.LogOut();
  }

  async AsignarMesaReserva(cliente: any, mesa: any) {
    console.log("Mesa de la reserva :" + JSON.stringify(mesa));
    let listadoConReserva = cliente;
    listadoConReserva.estado = "aprobadaReserva";
    console.log(listadoConReserva);
    await this.mesasSrv.AsignarMesaReserva(listadoConReserva, mesa);
  }

  rechazarReserva(listado: any) {
    this.mesasSrv.borrarDeListaEspera(listado);
  }

  mostrarMesasDisponibles(cliente: any): any {
    const clienteDiaTransformado = this.timestampDate(cliente.dia); 
  
    // Filtramos las reservas aprobadas para el día y horario del cliente y obtenemos solo las mesas asignadas
    const mesasUsadas = this.listadoClientesReservas
      .filter(reserva => {
        const reservaDiaTransformado = this.timestampDate(reserva.dia);
        return reserva.estado == "aprobadaReserva" 
               && reserva.horario == cliente.horario 
               && reservaDiaTransformado == clienteDiaTransformado;
      })
      .map(reserva => reserva.mesaAsignada); // Obtenemos solo las mesas asignadas
    
    // Filtramos las mesas disponibles, excluyendo las que ya están asignadas
    return this.mesasDisponiblesReservas.filter(element => {
      return !mesasUsadas.includes(element.numero);
    });
  }
  

  timestampDate(timestamp: any): string {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  MensajeMASIG:String = "La reserva ya tiene una mesa asignada"
  verificarTiempoEspera(cliente: any): boolean {
    if (cliente.mesaAsignada != null) {
      const ahora = new Date(); // Fecha y hora actual
  
      // Convertir el objeto 'nt' (timestamp en segundos) a un objeto Date
      const clienteDiaTimestamp = new Date(cliente.dia.seconds * 1000 + cliente.dia.nanoseconds / 1000000);
      
      // Extraer horas y minutos del horario en formato 'HH:mm'
      const [horas, minutos] = cliente.horario.split(':').map(Number);
      
      // Establecer la hora y los minutos en la fecha obtenida del timestamp
      clienteDiaTimestamp.setHours(horas, minutos, 0, 0);
      
      // Sumar 10 minutos al horario del cliente
      const clienteFechaHoraConEspera = new Date(clienteDiaTimestamp.getTime() + 3 * 60000);
      
      // Verificar si la fecha y hora del cliente (con 10 minutos de margen) es mayor que la fecha y hora actual
      if (clienteFechaHoraConEspera > ahora) {
        this.MensajeMASIG = "La reserva ya tiene una mesa asignada";
      } else {
        this.MensajeMASIG = "La reserva ya expiro";
        if (cliente.mesaAsignada != -1) {
          cliente.estado = "expirado";
          this.mesasSrv.desasignarCliente(cliente.mesaAsignada);
          cliente.mesaAsignada = -1;
          this.fire.updateDocument("lista-de-espera", cliente.uid, cliente)
        }
      }
      return true;
    }
  
    // Si no hay mesa asignada, podemos considerar que no hay tiempo de espera que verificar.
    return false;
  }
    
}

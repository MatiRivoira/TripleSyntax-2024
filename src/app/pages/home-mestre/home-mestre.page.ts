import { Component, OnInit } from '@angular/core';
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
    console.log(this.auth.UsuarioActivo);
    
    //this.fire.BorrarCollection("lista-de-espera");

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
        if (((diaActual.getTime() - diaPedido.getTime()) / (1000 * 60)) > 2 && unaLista.estado != "usada") {
          console.log("limpie Reservas ya vencidas");
          if (unaLista.estado == "aprobadaConMesaAsignada") {
            console.log("limpie aprobadaConMesaAsignada ");
            this.mesasSrv.TraerMesaPorNumero(unaLista.mesaAsignada).subscribe((mesa: any) => {
              if(mesa[0].ocupada && unaLista.estado == "aprobadaConMesaAsignada")
              {
                // mesa[0].ocupada = false;
                this.mesasSrv.LiberarMesa(mesa[0],unaLista).then(()=>{
                  this.rechazarReserva(unaLista);
                  this.listadoClientesReservas=[];
                  unaLista={};
                  console.log(this.listadoClientesReservas);
                });
              }
            })
          }else{
            if(unaLista.estado!="yaEscaneoLaMesaAsignada")
            {
              this.rechazarReserva(unaLista);
              this.listadoClientesReservas=[];
              unaLista={};
              console.log(this.listadoClientesReservas);
            }
          }
        }

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

  async AsignarMesaReserva(unaLista: any, mesa: any) {
    console.log("Mesa de la reserva :" + JSON.stringify(mesa));
    let listadoConReserva = unaLista;
    listadoConReserva.estado = "aprobadaReserva";
    await this.mesasSrv.AsignarMesaReserva(listadoConReserva, mesa);
  }

  rechazarReserva(listado: any) {
    this.mesasSrv.borrarDeListaEspera(listado);
  }
}

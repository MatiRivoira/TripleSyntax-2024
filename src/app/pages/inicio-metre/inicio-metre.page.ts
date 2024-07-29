import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/servicios/auth.service';
import { FirestoreService } from 'src/app/servicios/firestore.service';
import { MesasService } from 'src/app/servicios/mesas.service';
import { NotificacionesService } from 'src/app/servicios/notificaciones.service';
import { PushService } from 'src/app/servicios/push.service';

@Component({
  selector: 'app-home-mestre',
  templateUrl: './inicio-metre.page.html',
  styleUrls: ['./inicio-metre.page.scss'],
})
export class InicioMetrePage implements OnInit {

  constructor(private pushService: PushService,private notificacionesS: NotificacionesService, public mesasSrv: MesasService, public auth: AuthService, public fire: FirestoreService, private router: Router) { }

  listadoClientes: any[] = [];
  listadoClientesReservas: any[] = [];
  mesasDisponibles: any[] = [];
  mesasDisponiblesReservas: any[] = [];
  mesasOcupadasPorReservasTiempo: any[] = [];

  ngOnInit() {
    console.log("se llamo el oninit");
    //this.pushService.getUser();
    this.mesasSrv.traerListaEspera().subscribe((listasEsperas) => {
      console.log("entre en traer lista espera ");
      
      this.listadoClientes = listasEsperas.filter((espera: any) => {
        console.log("entre en traer lista espera interno");
        return (espera.enEspera == true && !espera.mesaAsignada);
      });
    })
    this.mesasSrv.traerListaEspera().subscribe((listasEsperas) => {
      this.listadoClientesReservas = listasEsperas.filter((espera: any) => {
        return (espera.tipoLista == "reserva");
      });
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
      console.log(this.auth.UsuarioReserva.value)
    })

    this.mesasSrv.traerMesasDisponibles().subscribe((mesas) => {
      this.mesasDisponibles = mesas.sort((mesaA: any, mesaB: any) => {
        return mesaA.numero - mesaB.numero;
      }).filter((mesa: any) => {
        return !mesa.ocupada;
      })

    })
    this.mesasSrv.traerMesas().subscribe((mesas) => {
      this.mesasDisponiblesReservas = mesas.sort((mesaA: any, mesaB: any) => {
        return mesaA.numero - mesaB.numero;
      })
    })



  }

  rechazarReserva(listado: any) {
    this.mesasSrv.borrarDeListaEspera(listado);
  }

  irASupervisor() {
    this.router.navigateByUrl("home-supervisor", { replaceUrl: true });
  }

  async asignarMesa(listado: any, mesa: any) {
    await this.mesasSrv.AsignarMesa(listado, mesa)
  }

  async asignarMesaRecorridoNormal(listado: any, mesa: any) {
    await this.mesasSrv.AsignarMesaRecorridoNormalMetre(listado, mesa)
  }
 
  async AsignarMesaReserva(unaLista: any, mesa: any) {
    console.log("Mesa de la reserva :" + JSON.stringify(mesa));
    let listadoConReserva = unaLista;
    listadoConReserva.estado = "aprobadaReserva";
    await this.mesasSrv.AsignarMesaReserva(listadoConReserva, mesa);
  }

  liberarMesa(numeroDeLaMesa)
  {
    this.mesasSrv.LiberarMesaPorNumero(numeroDeLaMesa);
  }
}

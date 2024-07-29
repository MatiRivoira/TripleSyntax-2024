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
    
    this.fire.BorrarCollection("lista-de-espera");

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

import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/servicios/auth.service';
import { FirestoreService } from 'src/app/servicios/firestore.service';
import { MesasService } from 'src/app/servicios/mesas.service';
import { PushService } from 'src/app/servicios/push.service';

@Component({
  selector: 'app-home-mestre',
  templateUrl: './home-mestre.page.html',
  styleUrls: ['./home-mestre.page.scss'],
})
export class HomeMestrePage implements OnInit {

  constructor(private pushService: PushService, public mesasSrv : MesasService, public auth:AuthService, public fire:FirestoreService) { }

  listadoClientes: any[] = [];
  mesasDisponibles: any[] = [];


  ngOnInit() {

    this.pushService.getUser(); 
    this.mesasSrv.traerListaEspera().subscribe((clientes)=>
    {
      this.listadoClientes = clientes;
    })

    this.mesasSrv.traerMesasDisponibles().subscribe((mesas)=>
    {
      this.mesasDisponibles = mesas;
      console.log(this.mesasDisponibles);
      
    })
  }

  async asignarMesa(cliente:any, numeroMesa:number)
  {
    await this.mesasSrv.AsignarMesa(cliente, numeroMesa)
  }

}

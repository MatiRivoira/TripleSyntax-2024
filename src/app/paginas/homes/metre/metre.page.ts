import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/servicios/auth.service';
import { FirebaseCloudMessagingService } from 'src/app/servicios/fcm.service';
import { FirebaseService } from 'src/app/servicios/firebase.service';

@Component({
  selector: 'app-metre',
  templateUrl: './metre.page.html',
  styleUrls: ['./metre.page.scss'],
})
export class MetrePage implements OnInit {

  listaEspera: any[] = [];
  spinner: boolean = false;
  popup: boolean = false;

  constructor(
    private auth: AuthService,
    private firestore: FirebaseService,
    private fcmService: FirebaseCloudMessagingService
  ) { }

  async ngOnInit() {
    this.firestore.obtenerColeccion('lista-espera').subscribe((data) => {
      this.listaEspera = data;
    });
    

    // Init push notifications listener
    await this.fcmService.initPush();
  }

  cerrarSesion() {
    this.popup = false;
    this.activarSpinner();
    this.auth.cerrarSesion();
  }

  activarSpinner() {
    this.spinner = true;
    setTimeout(() => {
      this.spinner = false;
    }, 2000);
  }

  sentarCliente(cliente: any) {
    if(this.listaEspera.length > 0) {
      cliente.sentado = true;
      this.firestore.actualizarClientePorId("lista-espera", cliente);
      this.activarSpinner();
    }
  }

}

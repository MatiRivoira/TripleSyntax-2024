import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/servicios/auth.service';
import { EmailService } from 'src/app/servicios/email.service';
import { FirestoreService } from 'src/app/servicios/firestore.service';
import { PushService } from 'src/app/servicios/push.service';

@Component({
  selector: 'app-home-supervisor',
  templateUrl: './home-supervisor.page.html',
  styleUrls: ['./home-supervisor.page.scss'],
})
export class HomeSupervisorPage implements OnInit {
  spinner: boolean = false;
  listadoClientes: any[] = [];

  verListaDeClientes: boolean = false;

  constructor(
    private router: Router,
    public authService: AuthService,
    private firestoreService: FirestoreService,
    private toastController: ToastController,
    private emailService: EmailService,
    private pushService: PushService
  ) {
    this.pushService.getUser();
  }

  ngOnInit() {
    this.firestoreService.traerClientes().subscribe((clientes: any) => {
      this.listadoClientes = [];
      clientes.forEach((c) => {
        if (c.tipo == 'registrado') {
          this.listadoClientes.push(c);
        }
      });
      // this.listadoClientes = clientes;
      // console.log('CLIENTES: ', clientes);
    });
  }

  irAEncuestas() {
    this.spinner = true;
    setTimeout(() => {
      this.spinner = false;
      this.router.navigate(['encuesta-supervisor']);
    }, 1000);
  }

  irAAltas() {
    this.spinner = true;
    setTimeout(() => {
      this.spinner = false;
      this.router.navigate(['menu-altas']);
    }, 1000);
  }

  irAClientes() {
    this.spinner = true;
    setTimeout(() => {
      this.spinner = false;
      this.verListaDeClientes = true;
    }, 1000);
  }

  irAHomeSupervisor() {
    this.spinner = true;
    setTimeout(() => {
      this.spinner = false;
      this.verListaDeClientes = false;
    }, 1000);
  }

  habilitarDeshabilitarCliente(cliente: any) {
    this.spinner = true;
    cliente.aprobado = !cliente.aprobado;
    this.firestoreService
      .actualizarUsuario(cliente)
      .then(() => {
        this.spinner = false;
        this.presentToast('Cliente actualizado', 'success', 'person-outline');
        if (cliente.aprobado) {
          this.emailService.enviarAvisoCuentaAprobada(cliente);
        } else {
          this.emailService.enviarAvisoCuentaDeshabilitada(cliente);
        }
      })
      .catch(() => {
        this.spinner = false;
        this.presentToast(
          'No se actualizo el cliente',
          'danger',
          'close-circle-outline'
        );
      });
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

  cerrarSesion(){
    this.spinner = true;
    this.authService.LogOut().then(()=>{
      this.spinner = false;
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/servicios/auth.service';
import { EmailService } from 'src/app/servicios/email.service';
import { FirestoreService } from 'src/app/servicios/firestore.service';
import { NotificacionesService } from 'src/app/servicios/notificaciones.service';
import { PushService } from 'src/app/servicios/push.service';

@Component({
  selector: 'app-home-supervisor',
  templateUrl: './inicio-supervisor.page.html',
  styleUrls: ['./inicio-supervisor.page.scss'],
})
export class InicioSupervisorPage implements OnInit {
  listadoClientes: any[] = [];
  clientesAprobados: any[] = [];
  clientesNoAprobados: any[] = [];
  verTodos:boolean=true;
  verHabilitados:boolean=false;
  verDeshabilitado:boolean=false;

  verListaDeClientes: boolean = false;

  constructor(
    private router: Router,
    public authService: AuthService,
    private firestoreService: FirestoreService,
    private notificacionesS: NotificacionesService,
    private emailService: EmailService,
    private pushService: PushService
  ) {
    this.pushService.getUser();
  }

  ngOnInit() {
    // this.firestoreService.traerClientes().subscribe((clientes: any) => {
    //   this.listadoClientes = [];
    //   clientes.forEach((c) => {
    //     if (c.tipo == 'registrado') {
    //       this.listadoClientes.push(c);
    //     }
    //   });
    // });
    console.log(this.authService.UsuarioReserva.value);
    this.firestoreService.traerClientes().subscribe((clientes: any) => {
    this.listadoClientes = [];
    this.clientesAprobados = [];
    this.clientesNoAprobados = [];
     
      
      clientes.forEach((c) => {
        if (c.tipo === 'registrado') {
          this.listadoClientes.push(c);
    
          if (c.aprobado) {
            this.clientesAprobados.push(c);
          } else {
            this.clientesNoAprobados.push(c);
          }
        }
      });
    
      // Utiliza los arrays clientesAprobados y clientesNoAprobados según sea necesario.
    });
  }

  irA(ruta: string) {
    this.notificacionesS.showSpinner();
    try {
      this.router.navigate([ruta]);

    } catch (error) {

    } finally {

      this.notificacionesS.hideSpinner();
    }
  }


  irAClientes() {
    this.notificacionesS.showSpinner();
    try {
      this.verListaDeClientes = true;

    } catch (error) {

    } finally {

      this.notificacionesS.hideSpinner();
    }
  }

  irAHomeSupervisor() {
    this.notificacionesS.showSpinner();
    try {
      this.verListaDeClientes = false;

    } catch (error) {

    } finally {

      this.notificacionesS.hideSpinner();
    }
  }

  verSoloClientesHabilitados(){
    this.verTodos=false;
    this.verHabilitados=true;
    this.verDeshabilitado=false;
  }

  verSoloClientesDeshabilitado(){
    this.verTodos=false;
    this.verHabilitados=false;
    this.verDeshabilitado=true;
  }

  verTodosLosClientes(){
    this.verTodos=true;
    this.verHabilitados=false;
    this.verDeshabilitado=false;
  }


  habilitarDeshabilitarCliente(cliente: any) {
    this.notificacionesS.showSpinner();
    try {
      cliente.aprobado = !cliente.aprobado;
      this.firestoreService
        .actualizarUsuario(cliente)
        .then(() => {
          this.notificacionesS.hideSpinner();
          this.notificacionesS.presentToast('Cliente actualizado', 'success', 'person-outline');
          if (cliente.aprobado) {
            this.emailService.enviarAvisoCuentaAprobada(cliente);
          } else {
            this.emailService.enviarAvisoCuentaDeshabilitada(cliente);
          }
        })
    } catch (error) {
      this.notificacionesS.hideSpinner();
      this.notificacionesS.presentToast(
        'No se actualizo el cliente',
        'danger',
        'close-circle-outline'
      );

    } finally {

      this.notificacionesS.hideSpinner();
    }


  }


  cerrarSesion() {
    this.notificacionesS.showSpinner();
    try {
      this.authService.LogOut();
    } catch (error) {

    } finally {
      this.notificacionesS.hideSpinner();
    }
  }
}

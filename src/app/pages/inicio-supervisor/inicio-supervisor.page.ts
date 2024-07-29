import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  spinnerActivo = false;
  listaClientes: any[] = [];
  popUp: any;
  formPopUp: FormGroup;
  razonesTouched: boolean = false;
  verificarCuentaCliente: boolean = false;
  clienteARechazar: any;
  popup: boolean = false;


  constructor(private firebaseServ: FirestoreService,
    private formBuilder: FormBuilder,
    private authServ: AuthService,
    private emailService: EmailService,
    private router: Router
  ) {
    this.formPopUp = this.formBuilder.group({
      razones: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(40)]]
    })
  }

  async ngOnInit() {
    this.cargarClientes();
    
  }

  ngAfterViewInit() {
    this.popUp = document.getElementById('contenedor-pop-up');

  }

  cargarClientes() {
    this.listaClientes = [];
    this.firebaseServ.traerClientes().subscribe((res) => {
      this.listaClientes = res;
       
    });
  }

  aceptarCliente(clienteAceptado: any) {
    const listaAux = this.listaClientes;
    this.listaClientes = listaAux.filter(cliente => cliente != clienteAceptado);
    this.emailService.enviarAvisoCuentaAprobada(clienteAceptado);
    this.activarSpinner();
  }

  formatDate(date:any) {
    const options:any = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('es-ES', options);
}

  activarSpinner() {
    this.spinnerActivo = true;
    setTimeout(() => {
      this.spinnerActivo = false;
    }, 2000);
  }

  accionRechazar(cliente: any) {
    this.popUp = document.getElementById('contenedor-pop-up');
    this.popUp.classList.remove("esconder");
    this.clienteARechazar = cliente;
  }

  cancelarRechazo() {
    this.popUp.classList.add("esconder");
  }

  async rechazarCliente() {
    this.razonesTouched = true;
    if (this.formPopUp.valid) {
      const listaAux = this.listaClientes;
      this.listaClientes = listaAux.filter(cliente => cliente != cliente);

      this.emailService.enviarAvisoCuentaDeshabilitada(this.clienteARechazar)

      this.cargarClientes();
      this.popUp.classList.add("esconder");
      this.razonesTouched = false;
      this.activarSpinner();
    }
  }

  isLoading: boolean = false;
  cerrarSesion(){
    this.isLoading = true;
    this.authServ.LogOut();
  }

  darDeAlta() {
      this.router.navigate(['register-mesa']);
  }
}

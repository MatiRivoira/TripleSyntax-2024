import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { EmailService } from 'src/app/services/email.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-home-supervisor',
  templateUrl: './home-supervisor.page.html',
  styleUrls: ['./home-supervisor.page.scss'],
})
export class HomeSupervisorPage implements OnInit {
  spinnerActivo = false;
  listaClientes: any[] = [];
  popUp: any;
  formPopUp: FormGroup;
  razonesTouched: boolean = false;
  verificarCuentaCliente: boolean = false;
  clienteARechazar: any;
  popup: boolean = false;
  opcion = 0;
  title = "CLIENTES EN ESPERA";


  constructor(private firebaseServ: FirestoreService,
    private formBuilder: FormBuilder,
    private authServ: AuthService,
    private emailService: EmailService,) {
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
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import * as emailjs from 'emailjs-com';
import { init } from "emailjs-com";
import { AuthService } from 'src/app/servicios/auth.service';
import { FirebaseCloudMessagingService } from 'src/app/servicios/fcm.service';
init("VO3cmQ8ZsWTmJC-fG");

@Component({
  selector: 'app-dueno-supervisor',
  templateUrl: './dueno-supervisor.page.html',
  styleUrls: ['./dueno-supervisor.page.scss'],
})
export class DuenoSupervisorPage implements OnInit {
  spinnerActivo = false;
  listaClientes: any[] = [];
  popUp: any;
  formPopUp: FormGroup;
  razonesTouched: boolean = false;
  verificarCuentaCliente: boolean = false;
  clienteARechazar: any;
  popup: boolean = false;

  constructor(private firebaseServ: FirebaseService,
    private formBuilder: FormBuilder,
    private authServ: AuthService,
    private fcmService: FirebaseCloudMessagingService) {
    this.formPopUp = this.formBuilder.group({
      razones: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(40)]]
    })
  }

  async ngOnInit() {
    this.cargarClientes();

    // Init push notifications listener
    await this.fcmService.initPush();
  }

  ngAfterViewInit() {
    this.popUp = document.getElementById('contenedor-pop-up');

  }

  cerrarSesion() {
    this.popup = false;
    this.activarSpinner();
    this.authServ.cerrarSesion();
  }

  cargarClientes() {
    this.listaClientes = [];
    this.firebaseServ.obtenerColeccion('clientes-pendientes').subscribe((res) => {
      this.listaClientes = res;
    });
  }

  aceptarCliente(clienteAceptado: any) {
    this.firebaseServ.agregarDocumento(clienteAceptado, 'usuarios-aceptados');
    this.firebaseServ.eliminarDocumento(clienteAceptado, 'clientes-pendientes');
    this.authServ.registrarUsuario(clienteAceptado);
    const listaAux = this.listaClientes;
    this.listaClientes = listaAux.filter(cliente => cliente != clienteAceptado);
    this.enviarEmail(clienteAceptado, "Fuiste aceptado. Ya podés iniciar sesión", "normal");
    this.activarSpinner();
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
      this.firebaseServ.agregarDocumento(this.clienteARechazar, 'clientes-rechazados');
      this.firebaseServ.eliminarDocumento(this.clienteARechazar, 'clientes-pendientes');
      this.firebaseServ.borrarFoto(this.clienteARechazar.rutaFoto);
      const listaAux = this.listaClientes;
      this.listaClientes = listaAux.filter(cliente => cliente != cliente);
      this.enviarEmail(this.clienteARechazar, this.formPopUp.getRawValue().razones, "normal");
      this.cargarClientes();
      this.popUp.classList.add("esconder");
      this.razonesTouched = false;
      this.activarSpinner();
    }
  }

  enviarEmail(usuario: any, mensaje: string, templateId: string) {
    const template = {
      user_email: usuario.email,
      to_name: usuario.nombre,
      message: mensaje,
      nombre_restaurante: 'Restaurante food'
    };
    emailjs.send("service", templateId, template)
      .then(res => console.log("Correo enviado.", res.status, res.text))
      .catch(error => console.log("Error al enviar", error));
  }
}

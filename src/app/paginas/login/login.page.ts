import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { log } from 'console';
import { AudioService } from 'src/app/servicios/audio.service';
import { AuthService } from 'src/app/servicios/auth.service';
import { FirebaseService } from 'src/app/servicios/firebase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  //@ts-ignore
  formLogin: FormGroup;
  emailPattern: any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  spinner: boolean = false;
  clientesPendientes: any[] = [];
  clientesRechazados: any[] = [];
  popup: boolean = false;
  mensajePopup: string = "";
  isAudioActive = false;

  email:any;
  password:any;

  constructor(private formBuilder: FormBuilder, private auth: AuthService, private firestore: FirebaseService, private audioService: AudioService) {
    this.formLogin = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
      password: ['', [Validators.required, Validators.pattern(".{6,}")]]
    });
  }

  ngOnInit() {
    this.isAudioActive = this.audioService.isActive;
  }

  ngAfterViewInit() {
    this.firestore.obtenerColeccion("clientes-pendientes").subscribe((data) => {
      this.clientesPendientes = data;
    });
    this.firestore.obtenerColeccion("clientes-rechazados").subscribe((data) => {
      this.clientesRechazados = data;
    });
  }

  verificarEmail(email: string) {
    let mensaje = "";

    this.clientesPendientes.forEach((cliente) => {
      if (cliente.email == email) {
        mensaje = "Pendiente";
      }
    });

    this.clientesRechazados.forEach((cliente) => {
      if (cliente.email == email) {
        mensaje = "Rechazado";
      }
    });

    return mensaje;
  }

  async login() {
    this.spinner = true;

    if (this.email, this.password) {
      setTimeout(async () => {

        let estado = this.verificarEmail(this.email);
        switch (estado) {
          case "":
            await this.auth.iniciarSesion(this.email, this.password).then(() => {
              console.log("¡Login exitoso!");
              this.formLogin.reset();
            })
              .catch((error) => {
                this.mensajePopup = this.auth.crearMensaje(error.code);
                this.popup = true;
              });
            break;
          case "Pendiente":
            this.mensajePopup = "Aún no se procesó tu registro.";
            this.popup = true;
            break;
          case "Rechazado":
            this.mensajePopup = "Se rechazó tu registro y no podés iniciar sesión.";
            this.popup = true;
            break;
        }

        this.spinner = false;
      }, 2000);
    }
    else {
      setTimeout(() => {
        this.spinner = false;
        this.mensajePopup = "Faltan completar campos";
        this.popup = true;
      }, 2000);
    }
  }

  insertarAccesosRapidos(perfil: string) {
    switch (perfil) {
      case "dueño":
        this.email = "duenio@duenio.com";
        this.password = "duenio";
        break;
      case "metre":
        this.email = "metre@metre.com";
        this.password = "metre1";
        break;
      case "mozo":
        this.email = "mozo1@mozos.com";
        this.password = "mozos1";
        break;
      case "cocinero":
        this.email = "cocinero@cocinero.com";
        this.password = "cocinero";
        break;
      case "bartender":
        this.email = "bartender@bartender.com";
        this.password = "bartender";
        break;
      case "cliente":
        this.email = "mgrivoira26@gmail.com";
        this.password = "quilmes";
        break;
    }
  }

  toggleSonido() {
    this.audioService.isActive = !this.audioService.isActive;
    this.isAudioActive = this.audioService.isActive;
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/servicios/auth.service';
import { NotificacionesService } from 'src/app/servicios/notificaciones.service';

@Component({
  selector: 'app-login',
  templateUrl: './iniciar-sesion.page.html',
  styleUrls: ['./iniciar-sesion.page.scss'],
})
export class IniciarSesionPage implements OnInit {
  public forma!: FormGroup;
  src_imagen = '../../../assets/img/logopng.png';
  foto: any;
  user: any = {};

  sonidoInicio: any = new Audio('../../../assets/login.mp3');
  visible: boolean = true;
  changetype: boolean = true;
  icon = "eye";

  constructor(
    public authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private notificacionesS: NotificacionesService
  ) {
    this.forma = this.fb.group({
      correo: ['', [Validators.required]],
      contrasena: ['', Validators.required],
    });
  }

  ngOnInit() {
  }

  verPass() {
    if (this.visible) {
      this.visible = !this.visible;
      this.changetype = !this.changetype;
      this.icon = "eye-off"
    }
    else {
      this.visible = !this.visible;
      this.changetype = !this.changetype;
      this.icon = "eye"
    }
  }
  ngOnDestroy() {
    this.authService.UsuarioActivo.unsubscribe();
  }
  async logIn() {
    const perfilRutas = {
      empleado: 'empleado-encuesta',
      cliente: 'home-cliente',
      registrado: 'home-cliente',
      supervisor: 'home-supervisor',
      dueño: 'home-supervisor',
      default: 'home'
    };
  
    this.notificacionesS.showSpinner();
    try {
      this.user.email = this.forma.get('correo')!.value;
      this.user.contrasena = this.forma.get('contrasena')!.value;
      let user = await this.authService.onLogin(this.user);
      if (user != null) {
        this.sonidoInicio.play();
        await new Promise((f) => setTimeout(f, 1500));
        // Handle the updated user data here
        let perfil = user.perfil;
        if (perfil === 'cliente' && !user.aprobado) {
          this.notificacionesS.presentToast('Tu cuenta debe ser aprobada', 'warning', 'alert-circle-outline');
          this.notificacionesS.vibrarError(1000);
          this.authService.LogOut();
        } else {
          this.notificacionesS.presentToast('Exito!', 'success', 'thumbs-up-outline');
          const ruta = perfilRutas[perfil] || perfilRutas.default;
          this.router.navigate([ruta]);
        }
      } else {
        this.notificacionesS.presentToast('Error! Usuario y/o contraseña incorrectos', 'danger', 'alert-circle-outline');
        this.notificacionesS.vibrarError(1000);
      }
    } catch (error) {
      this.notificacionesS.hideSpinner();
      if (error.code === 'auth/invalid-email') {
        this.notificacionesS.presentToast('Correo electrónico inválido', 'danger', 'alert-circle-outline');
      } else if (error.code === 'auth/wrong-password') {
        this.notificacionesS.presentToast('Contraseña incorrecta', 'danger', 'alert-circle-outline');
      } else {
        this.notificacionesS.presentToast(error, 'danger', 'alert-circle-outline');
      }
      this.notificacionesS.vibrarError(1000);
    } finally {
      this.notificacionesS.hideSpinner();
    }
  }
  
  

  cargarUsuarioRapido(opcion: string) {
    switch (opcion) {
      case "cliente":
        this.forma.setValue({
          correo: 'cliente@cliente.com',
          contrasena: '123456',
        });
        break;
      case "metre":
        this.forma.setValue({
          correo: 'metre@metre.com',
          contrasena: '123456',
        });
        break;
      case "dueño":
        this.forma.setValue({
          correo: 'super@super.com',
          contrasena: '123456',
        });
        break;
      case "mozo":
        this.forma.setValue({
          correo: 'mozo@mozo.com',
          contrasena: '123456',
        });
        break;

      case "cocinero":
        this.forma.setValue({
          correo: 'cocinero@cocinero.com',
          contrasena: '123456',
        });
        break;

      case "bartender":
        this.forma.setValue({
          correo: 'bar@bar.com',
          contrasena: '123456',
        });
        break;
    }
    this.notificacionesS.presentToast('Usuario cargardo!', 'primary', 'person-outline');
  }

}

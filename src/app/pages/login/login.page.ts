import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { EmailService } from 'src/app/services/email.service';
import { PushService } from 'src/app/services/push.service';
import { Vibration } from '@awesome-cordova-plugins/vibration/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public forma!: FormGroup;
  src_imagen = '../../../assets/img/logopng.png';
  foto: any;
  user: any = {};
  spinner: boolean = false;
  mostrarSpinner = false;

  sonidoInicio: any = new Audio('../../../assets/login.mp3');
  visible: boolean = true;
  changetype: boolean = true;
  icon = "eye";

  password: string = "";
  email: string = "";

  constructor(
    private loadingCtrl: LoadingController,
    public authService: AuthService,
    private fb: FormBuilder,
    private toastController: ToastController,
    private router: Router,
    private emailService: EmailService,
    private pushService: PushService,
    private vibration: Vibration
  ) {
    this.forma = this.fb.group({
      correo: ['', [Validators.required]],
      contrasena: ['', Validators.required],
    });
  }

  ngOnInit() {}

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

  async logIn() {
    this.mostrarSpinner = true;
    setTimeout(() => {
      this.mostrarSpinner = false;
    }, 4500);
    this.user.email = this.email;
    this.user.contrasena = this.password;
    const user = await this.authService.onLogin(this.user);
    if (user != null) {
      console.info('usuario encontrado: ', user);
      await new Promise((f) => setTimeout(f, 1500));
      if (this.authService.UsuarioActivo.perfil == 'empleado') {
        this.presentToast('Exito!', 'success', 'thumbs-up-outline');    
        this.sonidoInicio.play();  
        switch(this.authService.UsuarioActivo.tipo)
        {
          case "mozo":
            this.router.navigate(["home-mozo"])
            break;
    
          case "metre":
            this.router.navigate(["home-mestre"])
    
            break;
    
          case "bartender":
            this.router.navigate(["home-bartender"])
    
            break;
    
          case "cocinero":
            this.router.navigate(["home-cocinero"])
    
            break;
        }


      } else if (this.authService.UsuarioActivo.perfil == 'cliente') {
        if (this.authService.UsuarioActivo.aprobado) {
          this.router.navigate(['home-cliente']);
        } else {
          this.presentToast(
            'Tu cuenta debe ser aprobada',
            'warning',
            'alert-circle-outline'
          );
          this.vibration.vibrate(1000);
          this.authService.LogOut();
        }
      } else if (
        this.authService.UsuarioActivo.perfil == 'supervisor' ||
        this.authService.UsuarioActivo.perfil == 'dueño'
      ) {
        this.presentToast('Exito!', 'success', 'thumbs-up-outline');
        this.router.navigate(['home-supervisor']);
      } else {
        this.router.navigate(['home']);
      }
    } else {
      this.presentToast(
        'Error! Usuario y/o contraseña incorrectos',
        'danger',
        'alert-circle-outline'
      );
      this.vibration.vibrate(1000);
    }
  }

  async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Ingresando',
      spinner: 'bubbles',
      duration: 4000,
      cssClass: 'custom-loading',
    });

    loading.present();
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

  cargarUsuarioRapido(opcion: string) {
    switch (opcion) {
      case "cliente":
        this.email = 'cliente@cliente.com';
        this.password = '123456';
        break;

      case "metre":
        this.email = 'metre@metre.com'
        this.password = '123456';
        break;

      case "dueño":
        this.email = 'super@super.com';
        this.password = '123456';
        break;

      case "mozo":
        this.email =  'mozo@mozo.com';
        this.password = '123456';
        break;

      case "cocinero":
        this.email= 'cocinero@cocinero.com';
        this.password = '123456';
        break;

      case "bartender":
        this.email = 'bar@bar.com';
        this.password = '123456';
        break;
    }
  }

  cargarEmpleadoRapido(event: any) {
    const tipoEmpleado = event.target.value;
    switch (tipoEmpleado) {
      case 'Metre':
        this.forma.setValue({
          correo: 'JuanMaria@gmail.com',
          contrasena: '123456',
        });
        break;
      case 'Mozo':
        this.forma.setValue({
          correo: 'MarianoGOmez@gmail.com',
          contrasena: '123456',
        });
        break;
      case 'Cocinero':
        this.forma.setValue({
          correo: 'Josefina@gmail.com',
          contrasena: '123456',
        });
        break;
      case 'Bartender':
        this.forma.setValue({
          correo: 'mairaGomez@gmail.com',
          contrasena: '123456',
        });
        break;
    }
    this.presentToast('Usuario cargardo!', 'primary', 'person-outline');
  }

  probarEmailService() {
    const usuario = {
      nombre: 'Emmanuel Zelarayán',
      email: 'emmaysole@gmail.com',
    };
    this.emailService.enviarAvisoPendienteAprobacion(usuario);
  }

  probarPushService() {
    this.pushService
      .sendPushNotification({
        // eslint-disable-next-line @typescript-eslint/naming-convention
        registration_ids: [
          // eslint-disable-next-line max-len
          'd8vo-BAnRF2wJAAmLAs5Ne:APA91bG3-wJPR1DM6TZk0s4SKXhAiZ9y3o0Db2FvOVPibDekBzcUNdmSGL-XHJ1mGdhGFEejVtfrVdOJsf0hVwoAZvc-rvpJr27jlnEYSt24cJwpeDL3TEMVZ9Tr5eW-pHtKV88x6FuR',
          'dUN2Z10WQ9OnERV3THTOOb:APA91bGrhYomoYExJZrG_oQe9DaNUS_OIy54xVaqswTRFfVfrwfRveqFuLaC6A3JIcTPvgq7GEeMStbLDv2Hl9NGNsYTUWviOSkDpbjUwOsSrTYcN35nPMphX0Ffr9ADTWA9TxzvK2ho',
        ],
        notification: {
          title: 'Prueba con token supervisor.',
          body: 'Le tiene que llegar solo a un supervisor',
        },
      })
      .subscribe((data) => {
        console.log(data);
      });
  }
}

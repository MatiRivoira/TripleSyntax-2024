import { Injectable, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getDownloadURL, getStorage, ref, uploadString } from 'firebase/storage';
import { Router } from '@angular/router';
import { EmailService } from './email.service';
import { NotificacionesService } from './notificaciones.service';
import { PushNotifications, Token } from '@capacitor/push-notifications';
import { BehaviorSubject } from 'rxjs';
import { Capacitor } from '@capacitor/core';
import { first } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class AuthService  implements OnInit{
  constructor(
    public afAuth: AngularFireAuth,
    public afs: AngularFirestore,
    private router: Router,
    private emailService: EmailService,
    private notificationesS: NotificacionesService,
  ) {
   
  }
  ngOnInit(): void {
     // Mover la creación del listener aquí
   
  }

  agregarListener(){
    if (Capacitor.getPlatform() === 'android' && !this.conListener ) {
      PushNotifications.addListener('registration', (token: Token) => {
        this.registracionListenerToken = token;
        this.conListener=true;
      });
    }
  }

  UsuarioActivo: BehaviorSubject<any> = new BehaviorSubject(null);
  UsuarioReserva: BehaviorSubject<any> = new BehaviorSubject(null);
  registracionListenerToken: any = "";
  usuarioAnonimo: any = null;
  uidUser = '';
  sonidoCerrar: any = new Audio('../../assets/logout.mp3');
  conListener=false;

  async onRegister(user: any, subioFoto: boolean) {
    try {
      if (user && subioFoto) {
        user.foto = await this.subirArchivosString(user.foto);
      }
      await this.afAuth
        .createUserWithEmailAndPassword(user.email, user.contrasena)
        .then(async (cred) => {
          user.uid = cred.user.uid;
          user.token = '';
          await this.afs.collection('usuarios').doc(cred.user.uid).set(user);
          if (user && user?.perfil == 'cliente' && user?.tipo == 'registrado') {
            this.emailService.enviarAvisoPendienteAprobacion(user);
          }
        });

      return true;
    } catch (error) {
      console.error(error);

      this.notificationesS.presentToast(
        'Error! Hubo un error',
        'danger',
        'alert-circle-outline'
      );
      this.notificationesS.vibrarError(1000);

      return false;
    }
  }

  async onRegisterAnonimo(user: any, subioFoto: boolean) {
    let id = new Date().getTime().toString();
    user.uid = id;
    try {
      if (subioFoto) {
        user.foto = await this.subirArchivosString(user.foto);
      }

      await this.afs.collection('usuarios').doc(id).set(user);
      this.usuarioAnonimo = user;
      this.UsuarioActivo.next(user);
      return true;
    } catch (error) {
      this.notificationesS.presentToast(
        'Error! Hubo un error',
        'danger',
        'alert-circle-outline'
      );
      this.notificationesS.vibrarError(1000);

      return false;
    }
  }

  async subirArchivosString(foto: any): Promise<string> {
    var url: string = null;
    const storage = getStorage();

    const storageRef = await ref(
      storage,
      `imagenes/${this.formatDate(
        new Date().getHours() +
        ':' +
        new Date().getMinutes() +
        ':' +
        new Date().getSeconds()
      )}`
    );
    await uploadString(storageRef, foto, 'data_url').then(async (snapshot) => {
      await getDownloadURL(storageRef).then((downloadUrl) => {
        url = downloadUrl;
      });
    });
    return url;
  }

  async ChequearEmail(email: string): Promise<boolean> {
    let flag = false;
    await this.afAuth.fetchSignInMethodsForEmail(email).then((result) => {
      if (result.length != 0) {
        flag = true;
      }
    });
    return flag;
  }


  async onLogin(user: any) {
    let retorno: any;
    await this.afAuth
      .signInWithEmailAndPassword(user.email, user.contrasena)
      .then(async (ret) => {
        this.uidUser = ret.user.uid;
        retorno = ret;

        if (ret) {
          await this.afs
            .collection('usuarios')
            .doc(this.uidUser)
            .get()
            .toPromise()
            .then(async (doc) => {
              retorno = await this.afs
                .collection('usuarios')
                .doc(this.uidUser)
                .valueChanges()
                .pipe(first())
                .toPromise();
              this.UsuarioActivo.next(retorno);
              if(retorno.perfil=="supervisor" || retorno.tipo=="metre"){
                this.UsuarioReserva.next(retorno);
              }
              console.log("obtuve al usuario auth :" + JSON.stringify(retorno))
            });
        } else {
          retorno = null;
        }

        // Only execute push notification code on Android
        if (Capacitor.getPlatform() === 'android') {
          // Solicita permiso para recibir notificaciones y registra las notificaciones push
          let permStatus = await PushNotifications.checkPermissions();
          if (permStatus.receive === 'prompt') {
            permStatus = await PushNotifications.requestPermissions();
          }
          if (permStatus.receive !== 'granted') {
            throw new Error('User denied permissions!');
          }
          await PushNotifications.register();

          // Añade un listener para el evento 'registration'
          // Este evento se dispara cuando el registro de notificaciones push se completa sin problemas
          let usuarioConToken: any;

          usuarioConToken = {
            ...retorno,
            token: this.registracionListenerToken.value
          }
          this.afs
            .collection('usuarios')
            .doc(this.uidUser)
            .set(usuarioConToken);
          retorno = usuarioConToken;
        }


      })
      .catch((error) => {
        console.log(error);
        return null;
      });

    return retorno;
  }


  async LogOut() {
    this.notificationesS.showSpinner();
    try {
      await this.removeAllListeners();
      if (this.UsuarioActivo.value && this.UsuarioActivo.value.token) {
        this.UsuarioActivo.value.token = '';
      }
      const aux: any = await this.UsuarioActivo.value;

      console.log("token no se vacia :" + aux.token);
      this.afs
        .collection('usuarios')
        .doc(aux.uid)
        .set(aux)
        .then(() => {

          this.sonidoCerrar.play();
          this.router.navigate(['login']);
        })
      console.log("logOut : " + JSON.stringify(aux));
      if (aux.tipo == "anonimo") {
        this.sonidoCerrar.play();
        this.router.navigate(['login']);
      }

    }
    catch (error) {
    } finally {
      this.notificationesS.hideSpinner();
    }
  }

  
  formatDate = (date: any) => {
    return date.toLocaleString();
  };

  async removeAllListeners() {
    if (Capacitor.getPlatform() === 'android') {
      await PushNotifications.removeAllListeners();
    }
  }
}


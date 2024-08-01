import { getFirestore } from '@angular/fire/firestore';
import { Injectable, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestoreCollection,
  AngularFirestore,
} from '@angular/fire/compat/firestore';
import {
  FirebaseStorage,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
  uploadString,
} from 'firebase/storage';
import { Router } from '@angular/router';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import * as firebase from 'firebase/compat';
import { ToastController } from '@ionic/angular';
import { EmailService } from './email.service';
import { FirestoreService } from './firestore.service';
import { Vibration } from '@awesome-cordova-plugins/vibration/ngx';

// PUSH
import {
  ActionPerformed,
  PushNotifications,
  PushNotificationSchema,
  Token,
} from '@capacitor/push-notifications';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    public afAuth: AngularFireAuth,
    public afs: AngularFirestore,
    private router: Router,
    private toastController: ToastController,
    private emailService: EmailService,
    private firestoreSevice: FirestoreService,
    private vibration: Vibration
  ) {
    afAuth.authState.subscribe((user) => (this.isLogged = user));
  }

  public isLogged: any = false;
  UsuarioActivo: any;
  usuarioAnonimo: any = null;
  uidUser = '';
  sonidoCerrar: any = new Audio('../../assets/logout.mp3');

  

  async onRegister(user: any, subioFoto: boolean) {
    try {
      if (subioFoto) {
        user.foto = await this.subirArchivosString(user.foto);
      }
      await this.afAuth
        .createUserWithEmailAndPassword(user.email, user.contrasena)
        .then(async (cred) => {
          user.uid = cred.user.uid;
          user.token = '';
          await this.afs.collection('usuarios').doc(cred.user.uid).set(user);
          if (user.perfil == 'cliente' && user.tipo == 'registrado') {
            this.emailService.enviarAvisoPendienteAprobacion(user);
          }
        });

      return true;
    } catch (error) {
      console.log('Error en register', error);
      this.presentToast(
        'Error! Hubo un error',
        'danger',
        'alert-circle-outline'
      );
      this.vibration.vibrate(1000);

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
      this.UsuarioActivo = user;
      this.usuarioAnonimo = user;
      return true;
    } catch (error) {
      console.log('Error en register', error);
      this.presentToast(
        'Error! Hubo un error',
        'danger',
        'alert-circle-outline'
      );
      this.vibration.vibrate(1000);

      return false;
    }
  }

  async onLogin(user: any) {
    var retorno: any;
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
              await this.afs
                .collection('usuarios')
                .doc(this.uidUser)
                .valueChanges()
                .subscribe((usuario) => {
                  this.UsuarioActivo = usuario;
                });
            });
        } else {
          retorno = null;
        }
      })
      .catch(() =>{
        return null;
      });

    return retorno;
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

  async LogOut() {
    try {
      this.afAuth.signOut().then(() => {
        setTimeout(() => {
          console.log("Sesión cerrada exitosamente.");
          this.sonidoCerrar.play();
          this.router.navigate(['/login']);
        }, 2000);
      });
    } catch (error: any) {
      console.log(error.message);
    }
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

  formatDate = (date: any) => {
    return date.toLocaleString();
  };

  async removeAllListeners() {
    await PushNotifications.removeAllListeners();
  }
}

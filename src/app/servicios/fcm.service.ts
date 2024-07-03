import { Injectable, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import {
  PushNotifications,
  Token,
  PushNotificationSchema,
  ActionPerformed
} from '@capacitor/push-notifications';
import { AuthService } from './auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';

import { getMessaging, getToken } from "firebase/messaging";
import { FirebaseService } from './firebase.service';
import { collection, deleteField, getDocs } from 'firebase/firestore';

import { LocalNotifications } from '@capacitor/local-notifications';
import { environment } from 'src/environments/environment';
import { resolve } from 'dns';
import { Firestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseCloudMessagingService {

  constructor(
    private router: Router,
    private angularFirestore: AngularFirestore,
    private authService: AuthService,
    private firestore: FirebaseService,
    private firestore2: Firestore,
    private http: HttpClient
  ) { }

  public async initPush() {
    if (Capacitor.getPlatform() !== 'web') {
      this.registerPush();
    }
  }

  sendPushNotification(body: any): Observable<any> {

    // return this.http.post<Observable<any>>('https://fcm.googleapis.com/v1/projects/bianluca-pps/messages:send', body, {
    //   headers: {
    //     // Authorization: `Bearer ${getAccessToken()}`,
    //     Authorization: `Bearer ya29.c.b0Aaekm1IjfCNS3BKkizv96Ddrh3MR-cBP5PEhg2BnOtOB9TQXGGrL-oQn8E-N8-uz0lVQrHqmev1Ar8Bca1TDQya87yo-5JYc0gZmZfJv63Ccsa_7BGdwtYNS0JWmB0-s-vqBr6uc_6tRqsPWqvfAH-Hx2N-t4Jj2xE254GT3crzwgaFh8pEIlunYsTMhWJH15z9QCKVlmbPBafHMIn2XbLd5I1SmgdacHuNeFhzl3oIu2WE4prlAff0NEOr3MNbb9Fcc9rdLK2kPIBdr1Oo0a9rm3I8IZMUWx476LyKDXW7U81MPAnrrihgkeiua79qNriZhfcjVvQT339A6F-pmmyzpm_i-fVkxsiQQnBmXlr-7l_XM-lmop7VtSIlWvllipJt9QteqsdFpUU9m_QO6Z866fsJhV7QBljRMXRzlouk0q4Yaygcn24Xjhft1euZk3ISYmUjf4vSIyXkaVfi2dS-SRlWysX0qIvsYaaMIzf1cyJBjzFMBW850ymMr-hYM5ZriYvyX5zJbV1_pQ53Z-Xy12xv6tqWXqZOt3oawqS356ntjuWzjebjvvF5mq6f6rQ3rI36Zmo0nWnmao2fowibeabX7yYcyJin85Fn8QUI8eQFwVoQfZq8oBqubqSU7X0s64qOQyXvROexw9rkUlRkXcnwJVhJSpmZzstX898izVY1Ime30Uyyk4M6O18SSaidUB7QOQoYM46S0Vjc0XIh-FS3t39l7Y1UVO8s36rm_lBjScvtq7g802hxM3J932jyVeO9Q9_rcucQ4s4WrBhxb5lS_br6p-Sh2tdouv6BtsI1Rm1sa9bikipspcu06_W2W_0Yx7ouQyZ39og8qlgcOlUS8IkhFOwRnjqrrm1a-oR5_gz0QWgZ17iQ-9_OqQyXWUVX-kis7RRW4J25R8qW-kdsv2bW34dcgVzXhRYa-1f6b8w1feJ2Rk3lFj-tw__c1jiyg-gOBBoOyVQncO541caeJx7td7iuwcQ3ZolMF0zzzi5e9X_3`,
    //     'Content-Type': 'application/json',
    //   },
    // });

    return this.http.post<Observable<any>>('https://fcm.googleapis.com/fcm/send', body, {
      headers: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Authorization: "key=AAAAHLQlBJw:APA91bG_8qHdJPv03YZj6kKCVhzubhVBOVz-VwHt9YPbEraMbnCHIAEsFxXNIF2dvQq6b5zFfwg9T05YhPbiR0Xn-H0ZPx9_t1167W9YP63LlJOpVuBMs6BC-ZjwJGz2k9q7avPE2GKj",

        // eslint-disable-next-line @typescript-eslint/naming-convention
        'Content-Type': 'application/json',
      },
    });
  }

  async sendCocineroPushNotification() {
    const querySnapshot = await getDocs(collection(this.firestore2, 'usuarios-aceptados'));
    let tokens: any[] = [];
    querySnapshot.forEach(async (doc) => {
      const usuario = doc.data();
      if (usuario['perfil'] === 'cocinero' && usuario['fcmToken']) {
        tokens.push(usuario['fcmToken']);
      }
    });

    const body = {
      registration_ids: tokens,
      notification: {
        body: 'Hay un pedido para preparar',
        title: 'Nuevo pedido'
      }
    }

    this.sendPushNotification(body).subscribe(
      response => {
        console.log('Exito', response);
      },
      error => {
        console.error('Error', error);
      }
    );
  }

  async sendBartenderPushNotification() {
    const querySnapshot = await getDocs(collection(this.firestore2, 'usuarios-aceptados'));
    let tokens: any[] = [];
    querySnapshot.forEach(async (doc) => {
      const usuario = doc.data();
      if (usuario['perfil'] === 'bartender' && usuario['fcmToken']) {
        tokens.push(usuario['fcmToken']);
      }
    });

    const body = {
      registration_ids: tokens,
      notification: {
        body: 'Hay bebidas para preparar',
        title: 'Nuevo pedido'
      }
    }

    this.sendPushNotification(body).subscribe(
      response => {
        console.log('Exito', response);
      },
      error => {
        console.error('Error', error);
      }
    );
  }

  async sendPedirCuentaNotification() {
    const querySnapshot = await getDocs(collection(this.firestore2, 'usuarios-aceptados'));
    let tokens: any[] = [];
    querySnapshot.forEach(async (doc) => {
      const usuario = doc.data();
      if (usuario['perfil'] === 'mozo' && usuario['fcmToken']) {
        tokens.push(usuario['fcmToken']);
      }
    });

    const body = {
      registration_ids: tokens,
      notification: {
        body: 'El cliente esta pidiendo la cuenta',
        title: 'Pedido de cuenta'
      }
    }

    this.sendPushNotification(body).subscribe(
      response => {
        console.log('Exito', response);
      },
      error => {
        console.error('Error', error);
      }
    );
  }

  async pedidoListoPushNotification() {
    const querySnapshot = await getDocs(collection(this.firestore2, 'usuarios-aceptados'));
    let tokens: any[] = [];
    querySnapshot.forEach(async (doc) => {
      const usuario = doc.data();
      if (usuario['perfil'] === 'mozo' && usuario['fcmToken']) {
        tokens.push(usuario['fcmToken']);
      }
    });

    const body = {
      registration_ids: tokens,
      notification: {
        body: 'Hay un pedido listo para entregar al cliente',
        title: 'Pedido listo'
      }
    }

    this.sendPushNotification(body).subscribe(
      response => {
        console.log('Exito', response);
      },
      error => {
        console.error('Error', error);
      }
    );
  }

  async nuevoPedidoPushNotification() {
    const querySnapshot = await getDocs(collection(this.firestore2, 'usuarios-aceptados'));
    let tokens: any[] = [];
    querySnapshot.forEach(async (doc) => {
      const usuario = doc.data();
      if (usuario['perfil'] === 'mozo' && usuario['fcmToken']) {
        tokens.push(usuario['fcmToken']);
      }
    });

    const body = {
      registration_ids: tokens,
      notification: {
        body: 'Un cliente ha realizado un pedido',
        title: 'Nuevo pedido'
      }
    }

    this.sendPushNotification(body).subscribe(
      response => {
        console.log('Exito', response);
      },
      error => {
        console.error('Error', error);
      }
    );
  }

  async nuevoMensajePushNotification(nombreUsuario: string, mensaje: string, dirigidoA: string) {
    const querySnapshot = await getDocs(collection(this.firestore2, 'usuarios-aceptados'));
    let tokens: any[] = [];
    querySnapshot.forEach(async (doc) => {
      const usuario = doc.data();
      if (dirigidoA === 'mozo') {
        if (usuario['perfil'] === 'mozo' && usuario['fcmToken']) {
          tokens.push(usuario['fcmToken']);
        }
      }
      else {
        if ((usuario['perfil'] === 'cliente' || usuario['perfil'] === 'anónimo') && usuario['fcmToken']) {
          tokens.push(usuario['fcmToken']);
        }
      }
    });

    const body = {
      registration_ids: tokens,
      notification: {
        body: mensaje,
        title: 'Mensaje de: ' + nombreUsuario
      }
    }

    this.sendPushNotification(body).subscribe(
      response => {
        console.log('Exito', response);
      },
      error => {
        console.error('Error', error);
      }
    );
  }

  async clienteEnListaDeEsperaPushNotification() {
    const querySnapshot = await getDocs(collection(this.firestore2, 'usuarios-aceptados'));
    let tokens: any[] = [];
    querySnapshot.forEach(async (doc) => {
      const usuario = doc.data();
      if (usuario['perfil'] === 'metre' && usuario['fcmToken']) {
        tokens.push(usuario['fcmToken']);
      }
    });

    const body = {
      registration_ids: tokens,
      notification: {
        body: 'Un cliente está esperando una mesa',
        title: 'Lista de espera'
      }
    }

    this.sendPushNotification(body).subscribe(
      response => {
        console.log('Exito', response);
      },
      error => {
        console.error('Error', error);
      }
    );
  }

  async nuevoClientePushNotification() {
    const querySnapshot = await getDocs(collection(this.firestore2, 'usuarios-aceptados'));
    let tokens: any[] = [];
    querySnapshot.forEach(async (doc) => {
      const usuario = doc.data();
      if ((usuario['perfil'] === 'dueño' || usuario['perfil'] === 'supervisor') && usuario['fcmToken']) {
        tokens.push(usuario['fcmToken']);
      }
    });

    const body = {
      registration_ids: tokens,
      notification: {
        body: 'Un nuevo cliente está esperando aprobación',
        title: 'Hay un nuevo cliente'
      }
    }

    this.sendPushNotification(body).subscribe(
      response => {
        console.log('Exito', response);
      },
      error => {
        console.error('Error', error);
      }
    );
  }

  async deleteUsersWithToken(token: string, uid: string) {
    // borro los campos token de los usuarios con el mismo token recién ingresado

    const querySnapshot = await getDocs(collection(this.firestore2, 'usuarios-aceptados'));
    querySnapshot.forEach(async (doc) => {
      const usuario = doc.data();
      if (usuario['id'] !== uid && usuario['fcmToken'] && usuario['fcmToken'] === token) {
        const userRef = await this.angularFirestore.collection('usuarios-aceptados').doc(usuario!['id']);
        await userRef.update({
          fcmToken: deleteField()
        });
      }
    });
  }

  private registerPush() {

    // Request permission to use push notifications
    // iOS will prompt user and return if they granted permission or not
    // Android will just grant without prompting
    PushNotifications.requestPermissions().then(result => {
      if (result.receive === 'granted') {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        // Show some error
      }
    });

    // On success, we should be able to receive notifications
    PushNotifications.addListener('registration',
      async (token: Token) => {
        // alert('Push registration success, token: ' + token.value);

        // guardar el token del dispositivo del usuario
        try {
          const correoUsuario = this.authService.obtenerEmailUsuarioLogueado();
          if (correoUsuario) {
            const usuario = await this.authService.obtenerUsuarioPorEmail2(correoUsuario);
            const userRef = await this.angularFirestore.collection('usuarios-aceptados').doc(usuario!['id']);
            await userRef.update({
              fcmToken: token.value
            });

            this.deleteUsersWithToken(token.value, usuario!['id']);
          }
        }
        catch (e: any) {
          alert(e.message);
        }

      }
    );

    // Some issue with our setup and push will not work
    PushNotifications.addListener('registrationError',
      (error: any) => {
        alert('Error on registration: ' + JSON.stringify(error));
      }
    );

    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener('pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        // alert('Push received: ' + JSON.stringify(notification));
        console.log('Push received: ' + JSON.stringify(notification));

        LocalNotifications.schedule({
          notifications: [
            {
              title: notification.title || '',
              body: notification.body || '',
              id: new Date().getMilliseconds(),
              extra: {
                data: notification.data,
              },
              schedule: { at: new Date(Date.now() + 1000 * 5) },
            },
          ],
        });
      }
    );

    // Method called when tapping on a notification
    PushNotifications.addListener('pushNotificationActionPerformed',
      async (notification: ActionPerformed) => {
        const data = notification.notification.data;
        console.log('Action performed: ' + JSON.stringify(notification.notification));
        if (data.redirectUrl) {
          this.router.navigateByUrl(`/${data.redirectUrl}`);
        }
      }
    );
  }
}

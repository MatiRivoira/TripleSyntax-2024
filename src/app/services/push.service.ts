import { Injectable } from '@angular/core';
import {
  ActionPerformed,
  PushNotifications,
  PushNotificationSchema,
  Token,
} from '@capacitor/push-notifications';
import { Platform } from '@ionic/angular';
import { Firestore, doc, docData, updateDoc } from '@angular/fire/firestore';
import { LocalNotifications } from '@capacitor/local-notifications';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { FirestoreService } from './firestore.service';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class PushService {
  private user;

  constructor(
    private fs: FirestoreService,
    private authS: AuthService,
    private router: Router,
    private platform: Platform,
    private http: HttpClient,
    public afs: AngularFirestore
  ) {}

  async inicializar(): Promise<void> {
    this.addListeners();
    // Verificamos que este en un dispositivo y no en una PC y tambien que el usuario no tegna seteado el token
    if (this.platform.is('capacitor') && this.user.token === '') {
      const result = await PushNotifications.requestPermissions();
      if (result.receive === 'granted') {
        await PushNotifications.register();
      }
    }
  }

  getUser(): void {
    this.afs
      .collection('usuarios')
      .doc(this.authS.UsuarioActivo.uid)
      .valueChanges()
      .subscribe((usuario) => {
        this.user = usuario;
        // console.log(this.user);
        // this.inicializar();
      });
    setTimeout(() => {
      this.inicializar();
    }, 3000);
    // const aux = doc(this.firestore, `usuarios/${this.authS.UsuarioActivo.uid}`);
    // docData(aux, { idField: 'id' }).subscribe(async (user) => {
    //   this.user = user;
    //   console.log(this.user);
    //   this.inicializar();
    // });
  }

  sendPushNotification(req): Observable<any> {
    console.log('push notification');
    return this.http.post<Observable<any>>(environment.fcmUrl, req, {
      headers: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Authorization: `key=${environment.fcmServerKey}`,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'Content-Type': 'application/json',
      },
    });
  }

  private async addListeners(): Promise<void> {
    //Ocurre cuando el registro de las push notifications finaliza sin errores
    await PushNotifications.addListener(
      'registration',
      async (token: Token) => {
        //AcÃ¡ deberiamos asociar el token a nuestro usario en nuestra bd
        console.log('Registration token: ', token.value);
        this.user.token = token.value;
        this.fs.actualizarUsuario(this.user);
      }
    );

    //Ocurre cuando el registro de las push notifications finaliza con errores
    await PushNotifications.addListener('registrationError', (err) => {
      console.error('Registration error: ', err.error);
    });

    //Ocurre cuando el dispositivo recibe una notificacion push
    await PushNotifications.addListener(
      'pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        //Este evento solo se activa cuando tenemos la app en primer plano
        console.log('Push notification received: ', notification);
        console.log('data: ', notification.data);
        //Esto se hace en el caso de que querramos que nos aparezca la notificacion en la task bar del celular ya que por
        //defecto las push en primer plano no lo hacen, de no ser necesario esto se puede sacar.
        LocalNotifications.schedule({
          notifications: [
            {
              title: notification.title || '',
              body: notification.body || '',
              id: new Date().getMilliseconds(),
              extra: {
                data: notification.data,
              },
            },
          ],
        });
      }
    );

    //Ocurre cuando se realiza una accion sobre la notificacion push
    await PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        //Este evento solo se activa cuando tenemos la app en segundo plano y presionamos sobre la notificacion
        console.log(
          'Push notification action performed',
          notification.actionId,
          notification.notification
        );
      }
    );

    //Ocurre cuando se realiza una accion sobre la notificacion local
    await LocalNotifications.addListener(
      'localNotificationActionPerformed',
      (notificationAction) => {
        console.log('action local notification', notificationAction);
      }
    );
  }
}
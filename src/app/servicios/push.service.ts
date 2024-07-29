import { Injectable } from '@angular/core';
import { ActionPerformed, PushNotifications, PushNotificationSchema, Token } from '@capacitor/push-notifications';
import { Platform } from '@ionic/angular';
import { LocalNotifications } from '@capacitor/local-notifications';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class PushService {
  private user;
  public registracionListenerToken: any = "";
  public listenerAgregados=false;

  constructor(
    private authS: AuthService,
    private platform: Platform,
    private http: HttpClient,
    public afs: AngularFirestore
  ) {
    
   }

  async inicializar(): Promise<void> {
    try {
      if (!this.listenerAgregados &&this.platform.is('capacitor') && this.user.token === '') {
        this.listenerAgregados=true;
        this.addListeners();
        const result = await PushNotifications.requestPermissions();
        if (result.receive === 'granted') {
          await PushNotifications.register();
        }
      }

    } catch (error) {

    }
  }
  getUser(): void {
    try {
      this.afs
        .collection('usuarios')
        .doc(this.authS.UsuarioActivo.value.uid) // Access the value inside the BehaviorSubject
        .valueChanges()
        .subscribe((usuario) => {
          this.user = usuario;
          this.inicializar();
        });

    } catch (error) {

    }
  }

  sendPushNotification(req): Observable<any> {
    try {
      return this.http.post<Observable<any>>(environment.fcmUrl, req, {
        headers: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          Authorization: `key=${environment.fcmServerKey}`,
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'Content-Type': 'application/json',
        },
      });

    } catch (error) {

    }
  }



  private async addListeners(): Promise<void> {
    try {

      await PushNotifications.addListener('registrationError', (err) => {
        console.error('Registration error: ', err.error);
      });

      await PushNotifications.addListener(
        'pushNotificationReceived',
        (notification: PushNotificationSchema) => {
          console.log('Push notification received: ', notification);
          console.log('data: ', notification.data);
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

      await PushNotifications.addListener(
        'pushNotificationActionPerformed',
        (notification: ActionPerformed) => {
          console.log(
            'Push notification action performed',
            notification.actionId,
            notification.notification
          );
        }
      );

      await LocalNotifications.addListener(
        'localNotificationActionPerformed',
        (notificationAction) => {
          console.log('action local notification', notificationAction);
        }
      );
    } catch (error) {

    }
  }

}
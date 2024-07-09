import { AuthService } from './auth.service';
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

@Injectable({
  providedIn: 'root'
})
export class EncuestasService {

  constructor(public afAuth: AngularFireAuth,
    public afs: AngularFirestore,
    private router: Router,
    private toastController: ToastController, private auth : AuthService) { this.traerRespuestasEmpleados() }

  respondio=false

    private respEmpleados?: AngularFirestoreCollection<any>;
    public RespEmpleados= [];

    async agregarRespuestaEmpleados(resp : any)
    {
      try
      {
        resp.foto = await this.auth.subirArchivosString(resp.foto)
        await this.afs.collection('respuestas-encuesta-empleados').add(resp)
        return true;

      } catch (error) {
        console.log('Error al agregar respuesta', error);
        this.auth.presentToast(
          'Error! Hubo un error',
          'danger',
          'alert-circle-outline'
        );
        return false;
      }
    }
    async agregarRespuestaClientes(resp : any)
    {
      try
      {
        await this.afs.collection('respuestas-encuesta-clientes').add(resp) 
          return true;

      } catch (error) {
        console.log('Error al agregar respuesta', error);
        this.auth.presentToast(
          'Error! Hubo un error',
          'danger',
          'alert-circle-outline'
        );
        return false;
      }
    }

    traerEncuestasClientes() {
      const coleccion = this.afs.collection<any>(
        'respuestas-encuesta-clientes'
      );
      return coleccion.valueChanges();
  }

    traerRespuestasEmpleados() {
      const coleccion = this.afs.collection<any>('respuestas-encuesta-empleados');
      return coleccion.valueChanges();
    }
  
  
}

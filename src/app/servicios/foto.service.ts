import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Camera } from '@capacitor/camera';
import { delay, finalize } from 'rxjs';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class FotoService {
  usuarioLogueado:any;
  arrayFotos:any = new Array();
  constructor(private angularFirestorage: AngularFireStorage) 
  {  }

  obtenerArrayFotos()
  {
    return this.arrayFotos;
  }

  limpiarArrayFotos()
  {
    this.arrayFotos = new Array();
  }

  async obtenerImagenes(foto: any) {
    // Open the gallery and select an image
      const imagenes = await Camera.pickImages({
        quality: 90,
        limit: 10,
      });
      for (let i = 0; i < imagenes.photos.length; i++) {
        const image = imagenes.photos[i];
  
        if (image.webPath) {
          // Fetch the image data
          const response = await fetch(image.webPath);
          const blob = await response.blob();
          if(i > 0)
          {
            delay(500);
          }
          const fecha = new Date().getTime();
          foto.hora = fecha;
          const nombre = ` ${fecha}`; /*${foto.usuario.nombre}.${foto.idMesa}.*/
  
  
          const ref = this.angularFirestorage.ref(nombre);
          const task = ref.put(blob);
  
          await new Promise<void>((resolve) => {
            task.snapshotChanges().pipe(
              finalize(() => {
                ref.getDownloadURL().subscribe((downloadURL: string) => {
                  foto.pathFoto = downloadURL;
                  this.arrayFotos.push(foto);
                  console.log(foto);
                  resolve(); // Resuelve la promesa para avanzar al siguiente ciclo
                });
              })
            ).subscribe();
          });
        } else {
          console.log('No selecciono una imagen');
        }
      }
  }

}

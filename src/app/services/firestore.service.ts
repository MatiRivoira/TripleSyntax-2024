import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import {  Observable, Subscription } from 'rxjs';
import {  map  } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  constructor(private angularFirestore: AngularFirestore) {}

  traerClientes() {
    const coleccion = this.angularFirestore.collection('usuarios', (ref) =>
      ref.where('perfil', '==', 'cliente')
    );
    return coleccion.valueChanges();
  }

  actualizarUsuario(usuario: any) {
    return this.angularFirestore
      .doc<any>(`usuarios/${usuario.uid}`)
      .update(usuario);
  }

  traerSupervisores() {
    const coleccion = this.angularFirestore.collection('usuarios', (ref) =>
      ref.where('perfil', 'in', ['supervisor', 'dueño'])
    );
    return coleccion.valueChanges();
  }
  traerMetres() {
    const coleccion = this.angularFirestore.collection('usuarios', (ref) =>
      ref.where('tipo', '==', 'metre')
    );
   
    return coleccion.valueChanges();
  }

  traerEmpleados() {
    const coleccion = this.angularFirestore.collection('usuarios', (ref) =>
      ref.where('perfil', '==', 'empleado')
    );
    return coleccion.valueChanges();
  }

  traerEncuestasClientes() {
    const coleccion = this.angularFirestore.collection<any>(
      'encuestaSobreClientes'
    );
    return coleccion.valueChanges();
  }

  traerEncuestasEmpleados() {
    const coleccion = this.angularFirestore.collection<any>(
      'encuestaSobreEmpleados'
    );
    return coleccion.valueChanges();
  }

  crearEncuestaSobreClientes(encuesta: any) {
    return this.angularFirestore
      .collection<any>('encuestaSobreClientes')
      .add(encuesta);
  }

  crearEncuestaSobreEmpleados(encuesta: any) {
    return this.angularFirestore
      .collection<any>('encuestaSobreEmpleados')
      .add(encuesta);
  }

  async agregarAListaDeEspera(cliente: any) {
    return await this.angularFirestore.collection('lista-de-espera').doc(cliente.uid).set(cliente);
  }


  addDocument(collection: string, data: any, id?: string): Promise<void> {
    const docId = id || this.angularFirestore.createId();
    return this.angularFirestore.collection(collection).doc(docId).set({ id: docId, ...data });
  }

  addDocumentReturnID(collection: string, data: any, id?: string): Promise<string> {
    const docId = id || this.angularFirestore.createId();
    return this.angularFirestore.collection(collection).doc(docId).set({ id: docId, ...data })
        .then(() => docId);  // Retorna el docId después de agregar el documento
}

  // Read a document by ID
  getDocument(collection: string, id: string): Observable<any> {
    return this.angularFirestore.collection(collection).doc(id).valueChanges();
  }

  // Read all documents in a collection
  getDocuments(collection: string): Observable<any[]> {
    return this.angularFirestore.collection(collection).valueChanges();
  }

  // Update a document by ID
  updateDocument(collection: string, id: string, data: any): Promise<void> {
    return this.angularFirestore.collection(collection).doc(id).update(data);
  }

  // Delete a document by ID
  deleteDocument(collection: string, id: string): Promise<void> {
    return this.angularFirestore.collection(collection).doc(id).delete();
  }

  // Search document by restriction
  getDocumentsWhere(collection: string, field: string, value: any): Observable<any[]> {
    let collectionRef: AngularFirestoreCollection<any> = this.angularFirestore.collection(collection);
    if (field && value) {
      collectionRef = this.angularFirestore.collection(collection, ref => ref.where(field, '==', value));
    }
    return collectionRef.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  getDocumentsWhereArrayContains(collection: string, field: string, value: any): Observable<any[]> {
    let collectionRef: AngularFirestoreCollection<any> = this.angularFirestore.collection(collection);
    
    if (field && value) {
      collectionRef = this.angularFirestore.collection(collection, ref => ref.where(field, 'array-contains', value));
    }

    return collectionRef.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  getDocumentsWhereArrayElementMatches(collection: string, field: string, subfield: string, value: any): Observable<any[]> {
    let collectionRef: AngularFirestoreCollection<any> = this.angularFirestore.collection(collection);
    
    return collectionRef.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        }).filter(doc => {
          if (Array.isArray(doc[field])) {
            return doc[field].some((element:any) => element[subfield] === value);
          }
          return false;
        });
      })
    );
  }

   // Método para borrar todos los documentos de una colección
   BorrarCollection(collection: string): Subscription {
    const subscription = this.getDocuments(collection).subscribe(documents => {
      console.log(documents);
      documents.forEach(doc => {
        this.deleteDocument(collection, doc.uid);
      });
      subscription.unsubscribe(); // Desuscribirse después de completar la eliminación
    });

    return subscription;
  }
  
}

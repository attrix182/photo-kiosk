import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import * as firebase from 'firebase/app';
import { finalize, map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class StorageService {
  public loadedImage: any;

  public fotoCargada: any;
  public foto: any;

  constructor(private cloudFireStore: AngularFirestore, private storage: AngularFireStorage) {}

  InsertCustomID(collectionName: string, idCustom: any, data: any) {
    return this.cloudFireStore.collection(collectionName).doc(idCustom).set(data);
  }

  GetByParameter(collection: string, parametro: string, value: any) {
    return this.cloudFireStore
      .collection<any>(collection, (ref) => ref.where(parametro, '==', value))
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data: any = a.payload.doc.data();
            data.id = a.payload.doc.id;
            return data;
          })
        )
      );
  }

  GetAll(collectionName: string) {
    return this.cloudFireStore
      .collection(collectionName)
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data: any = a.payload.doc.data();
            data.id = a.payload.doc.id;
            return data;
          })
        )
      );
  }

  InsertImage(collectionName: string, image: any): Promise<string> {
    return new Promise((resolve, reject) => {
      image.id = this.cloudFireStore.createId();
      const filePath = `/images/${image.id}/image.jpeg`;
      this.storage
        .ref(filePath)
        .putString(image.photo, 'base64', { contentType: 'image/jpeg' })
        .then(() => {
          let storages = firebase.default.storage();
          let storageRef = storages.ref();
          let spaceRef = storageRef.child(filePath);

          spaceRef
            .getDownloadURL()
            .then((url) => {
              this.fotoCargada = url;
              this.fotoCargada = `${this.fotoCargada}`;
              image.photo = url;
              this.InsertCustomID(collectionName, image.id, image).then(() => {
                resolve(url);
              });
            })
            .catch((error) => {
              reject(error);
            });
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}

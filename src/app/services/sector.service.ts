import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Sector } from '../models/sector';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SectorService {
  
  public sectorsCollection: AngularFirestoreCollection<Sector>;
  public sectors: Observable<Sector[]>;
  
    constructor( 
        private afs: AngularFirestore,
        ) {
          this.sectorsCollection = afs.collection<Sector>('sectors');
          this.sectors = this.sectorsCollection.valueChanges();
      }

    getSectors(){
         return this.sectors = this.sectorsCollection.snapshotChanges()
         .pipe(map(changes =>{
           return changes.map(action => {
             const data = action.payload.doc.data() as Sector;
             return data;
           });
         }));
    }
}

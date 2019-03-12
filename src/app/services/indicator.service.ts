import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { Indicator } from '../models/indicator';

@Injectable({
  providedIn: 'root'
})
export class IndicatorsService {
  
  public indicatorsCollection: AngularFirestoreCollection<Indicator>;
  public indicators: Observable<Indicator[]>;
  public indicatorDoc: AngularFirestoreDocument<Indicator>;
  public indicator: Observable<Indicator>;
  
  constructor( 
      private afs: AngularFirestore,
      private afAuth: AngularFireAuth
      ) {
        this.indicatorsCollection = afs.collection<Indicator>('indicators');
        this.indicators = this.indicatorsCollection.valueChanges();
    }

    getIndicators(){
      return this.indicators = this.indicatorsCollection.snapshotChanges()
      .pipe(map(changes =>{
        return changes.map(action=> {
          const data = action.payload.doc.data() as Indicator;
          data.id = action.payload.doc.id;
          return data;
        });
      }));
    }

    getUserIndicator(idUser: string){
      this.indicatorDoc = this.afs.doc<Indicator>(`indicators/${idUser}`);
      return this.indicator = this.indicatorDoc.snapshotChanges().pipe(map(action => {
        if (action.payload.exists === false) {
          return null;
        } else {
          const data = action.payload.data() as Indicator;
          data.id = action.payload.id;
          return data;
        }
      }));
    }

    insertUserIndicators(indicator: Indicator){
      let currentUser = this.afAuth.auth.currentUser;
      let userId = currentUser.uid;
      this.indicatorsCollection.doc(userId).set(indicator);
    }

    updatetUserIndicators(indicator: Indicator){
      let idIndicator = indicator.id;
      indicator.id = '';
      this.indicatorDoc = this.afs.doc<Indicator>(`indicators/${idIndicator}`);
      this.indicatorDoc.update(indicator);
    }
}

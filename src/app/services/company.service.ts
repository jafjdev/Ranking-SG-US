import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Company } from '../models/company';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  
  public companiesCollection: AngularFirestoreCollection<Company>;
  public companies: Observable<Company[]>;
  
    constructor( 
        private afs: AngularFirestore,
        ) {
          this.companiesCollection = afs.collection<Company>('companies');
          this.companies = this.companiesCollection.valueChanges();
      }

    getCompanies(){
         return this.companies = this.companiesCollection.snapshotChanges()
         .pipe(map(changes =>{
           return changes.map(action => {
             const data = action.payload.doc.data() as Company;
             return data;
           });
         }));
    }
}

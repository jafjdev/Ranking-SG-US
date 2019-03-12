import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { take, map, tap } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable()
export class AuthService implements CanActivate {
  
  loggedInSubject: BehaviorSubject<boolean>;
  state: Observable<firebase.User>;
  user: any;
  isLoggedIn: boolean;
  
  constructor(private router: Router,
    private afAuth: AngularFireAuth) {
  }

  canActivate(): Observable<boolean> | boolean {
    if (typeof window !== 'undefined') {
      return this.afAuth.user.pipe(
        take(1),
        map(state => !!state),
        tap(loggedIn => {
          if (!loggedIn) {
            this.router.navigate(['/login']);
          } 
        })
      );
    }
    return true;
  }

  signup(email: string, password: string) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then(() => {
          
      })
      .catch(error => console.log(error));
  }

  signin(email: string, password: string) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
    .then(() => {
        
    })
    .catch(error => console.log(error));
  }

  logout(){
    return this.afAuth.auth.signOut()
    .then(() => {
        
    })
    .catch(error => console.log(error));

  }
}

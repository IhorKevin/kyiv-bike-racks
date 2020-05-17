import { Injectable } from '@angular/core';
import {AngularFireAuth} from "@angular/fire/auth";
import {Observable, of} from "rxjs";
import 'firebase/auth';
import {User, auth} from "firebase/app";
import {map, switchMap} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    user: Observable<User | null>;

    constructor(private fireAuth: AngularFireAuth) {
        this.user = this.fireAuth.user;
    }

    isAuthenticated(): Observable<boolean> {
        return this.user.pipe(map(user => Boolean(user)));
    }

    isEditor(): Observable<boolean> {
        return this.getCustomClaims().pipe(map(claims => claims.editor || claims.admin));
    }

    isAdmin(): Observable<boolean> {
        return this.getCustomClaims().pipe(map(claims => claims.admin));
    }

    login(): Promise<auth.UserCredential> {
        return this.fireAuth
            .setPersistence(auth.Auth.Persistence.LOCAL)
            .then(() => this.fireAuth.signInWithPopup(new auth.GoogleAuthProvider()));
    }

    logout(): Promise<void> {
        return this.fireAuth.signOut();
    }

    private getCustomClaims(): Observable<{[key: string]: boolean}> {
        return this.user
            .pipe(switchMap(user => {
                return user ? user.getIdTokenResult() : of(null);
            }))
            .pipe(map(result => {
                return result ? result.claims : {};
            }));
    }

}

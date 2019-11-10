import { Injectable } from '@angular/core';
import {AngularFireAuth} from "@angular/fire/auth";
import {Observable} from "rxjs";
import {User, auth} from "firebase/app";
import { map } from 'rxjs/operators';

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

    login(): Promise<auth.UserCredential> {
        return this.fireAuth.auth
            .setPersistence(auth.Auth.Persistence.LOCAL)
            .then(() => this.fireAuth.auth.signInWithPopup(new auth.GoogleAuthProvider()));
    }

    logout(): Promise<void> {
        return this.fireAuth.auth.signOut();
    }

}

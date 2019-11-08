import { Injectable } from '@angular/core';
import {AngularFireAuth} from "@angular/fire/auth";
import {Observable} from "rxjs";
import {User, auth} from "firebase/app";

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    user: Observable<User | null>;

    constructor(private fireAuth: AngularFireAuth) {
        this.user = this.fireAuth.user;
    }

    isAuthenticated(): Observable<boolean> {
        return;
    }

    login(): Promise<auth.UserCredential> {
        return this.fireAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
    }

    logout(): void {

    }

}

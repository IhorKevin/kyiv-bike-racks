import { Injectable } from '@angular/core';
import {
    Auth,
    GoogleAuthProvider,
    signOut,
    signInWithPopup,
    User,
    browserLocalPersistence,
    user,
} from '@angular/fire/auth';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    user: Observable<User | null>;

    constructor(private fireAuth: Auth) {
        this.user = user(this.fireAuth);
    }

    isAuthenticated(): Observable<boolean> {
        return this.user.pipe(map(Boolean));
    }

    isEditor(): Observable<boolean> {
        return this.getCustomClaims().pipe(map(claims => claims.editor || claims.admin));
    }

    isAdmin(): Observable<boolean> {
        return this.getCustomClaims().pipe(map(claims => claims.admin));
    }

    async login() {
        await this.fireAuth.setPersistence(browserLocalPersistence);
        return signInWithPopup(this.fireAuth, new GoogleAuthProvider());
    }

    logout(): Promise<void> {
        return signOut(this.fireAuth);
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

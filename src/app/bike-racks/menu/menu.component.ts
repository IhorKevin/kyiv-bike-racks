import { Component, EventEmitter, inject, Output } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../services';

@Component({
    selector: 'app-menu',
    imports: [
        AsyncPipe,
        MatButton,
        MatIcon,
        MatMenu,
        MatMenuItem,
        NgIf,
        RouterLink,
        MatMenuTrigger,
    ],
    templateUrl: './menu.component.html',
    styleUrl: './menu.component.scss',
})
export class MenuComponent {
    isLoggedIn: Observable<boolean>;
    isEditor: Observable<boolean>;

    @Output() readonly logout = new EventEmitter<void>();
    @Output() readonly settingsClicked = new EventEmitter<void>();

    private readonly auth = inject(AuthService);

    constructor() {
        this.isLoggedIn = this.auth.isAuthenticated();
        this.isEditor = this.auth.isEditor();
    }
}

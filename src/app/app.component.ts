import {Component, OnInit, HostBinding} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {filter, map} from "rxjs/operators";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.styl']
})
export class AppComponent implements OnInit {

    title: string = 'Велопарковки Києва';

    @HostBinding('class') className = 'mat-typography';

    constructor(private titleService: Title, private router: Router, private route: ActivatedRoute) {}

    ngOnInit(): void {
        this.router.events
            .pipe(filter(event => event instanceof NavigationEnd))
            .pipe(map(() => this.route))
            .subscribe(route => {
                while (route.firstChild) {
                    route = route.firstChild;
                }
                const pageTitle = route.snapshot.data.title;
                const title = pageTitle ? `${pageTitle} | ${this.title}` : this.title;
                this.titleService.setTitle(title);
            });
    }
}

import { Component, OnInit, HostBinding } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { BikeRack } from './bike-racks';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    title: string = 'Велопарковки Києва';

    @HostBinding('class') className = 'mat-typography';

    constructor(
        private titleService: Title,
        private router: Router,
        private route: ActivatedRoute,
    ) {}

    ngOnInit(): void {
        this.router.events
            .pipe(filter((event) => event instanceof NavigationEnd))
            .pipe(map(() => this.route))
            .subscribe((route) => {
                while (route.firstChild) {
                    route = route.firstChild;
                }
                const state = this.router.getCurrentNavigation().extras.state;
                const rack: BikeRack = route.snapshot.data.rack;
                const stateTitle = state ? state.title : null;
                const rackTitle =
                    rack && !state
                        ? rack.title || rack.owner_name || rack.street_address
                        : ''; // for initial loading only
                const pageTitle = route.snapshot.data.title;
                const currentTitle = stateTitle || rackTitle || pageTitle;
                const title = currentTitle
                    ? `${currentTitle} | ${this.title}`
                    : this.title;
                this.titleService.setTitle(title);
            });
    }
}

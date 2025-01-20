import { inject, Injectable, Injector } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Router,
    RouterStateSnapshot,
    TitleStrategy,
} from '@angular/router';
import { Title } from '@angular/platform-browser';
import { BikeRack } from '../bike-racks';

@Injectable({
    providedIn: 'root',
})
export class TitleStrategyService extends TitleStrategy {
    private readonly siteName = 'Велопарковки Києва';
    private readonly title = inject(Title);
    private readonly injector = inject(Injector);

    override updateTitle(snapshot: RouterStateSnapshot): void {
        const pageTitle = this.buildTitle(snapshot);
        const title = pageTitle
            ? `${pageTitle} - ${this.siteName}`
            : this.siteName;
        this.title.setTitle(title);
    }

    override getResolvedTitleForRoute(snapshot: ActivatedRouteSnapshot): any {
        const router = this.injector.get(Router);
        const state = router.getCurrentNavigation().extras.state;
        const rack: BikeRack = snapshot.data.rack;
        const stateTitle = state ? state.title : null;
        const rackTitle =
            rack && !state
                ? rack.title || rack.owner_name || rack.street_address
                : ''; // for initial loading only
        const pageTitle = snapshot.title;

        const currentTitle = stateTitle || rackTitle || pageTitle;
        if (currentTitle) return currentTitle;

        return super.getResolvedTitleForRoute(snapshot);
    }
}

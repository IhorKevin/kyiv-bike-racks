import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    inject,
    OnInit,
    TemplateRef,
    ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { GoogleMap, MapMarker } from '@angular/google-maps';
import {
    MatDialog,
    MatDialogClose,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
} from '@angular/material/dialog';
import { MatListModule, MatSelectionListChange } from '@angular/material/list';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatButton, MatMiniFabButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
    Firestore,
    doc,
    deleteDoc,
    collection,
    query,
    where,
    QueryConstraint,
    collectionData,
    docSnapshots,
} from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime, map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { BikeRack } from '../bike-rack';
import {
    GeoService,
    MarkerOptionsSet,
    MarkersService,
    AuthService,
} from '../../services';
import { FilterSettings } from '../settings';
import { RackCardComponent } from '../rack-card/rack-card.component';

const settingsKey: string = 'racks_settings';

@Component({
    selector: 'app-racks-page',
    templateUrl: './racks-page.component.html',
    styleUrls: ['./racks-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        MatDialogClose,
        MatDialogActions,
        MatDialogContent,
        MatDialogTitle,
        MatMenuModule,
        MatListModule,
        MatIconModule,
        MatButton,
        RackCardComponent,
        GoogleMap,
        MapMarker,
        RouterLink,
        MatMiniFabButton,
        NgIf,
        AsyncPipe,
        NgForOf,
    ],
})
export class RacksPageComponent implements OnInit, AfterViewInit {
    userPosition: GeolocationPosition;
    zoom: number = 16;

    mapOptions: google.maps.MapOptions;
    markerOptions: MarkerOptionsSet;

    racks: Observable<BikeRack[]>;
    selectedRack: Observable<BikeRack>;
    isLoggedIn: Observable<boolean>;
    isEditor: Observable<boolean>;
    isAdmin: Observable<boolean>;

    settings: FilterSettings;

    @ViewChild(GoogleMap) mapRef: GoogleMap;

    private readonly minZoom = 11;
    private readonly maxZoom = 19;
    private readonly locationZoom = 18;
    private settingsChange: BehaviorSubject<FilterSettings>;
    private db = inject(Firestore);
    private snackBar = inject(MatSnackBar);

    constructor(
        private auth: AuthService,
        private geoService: GeoService,
        private router: Router,
        private route: ActivatedRoute,
        private markersService: MarkersService,
        private dialog: MatDialog,
        private cdr: ChangeDetectorRef,
    ) {
        this.mapOptions = {
            center: GeoService.KyivCenterCoords,
            minZoom: this.minZoom,
            maxZoom: this.maxZoom,
            streetViewControl: false,
            fullscreenControl: false,
            mapTypeControl: false,
            zoomControl: false,
            rotateControl: true,
            clickableIcons: false,
        };
        this.initSettings();

        const itemsRef = collection(this.db, 'racks').withConverter<BikeRack>({
            fromFirestore: (snapshot) => snapshot.data() as BikeRack,
            toFirestore: (item: any) => item,
        });

        this.racks = this.settingsChange.pipe(debounceTime(500)).pipe(
            switchMap((settings) => {
                const constraints: QueryConstraint[] = [];
                if (!settings.private)
                    constraints.push(where('is_private', '==', false));
                if (!settings.small)
                    constraints.push(where('capacity', '>=', 6));
                if (!settings.allDesigns)
                    constraints.push(where('is_sheffield', '==', true));

                const bikeRacksQuery = query(itemsRef, ...constraints);
                return collectionData(bikeRacksQuery, { idField: 'id' }).pipe(
                    shareReplay(1),
                );
            }),
        );

        this.markerOptions = this.markersService.options();
        this.isLoggedIn = this.auth.isAuthenticated();
        this.isEditor = this.auth.isEditor();
        this.isAdmin = this.auth.isAdmin();
    }

    ngOnInit() {
        const id = this.route.snapshot.queryParamMap.get('rack_id');
        const center = this.getCenterParam();
        if (!id && center) {
            const coords = center.split(',').map((value) => Number(value));
            this.mapOptions.center = {
                lat: coords[0],
                lng: coords[1],
            };
        }
    }

    ngAfterViewInit(): void {
        const selectedRackDoc = this.route.queryParamMap
            .pipe(map((paramMap) => paramMap.get('rack_id')))
            .pipe(
                switchMap((id) => {
                    const docRef = doc(this.db, `racks/${id}`);
                    return docSnapshots(docRef);
                }),
            );

        this.selectedRack = selectedRackDoc
            .pipe(
                map((snapshot) => {
                    if (snapshot.exists()) {
                        const data = snapshot.data() as BikeRack;
                        return {
                            id: snapshot.id,
                            ...data,
                        };
                    } else {
                        return null;
                    }
                }),
            )
            .pipe(
                tap((data) => {
                    if (data) this.panToRackWithOffset(data);
                    else {
                        if (this.getCenterParam()) this.clearRack();
                    }
                }),
            );
    }

    centerMapToUserPosition(): void {
        const onSuccess = (position) => {
            this.mapRef.panTo({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            });
            this.mapRef.zoom = this.locationZoom;
            this.userPosition = position;
        };
        const onReject = () => {
            this.mapRef.panTo(GeoService.KyivCenterCoords);
            this.userPosition = null;
        };
        this.geoService
            .getUserPosition()
            .then(onSuccess)
            .catch(onReject)
            .finally(() => this.cdr.markForCheck());
    }

    onRackSelect(rack: BikeRack): void {
        this.router.navigate(['.'], {
            relativeTo: this.route,
            queryParams: { rack_id: rack.id },
            state: {
                title: rack.title || rack.owner_name || rack.street_address,
            },
        });
    }

    clearRack(): void {
        this.router.navigate(['.'], {
            relativeTo: this.route,
            state: {
                title: '',
            },
        });
    }

    onZoom(): void {
        this.cdr.markForCheck();
    }

    logout(): void {
        this.auth.logout().then(() =>
            this.mapRef.panTo({
                lat: GeoService.KyivCenterCoords.lat,
                lng: GeoService.KyivCenterCoords.lng,
            }),
        );
    }

    openSettings(template: TemplateRef<any>): void {
        this.dialog.open(template, {
            maxWidth: '90vw',
            maxHeight: '90vh',
            autoFocus: false,
        });
    }

    onSettingsChange(event: MatSelectionListChange): void {
        const enabledKeys: string[] = event.source.selectedOptions.selected.map(
            (option) => option.value,
        );

        Object.keys(this.settings).forEach((key) => {
            this.settings[key] = enabledKeys.includes(key);
        });
        localStorage.setItem(settingsKey, JSON.stringify(this.settings));
        this.settingsChange.next(this.settings);
    }

    openConfirmation(template: TemplateRef<any>, rack: BikeRack): void {
        this.dialog.open(template, {
            data: rack,
            autoFocus: false,
        });
    }

    deleteRack(id: string): void {
        const docRef = doc(this.db, 'racks', id);
        deleteDoc(docRef)
            .then(() => {
                this.dialog.closeAll();
                this.clearRack();
                this.snackBar.open('Велопарковку видалено', 'OK', {
                    duration: 3000,
                });
            })
            .catch((error) => this.snackBar.open(error.message, 'OK'));
    }

    trackByRackId(index: number, item: BikeRack) {
        return item.id;
    }

    configMarker(rack: BikeRack, active?: boolean): google.maps.MarkerOptions {
        const type = rack.is_sheffield ? 'primary' : 'secondary';
        const currentZoom: number = this.mapRef.getZoom();
        const size = currentZoom < this.zoom ? 'sm' : 'lg';
        const state = active ? 'active' : 'default';
        return this.markersService.getRackMarker(type, size, state);
    }

    private panToRackWithOffset(rack: BikeRack): void {
        // displays selected marker not in the map center but closer to top of the view
        // calculate 15vh from center of the screen

        const coords = rack.coords;
        const bounds = this.mapRef.getBounds().toJSON();
        const offset = (bounds.north - bounds.south) * 0.15; // 15vh from center

        this.mapRef.panTo({
            lat: coords.latitude - offset,
            lng: coords.longitude,
        });
    }

    private getCenterParam(): string {
        return this.route.snapshot.queryParamMap.get('center');
    }

    private initSettings(): void {
        const initial: FilterSettings = {
            private: false,
            small: true,
            allDesigns: true,
        };
        const saved: FilterSettings = JSON.parse(
            localStorage.getItem(settingsKey),
        );

        this.settings = saved || initial;
        this.settingsChange = new BehaviorSubject(this.settings);
    }
}

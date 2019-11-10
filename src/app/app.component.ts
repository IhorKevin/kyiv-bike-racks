import {Component, OnInit, HostBinding} from '@angular/core';
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.styl'],
  host: {
    "class": "mat-typography"
  }
})
export class AppComponent implements OnInit {

    title = 'Велопарковки Києва';

    constructor(private titleService: Title) {}

    ngOnInit(): void {
        this.titleService.setTitle(this.title);
    }
}

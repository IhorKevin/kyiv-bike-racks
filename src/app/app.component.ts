import {Component, OnInit} from '@angular/core';
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.styl']
})
export class AppComponent implements OnInit {

    title = 'Велопарковки Києва';

    constructor(private titleService: Title) {}

    ngOnInit(): void {
        this.titleService.setTitle(this.title);
    }
}

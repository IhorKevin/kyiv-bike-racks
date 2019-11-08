import { Component, OnInit } from '@angular/core';
import {AngularFireStorage, AngularFireUploadTask} from "@angular/fire/storage";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.styl']
})
export class HomeComponent implements OnInit {

    uploadPercent: number;
    private file: File;

    constructor(private firestorage: AngularFireStorage) { }

    ngOnInit() {
    }

    onFileInputChange(input: HTMLInputElement): void {
        console.log(input.files[0]);
        if(input.files.length) {
            this.file = input.files.item(0);
        }
        else {
            this.file = null;
        }
    }

    upload(): void {
        if(this.file) {
            const path: string = `/racks-photo/${this.file.name}`;
            const task: AngularFireUploadTask = this.firestorage.upload(path, this.file);
            task.percentageChanges().subscribe(percentage => this.uploadPercent = percentage);
            task.then(snapshot => {
                this.uploadPercent = null;
                this.file = null;
                snapshot.ref.getDownloadURL().then(url => console.log('IMAGE', url));
            });

        }
    }

}

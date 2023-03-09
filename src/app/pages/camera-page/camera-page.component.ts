import { Component, OnInit } from '@angular/core';
import { WebcamImage } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-camera-page',
  templateUrl: './camera-page.component.html',
  styleUrls: ['./camera-page.component.scss']
})
export class CameraPageComponent implements OnInit {
  showWebcam: boolean = true;
  public webcamImage!: WebcamImage;
  private trigger: Subject<void> = new Subject<void>();

  constructor(private storageSvc: StorageService) {}

  ngOnInit(): void {}

  handleImage(webcamImage: WebcamImage): void {
    this.webcamImage = webcamImage;
    this.uploadImage();
    this.showWebcam = false;
  }

  triggerSnapshot() {
    this.trigger.next();
  }

  toggleShowCamera() {
    this.showWebcam = !this.showWebcam;
  }

  uploadImage() {
    let image = {
    photo: this.webcamImage
    }
   // this.storageSvc..InsertImage('images', image)
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }
}

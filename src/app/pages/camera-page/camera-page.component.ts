import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { WebcamImage } from 'ngx-webcam';
import { filter, map, Observable, Subject, tap, withLatestFrom } from 'rxjs';
import { HandGesture } from 'src/app/services/hand-gesture.service';
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
  showTimer: boolean = false;
  @ViewChild('canvas') canvas: ElementRef<HTMLCanvasElement> | undefined;
  @ViewChild('video') video: any;

  //sobra
  opened$ = this.handService.swipe$.pipe(
    filter((value) => value === 'left' || value === 'right'),
    map((value) => value === 'right')
  );

  shot$ = this.handService.gesture$.pipe(
    filter((value) => value === 'one' || value === 'two'),
    map((value) => (value === 'one' ? 'one' : 'two'))
  );

  constructor(private storageSvc: StorageService, private handService: HandGesture) {
    this.handService.gesture$
      .pipe(
        filter((value) => value === 'two'),
        withLatestFrom(this.shot$)
      )
      .subscribe((value) => this.triggerSnapshot());
  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.handService.initialize(this.canvas?.nativeElement, this.video.nativeElement);
  }

  get stream() {
    return this.handService.stream;
  }

  handleImage(webcamImage: WebcamImage): void {
    this.webcamImage = webcamImage;
   // this.uploadImage();
    this.showWebcam = false;
  }

  triggerSnapshot() {
    console.log('triggerSnapshot');
    this.showTimer = true;

    setTimeout(() => {
    this.trigger.next();
    this.showTimer = false;
    }, 3000);
  }

  toggleShowCamera() {
    this.showWebcam = !this.showWebcam;
  }

  uploadImage() {
    let image = {
      photo: this.webcamImage
    };
    this.storageSvc.InsertImage('images', image);
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }
}

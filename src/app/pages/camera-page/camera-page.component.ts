import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
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
  showFlash: boolean = false;
  screenHeight: number = window.innerHeight;
  screenWidth: number = window.innerWidth;
  @ViewChild('canvas') canvas: ElementRef<HTMLCanvasElement> | undefined;
  @ViewChild('video') video: any;
  url: string;

  shot$ = this.handService.gesture$.pipe(
    filter((value) => value === 'ok' || value === 'two'),
    map((value) => (value === 'ok' ? 'ok' : 'two'))
  );

  constructor(private storageSvc: StorageService, private handService: HandGesture) {
    this.handService.gesture$
      .pipe(
        filter((value) => value === 'two' || value === 'ok'),
        withLatestFrom(this.shot$)
      )
      .subscribe((value) => {
        if (value[1] === 'two') {
          this.triggerSnapshot();
        }
        if (value[1] === 'ok') {
          this.toggleShowCamera();
        }
      });

      this.gestureDetected();
    }

  gestureDetected() {
    this.handService.gesture$.subscribe((value) => this.showGestureDetected(value));
  }
  showGestureDetected(gesture: string) {
    console.log(gesture);
  }

  ngOnInit(): void {}

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;

    console.log(this.screenHeight, this.screenWidth);
  }

  ngAfterViewInit() {
    this.handService.initialize(this.canvas?.nativeElement, this.video.nativeElement);
  }

  get stream() {
    return this.handService.stream;
  }

  handleImage(webcamImage: WebcamImage): void {
    this.webcamImage = webcamImage;
    this.uploadImage();
    this.showWebcam = false;
  }

  triggerSnapshot() {
    if (this.showTimer) return;
    if (this.webcamImage) return;

    this.showTimer = true;
    setTimeout(() => {
      this.showFlash = true;
      this.playShootSound();
    }, 2500);

    setTimeout(() => {
      this.trigger.next();
      this.showTimer = false;
      this.showFlash = false;
    }, 2900);
  }

  playShootSound() {
    let audio = new Audio();
    audio.src = '../../../assets/shoot-sound.mp3';
    audio.load();
    audio.play();
  }

  toggleShowCamera() {
    if (!this.webcamImage) return;
    this.webcamImage = null;
    this.showWebcam = !this.showWebcam;
  }

  uploadImage() {
    let image = {
      photo: this.webcamImage.imageAsBase64
    };
    this.storageSvc
      .InsertImage('images', image)
      .then((url) => {
        console.log('URL: ', url);
        this.url = url;
      })
      .catch((error) => {
        console.error('Ha ocurrido un error:', error);
      });
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }
}

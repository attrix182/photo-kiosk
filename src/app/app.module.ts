import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { QRCodeModule } from 'angular2-qrcode';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CameraPageComponent } from './pages/camera-page/camera-page.component';
import {WebcamModule} from 'ngx-webcam';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
@NgModule({
  declarations: [
    AppComponent,
    CameraPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    WebcamModule,
    QRCodeModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CameraPageComponent } from './pages/camera-page/camera-page.component';

const routes: Routes = [
  {path: '', component: CameraPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

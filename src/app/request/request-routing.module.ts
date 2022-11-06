import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RequestsPageComponent } from './components/requests-page/requests-page.component';


const routes: Routes = [
  { path: '', component: RequestsPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequestRoutingModule { }

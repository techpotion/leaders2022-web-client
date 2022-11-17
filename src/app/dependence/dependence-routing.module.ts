import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DependencePageComponent } from './components/dependence-page/dependence-page.component';

const routes: Routes = [
  { path: '', component: DependencePageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DependenceRoutingModule { }

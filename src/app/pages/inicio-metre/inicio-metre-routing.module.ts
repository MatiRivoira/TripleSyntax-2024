import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InicioMetrePage } from './inicio-metre.page';

const routes: Routes = [
  {
    path: '',
    component: InicioMetrePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InicioMetrePageRoutingModule {}

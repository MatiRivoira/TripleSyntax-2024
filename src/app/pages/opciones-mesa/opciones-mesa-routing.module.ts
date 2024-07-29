import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OpcionesMesaPage } from './opciones-mesa.page';

const routes: Routes = [
  {
    path: '',
    component: OpcionesMesaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OpcionesMesaPageRoutingModule {}

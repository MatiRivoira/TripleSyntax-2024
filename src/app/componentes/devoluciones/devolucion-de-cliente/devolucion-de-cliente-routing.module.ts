import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {  DevolucionDeClientePage } from './devolucion-de-cliente.page';

const routes: Routes = [
  {
    path: '',
    component: DevolucionDeClientePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DevolucionDeClientePageRoutingModule {}

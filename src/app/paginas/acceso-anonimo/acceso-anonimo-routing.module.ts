import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccesoAnonimoPage } from './acceso-anonimo.page';

const routes: Routes = [
  {
    path: '',
    component: AccesoAnonimoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccesoAnonimoPageRoutingModule {}

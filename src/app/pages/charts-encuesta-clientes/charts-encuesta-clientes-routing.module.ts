import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChartsEncuestaClientesPage } from './charts-encuesta-clientes.page';

const routes: Routes = [
  {
    path: '',
    component: ChartsEncuestaClientesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChartsEncuestaClientesPageRoutingModule {}

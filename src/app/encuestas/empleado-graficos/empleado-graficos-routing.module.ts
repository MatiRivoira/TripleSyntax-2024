import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmpleadoGraficosPage } from './empleado-graficos.page';

const routes: Routes = [
  {
    path: '',
    component: EmpleadoGraficosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmpleadoGraficosPageRoutingModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmpleadoEncuestaPage } from './empleado-encuesta.page';

const routes: Routes = [
  {
    path: '',
    component: EmpleadoEncuestaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmpleadoEncuestaPageRoutingModule {}

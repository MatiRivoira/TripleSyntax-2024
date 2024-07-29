import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DevolucionDeEmpleadoPage } from './devolucion-de-empleado.page';

const routes: Routes = [
  {
    path: '',
    component: DevolucionDeEmpleadoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DevolucionDeEmpleadoPageRoutingModule {}

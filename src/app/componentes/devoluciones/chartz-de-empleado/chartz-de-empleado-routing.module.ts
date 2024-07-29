import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChartzDeEmpleadoPage } from './chartz-de-empleado.page';

const routes: Routes = [
  {
    path: '',
    component: ChartzDeEmpleadoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChartzDeEmpleadoPageRoutingModule {}

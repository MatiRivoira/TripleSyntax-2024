import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterEmpleadoPage } from './register-empleado.page';

const routes: Routes = [
  {
    path: '',
    component: RegisterEmpleadoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterEmpleadoPageRoutingModule {}

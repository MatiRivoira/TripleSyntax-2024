import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterMesaPage } from './register-mesa.page';

const routes: Routes = [
  {
    path: '',
    component: RegisterMesaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterMesaPageRoutingModule {}

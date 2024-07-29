import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InicioClientePage } from './inicio-cliente.page';

const routes: Routes = [
  {
    path: '',
    component: InicioClientePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InicioClientePageRoutingModule {}

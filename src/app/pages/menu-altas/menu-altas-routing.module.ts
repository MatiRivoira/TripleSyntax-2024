import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuAltasPage } from './menu-altas.page';

const routes: Routes = [
  {
    path: '',
    component: MenuAltasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuAltasPageRoutingModule {}

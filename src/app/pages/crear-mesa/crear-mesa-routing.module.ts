import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CrearMesaPage } from './crear-mesa.page';

const routes: Routes = [
  {
    path: '',
    component: CrearMesaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrearMesaPageRoutingModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InicioCocineroPage } from './inicio-cocinero.page';

const routes: Routes = [
  {
    path: '',
    component: InicioCocineroPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InicioCocineroPageRoutingModule {}

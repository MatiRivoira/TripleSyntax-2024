import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InicioMozoPage } from './inicio-mozo.page';

const routes: Routes = [
  {
    path: '',
    component: InicioMozoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InicioMozoPageRoutingModule {}

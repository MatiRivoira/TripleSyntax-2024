import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InicioBartenderPage } from './inicio-bartender.page';

const routes: Routes = [
  {
    path: '',
    component: InicioBartenderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InicioBartenderPageRoutingModule {}

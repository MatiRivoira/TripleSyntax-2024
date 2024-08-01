import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChatConsultaPage } from './chat-consulta.page';

const routes: Routes = [
  {
    path: '',
    component: ChatConsultaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatConsultaPageRoutingModule {}

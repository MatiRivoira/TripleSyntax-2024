import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatConsultaPageRoutingModule } from './chat-consulta-routing.module';

import { ChatConsultaPage } from './chat-consulta.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChatConsultaPageRoutingModule
  ],
  declarations: [ChatConsultaPage]
})
export class ChatConsultaPageModule {}

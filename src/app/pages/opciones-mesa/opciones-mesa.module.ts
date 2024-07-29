import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { OpcionesMesaPageRoutingModule } from './opciones-mesa-routing.module';
import { OpcionesMesaPage } from './opciones-mesa.page';
import { MinutasComponent } from 'src/app/componentes/minuta/minuta.component';
import { DiferenciaMinutosPipe } from 'src/app/pipes/diferencia-minutos.pipe';
import { AbonarComponent } from 'src/app/componentes/abonar/abonar.component';
import { SeleccionPropinaComponent } from 'src/app/componentes/seleccion-propina/seleccion-propina.component';
import { PreguntadosDiezComponent } from 'src/app/juegos/preguntadosDiez/preguntadosDiez.component';
import { SimonQuinceComponent } from 'src/app/juegos/simonQuince/simonQuince.component';
import { VerMinutaComponent } from 'src/app/componentes/ver-minuta/ver-minuta.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OpcionesMesaPageRoutingModule
  ],
  declarations: [OpcionesMesaPage, MinutasComponent, DiferenciaMinutosPipe, AbonarComponent, SeleccionPropinaComponent, PreguntadosDiezComponent, SimonQuinceComponent, VerMinutaComponent]
})
export class OpcionesMesaPageModule { }

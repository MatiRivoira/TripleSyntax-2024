import { NodeWithI18n } from '@angular/compiler';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'diferenciaMinutos'
})
export class DiferenciaMinutosPipe implements PipeTransform {

  transform(comienzo: any, tiempoPreparacion: number): number {

    console.log(comienzo)
    let horaFinal = new Date((new Date(comienzo.seconds*1000)).getTime() + tiempoPreparacion * 60000)
    console.log("Hora Final: ", horaFinal)
    let ahora = new Date()
    console.log("Ahora: ", ahora)
    let diffMs = (horaFinal.getTime() - ahora.getTime()); 
    console.log("diff mil: ", diffMs)
    var diffMins = Math.round(diffMs / 60000); 
    console.log("diff min: ", diffMins)
    return diffMins;
  }

}

//NUEVOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'diferenciaMinutos'
})
export class DiferenciaMinutosPipe implements PipeTransform {

  transform(comienzo: Date | number | string, tiempoPreparacion: number): string {
    const comienzoDate = typeof comienzo === 'string' ? new Date(comienzo) : new Date(comienzo instanceof Date ? comienzo : comienzo * 1000);
    const horaFinal = new Date(comienzoDate.getTime() + tiempoPreparacion * 60000);
    const ahora = new Date();
    const diffMs = horaFinal.getTime() - ahora.getTime();
    const diffSecs = Math.floor(diffMs / 1000) % 60; // Obtenemos los segundos
    const diffMins = Math.floor(diffMs / 60000) % 60; // Obtenemos los minutos
    return `${diffMins} minutos con ${diffSecs} segundos`;
  }

}

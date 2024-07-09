import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterProductByType'
})
export class FilterProductByTypePipe implements PipeTransform {

  transform(items: any[], type: string): any[] {
    if (!items) {
      return [];
    }
    if (!type) {
      return items;
    }
    return items.filter(item => item.tipo === type);
  }

}

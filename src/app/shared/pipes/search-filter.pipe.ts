import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchFilter',
  pure: false
})
export class SearchFilterPipe implements PipeTransform {

  transform(value: any, searchText: string): any {
    if(searchText === ''){
      return value;
    }
    return value.filter((item: any) => item.name.toLowerCase().includes(searchText.toLowerCase())
                                    || item.description.toLowerCase().includes(searchText.toLowerCase())
                                    || String(item.price).toLowerCase().includes(searchText.toLowerCase())
                                    || String(item.stock).toLowerCase().includes(searchText.toLowerCase())
                        );
  }

}

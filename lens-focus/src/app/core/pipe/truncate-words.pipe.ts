import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncateWords',
  standalone: false
})
export class TruncateWordsPipe implements PipeTransform {

  transform(value: string, wordLimit: number = 10): string {
    if (!value) return '';

    const words = value.split(/\s+/); // Split by whitespace
    if (words.length <= wordLimit) return value;

    return words.slice(0, wordLimit).join(' ') + '...'; // Add ellipsis at the end
  }

}

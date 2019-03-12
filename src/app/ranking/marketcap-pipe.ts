import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'marketCapPipe'})
export class MarketcapPipe implements PipeTransform {
  transform(value: number): string {
    let result;
    let marketcap;
    if(value >= 1000000000){
        result = value/1000000000;
        marketcap = `${result.toFixed(3)}B`;
    } else {
        result = value/1000000;
        marketcap = `${result.toFixed(3)}M`;
    }
    return marketcap;
  }
}
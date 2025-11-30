import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface CurrencyData {
  country: string;
  currency: string;
  symbol: string;
  code: string;
  asOnDate: string;
  usdRate: string;
  notFoundMessage: string;
}

export interface CurrencyResponse {
  currencyDataList: CurrencyData[];
}

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  private apiUrl = 'http://localhost:8080/currency/find-curr-exchange-rate';

  constructor(private http: HttpClient) { }

  getExchangeRate(country: string): Observable<CurrencyResponse> {
    return this.http.get<CurrencyResponse>(`${this.apiUrl}?country=${country}`);
  }
}

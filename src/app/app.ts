import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { CurrencyData, CurrencyService } from './services/currency.service';

interface ViewState {
  currencyDataList: CurrencyData[];
  errorMessage: string | null;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  country: string = '';
  viewState$: Observable<ViewState> | null = null;
  isLoading: boolean = false;

  constructor(private currencyService: CurrencyService) { }

  onSubmit() {
    if (!this.country.trim()) return;

    this.isLoading = true;

    this.viewState$ = this.currencyService.getExchangeRate(this.country).pipe(
      map(response => {
        if (response.currencyDataList && response.currencyDataList.length > 0) {
          const firstItem = response.currencyDataList[0];
          if (firstItem.notFoundMessage) {
            return {
              currencyDataList: [],
              errorMessage: firstItem.notFoundMessage
            };
          } else {
            console.log(response.currencyDataList);
            return {
              currencyDataList: response.currencyDataList,
              errorMessage: null
            };
          }
        } else {
          return {
            currencyDataList: [],
            errorMessage: 'No data received.'
          };
        }
      }),
      catchError(err => {
        console.error(err);
        return of({
          currencyDataList: [],
          errorMessage: 'An error occurred while fetching data. Please try again.'
        });
      }),
      finalize(() => {
        // This runs when the Observable completes (success or error)
        this.isLoading = false;
      })
    );
  }
}

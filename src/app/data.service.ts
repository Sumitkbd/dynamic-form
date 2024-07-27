import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Control, Dealer, Country, State } from './models/model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private http: HttpClient) { }

  getControlList(): Observable<Control[]> {
    return this.http.get<Control[]>(`./assets/ControlList_Json.json`);
  }

  getDealerList(): Observable<Dealer[]> {
    return this.http.get<Dealer[]>(`./assets/DealerList_Json.json`);
  }

  getCountryList(): Observable<Country[]> {
    return this.http.get<Country[]>(`./assets/CountryList_Json.json`);
  }

  getStateList(countryId: string): Observable<State[]> {
    return this.http
      .get<State[]>(`./assets/StateList_Json.json`)
      .pipe(
        map((states: State[]) =>
          states.filter((state) => state.CountryName === countryId)
        )
      );
  }
}

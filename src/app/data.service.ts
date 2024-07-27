
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Control } from './models/control-list.model';
import { DropdownItem } from './models/dropdown.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private controlList: Control[] = [
    { type: 'text', description: 'Manufacturer' },
    { type: 'dropdown', description: 'Country' },
    { type: 'dropdown', description: 'State' }
  ];

  private dealerList: DropdownItem[] = [
    { id: '1', name: 'Dealer A' },
    { id: '2', name: 'Dealer B' }
  ];

  private countryList: DropdownItem[] = [
    { id: '1', name: 'USA' },
    { id: '2', name: 'India' }
  ];

  private stateList: { [key: string]: DropdownItem[] } = {
    '1': [
      { id: '1', name: 'California' },
      { id: '2', name: 'Texas' }
    ],
    '2': [
      { id: '1', name: 'Maharashtra' },
      { id: '2', name: 'Delhi' }
    ]
  };

  getControlList(): Observable<Control[]> {
    return of(this.controlList);
  }

  getDealerList(): Observable<DropdownItem[]> {
    return of(this.dealerList);
  }

  getCountryList(): Observable<DropdownItem[]> {
    return of(this.countryList);
  }

  getStateList(countryId: string): Observable<DropdownItem[]> {
    return of(this.stateList[countryId] || []);
  }
}


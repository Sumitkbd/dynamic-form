import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DataService } from '../data.service';
import { Control, Dealer, Country, State } from '../models/model';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatAutocompleteModule,
    MatInputModule,
  ],
  templateUrl: './dynamic-form.component.html',
  styleUrl: './dynamic-form.component.css',
})
export class DynamicFormComponent implements OnInit {
  form!: FormGroup;
  controls: Control[] = [];

  dealerList: Dealer[] = [];
  filteredDealers!: Observable<Dealer[]>;
  displayDealer: any;

  countries: Country[] = [];
  filteredCountries!: Observable<Country[]>;
  displayCountry: any;

  states: State[] = [];
  filteredStates!: Observable<State[]>;
  displayState: any;
  dealer: any;

  constructor(private fb: FormBuilder, private dataService: DataService) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      dealer: [''],
      country: [''],
      state: [''],
      manufacturer: ['', Validators.required],
      serviceProvider: [''],
    });

    this.dataService.getControlList().subscribe((controls) => {
      this.controls = controls;
    });

    this.dataService.getDealerList().subscribe((dealerList) => {
      this.dealerList = dealerList;
      this.filteredDealers = this.form.get('dealer')!.valueChanges.pipe(
        startWith(''),
        map((value) => this._filterDealers(value || ''))
      );
    });

    this.dataService.getCountryList().subscribe((countries) => {
      this.countries = countries;
      this.filteredCountries = this.form.get('country')!.valueChanges.pipe(
        startWith(''),
        map((value) => this._filterCountries(value || ''))
      );
    });

    this.form.get('country')?.valueChanges.subscribe((countryId) => {
      if (countryId) {
        this.dataService.getStateList(countryId).subscribe((states) => {
          this.states = states;
          this.filteredStates = this.form.get('state')!.valueChanges.pipe(
            startWith(''),
            map((value) => this._filterStates(value || ''))
          );
        });
      } else {
        this.states = [];
      }
    });
  }

  onCountryChange(event: any) {
    const countryId = event.target.value;
    if (countryId) {
      this.dataService.getStateList(countryId).subscribe((states) => {
        this.states = states;
      });
    } else {
      this.states = [];
    }
  }

  onSubmit() {
    if (this.form.valid) {
      alert(`Submitted: ${JSON.stringify(this.form.value)}`);
    } else {
      alert('Please fill in all required fields.');
    }
  }

  private _filterDealers(value: string): Dealer[] {
    const filterValue = value.toLowerCase();
    const filtered = this.dealerList.filter((dealer) =>
      dealer.Desp.toLowerCase().includes(filterValue)
    );
    if (filtered.length === 0) {
      return [
        {
          Code: 0,
          Desp: 'The value doesn’t belong to the list',
          ExtraValue: '',
        },
      ];
    }
    return filtered;
  }

  private _filterCountries(value: string): Country[] {
    const filterValue = value.toLowerCase();
    const filtered = this.countries.filter((country) =>
      country.CountryName.toLowerCase().includes(filterValue)
    );
    if (filtered.length === 0) {
      return [
        {
          Code: 0,
          CountryName: 'The value doesn’t belong to the list',
          CountryCode: '',
        },
      ];
    }
    return filtered;
  }

  private _filterStates(value: string): State[] {
    const filterValue = value.toLowerCase();
    const filtered = this.states.filter((state) =>
      state.StateName.toLowerCase().includes(filterValue)
    );
    if (filtered.length === 0) {
      return [
        {
          Code: 0,
          StateName: 'The value doesn’t belong to the list',
          CountryMaster_Code: 0,
          CountryName: '',
        },
      ];
    }
    return filtered;
  }
}

import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DataService } from '../data.service';
import { Control, Dealer, Country, State } from '../models/model';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './dynamic-form.component.html',
  styleUrl: './dynamic-form.component.css',
})
export class DynamicFormComponent implements OnInit {
  form!: FormGroup;
  controls: Control[] = [];
  dealerList: Dealer[] = [];
  countries: Country[] = [];
  states: State[] = [];
  filteredStates: State[] = [];
  dealer: any;

  constructor(private fb: FormBuilder, private dataService: DataService) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      dealer: [''],
      country: [''],
      state: [''],
      manufacturer: ['', Validators.required],
      serviceProvider: ['', Validators.required],
    });

    this.dataService.getControlList().subscribe((controls) => {
      this.controls = controls;
    });

    this.dataService.getDealerList().subscribe((dealerList) => {
      this.dealerList = dealerList;
    });

    this.dataService.getCountryList().subscribe((countries) => {
      this.countries = countries;
    });

    this.form.get('country')?.valueChanges.subscribe((countryId) => {
      if (countryId) {
        this.dataService.getStateList(countryId).subscribe((states) => {
          this.states = states;
          // Reset the state field whenever country changes
          this.form.get('state')?.setValue('');
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
        this.filteredStates = states;
      });
    } else {
      this.states = [];
      this.filteredStates = [];
    }
  }

  onSubmit() {
    if (this.form.valid) {
      alert(`Submitted: ${JSON.stringify(this.form.value)}`);
    } else {
      alert('Please fill in all required fields.');
    }
  }

  filterStates(event: any) {
    const query = event.target.value.toLowerCase();
    this.filteredStates = this.states.filter((state) =>
      state.StateName.toLowerCase().includes(query)
    );
    if (this.filteredStates.length === 0) {
      this.filteredStates.push({
        Code: 0,
        StateName: 'The value doesn’t belong to the list',
        CountryMaster_Code: 0,
        CountryName: '',
      });
    }
  }
}

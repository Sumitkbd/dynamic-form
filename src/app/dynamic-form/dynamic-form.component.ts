
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataService } from '../data.service';
import { Control } from '../models/control-list.model';
import { DropdownItem } from '../models/dropdown.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dynamic-form.component.html',
  styleUrl: './dynamic-form.component.css'
})
export class DynamicFormComponent implements OnInit {
  form!: FormGroup;
  controls: Control[] = [];
  dealerList: DropdownItem[] = [];
  countries: DropdownItem[] = [];
  states: DropdownItem[] = [];
  filteredStates: DropdownItem[] = [];
  dealer: any;

  constructor(private fb: FormBuilder, private dataService: DataService) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      dealer: [''],
      manufacturer: ['', Validators.required],
      country: [''],
      state: ['']
    });

    this.dataService.getControlList().subscribe(controls => {
      this.controls = controls;
    });

    this.dataService.getDealerList().subscribe(dealerList => {
      this.dealerList = dealerList;
    });


    this.dataService.getCountryList().subscribe(countries => {
      this.countries = countries;
    });

    this.form.get('country')?.valueChanges.subscribe(countryId => {
      if (countryId) {
        this.dataService.getStateList(countryId).subscribe(states => {
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
      this.dataService.getStateList(countryId).subscribe(states => {
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
    console.log(this.form.value)


  }

  filterStates(event: any) {
    const query = event.target.value.toLowerCase();
    this.filteredStates = this.states.filter(state => state.name.toLowerCase().includes(query));
    if (this.filteredStates.length === 0) {
      this.filteredStates.push({ id: '', name: 'The value doesn’t belong to the list' });
    }
  }
}



export interface Control {
  Code: number;
  ControlLabel: string;
  ControlType: string;
  MaxLength: number;
}

export interface Country {
  Code: number;
  CountryName: string;
  CountryCode: string;
}

export interface State {
  Code: number;
  CountryMaster_Code: number;
  CountryName: string;
  StateName: string;
}

export interface Dealer {
  Code: number;
  Desp: string;
  ExtraValue: string;
}

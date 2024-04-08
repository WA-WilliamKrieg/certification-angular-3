import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-zipcode-entry',
  template: `
    <div class="well">
      <h2>Enter a zipcode:</h2>
      <input type="text" #zipcodeInput placeholder="Zipcode" class="form-control">
      <br>
      <button class="btn btn-primary" (click)="addLocation.emit(zipcodeInput.value)" >
        Add location
      </button>
    </div>
  `
})
export class ZipcodeEntryComponent {

  @Output() addLocation =  new EventEmitter<string>();

  constructor() { }

}

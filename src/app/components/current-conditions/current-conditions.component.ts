import {Component, EventEmitter, inject, Input, Output, Signal} from '@angular/core';
import {WeatherService} from "../../services/weather.service";
import {Router} from "@angular/router";
import {ConditionsExtended} from '../../types/conditions-and-zip.type';

@Component({
  selector: 'app-current-conditions',
  templateUrl: './current-conditions.component.html',
  styleUrls: ['./current-conditions.component.css']
})
export class CurrentConditionsComponent {

  protected weatherService = inject(WeatherService);
  private router = inject(Router);
  protected currentConditionsByZip: Signal<ConditionsExtended[]> = this.weatherService.getCurrentConditions();

  @Output() removeLocation = new EventEmitter<string>();
  @Output() goTo = new EventEmitter<string>();

  public removeLocationCallback(index: number) {
    this.removeLocation.emit(this.currentConditionsByZip()[index].zip)
  }

}

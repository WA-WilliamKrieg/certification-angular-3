import {Component, EventEmitter, inject, Output, Signal} from '@angular/core';
import {WeatherService} from '../../services/weather.service';
import {ConditionsExtended} from '../../types/conditions-and-zip.type';

@Component({
  selector: 'app-current-conditions',
  templateUrl: './current-conditions.component.html',
  styleUrls: ['./current-conditions.component.css']
})
export class CurrentConditionsComponent{

  protected weatherService = inject(WeatherService);
  protected currentConditionsByZip: Signal<ConditionsExtended[]> = this.weatherService.getCurrentConditions();

  @Output() removeLocation = new EventEmitter<string>();
  @Output() goTo = new EventEmitter<string>();

  public removeLocationCallback(index: number) {
    this.removeLocation.emit(this.currentConditionsByZip()[index].zip)
  }


}

import {Component, inject} from '@angular/core';
import {LocationService} from '../../services/location.service';
import {WeatherService} from '../../services/weather.service';
import {Router} from '@angular/router';
import {ConditionsExtended} from '../../types/conditions-and-zip.type';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
})
export class MainPageComponent {

  private  locationService = inject(LocationService);
  protected weatherService = inject(WeatherService);
  private  router = inject(Router);


  constructor() {
    this.locationService.locations.forEach((zipcode) => this.weatherService.addCurrentConditions(zipcode));
  }


  public addLocationCallback(zipcode: string) {
    this.locationService.addLocation(zipcode)
    this.weatherService.addCurrentConditions(zipcode);
  }
  public removeLocationCallback(zipcode: string) {
    this.locationService.removeLocation(zipcode);
    this.weatherService.removeCurrentConditions(zipcode);
  }
  public goToLocationCallback(zipcode: string) {
    this.router.navigate(['/forecast', zipcode])
  }


}

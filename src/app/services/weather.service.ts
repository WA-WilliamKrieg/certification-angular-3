import {Injectable, Signal, signal} from '@angular/core';
import {Observable} from 'rxjs';

import {HttpClient} from '@angular/common/http';
import {CurrentConditions} from '../types/current-conditions.type';
import {Forecast} from '../pages/forecasts-list/forecast.type';
import {environment} from '../../environments/environment';
import {ConditionsExtended} from '../types/conditions-and-zip.type';

@Injectable()
export class WeatherService {

    private currentConditions = signal<ConditionsExtended[]>([]);
    private conditionCacheTime =  '0-2'; // 0 day and 2 hours
    private conditionCacheHeader =  {
        headers : { 'Cache-Duration': `${this.conditionCacheTime}` }
    }
    private forecastCacheTime = '5-0'; //  5 days and 0 hours
    private forecastCacheHeader =  {
        headers: {'Cache-Duration': `${this.forecastCacheTime}`}
    }

    constructor(private http: HttpClient) {
    }

    addCurrentConditions(zipcode: string): void {
        // If current conditions for this zipcode are already being displayed, don't make another request
        if (this.currentConditions().some(condition => condition.zip === zipcode)) {
            return;
        }
        // Here we make a request to get the current conditions data from the API. Note the use of backticks and an expression to insert the zipcode
        this.http.get<CurrentConditions>(
            this.getCurrentConditionUrl(zipcode), this.conditionCacheHeader )
            .subscribe(data => this.currentConditions.update(conditions => [...conditions, {zip: zipcode, data, label : data.name + ` (${zipcode})`}]));
    }

    removeCurrentConditions(zipcode: string) {
        this.currentConditions.update(conditions => conditions.filter(condition => condition.zip !== zipcode));
    }

    getCurrentConditions(): Signal<ConditionsExtended[]> {
        return this.currentConditions.asReadonly();
    }

    getCurrentConditionUrl(zipcode: string): string {
        return `${environment.API_URL}/weather?zip=${zipcode},us&units=imperial&APPID=${environment.APP_ID}`
    }

    getForecast(zipcode: string): Observable<Forecast> {
        // Here we make a request to get the forecast data from the API. Note the use of backticks and an expression to insert the zipcode
        return this.http.get<Forecast>(this.getForecastUrl(zipcode),this.forecastCacheHeader);
    }
    getForecastUrl(zipcode: string): string {
        return `${environment.API_URL}/forecast/daily?zip=${zipcode},us&units=imperial&cnt=5&APPID=${environment.APP_ID}`
    }

    getWeatherIcon(id: number): string {
        let icon = environment.ICON_URL;
        if (id >= 200 && id <= 232) {
            return icon + 'art_storm.png';
        } else if (id >= 501 && id <= 511) {
            return icon + 'art_rain.png';
        } else if (id === 500 || (id >= 520 && id <= 531)) {
            return icon + 'art_light_rain.png';
        } else if (id >= 600 && id <= 622) {
            return icon + 'art_snow.png';
        } else if (id >= 801 && id <= 804) {
            return icon + 'art_clouds.png';
        } else if (id === 741 || id === 761) {
            return icon + "art_fog.png";
        } else {
            return icon + "art_clear.png";
        }
    }

}

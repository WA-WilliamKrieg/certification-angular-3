import {Injectable} from '@angular/core';

export const LOCATIONS: string = 'locations';

@Injectable()
export class LocationService {

    private _locations: string[] = [];
    get locations(): string[] {
        return this._locations;
    }

    set locations(value: string[]) {
        this._locations = value;
        localStorage.setItem(LOCATIONS, JSON.stringify(this.locations));
    }

    constructor() {
        this._locations = JSON.parse(localStorage.getItem(LOCATIONS) || '[]');
    }

    addLocation(zipcode: string) {
        if (!this.locations.includes(zipcode))
            this.locations = [...this.locations, zipcode];
    }

    removeLocation(zipcode: string) {
        if (this.locations.includes(zipcode))
            this.locations = this.locations.filter(location => location !== zipcode);
    }
}

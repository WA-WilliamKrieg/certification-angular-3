import {environment} from '../../environments/environment';

export const  API_CONST = {
    FORECAST : {
        GET: `${environment.API_URL}/forecast/daily?zip={zipcode},us&units=imperial&cnt=5&APPID=${environment.APP_ID}`
    },
    WEATHER : {
        GET : `${environment.API_URL}/weather?zip={zipcode},us&units=imperial&APPID=${environment.APP_ID}`
    }
}

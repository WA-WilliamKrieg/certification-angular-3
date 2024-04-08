import { Injectable } from '@angular/core';
import {
    HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import {CacheService} from '../services/utils/cache.service';

@Injectable()
export class CacheInterceptor implements HttpInterceptor {

    constructor(private cacheService: CacheService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const cacheKey = req.url;
        const cachedResponse = this.cacheService.get(cacheKey);

        // Si les données sont disponibles dans le cache, retournez ces données sans appeler le serveur.
        if (cachedResponse) {
            return of(new HttpResponse({ status: 200, body: cachedResponse }));
        }

        const ttlFromHeader = req.headers.get('Cache-Duration') || "0-2";
        // Remove the Cache-Duration header from the request
        const headers = req.headers.delete('Cache-Duration');
        // Clone the request and set the new headers
        req = req.clone({ headers });


        // Sinon, on passe la requête au serveur et cachez la réponse.
        return next.handle(req).pipe(
            tap(event => {
                if (event instanceof HttpResponse) {
                    const ttl = ttlFromHeader.split('-').map(Number);
                    if(ttl.length === 2) {
                        this.cacheService.set(cacheKey, event.body, {days: ttl[0], hours: ttl[1]});
                    }
                }
            })
        );
    }
}

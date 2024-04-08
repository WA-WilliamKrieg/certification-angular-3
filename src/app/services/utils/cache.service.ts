import { Injectable } from '@angular/core';

interface CacheEntry {
    expiry: number;
    data: any;
}

@Injectable({
    providedIn: 'root'
})
export class CacheService {
    private cache = new Map<string, CacheEntry>();

    constructor() { }

    // Obtient les données du cache si elles existent et ne sont pas expirées
    get(key: string): any | null {
        const entry = localStorage.getItem(key);
        if (!entry) return null;

        const { expiry, data } = JSON.parse(entry);
        if (Date.now() > expiry) {
            localStorage.removeItem(key);
            return null;
        }
        return data;
    }

    // Ajoute ou met à jour les données du cache avec une durée de vie spécifique
    set(key: string, data: any, time = {days:0, hours:0}): void {
        const today = new Date();
        // Calcule le temps d'expiration
        let expiry = new Date(today.getTime() + (time.days * 24 * 60 * 60 * 1000) + (time.hours * 60 * 60 * 1000)).getTime();
        const entry = { expiry, data };
        localStorage.setItem(key, JSON.stringify(entry));
    }

    // Delete the cache entry with the given key if you want to clear the cache
    delete(key: string): void {
        localStorage.removeItem(key);
    }
}

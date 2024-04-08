import {Component, Input} from '@angular/core';
import {NgIf} from '@angular/common';

@Component({
    selector: 'app-tab',
    standalone: true,
    imports: [
        NgIf
    ],
    template: `
        <div *ngIf="active">
            <ng-content></ng-content>
        </div>
    `
})
export class TabComponent {

    @Input() label: string = '';
    active: boolean = false;

}

import {
    AfterContentInit, AfterViewInit, ChangeDetectorRef,
    Component, ContentChild,
    ContentChildren, EventEmitter, Input, OnDestroy, Output,
    QueryList, ViewChildren,
} from '@angular/core';
import {NgForOf} from '@angular/common';
import {TabComponent} from '../tab/tab.component';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';


interface WithLabel {
    label: string;
}

@Component({
    selector: 'app-tab-group',
    standalone: true,
    imports: [
        TabComponent,
        NgForOf
    ],
    template: `
        <ul class="tabs">
            <li *ngFor="let tab of tabsToDisplay; let i = index" (click)="selectTab(i)" [class.active]="activeTab === i">
                {{tab.label}} <button (click)="removeTab(i)">X</button>
            </li>
        </ul>
        <div class="tab-content" [hidden]="!tabsToDisplay.length">
            <ng-content></ng-content>
        </div>
    `,
    styleUrls: ['./tab-group.component.css']
})
export class TabGroupComponent  implements AfterContentInit, OnDestroy{

    // QueryList is imuable is not possible to delete a TabComponent from the QueryList
    // But it's possible to copy the list and remove the tab from the copy
    // Inspiration : Angular Material Tabs With Tab Group and Tab Component
    @ContentChildren(TabComponent) tabs: QueryList<TabComponent> | undefined
    @Output() deleteTab = new EventEmitter<number>();


    public activeTab: number | undefined
    public tabsToDisplay : {label: string, active: boolean}[] = [];

    private destroy$ = new Subject<void>();


    constructor() {
    }

    ngAfterContentInit() {
        const activeTabs = this.tabs?.filter(tab => tab.active) || [];
        if (activeTabs.length === 0 && this.tabs) {
            this.selectTab(0);
        }
       if(this.tabs)
           this.setupTabs(this.tabs.toArray())


        this.tabs?.changes.pipe(takeUntil(this.destroy$)).subscribe((tabs) => {
            this.setupTabs(tabs.toArray())
        });
    }

    private setupTabs(tabs:TabComponent[]) {
        this.tabsToDisplay = tabs.map((tab : TabComponent) => ({label: tab.label, active: tab.active}))

    }

    selectTab(tabIndex:number) {
        if(!this.tabs || !this.tabs.toArray()[tabIndex]) return;
        setTimeout(() => {
            this.tabs?.forEach((tab, index) => tab.active = (index === tabIndex))
            this.activeTab = tabIndex;
        });
    }

    // c'est plus facile de faire remonter la suppression d'un tab via un EventEmitter pour que le parent puisse gérer la suppression
    // Mais dans le test il est bien demandé : "The parent component doesn’t have to know how to remove a tab "
    // On est quand même obliger d'emettre une information pour que le parent puisse gérer la suppression dans le storage par exemple
    removeTab(index: number) {
        if(!this.tabs) return;
        this.tabsToDisplay = this.tabsToDisplay.filter((tab, i) => i !== index);
        // Théoriquement on devrait faire ça pour supprimer le tab de la liste des tabs
        this.deleteTab.emit(index);
        if(index === this.activeTab && this.tabsToDisplay.length > 0) {
            this.selectTab(0)
        }
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

}

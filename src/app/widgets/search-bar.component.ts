import {Component, EventEmitter, Input, Output, OnChanges, ViewChild} from '@angular/core';
import {Query} from '../datastore/query';
import {ConfigLoader} from '../configuration/config-loader';
import {IdaiType} from '../configuration/idai-type';

@Component({
    moduleId: module.id,
    selector: 'search-bar',
    templateUrl: './search-bar.html',
    host: {
        '(document:click)': 'handleClick($event)',
    }
})

/**
 * @author Sebastian Cuy
 * @author Thomas Kleinke
 * @author Jan G. Wieners
 */
export class SearchBarComponent implements OnChanges {

    // 'resource' or 'image'
    @Input() type: string = 'resource';

    // If these values are set, only valid domain types for the given relation name & range type are shown in the
    // filter menu.
    @Input() relationName: string;
    @Input() relationRangeType: string;

    @Input() showFiltersMenu: boolean;
    @Output() onQueryChanged = new EventEmitter<Query>();
    @ViewChild('p') private popover;

    private q: string = '';
    private filterOptions: Array<IdaiType> = [];
    private queryTimeoutReference: number;
    private selectedType: string;


    constructor(private configLoader: ConfigLoader) {
        this.initializeFilterOptions();
    }

    public ngOnChanges() {

        this.resetSelectedType();
        this.initializeFilterOptions();
        this.emitCurrentQuery();
    }

    public qChanged(q: string) {

        if (q) {
            this.q = q;
        } else {
            this.q = '';
        }

        if (this.queryTimeoutReference) clearTimeout(this.queryTimeoutReference);
        this.queryTimeoutReference = setTimeout(this.emitCurrentQuery.bind(this), 500);
    }

    public setSelectedType(selectedType: string) {

        this.selectedType = selectedType;
        this.emitCurrentQuery();
    }

    public resetSelectedType() {

        this.selectedType = this.type;
    }

    private emitCurrentQuery() {

        let query: Query = { q: this.q, type: this.selectedType };
        this.onQueryChanged.emit(query);
    }

    private initializeFilterOptions() {

        this.configLoader.getProjectConfiguration().then(projectConfiguration => {

            let types = projectConfiguration.getTypesList();
            this.filterOptions = [];

            for (let type of types) {
                if (type.name == 'image' || type.name == 'project') continue;

                let parentTypes: Array<string> = projectConfiguration.getParentTypes(type.name);
                if (parentTypes.indexOf('image') > -1) continue;

                if (this.relationName && this.relationRangeType
                        && !projectConfiguration.isAllowedRelationDomainType(type.name, this.relationRangeType,
                        this.relationName)) {
                    continue;
                }

                this.addFilterOption(type);
            }
        });
    }

    private addFilterOption(type: IdaiType) {

        if (this.filterOptions.indexOf(type) == -1) {
            this.filterOptions.push(type);
        }
    }

    private handleClick(event) {

        if (!this.popover) return;
        var target = event.target;
        var inside = false;
        do {
            if (target.id === 'filter-button') {
                inside = true;
                break;
            }
            target = target.parentNode;
        } while (target);
        if (!inside) {
            this.popover.close();
        }
    }

}
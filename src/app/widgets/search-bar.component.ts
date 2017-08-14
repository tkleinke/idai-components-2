import {Component, EventEmitter, Input, Output, OnChanges, ViewChild} from '@angular/core';
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

    // If these values are set, only valid domain types for the given relation name & range type are shown in the
    // filter menu.
    @Input() relationName: string;
    @Input() relationRangeType: string;

    @Input() type: string;
    @Input() showFiltersMenu: boolean = true;

    @Output() onTypeChanged = new EventEmitter<string>();
    @Output() onQueryStringChanged = new EventEmitter<string>();

    @ViewChild('p') private popover;

    private q: string = '';
    private filterOptions: Array<IdaiType> = [];
    private queryTimeoutReference: number;


    constructor(private configLoader: ConfigLoader) {
        this.initializeFilterOptions();
    }

    public ngOnChanges() {

        this.initializeFilterOptions();
    }

    public setQueryString(q: string) {

        q ? this.q = q : this.q = '';
        if (this.queryTimeoutReference) clearTimeout(this.queryTimeoutReference);
        this.queryTimeoutReference = setTimeout(this.emitQueryString.bind(this), 300);
    }

    public setType(type: string) {

        this.type = type;
        this.onTypeChanged.emit(this.type);
    }

    public emitQueryString() {

        this.onQueryStringChanged.emit(this.q);
    }

    private initializeFilterOptions() {

        this.filterOptions = [];

        this.configLoader.getProjectConfiguration().then(projectConfiguration => {

            for (let type of projectConfiguration.getTypesList()) {
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
        let target = event.target;
        let inside = false;
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
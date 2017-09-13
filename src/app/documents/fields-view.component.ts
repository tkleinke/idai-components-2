import {Component, OnChanges, Input} from '@angular/core';
import {ConfigLoader} from '../configuration/config-loader';
import {Resource} from '../model/resource';

@Component({
    selector: 'fields-view',
    moduleId: module.id,
    templateUrl: './fields-view.html'
})

/**
 * Shows fields of a document.
 *
 * @author Thomas Kleinke
 * @author Sebastian Cuy
 */
export class FieldsViewComponent implements OnChanges {

    @Input() resource: Resource;

    protected fields: Array<any>;

    constructor(
        private configLoader: ConfigLoader
    ) { }

    ngOnChanges() {

        this.fields = [];
        if (this.resource) this.processFields(this.resource);
    }

    public isBoolean(value): boolean {

        return typeof value == 'boolean';
    }

    private processFields(resource: Resource) {

        this.configLoader.getProjectConfiguration().then(projectConfiguration => {

            const ignoredFields: string[] = ['relations'];

            for (let fieldDefinition of projectConfiguration.getFieldDefinitions(resource.type)) {

                const fieldName = fieldDefinition.name;

                if (!projectConfiguration.isVisible(resource.type, fieldName)) continue;

                if (resource[fieldName] && ignoredFields.indexOf(fieldName) == -1) {
                    this.fields.push({
                        name: projectConfiguration.getFieldDefinitionLabel(resource.type, fieldName),
                        value: resource[fieldName],
                        isArray: Array.isArray(resource[fieldName])
                    });
                }
            }
        });
    }
}
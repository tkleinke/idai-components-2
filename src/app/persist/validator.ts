import {Injectable} from '@angular/core';
import {MDInternal} from '../messages/md-internal';
import {ConfigLoader} from '../configuration/config-loader';
import {ProjectConfiguration} from '../configuration/project-configuration';
import {FieldDefinition} from '../configuration/field-definition';
import {RelationDefinition} from '../configuration/relation-definition';
import {IdaiType} from '../configuration/idai-type';
import {Document} from '../model/document';

/**
 * @author Daniel de Oliveira
 * @author Thomas Kleinke
 */
@Injectable()
export class Validator {

    constructor(private configLoader: ConfigLoader) {}

    /**
     * @param doc
     * @returns resolves with () or rejects with msgsWithParams
     */
    public validate(doc: Document): Promise<any> {

        return this.configLoader.getProjectConfiguration().then(projectConfiguration => {

            let resource = doc['resource'];

            if (!Validator.validateType(resource, projectConfiguration)) {
                let err = [MDInternal.VALIDATION_ERROR_INVALIDTYPE];
                err.push(resource.id);
                err.push('"' + resource.type + '"');
                return Promise.reject(err);
            }

            let missingProperties = Validator.getMissingProperties(resource, projectConfiguration);
            if (missingProperties.length > 0) {
                return Promise.reject([MDInternal.VALIDATION_ERROR_MISSINGPROPERTY, resource.type]
                    .concat(missingProperties.join((', '))));
            }

            let invalidFields;
            if (invalidFields = Validator.validateFields(resource, projectConfiguration)) {
                let err = [invalidFields.length == 1 ?
                    MDInternal.VALIDATION_ERROR_INVALIDFIELD : MDInternal.VALIDATION_ERROR_INVALIDFIELDS];
                err.push(resource.type);
                err.push(invalidFields.join(', '));
                return Promise.reject(err);
            }

            let invalidRelationFields;
            if (invalidRelationFields = Validator.validateRelations(resource, projectConfiguration)) {
                let err = [invalidRelationFields.length == 1 ?
                    MDInternal.VALIDATION_ERROR_INVALIDFIELD : MDInternal.VALIDATION_ERROR_INVALIDFIELDS];
                err.push(resource.type);
                err.push(invalidFields.join(', '));
                return Promise.reject(err);
            }

            let invalidNumericValues;
            if (invalidNumericValues = Validator.validateNumericValues(resource, projectConfiguration)) {
                let err = [invalidNumericValues.length == 1 ?
                    MDInternal.VALIDATION_ERROR_INVALID_NUMERIC_VALUE :
                    MDInternal.VALIDATION_ERROR_INVALID_NUMERIC_VALUES];
                err.push(resource.type);
                err.push(invalidNumericValues.join(', '));
                return Promise.reject(err);
            }

            return this.validateCustom(doc);
        });
    }

    /**
     * @param doc
     * @returns {Promise<void>} resolves with () or rejects with msgsWithParams in case of validation error
     */
    protected validateCustom(doc: Document): Promise<any> {

        return Promise.resolve();
    }

    private static getMissingProperties(resource: any, projectConfiguration: ProjectConfiguration) {

        let missingFields: string[] = [];
        let fieldDefinitions: Array<FieldDefinition> = projectConfiguration.getFieldDefinitions(resource.type);

        for (let fieldDefinition of fieldDefinitions) {
            if (projectConfiguration.isMandatory(resource.type,fieldDefinition.name)) {
                if (resource[fieldDefinition.name] == undefined || resource[fieldDefinition.name] == '') {
                    missingFields.push(fieldDefinition.name);
                }
            }
        }

        return missingFields;
    }

    /**
     *
     * @param resource
     * @param projectConfiguration
     * @returns {boolean} true if the type of the resource is valid, otherwise false
     */
    private static validateType(resource: any,projectConfiguration:ProjectConfiguration): boolean {

        if (!resource.type) return false;

        let types: Array<IdaiType> = projectConfiguration.getTypesList();

        for (let i in types) {
            if (types[i].name == resource.type) return true;
        }

        return false;
    }

    /**
     *
     * @param resource
     * @param projectConfiguration
     * @returns {string[]} the names of invalid fields if one or more of the fields are invalid, otherwise
     * <code>undefined</code>
     */
    public static validateFields(resource: any, projectConfiguration: ProjectConfiguration): string[] {

        const projectFields: Array<FieldDefinition> = projectConfiguration.getFieldDefinitions(resource.type);
        const defaultFields: Array<FieldDefinition> = [{ name: 'relations' }];

        const fields: Array<any> = projectFields.concat(defaultFields);

        const invalidFields: Array<any> = [];

        for (let resourceField in resource) {
            if (resource.hasOwnProperty(resourceField)) {
                let fieldFound: boolean = false;
                for (let i in fields) {
                    if (fields[i].name == resourceField) {
                        fieldFound = true;
                        break;
                    }
                }
                if (!fieldFound) {
                    invalidFields.push(resourceField);
                }
            }
        }

        if (invalidFields.length > 0) {
            return invalidFields;
        }
        else {
            return undefined;
        }
    }

    /**
     * @returns {string[]} the names of invalid relation fields if one or more of the fields are invalid, otherwise
     * <code>undefined</code>
     */
    public static validateRelations(resource: any, projectConfiguration: ProjectConfiguration): string[] {

        const fields: Array<RelationDefinition> = projectConfiguration.getRelationDefinitions(resource.type);

        const invalidFields: Array<any> = [];

        for (let relationField in resource.relations) {
            if (resource.relations.hasOwnProperty(relationField)) {
                let fieldFound: boolean = false;
                for (let i in fields) {
                    if (fields[i].name == relationField) {
                        fieldFound = true;
                        break;
                    }
                }
                if (!fieldFound) {
                    invalidFields.push(relationField);
                }
            }
        }

        if (invalidFields.length > 0) {
            return invalidFields;
        }
        else {
            return undefined;
        }
    }

    public static validateNumericValues(resource: any, projectConfiguration: ProjectConfiguration): string[] {

        let projectFields: Array<FieldDefinition> = projectConfiguration.getFieldDefinitions(resource.type);
        let numericInputTypes: string[] = ['unsignedInt', 'float', 'unsignedFloat'];
        let invalidFields: string[] = [];

        for (let i in projectFields) {
            let fieldDef = projectFields[i];

            if (fieldDef.hasOwnProperty('inputType')) {
                let value = resource[fieldDef.name];

                if (value && numericInputTypes.indexOf(fieldDef['inputType']) != -1) {
                    let valueIsValid = false;

                    if (fieldDef['inputType'] == 'unsignedInt') {
                        valueIsValid = value >>> 0 === parseFloat(value);
                    }

                    if (fieldDef['inputType'] == 'unsignedFloat') {
                        valueIsValid = 0 <= (value = parseFloat(value));
                    }
                    if (fieldDef['inputType'] == 'float') {
                        valueIsValid = !isNaN(value = parseFloat(value));
                    }

                    if (!valueIsValid) {
                        invalidFields.push(fieldDef.label);
                    }
                }
            }
        }

        if (invalidFields.length > 0) {
            return invalidFields;
        } else {
            return undefined;
        }
    }
}
import {Component, Input} from '@angular/core';
import {Resource} from "../../../model/resource";
import {DocumentEditChangeMonitor} from "../document-edit-change-monitor";
import {DecimalPipe} from "@angular/common";


/**
 * @author Fabian Z.
 */
@Component({
    moduleId: module.id,
    selector: 'dai-dimension',
    templateUrl: './dimension.html'
})

export class DimensionComponent {
    @Input() resource: Resource;
    @Input() field: any;

    constructor(private documentEditChangeMonitor: DocumentEditChangeMonitor,
        private decimalPipe: DecimalPipe) {
    }
    public newDimension: {} = null;

    public createNewDimension() {
    	this.newDimension = {
    		"new": true,
    		"hasValue": 0,
            "hasInputValue": 0,
			"hasMeasurementPosition": "",
			"hasMeasurementComment": "",
			"hasInputUnit": "cm",
			"isImprecise": false,
			"hasLabel": ""
    	}
    }

    private convertInputToMM(dimension) {
    	let _val = parseFloat(dimension["hasInputValue"]);
        if (dimension["hasInputUnit"] == "mm") dimension["hasValue"] = _val * 1000;
    	if (dimension["hasInputUnit"] == "cm") dimension["hasValue"] = _val * 10000;
    	if (dimension["hasInputUnit"] == "m") dimension["hasValue"] = _val * 1000000;
    }

    private generateLabel(dimension) {
        let formattedValue = "" + this.decimalPipe.transform(dimension["hasInputValue"]);
    	dimension["hasLabel"] = (dimension["isImprecise"] ? "ca. " : "")
            + formattedValue
            + " " + dimension["hasInputUnit"];
    	if (dimension["hasMeasurementPosition"])
            dimension['hasLabel'] += ", Gemessen an " + dimension["hasMeasurementPosition"];
    	if (dimension["hasMeasurementComment"])
            dimension['hasLabel'] += " (" + dimension["hasMeasurementComment"] + ")";
    }

    public cancelNewDimension() {
        this.newDimension = null;
    }

    public removeDimensionAtIndex(dimensionIndex) {
        this.resource[this.field.name].splice(dimensionIndex, 1);
    }

    public saveDimension(dimension) {
    	if (!this.resource[this.field.name]) this.resource[this.field.name] = [];

    	this.convertInputToMM(dimension);
    	this.generateLabel(dimension);
    	if (dimension["new"]) {
    		delete dimension["new"];
    		this.resource[this.field.name].push(dimension);
            this.newDimension = null;
    	} else {
    	    delete dimension["editing"];
        }
    	this.documentEditChangeMonitor.setChanged();
    }
}
import {Component, Input} from '@angular/core';
import {Resource} from "../../model/resource";
import {DocumentEditChangeMonitor} from "../document-edit-change-monitor";


/**
 * @author Fabian Z.
 */
@Component({
    moduleId: module.id,
    selector: 'dai-diameter',
    templateUrl: './diameter.html'
})

export class DiameterComponent {
    @Input() resource: Resource;
    @Input() field: any;

    constructor(private documentEditChangeMonitor: DocumentEditChangeMonitor) {
    }
    public newDiameter: {} = null;

    public createNewDiameter() {
    	this.newDiameter = {
    		"new": true,
    		"hasValue": 12,
			"hasMeasurementPosition": (this.field.position_values ? this.field.position_values[0] : "")  ,
			"hasMeasurementComment": "",
			"unit": "cm",
			"isImprecise": true,
			"hasLabel": ""
    	}
    }

    private convertInputToCm(diameter) {
    	let _val = parseFloat(diameter["hasValue"]);
    	if (diameter["unit"] == "m") diameter["hasValue"] = _val * 100;
    	if (diameter["unit"] == "mm") diameter["hasValue"] = _val / 10;
    }

    private generateLabel(diameter) {
    	diameter["hasLabel"] = (diameter["isImprecise"] ? "ca. " : "") + diameter["hasValue"] + "cm, Gemessen an " + diameter["hasMeasurementPosition"] + " (" + diameter["hasMeasurementComment"] + ")";
    }

    public saveDiameter(diameter) {
    	if (!this.resource[this.field.name]) this.resource[this.field.name] = [];
    	this.convertInputToCm(diameter);
    	this.generateLabel(diameter);
    	if (diameter["new"]) {
    		delete diameter["new"];
    		this.resource[this.field.name].push(diameter);
    	}
    	delete diameter["editing"];
    	this.newDiameter = null;
    	this.documentEditChangeMonitor.setChanged();
    }
}
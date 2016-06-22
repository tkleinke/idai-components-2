System.register(['@angular/core', "@angular/common", "./load-and-save-service"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, common_1, load_and_save_service_1;
    var ValuelistComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (load_and_save_service_1_1) {
                load_and_save_service_1 = load_and_save_service_1_1;
            }],
        execute: function() {
            /**
             * @author Thomas Kleinke
             */
            ValuelistComponent = (function () {
                function ValuelistComponent(loadAndSaveService) {
                    this.loadAndSaveService = loadAndSaveService;
                }
                ValuelistComponent.prototype.ngOnChanges = function () {
                    if (this.document)
                        this.resource = this.document['resource'];
                };
                ValuelistComponent.prototype.setValues = function (selectedOptions) {
                    this.resource[this.field.field] = [];
                    for (var i = 0; i < selectedOptions.length; i++) {
                        this.resource[this.field.field].push(selectedOptions.item(i).childNodes[0].nodeValue);
                    }
                    this.loadAndSaveService.setChanged();
                };
                ValuelistComponent.prototype.isSelected = function (item) {
                    if (this.resource[this.field.field])
                        return (this.resource[this.field.field].indexOf(item) > -1);
                    else
                        return false;
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], ValuelistComponent.prototype, "document", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], ValuelistComponent.prototype, "field", void 0);
                ValuelistComponent = __decorate([
                    core_1.Component({
                        selector: 'valuelist',
                        template: "<div>\n    <select (change)=\"setValues($event.target.selectedOptions)\" class=\"form-control\" multiple>\n        <option *ngFor=\"let item of field.valuelist\" value=\"{{item}}\" [selected]=\"isSelected(item)\">{{item}}</option>\n    </select>\n</div>",
                        directives: [common_1.CORE_DIRECTIVES, common_1.COMMON_DIRECTIVES, common_1.FORM_DIRECTIVES]
                    }), 
                    __metadata('design:paramtypes', [load_and_save_service_1.LoadAndSaveService])
                ], ValuelistComponent);
                return ValuelistComponent;
            }());
            exports_1("ValuelistComponent", ValuelistComponent);
        }
    }
});
//# sourceMappingURL=valuelist.component.js.map
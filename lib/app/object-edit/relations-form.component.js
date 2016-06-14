System.register(['@angular/core', "./persistence-manager", "@angular/common", "./relation-picker-group.component", "./valuelist.component", "./fieldlist.component", "./localized.component"], function(exports_1, context_1) {
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
    var core_1, persistence_manager_1, common_1, relation_picker_group_component_1, valuelist_component_1, fieldlist_component_1, localized_component_1;
    var RelationsFormComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (persistence_manager_1_1) {
                persistence_manager_1 = persistence_manager_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (relation_picker_group_component_1_1) {
                relation_picker_group_component_1 = relation_picker_group_component_1_1;
            },
            function (valuelist_component_1_1) {
                valuelist_component_1 = valuelist_component_1_1;
            },
            function (fieldlist_component_1_1) {
                fieldlist_component_1 = fieldlist_component_1_1;
            },
            function (localized_component_1_1) {
                localized_component_1 = localized_component_1_1;
            }],
        execute: function() {
            /**
             * @author Daniel de Oliveira
             */
            RelationsFormComponent = (function () {
                function RelationsFormComponent(persistenceManager) {
                    this.persistenceManager = persistenceManager;
                }
                RelationsFormComponent.prototype.markAsChanged = function () {
                    this.persistenceManager.load(this.object);
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], RelationsFormComponent.prototype, "object", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], RelationsFormComponent.prototype, "primary", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], RelationsFormComponent.prototype, "relationFields", void 0);
                RelationsFormComponent = __decorate([
                    core_1.Component({
                        directives: [
                            common_1.FORM_DIRECTIVES,
                            common_1.CORE_DIRECTIVES,
                            common_1.COMMON_DIRECTIVES,
                            relation_picker_group_component_1.RelationPickerGroupComponent,
                            valuelist_component_1.ValuelistComponent,
                            fieldlist_component_1.FieldlistComponent,
                            localized_component_1.LocalizedComponent
                        ],
                        selector: 'relations-form',
                        templateUrl: 'lib/templates/relations-form.html'
                    }), 
                    __metadata('design:paramtypes', [persistence_manager_1.PersistenceManager])
                ], RelationsFormComponent);
                return RelationsFormComponent;
            }());
            exports_1("RelationsFormComponent", RelationsFormComponent);
        }
    }
});
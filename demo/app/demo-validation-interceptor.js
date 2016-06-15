System.register(["@angular/core", "../../lib/app/object-edit/validation-interceptor"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, validation_interceptor_1;
    var DemoValidationInterceptor;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (validation_interceptor_1_1) {
                validation_interceptor_1 = validation_interceptor_1_1;
            }],
        execute: function() {
            /**
             * @author Daniel de Oliveira
             */
            DemoValidationInterceptor = (function (_super) {
                __extends(DemoValidationInterceptor, _super);
                function DemoValidationInterceptor() {
                    _super.apply(this, arguments);
                }
                DemoValidationInterceptor.prototype.validate = function (resource) {
                    return undefined;
                };
                DemoValidationInterceptor = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [])
                ], DemoValidationInterceptor);
                return DemoValidationInterceptor;
            }(validation_interceptor_1.ValidationInterceptor));
            exports_1("DemoValidationInterceptor", DemoValidationInterceptor);
        }
    }
});

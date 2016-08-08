import {Document} from '../../src/app/core-services/document';

export var OBJECTS: Document[] = [
    
    { "resource" : { "id" : "/demo/1", "identifier": "ob1", "type": "object" , "multiple_input" : [ "a" , "b" ],
        "localized_multiple_input" : { "de" : [ "a" , "b" ], "en" : [ "c" , "d" ] }, "single_select_radio": "CD", "relations" : {} }},
    
    { "resource" : { "id" : "/demo/2", "identifier": "ob2", "type": "object", "relations" : {} }},

    { "resource" : { "id" : "/demo/3", "identifier": "ob3", "type": "object", "relations" : {} }},

    { "resource" : { "id" : "/demo/4", "identifier": "ob4", "type": "object_enhanced", "relations" : {} }},

    { "resource" : { "id" : "/demo/5", "identifier": "ob5", "type": "section", "relations" : {} }},

    { "resource" : { "id" : "/demo/6", "identifier": "ob6", "relations" : {} }},
    
];
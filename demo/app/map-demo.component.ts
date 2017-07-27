import {Component} from '@angular/core';
import {IdaiFieldDocument} from '../../src/app/idai-field-model/idai-field-document';

@Component({
    selector: 'idai-field-map-demo',
    templateUrl: 'demo/app/map-demo.html'
})

/**
 * @author Thomas Kleinke
 */
export class MapDemoComponent {

    public documents: Array<IdaiFieldDocument> = [
        {
            'resource': {
                'id': 'obj1',
                'identifier': 'object1',
                'shortDescription': 'Punkt',
                'relations': {},
                'geometry': {
                    'type': 'Point',
                    'coordinates': [ 1.5, 3.5 ],
                    'crs': 'local'
                },
                'type': 'object'
            }
        },
        {
            'resource': {
                'id': 'obj2',
                'identifier': 'object2',
                'shortDescription': 'Polygon',
                'relations': {},
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': [[[3.0, 3.0], [4.0, 3.0], [4.5, 3.5], [4.5, 4.0], [3.5, 4.0], [3.0, 3.0]]],
                    'crs': 'local'
                },
                'type': 'object'
            }
        },
        {
            'resource': {
                'id': 'obj3',
                'identifier': 'object3',
                'shortDescription': 'Multipolygon',
                'relations': {},
                'geometry': {
                    'type': 'MultiPolygon',
                    'coordinates': [[[[-3.0, 3.0], [-5.0, 2.5], [-4.5, 3.0], [-4.25, 3.75], [-3.5, 4.0], [-3.0, 3.0]]],
                        [[[-3.25, 4.0], [-3.25, 4.5], [-3.5, 5.0], [-3.75, 4.0], [-3.5, 4.25], [-3.25, 4.0]]]],
                    'crs': 'local'
                },
                'type': 'object'
            }
        },
        {
            'resource': {
                'id': 'obj4',
                'identifier': 'object4',
                'shortDescription': 'Polyline',
                'relations': {},
                'geometry': {
                    'type': 'LineString',
                    'coordinates': [[1.0, 3.0], [1.5, 2.5], [1.75, 2.5], [1.9, 2.25], [1.35, 2.0], [1.0, 1.5]],
                    'crs': 'local'
                },
                'type': 'object'
            }
        },
        {
            'resource': {
                'id': 'obj5',
                'identifier': 'object5',
                'shortDescription': 'Multipolyline',
                'relations': {},
                'geometry': {
                    'type': 'MultiLineString',
                    'coordinates': [[[7.0, 0.0], [7.5, 0.5], [7.5, 1.0], [7.25, 1.5]],
                        [[6.0, 0.0], [6.5, 0.5], [6.5, 1.0], [6.25, 1.5]]],
                    'crs': 'local'
                },
                'type': 'object'
            }
        }
    ];

    public mainTypeDocumentTemplate: IdaiFieldDocument = {
        'resource': {
            'id': 's1',
            'identifier': 'section1',
            'shortDescription': 'Maßnahme',
            'relations': {},
            'geometry': {
                'type': 'Polygon',
                'coordinates': [[[-7.0, -7.0], [-6.0, -5.0], [7.0, -7.0], [9.0, 1.0], [7.0, 7.0], [5.0, 10.0],
                    [-7.0, 7.0]]],
                'crs': 'local'
            },
            'type': 'section'
        }
    };

    public projectDocument: IdaiFieldDocument = {
        'resource': {
            'id': 'mapdemo',
            'identifier': 'mapdemo',
            'shortDescription': 'Map-Demo',
            'coordinateReferenceSystem': 'Eigenes Koordinatenbezugssystem',
            'relations': {},
            'type': 'project'
        }
    };

    public mainTypeDocument: IdaiFieldDocument;
    public selectedDocument: IdaiFieldDocument;
    public liveUpdate: boolean = true;

    public selectDocument(document: IdaiFieldDocument) {

        this.selectedDocument = document;
    }

    public toggleDocument(document: IdaiFieldDocument) {

        if (this.selectedDocument == document) {
            this.selectedDocument = undefined;
        } else {
            this.selectedDocument = document;
        }
    }

    public toggleMainTypeDocument() {

        if (this.mainTypeDocument) {
            this.mainTypeDocument = undefined;
        } else {
            this.mainTypeDocument = this.mainTypeDocumentTemplate;
        }
    }
}
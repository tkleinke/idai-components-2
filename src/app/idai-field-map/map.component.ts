import {Component, Input, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';
import {IdaiFieldDocument} from '../idai-field-model/idai-field-document';
import {IdaiFieldResource} from '../idai-field-model/idai-field-resource';
import {IdaiFieldPolygon} from './idai-field-polygon';
import {IdaiFieldMarker} from './idai-field-marker';
import {MapState} from './map-state';

@Component({
    moduleId: module.id,
    selector: 'map',
    template: '<div id="map-container"></div>'
})

/**
 * @author Thomas Kleinke
 */
export class MapComponent implements OnChanges {

    @Input() documents: Array<IdaiFieldDocument>;
    @Input() selectedDocument: IdaiFieldDocument;

    @Output() onSelectDocument: EventEmitter<IdaiFieldDocument> = new EventEmitter<IdaiFieldDocument>();

    protected map: L.Map;
    protected polygons: { [resourceId: string]: Array<IdaiFieldPolygon> } = {};
    protected markers: { [resourceId: string]: IdaiFieldMarker } = {};

    protected bounds: any[]; // in fact L.LatLng[], but leaflet typings are incomplete

    protected markerIcons = {
        'blue': L.icon({
            iconUrl: 'img/marker-icons/marker-icon-blue.png',
            shadowUrl: 'img/marker-icons/marker-shadow.png',
            iconSize:     [25, 41],
            shadowSize:   [41, 41],
            iconAnchor:   [12, 39],
            shadowAnchor: [13, 39]
        }),
        'darkblue': L.icon({
            iconUrl: 'img/marker-icons/marker-icon-darkblue.png',
            shadowUrl: 'img/marker-icons/marker-shadow.png',
            iconSize:     [25, 41],
            shadowSize:   [41, 41],
            iconAnchor:   [12, 39],
            shadowAnchor: [13, 39]
        }),
        'red': L.icon({
            iconUrl: 'img/marker-icons/marker-icon-red.png',
            shadowUrl: 'img/marker-icons/marker-shadow.png',
            iconSize:     [25, 41],
            shadowSize:   [41, 41],
            iconAnchor:   [12, 39],
            shadowAnchor: [13, 39]
        })
    };

    constructor(protected mapState: MapState) {
        this.bounds = [];
    }

    public ngAfterViewInit() {

        if (this.map) {
            this.map.invalidateSize(false);
        }
    }

    public ngOnChanges(changes: SimpleChanges) {

        if (!this.map) {
            this.map = this.createMap();
        } else {
            this.clearMap();
        }

        this.bounds = [];
        for (var i in this.documents) {
            if (this.documents[i].resource.geometry) {
                this.addToMap(this.documents[i].resource.geometry, this.documents[i]);
            }
        }

        this.setView();
    }

    private createMap(): L.Map {

        const map = L.map("map-container", { crs: L.CRS.Simple, attributionControl: false, minZoom: -1000 });

        let mapComponent = this;
        map.on('click', function(event: L.MouseEvent) {
            mapComponent.clickOnMap(event.latlng);
        });

        this.initializeViewport(map);
        this.initializeViewportMonitoring(map);

        return map;
    }

    private initializeViewport(map: L.Map) {

        if (this.mapState.getCenter()) {
            map.setView(this.mapState.getCenter(), this.mapState.getZoom());
        } else {
            map.setView([0, 0], 5);
        }
    }

    private initializeViewportMonitoring(map: L.Map) {

        map.on('moveend', function () {
            this.mapState.setCenter(map.getCenter());
            this.mapState.setZoom(map.getZoom());
        }.bind(this));
    }

    protected setView() {

        this.map.invalidateSize(true);

        if (this.selectedDocument) {
            if (this.polygons[this.selectedDocument.resource.id]) {
                this.focusPolygons(this.polygons[this.selectedDocument.resource.id]);
            } else if (this.markers[this.selectedDocument.resource.id]) {
                this.focusMarker(this.markers[this.selectedDocument.resource.id]);
            }
        } else if (!this.mapState.getCenter()) {
            if (this.bounds.length > 1) {
                this.map.fitBounds(L.latLngBounds(this.bounds));
            } else if (this.bounds.length == 1) {
                this.map.setView(this.bounds[0], 5);
            }
        }
    }

    private clearMap() {

        for (let i in this.polygons) {
            for (let polygon of this.polygons[i]) {
                this.map.removeLayer(polygon);
            }
        }

        for (let i in this.markers) {
            this.map.removeLayer(this.markers[i]);
        }

        this.polygons = {};
        this.markers = {};
    }

    protected extendBounds(latLng: L.LatLng) {

        this.bounds.push(latLng);
    }

    private extendBoundsForMultipleLatLngs(latLngs: Array<L.LatLng>) {

        for (let latLng of latLngs) {
            this.extendBounds(latLng);
        }
    }

    private addToMap(geometry: any, document: IdaiFieldDocument) {

        switch(geometry.type) {
            case "Point":
                let marker: IdaiFieldMarker = this.addMarkerToMap(geometry.coordinates, document);
                this.extendBounds(marker.getLatLng());
                break;
            case "Polygon":
                let polygon: IdaiFieldPolygon = this.addPolygonToMap(geometry.coordinates, document);
                this.extendBoundsForMultipleLatLngs(polygon.getLatLngs());
                break;
            case "MultiPolygon":
                for (let polygonCoordinates of geometry.coordinates) {
                    let polygon: IdaiFieldPolygon = this.addPolygonToMap(polygonCoordinates, document);
                    this.extendBoundsForMultipleLatLngs(polygon.getLatLngs());
                }
                break;
        }
    }

    private addMarkerToMap(coordinates: any, document: IdaiFieldDocument): IdaiFieldMarker {

        let latLng = L.latLng([coordinates[1], coordinates[0]]);

        let icon = (document == this.selectedDocument) ? this.markerIcons.red : this.markerIcons.blue;

        let marker: IdaiFieldMarker = L.marker(latLng, {
            icon: icon
        });
        marker.document = document;

        marker.bindTooltip(this.getShortDescription(document.resource), {
            offset: L.point(0, -40),
            direction: 'top',
            opacity: 1.0});

        let mapComponent = this;
        marker.on('click', function() {
            mapComponent.select(this.document);
        });

        marker.addTo(this.map);
        this.markers[document.resource.id] = marker;

        return marker;
    }

    private addPolygonToMap(coordinates: any, document: IdaiFieldDocument): IdaiFieldPolygon {

        let polygon: IdaiFieldPolygon = this.getPolygonFromCoordinates(coordinates);
        polygon.document = document;

        if (document == this.selectedDocument) {
            polygon.setStyle({color: 'red'});
        }

        polygon.bindTooltip(this.getShortDescription(document.resource), {
            direction: 'center',
            opacity: 1.0});

        let mapComponent = this;
        polygon.on('click', function(event: L.Event) {
            if (mapComponent.select(this.document)) L.DomEvent.stop(event);
        });

        polygon.addTo(this.map);

        let polygons: Array<IdaiFieldPolygon>
            = this.polygons[document.resource.id] ? this.polygons[document.resource.id] : [];
        polygons.push(polygon);
        this.polygons[document.resource.id] = polygons;

        return polygon;
    }

    private focusMarker(marker: L.Marker) {

        this.map.panTo(marker.getLatLng(), { animate: true, easeLinearity: 0.3 });
    }

    private focusPolygons(polygons: Array<L.Polygon>) {

        let bounds = [];
        for (let polygon of polygons) {
            bounds.push(polygon.getLatLngs());
        }
        this.map.fitBounds(bounds);
    }

    private getShortDescription(resource: IdaiFieldResource) {

        let shortDescription = resource.identifier;
        if (resource.shortDescription && resource.shortDescription.length > 0) {
            shortDescription += " | " + resource.shortDescription;
        }

        return shortDescription;
    }

    protected clickOnMap(clickPosition: L.LatLng) {

        this.deselect();
    }

    protected select(document: IdaiFieldDocument): boolean {

        this.onSelectDocument.emit(document);
        return true;
    }

    protected deselect() {

        this.onSelectDocument.emit(null);
    }

    private getPolygonFromCoordinates(coordinates: Array<any>): L.Polygon {

        let feature = L.polygon(coordinates).toGeoJSON();
        return L.polygon(<any> feature.geometry.coordinates[0]);
    }
}

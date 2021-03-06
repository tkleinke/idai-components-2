import {Component, Input} from '@angular/core';
import {Document} from '../model/document';

@Component({
    selector: 'document-teaser',
    moduleId: module.id,
    templateUrl: './document-teaser.html'
})
export class DocumentTeaserComponent {

    @Input() document: Document;
}
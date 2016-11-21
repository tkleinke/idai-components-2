import {Component} from '@angular/core';
import {MD} from '../../src/app/messages/md';
import {Messages} from '../../src/app/messages/messages';

/**
 * @author Thomas Kleinke
 */
@Component({
    selector: 'messages-demo',
    templateUrl: 'demo/templates/messages-demo.html'
})
export class MessagesDemoComponent {

    private messageKeys = [];
    private params = [];
    private useParams = false;

    constructor(private md : MD, private messages: Messages) {
        this.messageKeys = Object.keys(md.msgs);
    }

    public showMessage(msgKey: string) {
        if (this.useParams) {
            this.messages.addWithParams([msgKey].concat(this.params));
        } else {
            this.messages.add(msgKey);
        }
    }

    public clearMessages() {
        this.messages.clear();
    }

}
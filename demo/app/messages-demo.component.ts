import {Component} from '@angular/core';
import {MD} from '../../src/app/messages/md';
import {Messages} from '../../src/app/messages/messages';

@Component({
    selector: 'messages-demo',
    templateUrl: 'demo/app/messages-demo.html'
})

/**
 * @author Thomas Kleinke
 */
export class MessagesDemoComponent {

    private messageKeys = [];
    private params = [];
    private useParams = false;

    constructor(private md: MD, private messages: Messages) {
        this.messageKeys = Object.keys(md.msgs) as never;
    }

    public showMessage(msgKey: string) {
        if (this.useParams && msgKey == "with_params") {
            this.messages.add([msgKey].concat(this.params));
        } else {
            this.messages.add([msgKey]);
        }
    }

    public clearMessages() {
        this.messages.clear();
    }

    public setMessagesHidden(shown) {
        this.messages.setHidden(!shown);
    }

}
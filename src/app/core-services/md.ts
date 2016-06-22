import {Injectable} from "@angular/core";
import {Message} from "./message"

/**
 * This map contains the message bodies
 * messages identified by their key.
 * It can be replaced later by another data source
 * like an external service.
 *
 * @author Daniel M. de Oliveira
 * @author Jan G. Wieners
 */
@Injectable()
export class MD { // = Messages Dictionary. For reasons of brevity of calls to it just "M".

    public static OBJLIST_IDEXISTS : string = 'objectlist/idexists';
    public static OBJLIST_IDMISSING : string = 'objectlist/idmissing';
    public static OBJLIST_SAVE_SUCCESS : string = 'objectlist/savesuccess';
    public static MESSAGES_NOBODY : string = 'messages/nobody';
    public static PC_GENERIC_ERROR : string = 'pmc/generic';
    public static PARSE_GENERIC_ERROR : string = 'parse/generic';

    public msgs : { [id: string]: Message } = {};

    constructor() {
        this.msgs[MD.OBJLIST_IDEXISTS]={
            content: 'Objekt-Identifier existiert bereits.',
            level: 'danger',
        };
        this.msgs[MD.OBJLIST_IDMISSING]={
            content: 'Objekt-Identifier fehlt.',
            level: 'danger'
        };
        this.msgs[MD.OBJLIST_SAVE_SUCCESS]={
            content: 'Das Objekt wurde erfolgreich gespeichert.',
            level: 'success'
        };
        this.msgs[MD.MESSAGES_NOBODY]={
            content: "Keine Message gefunden für Schlüssel 'id'.",
            level: 'danger'
        };
        this.msgs[MD.PC_GENERIC_ERROR]={
            content: "Fehler beim Auswerten eines Konfigurationsobjektes.",
            level: 'danger'
        };
        this.msgs[MD.PARSE_GENERIC_ERROR]={
            content: "Fehler beim Parsen einer Konfigurationsdatei.",
            level: 'danger'
        };
    }
}
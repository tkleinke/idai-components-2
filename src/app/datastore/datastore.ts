import {Document} from "../model/document";
import {ReadDatastore} from "./read-datastore";
import {Observable} from "rxjs/Observable";

/**
 * The interface for datastores supporting 
 * the idai-components document model.
 * 
 * @author Sebastian Cuy
 * @author Daniel de Oliveira
 */ 
export abstract class Datastore extends ReadDatastore {

    /**
     * @param doc
     * @returns {Promise<Document>} resolve -> (),
     *   reject -> the error message or a message key.
     */
    abstract create(doc: Document): Promise<string>;

    /**
     * @param doc
     * @returns {Promise<Document>} resolve -> (),
     *   reject -> the error message or a message key.
     */ 
    abstract update(doc: Document): Promise<any>;

    /**
     * @param doc
     */
    abstract remove(doc: Document): Promise<any>;

    /**
     * Subscription enables clients to get notified
     * when documents get modified via one of the accessor
     * methods defined here.
     */
    abstract documentChangesNotifications():Observable<Document>;

}

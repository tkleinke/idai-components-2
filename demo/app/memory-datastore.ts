import {Document} from "../../lib/app/core-services/document";
import {Datastore} from "../../lib/app/datastore/datastore";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";

/**
 * @author Daniel de Oliveira
 */
@Injectable()
export class MemoryDatastore implements Datastore {

    private static IDAIFIELDOBJECT = 'idai-field-object';
    private static FULLTEXT = 'fulltext';

    private db: Promise<any>;
    private observers = [];
    private objectCache: { [id: string]: Document } = {};

    public getUnsyncedObjects(): Observable<Document> {
        return undefined;
    }
    
    constructor(){};

    public create(document:Document):Promise<string> {

        return new Promise((resolve, reject) => {
            resolve();
        });
    }

    public update(document:Document):Promise<any> {
        
        console.log("update document ",document)

        this.objectCache[document['resource']['@id']]=document;
        return new Promise((resolve, reject) => {
            resolve();
        });
    }

    public refresh(id:string):Promise<Document>  {

        return this.fetchObject(id);
    }

    public get(id:string):Promise<Document> {

        if (this.objectCache[id]) {
            return new Promise((resolve, reject) => resolve(this.objectCache[id]));
        } else {
            return this.fetchObject(id);
        }
    }

    public remove(id:string):Promise<any> {
        return new Promise((resolve, reject) => {
            this.db.then(db => {
               resolve();
            });
        });
    }

    public clear():Promise<any> {
        return new Promise((resolve, reject) => {
            this.db.then(db => {
                resolve();
            });
        });
    }

    
    public find(query:string):Promise<Document[]> {

        query = query.toLowerCase();

        var results : Document[] = [];
        for (var i in this.objectCache) {
            if (this.objectCache[i]['resource']['@id'].indexOf(query)!=-1) results.push(this.objectCache[i]);
        }

        return new Promise((resolve, reject) => {
            resolve(results);
        });
    }

    public all():Promise<Document[]> {

        return new Promise<Document[]>((resolve, reject) => {
            resolve();
        });
    }

    private fetchObject(id:string): Promise<Document> {

        return new Promise((resolve, reject) => {
            resolve();
        });
    }

    private saveObject(document:Document):Promise<any> {

        return new Promise((resolve, reject) => {
            resolve();
        });
    }

    private saveFulltext(document:Document):Promise<any> {

        return new Promise((resolve, reject) => {
            resolve();
        })
    }
}

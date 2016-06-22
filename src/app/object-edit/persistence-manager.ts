import {Injectable} from "@angular/core";
import {Datastore} from "../datastore/datastore";
import {RelationsConfiguration} from "./relations-configuration";
import {Document} from "../core-services/document";
import {Resource} from "../core-services/resource";

/**
 * With a document to persist, it determines which other documents are 
 * affected by being related to the document in its current or previous state.
 * When persisting, it maintains a consistent state of relations between the objects
 * by also persisting the related documents with updated target relations.
 * 
 * This class is intended to be used only from within the library. 
 * Clients outside this library are advised to use the load-and-service 
 * to load and save objects.
 * 
 * @author Daniel de Oliveira
 */
@Injectable() export class PersistenceManager {
    
    constructor(
        private datastore: Datastore
    ) {}

    private oldVersion : Document = undefined;
    private relationsConfiguration : RelationsConfiguration = undefined;

    public setRelationsConfiguration(relationsConfiguration) {
        this.relationsConfiguration = relationsConfiguration;
    }

    public setOldVersion(oldVersion) {
        this.oldVersion=JSON.parse(JSON.stringify(oldVersion));
    }
    
    /**
     * Persists the loaded object and all the objects that are or have been in relation
     * with the object before the method call.
     *
     * @returns {Promise<string[]>} If all objects could get stored,
     *   the promise will just resolve to <code>undefined</code>. If one or more
     *   objects could not get stored properly, the promise will resolve to
     *   <code>string[]</code>, containing ids of M where possible,
     *   and error messages where not.
     */
    public persist(document) {
        var resource=document['resource'];

        return new Promise<any>((resolve, reject) => {
            if (!this.relationsConfiguration) return reject("no relations configuration available");

                if (document==undefined) return resolve();

                this.persistIt(document).then(()=> {
                    Promise.all(this.makeGetPromises(document,this.oldVersion)).then((targetDocuments)=> {

                        Promise.all(this.makeSavePromises(resource,targetDocuments)).then(()=> {

                            resolve();
                        }, (err)=>reject(err));


                }, (err)=>reject(err))
            }, (err)=> { reject(this.toStringArray(err)); });
        });
    }

    private makeGetPromises(document,oldVersion) {
        var promisesToGetObjects = new Array();
        for (var id of this.extractRelatedObjectIDs(document['resource'])) {
            promisesToGetObjects.push(this.datastore.get(id))
        }
        for (var id of this.extractRelatedObjectIDs(oldVersion['resource'])) {
            promisesToGetObjects.push(this.datastore.get(id))
        }
        return promisesToGetObjects;
    }

    private makeSavePromises(resource,targetDocuments) {
        var promisesToSaveObjects = new Array();
        for (var targetDocument of targetDocuments) {

            this.pruneInverseRelations(resource['@id'],targetDocument['resource']);
            this.setInverseRelations(resource, targetDocument['resource']);
            promisesToSaveObjects.push(this.datastore.update(targetDocument));
        }
        return promisesToSaveObjects;
    }

    private pruneInverseRelations(id,targetResource) {
        for (var prop in targetResource) {
            if (!targetResource.hasOwnProperty(prop)) continue;
            if (!this.relationsConfiguration.isRelationProperty(prop)) continue;

            var index=targetResource[prop].indexOf(id);
            if (index!=-1) {
                targetResource[prop].splice(index,1)
            }

            if (targetResource[prop].length==0) delete targetResource[prop];
        }
    }

    private setInverseRelations(resource, targetResource) {
        for (var prop in resource) {
            if (!resource.hasOwnProperty(prop)) continue;
            if (!this.relationsConfiguration.isRelationProperty(prop)) continue;

            for (var id of resource[prop]) {
                if (id!=targetResource['@id']) continue;

                var inverse = this.relationsConfiguration.getInverse(prop);

                if (targetResource[inverse]==undefined)
                    targetResource[inverse]=[];

                var index = targetResource[inverse].indexOf(resource['@id']);
                if (index != -1) {
                    targetResource[inverse].splice(index, 1);
                }

                targetResource[inverse].push(resource['@id']);
            }
        }
    }


    private extractRelatedObjectIDs(resource:Resource) : Array<string> {
        var relatedObjectIDs = new Array();

        for (var prop in resource) {
            if (!resource.hasOwnProperty(prop)) continue;
            if (!this.relationsConfiguration.isRelationProperty(prop)) continue;

            for (var id of resource[prop]) {
                relatedObjectIDs.push(id);
            }
        }
        return relatedObjectIDs;
    }
    

    /**
     * Saves the document to the local datastore.
     * @param document
     */
    private persistIt(document: Document): Promise<any> {
        
        if (document['resource']['@id']) {
            return this.datastore.update(document);
        } else {
            // TODO isn't it a problem that create resolves to object id?
            // wouldn't persistChangedObjects() interpret it as an error?
            // why does this not happen?
            return this.datastore.create(document);
        }
    }
    

    private toStringArray(str : any) : string[] {
        if ((typeof str)=="string") return [str]; else return str;
    }
}
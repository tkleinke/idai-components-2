/**
 * represents a query to the datastore
 * @property q the query string that is used to search documents in the datastore
 * @property type restricts results to the given type
 * @property contraints restricts the search result further to match some fields.
 *   you can think of them as search terms that must be matched exactly. They are
 *   combined with each other and with the q term with AND, meaning that a search has to
 *   satisfy all the constraints (if defined) as well as to match q (at least partially) and
 *   type (if defined). A given contraint of
 *   { 'resource.relations.isRecordedIn' : 'id1' } would mean that the search result
 *   contains the results which match the other properties of the query and which
 *   also match the given search term in the given field exactly.
 */
export interface Query {
    q?: string;
    type?: string;
    constraints?: any;
}

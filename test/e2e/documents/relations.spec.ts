import {browser,protractor} from 'protractor'
import {EditPage} from './edit.page';
const EC = protractor.ExpectedConditions;
const delays = require('../config/delays');

/**
 * @author Daniel de Oliveira
 */
describe('documents package - - - ', function() {

    beforeEach(function(){
        browser.get('/#/edit');
    });

    it('should suggest relations as long as they are not already set', function() {
        EditPage.selectFirstDocument();
        EditPage.getRelation(3,EditPage._addRelation).click();
        EditPage.getRelation(3,EditPage._input).sendKeys('/demo/');
        expect(EditPage.getRelationItems(3).get(0).getText()).toBe("/demo/5");
        EditPage.getRelation(3,EditPage._input).sendKeys(protractor.Key.ENTER);
        EditPage.getRelation(3,EditPage._addRelation).click();
        EditPage.getRelation(3,EditPage._input).sendKeys('/demo/');
        expect(EditPage.getRelationItems(3).get(0).getText()).toBe("/demo/6");
        expect(EditPage.getRelationItems(3).get(1).getText()).toBe("/demo/7");
    });
});
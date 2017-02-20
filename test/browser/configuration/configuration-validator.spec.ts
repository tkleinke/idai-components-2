import {ConfigurationDefinition} from "../../../src/app/configuration/configuration-definition";
import {ConfigurationValidator} from "../../../src/app/configuration/configuration-validator";
import {MDInternal} from "../../../src/app/messages/md-internal";

/**
 * @author Daniel de Oliveira
 */
export function main() {
    describe('ConfigurationValidator', () => {

        var configuration : ConfigurationDefinition;

        it('should report missing mandatory type', function(){

            configuration = {
                "types" : [
                    { "type": "T",
                        "fields": []
                    }
                ]
            };

            expect(new ConfigurationValidator(['Tmissing'])
                .go(configuration))
                .toEqual([MDInternal.VALIDATION_ERROR_MISSINGTYPE,'Tmissing']);
        });

        it('should report duplicate type', function(){

            configuration = {
                "types" : [
                    { "type": "Tduplicate",
                        "fields": []
                    },
                    { "type": "Tduplicate",
                        "fields": []
                    }
                ]
            };

            expect(new ConfigurationValidator([])
                .go(configuration))
                .toEqual([MDInternal.VALIDATION_ERROR_DUPLICATETYPE,'Tduplicate']);
        });
    });
}
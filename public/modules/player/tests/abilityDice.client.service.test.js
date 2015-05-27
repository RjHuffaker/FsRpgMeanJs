'use strict';

(function() {
    describe('abilityDice', function() {
        
        // Load the main application module
        beforeEach(module(ApplicationConfiguration.applicationModuleName));
        
        // Initialize global variables
        var abilityDice, mockDataBuilder, mockData;
        
        beforeEach(inject(['abilityDice', function (_abilityDice_) {
            abilityDice = _abilityDice_;
        }]));

        it('abilityDice should be defined', function(){
            expect(abilityDice).toBeDefined();
        });
        
    });
})();
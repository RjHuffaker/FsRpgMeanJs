'use strict';

(function() {
    describe('factorDefenses', function() {
        
        // Load the main application module
        beforeEach(module(ApplicationConfiguration.applicationModuleName));
        
        // Initialize global variables
        var factorDefenses, mockDataBuilder, mockData;
        
        beforeEach(inject(['factorDefenses', function (_factorDefenses_) {
            factorDefenses = _factorDefenses_;
        }]));

        it('factorDefenses should be defined', function(){
            expect(factorDefenses).toBeDefined();
        });
        
    });
})();
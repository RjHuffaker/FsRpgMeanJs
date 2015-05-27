'use strict';

(function() {
    describe('factorStats', function() {
        
        // Load the main application module
        beforeEach(module(ApplicationConfiguration.applicationModuleName));
        
        // Initialize global variables
        var factorStats, mockDataBuilder, mockData;
        
        beforeEach(inject(['factorStats', function (_factorStats_) {
            factorStats = _factorStats_;
        }]));

        it('factorStats should be defined', function(){
            expect(factorStats).toBeDefined();
        });
        
    });
})();
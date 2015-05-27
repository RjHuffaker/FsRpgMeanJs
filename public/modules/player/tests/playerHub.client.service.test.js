'use strict';

(function() {
    describe('PlayerHub', function() {
        
        // Load the main application module
        beforeEach(module(ApplicationConfiguration.applicationModuleName));
        
        // Initialize global variables
        var PlayerHub, mockDataBuilder, mockData;
        
        beforeEach(inject(['PlayerHub', function (_playerHub_) {
            PlayerHub = _playerHub_;
        }]));

        it('PlayerHub should be defined', function(){
            expect(PlayerHub).toBeDefined();
        });
        
    });
})();
'use strict';

(function(){
    describe('CardsBread', function() {
        
        // Load the main application module
        beforeEach(module(ApplicationConfiguration.applicationModuleName));
        
        // Initialize global variables
        var CardsBread;
        
        beforeEach(inject(['CardsBread', function (_CardsBread_) {
            CardsBread = _CardsBread_;
        }]));
        
        it('CardsBread should be defined', function(){
            expect(CardsBread).toBe(CardsBread);
        });
        
    });
})();
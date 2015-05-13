'use strict';

(function(){
    describe('CardsBread', function() {
        
        beforeEach(module(ApplicationConfiguration.applicationModuleName));
        
        var CardsBread;
        
        beforeEach(inject(['CardsBread', function (_CardsBread_) {
            CardsBread = _CardsBread_;
        }]));
        
        it('CardsBread should not be undefined', function(){
            expect(CardsBread).not.toBeUndefined();
        });
        
    });
})();
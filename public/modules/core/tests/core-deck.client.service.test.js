'use strict';

(function(){
    describe('CoreDeck', function() {
        
        beforeEach(module(ApplicationConfiguration.applicationModuleName));
        
        var Bakery, CoreDeck;
        
        beforeEach(inject(['CoreDeck', function (_CoreDeck_) {
            CoreDeck = _CoreDeck_;
        }]));
        
        it('CoreDeck should not be undefined', function(){
            expect(CoreDeck).not.toBeUndefined();
        });
        
    });
})();
'use strict';

(function(){
    describe('decks-bread', function() {
        
        beforeEach(module(ApplicationConfiguration.applicationModuleName));
        
        var Bakery, DecksBread;
        
        beforeEach(inject(['DecksBread', function (_DecksBread_) {
            DecksBread = _DecksBread_;
        }]));
        
        it('DecksBread should not be undefined', function(){
            expect(DecksBread).not.toBeUndefined();
        });
        
    });
})();
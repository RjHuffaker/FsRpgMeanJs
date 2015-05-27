'use strict';

(function(){
    describe('MoveHub', function() {
        
        beforeEach(module(ApplicationConfiguration.applicationModuleName));
        
        var Bakery, MoveHub;
        
        beforeEach(inject(['MoveHub', function (_MoveHub_) {
            MoveHub = _MoveHub_;
        }]));
        
        it('MoveHub should be defined', function(){
            expect(MoveHub).toBeDefined();
        });
        
    });
})();
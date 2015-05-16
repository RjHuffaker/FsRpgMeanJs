'use strict';

(function(){
    describe('CoreMove', function() {
        
        beforeEach(module(ApplicationConfiguration.applicationModuleName));
        
        var Bakery, CoreMove;
        
        beforeEach(inject(['CoreMove', function (_CoreMove_) {
            CoreMove = _CoreMove_;
        }]));
        
        it('CoreMove should not be undefined', function(){
            expect(CoreMove).not.toBeUndefined();
        });
        
    });
})();
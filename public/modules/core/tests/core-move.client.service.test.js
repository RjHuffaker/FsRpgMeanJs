'use strict';

(function(){
    describe('CoreMove', function() {
        
        beforeEach(module(ApplicationConfiguration.applicationModuleName));
        
        var Bakery, CoreMove;
        
        beforeEach(inject(['CoreMove', function (_CoreMove_) {
            CoreMove = _CoreMove_;
        }]));
        
        it('CoreMove should be defined', function(){
            expect(CoreMove).not.toBeDefined();
        });
        
    });
})();

'use strict';

(function(){
    describe('StackUtils', function() {
        
        // Load the main application module
        beforeEach(module(ApplicationConfiguration.applicationModuleName));
        
        // Initialize global variables
        var StackUtils, PanelUtils, DeckUtils, shuffleDeck, mockDataBuilder, mockData;
        
        beforeEach(inject(['StackUtils', function (_StackUtils_) {
            StackUtils = _StackUtils_;
        }]));
        
        beforeEach(inject(['PanelUtils', function (_PanelUtils_) {
            PanelUtils = _PanelUtils_;
        }]));
        
        beforeEach(inject(['DeckUtils', function (_DeckUtils_) {
            DeckUtils = _DeckUtils_;
        }]));
        
        beforeEach(inject(['shuffleDeck', function (_shuffleDeck_) {
            shuffleDeck = _shuffleDeck_;
        }]));
        
        beforeEach(inject(['mockDataBuilder', function (_mockDataBuilder_) {
            mockDataBuilder = _mockDataBuilder_;
        }]));
        
        beforeEach(function(){
            mockData = mockDataBuilder.newMockData();
        });
        
        it('getStack(cardList, panel) should return the index of each card in the same vertical or horizontal stack as the given panel', function(){
        //    console.log('getStack');
            var _cardList = mockData.featDeck.cardList;
            shuffleDeck(_cardList);
            
            var _refArray = DeckUtils.getRefArray(_cardList);
            console.log(_cardList);
            
        /*    for(var ia = 0; ia < _refArray.length; ia++){
                console.log(_refArray[ia]+': '+_cardList[_refArray[ia]].x_coord+'/'+_cardList[_refArray[ia]].y_coord);
            }
            /*
            for(var ib = 0; ib < _refArray.length; ib++){
                var _stackArray = StackUtils.getStack(_cardList, _cardList[_refArray[ib]]);
                var _stack = 'Stack '+_refArray[ib]+': ';
                
                for(var ic = 0; ic < _stackArray.length; ic++){
                    _stack = _stack.concat(_stackArray[ic].x_coord, '/', _stackArray[ic].y_coord, ', ');
                }
                console.log(_stack);
            }
            */
        });
        
    });
})();
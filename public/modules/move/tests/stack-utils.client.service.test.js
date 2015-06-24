
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
            console.log('getStack');
            var _cardList = mockData.featDeck.cardList;
            shuffleDeck(_cardList);
            
            var _refArray = DeckUtils.getRefArray(_cardList);
            console.log('_cardList[_refArray[i]]: ');
            for(var ia = 0; ia < _refArray.length; ia++){
                console.log(_refArray[ia]+': '+_cardList[_refArray[ia]].x_coord+'/'+_cardList[_refArray[ia]].y_coord);
            }
            
            for(var ib = 0; ib < _refArray.length; ib++){
                var _stackArray = StackUtils.getStack(_cardList, _cardList[_refArray[ib]]);
                var _stack = 'Stack '+_refArray[ib]+': ';
                
                for(var ic = 0; ic < _stackArray.length; ic++){
                    _stack = _stack.concat(_stackArray[ic].x_coord, '/', _stackArray[ic].y_coord, ', ')
                }
                console.log(_stack);
            }
            
        });
        
        it('changeStack(cardList, x_coord) should set stacked and y_overlap for each panel of that x_coord', function(){
            
            // Setup
            var _cardList = mockData.featDeck.cardList;
            StackUtils.setStack(_cardList, 45);
            
            // Get lowest panel in column
            var _lowest = PanelUtils.getLowestPanel(_cardList, 45);
            
            // Get an array representing each panel in column
            var _column = StackUtils.getStack(_cardList, 45);
            
            // Sort array according to y_coord
            _column.sort(function(a, b){
                return _cardList[a].y_coord - _cardList[b].y_coord;
            });
            
            if(_column.length > 1){
                for(var i = 0; i < _column.length; i++){
                    var _panel = _cardList[_column[i]];
                    var _next = _cardList[_column[i+1]];
                    
                    // Check each element in sorted array
                    expect(_panel.stacked).toBeTruthy();
                    if(_column[i] === _lowest.index){
                        expect(_panel.y_overlap).toBeFalsy();
                    } else {
                        if(_next.y_coord - _panel.y_coord === 3){
                            expect(_panel.y_overlap).toBeTruthy();
                        } else if(_next.y_coord - _panel.y_coord === 21){
                            expect(_panel.y_overlap).toBeFalsy();
                        }
                    }
                }
            } else {
                expect(_lowest.panel.y_overlap).toBeFalsy();
                expect(_lowest.panel.stacked).toBeFalsy();
            }
        });
        
    });
})();
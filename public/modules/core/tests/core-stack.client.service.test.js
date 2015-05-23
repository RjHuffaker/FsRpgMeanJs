'use strict';

(function(){
    describe('CoreStack', function() {
        
        beforeEach(module(ApplicationConfiguration.applicationModuleName));
        
        var CoreStack, mockDataBuilder, mockData;
        
        beforeEach(inject(['CoreStack', function (_CoreStack_) {
            CoreStack = _CoreStack_;
        }]));
        
        beforeEach(inject(['mockDataBuilder', function (_mockDataBuilder_) {
            mockDataBuilder = _mockDataBuilder_;
        }]));
        
        beforeEach(function(){
            mockData = mockDataBuilder.newMockData();
        });
        
        it('getLastPanel(cardList) should retrieve the last panel and index from the cardList', function(){
            CoreStack.setCardList(mockData.aspectDeck.cardList);
            CoreStack.setCardList(mockData.traitDeck.cardList);
            var lastCard_1 = CoreStack.getLastPanel(mockData.aspectDeck.cardList);
            var lastCard_2 = CoreStack.getLastPanel(mockData.traitDeck.cardList);
            expect(lastCard_1.index).toEqual(7);
            expect(lastCard_2.index).toEqual(3);
        });
        
        it('getLowestPanel(cardList, x_coord) should retrieve the lowest panel and index of that x_coord from the cardList', function(){
            var panel_1 = CoreStack.getLowestPanel(mockData.featDeck.cardList, 0).panel;
            var panel_2 = CoreStack.getLowestPanel(mockData.featDeck.cardList, 15).panel;
            var panel_3 = CoreStack.getLowestPanel(mockData.featDeck.cardList, 30).panel;
            expect(panel_1.featData.name).toEqual('Feat the First');
            expect(panel_2.featData.name).toEqual('Feat the Third');
            expect(panel_3.featData.name).toEqual('Feat the Sixth');
        });
        
        it('getDeckWidth(cardList) should return the overall width of the cardList, or 15 if empty', function(){
            CoreStack.setCardList(mockData.aspectDeck.cardList);
            CoreStack.setCardList(mockData.traitDeck.cardList);
            var deckWidth_1 = CoreStack.getDeckWidth(mockData.aspectDeck.cardList);
            var deckWidth_2 = CoreStack.getDeckWidth(mockData.traitDeck.cardList);
            expect(deckWidth_1).toEqual(120);
            expect(deckWidth_2).toEqual(60);
        });

        it('setCardList(cardList) should add default variables to each element in cardList', function(){
            CoreStack.setCardList(mockData.traitDeck.cardList);
            for(var i = 0; i < mockData.traitDeck.cardList.length; i++){
                var _panel = mockData.traitDeck.cardList[i];
                expect(_panel.x_coord).toEqual(i * 15);
                expect(_panel.y_coord).toEqual(0);
                expect(_panel.x_overlap).toBe(false);
                expect(_panel.y_overlap).toBe(false);
                expect(_panel.dragging).toBe(false);
                expect(_panel.stacked).toBe(false);
                expect(_panel.locked).toBe(false);
            }
        });
        
        if('getColumnArray(cardList, x_coord) should return the index of each panel of that x_coord', function(){
            var _column = CoreStack.getColumnArray(mockData.featDeck.cardList, 30);
            for(var i = 0; i < _column.length; i++){
                expect(mockData.featDeck.cardList[_column[i]].x_coord).toBe(30);
            }
        });
        
        it('setColumnVars(cardList, x_coord) should set stacked and y_overlap for each panel of that x_coord', function(){
            
            // Setup
            var _cardList = mockData.featDeck.cardList;
            CoreStack.setColumnVars(_cardList, 45);
            
            // Get lowest panel in column
            var _lowest = CoreStack.getLowestPanel(_cardList, 45);
            
            // Get an array representing each panel in column
            var _column = CoreStack.getColumnArray(_cardList, 45);
            
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
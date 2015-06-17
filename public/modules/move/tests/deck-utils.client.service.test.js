'use strict';

(function(){
    describe('DeckUtils', function() {
        
        // Load the main application module
        beforeEach(module(ApplicationConfiguration.applicationModuleName));
        
        // Initialize global variables
        var DeckUtils, mockDataBuilder, mockData;
        
        beforeEach(inject(['DeckUtils', function (_DeckUtils_) {
            DeckUtils = _DeckUtils_;
        }]));
        
        beforeEach(inject(['mockDataBuilder', function (_mockDataBuilder_) {
            mockDataBuilder = _mockDataBuilder_;
        }]));
        
        beforeEach(function(){
            mockData = mockDataBuilder.newMockData();
        });
        
        it('getRefArray(cardList) should return a sorted array of each card in cardList', function(){
            var _cardList = mockData.featDeck.cardList;
            var _refArray = DeckUtils.getRefArray(_cardList);
            for(var i = 0; i < _refArray.length; i++){
                var _current = _cardList[_refArray[i]];
                var _previous = _cardList[_refArray[i-1]] || null;
                if(_previous) expect(_previous.x_coord < _current.x_coord || _previous.y_coord < _current.y_coord).toBeTruthy();
            }
        });
        
        it('getRefIndex(cardList, panel) should return the cardList index of the given panel', function(){
            var _cardList = mockData.featDeck.cardList;
            var _refIndex = DeckUtils.getRefIndex(_cardList, _cardList[3]);
            expect(_cardList[_refIndex]).toEqual(_cardList[3]);
        });
        
        
        it('setCardList(cardList) should add default variables to each element in cardList', function(){
            DeckUtils.setCardList(mockData.traitDeck.cardList);
            for(var i = 0; i < mockData.traitDeck.cardList.length; i++){
                var _panel = mockData.traitDeck.cardList[i];
                expect(_panel.x_coord).toEqual(i * 15);
                expect(_panel.y_coord).toEqual(0);
                expect(_panel.x_overlap).toBe(false);
                expect(_panel.y_overlap).toBe(false);
                expect(_panel.x_stack).toBe(false);
                expect(_panel.y_stack).toBe(false);
                expect(_panel.dragging).toBe(false);
                expect(_panel.locked).toBe(false);
            }
        });
        
        it('expandDeck(panel, cardList) should add 15 to the x_coord of each element with the same x_coord or greater', function(){
            var _cardList = mockData.traitDeck.cardList;
            DeckUtils.setCardList(_cardList);
            
            DeckUtils.expandDeck(_cardList[0], _cardList);
            expect(_cardList[0].x_coord).toEqual(0);
            
            for(var i = 1; i < _cardList.length; i++){
                expect(_cardList[i].x_coord).toEqual((i+1) * 15);
            }
        });
        
        it('collapseDeck(panel, cardList) should subtract 15 from the x_coord of each element of a higher x_coord', function(){
            var _cardList = mockData.traitDeck.cardList;
            DeckUtils.setCardList(_cardList);
            
            DeckUtils.collapseDeck(_cardList[0], _cardList);
            expect(_cardList[0].x_coord).toEqual(0);
            
            for(var i = 1; i < _cardList.length; i++){
                expect(_cardList[i].x_coord).toEqual((i-1) * 15);
            }
        });
        
        it('getDeckWidth(cardList) should return the overall width of the cardList, or 15 if empty', function(){
            var _aspectList = mockData.aspectDeck.cardList;
            var _traitList = mockData.traitDeck.cardList;
            DeckUtils.setCardList(_aspectList);
            DeckUtils.setCardList(_traitList);
            var deckWidth_1 = DeckUtils.getDeckWidth(_aspectList);
            var deckWidth_2 = DeckUtils.getDeckWidth(_traitList);
            expect(deckWidth_1).toEqual(120);
            expect(deckWidth_2).toEqual(60);
        });
        
        it('setDeckSize() should iterate through resource.cardList and set resource.deckSize as well as the deckSize variable of each card', function(){
            DeckUtils.setCardList(mockData.traitDeck.cardList);
            DeckUtils.setDeckSize(mockData.traitDeck);
            var _length = mockData.traitDeck.cardList.length - 1;
            expect(mockData.traitDeck.deckSize).toEqual(_length);
        });
        
        it('shuffleDeck(cardList) should randomly rearrange the x_coord of each element in cardList', function(){
            var _cardList = mockData.featDeck.cardList;
            
            DeckUtils.shuffleDeck(_cardList);
            
            var _refArray = DeckUtils.getRefArray(_cardList);
        //    console.log('shuffleDeck:');
        //    for(var i = 0; i < _refArray.length; i++){
        //        console.log(_cardList[_refArray[i]].x_coord+' / '+_cardList[_refArray[i]].y_coord);
        //    }
        });
        
    });
})();
'use strict';

(function(){
    describe('MovePanel', function() {
        
        // Load the main application module
        beforeEach(module(ApplicationConfiguration.applicationModuleName));
        
        // Initialize global variables
        var MovePanel, MoveStack, mockDataBuilder, mockData;
        
        beforeEach(inject(['MovePanel', function (_MovePanel_) {
            MovePanel = _MovePanel_;
        }]));
        
        beforeEach(inject(['MoveStack', function (_MoveStack_) {
            MoveStack = _MoveStack_;
        }]));
        
        beforeEach(inject(['mockDataBuilder', function (_mockDataBuilder_) {
            mockDataBuilder = _mockDataBuilder_;
        }]));
        
        beforeEach(function(){
            mockData = mockDataBuilder.newMockData();
        });
        
        it('getPanel(cardList, x_coord, y_coord) should retrieve the panel at the specified index', function(){
            MoveStack.setCardList(mockData.aspectDeck.cardList);
            var panel_1 = MovePanel.getPanel(mockData.aspectDeck.cardList, 0, 0).panel;
            var index_1 = MovePanel.getPanel(mockData.aspectDeck.cardList, 0, 0).index;
            var panel_2 = MovePanel.getPanel(mockData.aspectDeck.cardList, 60, 0).panel;
            var index_2 = MovePanel.getPanel(mockData.aspectDeck.cardList, 60, 0).index;
            expect(panel_1.aspectData.name).toEqual('Aspect the First');
            expect(index_1).toEqual(0);
            expect(panel_2.aspectData.name).toEqual('Aspect the Fifth');
            expect(index_2).toEqual(4);
        });
        
        it('removePanel(cardList, panel) should remove panel from cardList', function(){
            MovePanel.removePanel(mockData.traitDeck.cardList, mockData.trait_1);
            for(var i = 0; i < mockData.traitDeck.cardList.length; i++){
                expect(mockData.traitDeck.cardList[i]).not.toEqual(mockData.trait_1);
            }
        });
        
        it('getPanelData(panel) should not return false', function(){
            for(var i = 0; i < mockData.traitDeck.cardList.length; i++){
                var cardData = MovePanel.getPanelData(mockData.traitDeck.cardList[i]);
                expect(cardData).not.toBeFalsy();
            }
        });
        
        it('setPanelData(panel, cardData) should assign cardData to the correct panel variable', function(){
            var testPanel = { panelType: 'Aspect' };
            var testData = { cardType: 'Aspect', name: 'A card for testing' };
            MovePanel.setPanelData(testPanel, testData);
            expect(testPanel.testData).not.toBeNull();
        });
        
        it('getCardParams(panel) should not return false', function(){
            for(var i = 0; i < mockData.traitDeck.cardList.length; i++){
                var cardParams = MovePanel.getCardParams(mockData.traitDeck.cardList[i]);
                expect(cardParams).not.toBeFalsy();
            }
        });
        
        it('expandDeck(panel, cardList) should add 15 to the x_coord of each element with the same x_coord or greater', function(){
            MoveStack.setCardList(mockData.traitDeck.cardList);
            
            MovePanel.expandDeck(mockData.trait_1, mockData.traitDeck.cardList);
            expect(mockData.traitDeck.cardList[0].x_coord).toEqual(0);
            
            for(var i = 1; i < mockData.traitDeck.cardList.length; i++){
                expect(mockData.traitDeck.cardList[i].x_coord).toEqual((i+1) * 15);
            }
        });
        
        it('collapseDeck(panel, cardList) should subtract 15 from the x_coord of each element of a higher x_coord', function(){
            MoveStack.setCardList(mockData.traitDeck.cardList);
            
            MovePanel.collapseDeck(mockData.trait_1, mockData.traitDeck.cardList);
            expect(mockData.traitDeck.cardList[0].x_coord).toEqual(0);
            
            for(var i = 1; i < mockData.traitDeck.cardList.length; i++){
                expect(mockData.traitDeck.cardList[i].x_coord).toEqual((i-1) * 15);
            }
        });
        
        it('setDeckSize() should iterate through resource.cardList and set resource.deckSize as well as the deckSize variable of each card', function(){
            MoveStack.setCardList(mockData.traitDeck.cardList);
            MovePanel.setDeckSize(mockData.traitDeck);
            var _length = mockData.traitDeck.cardList.length - 1;
            expect(mockData.traitDeck.deckSize).toEqual(_length);
        });
        
        
    });
})();
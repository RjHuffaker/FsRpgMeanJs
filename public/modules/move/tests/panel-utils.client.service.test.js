'use strict';

(function(){
    describe('PanelUtils', function() {
        
        // Load the main application module
        beforeEach(module(ApplicationConfiguration.applicationModuleName));
        
        // Initialize global variables
        var PanelUtils, DeckUtils, mockDataBuilder, shuffleDeck, mockData;
        
        beforeEach(inject(['PanelUtils', 'DeckUtils', 'shuffleDeck', 'mockDataBuilder', 
            function (_PanelUtils_, _DeckUtils_, _shuffleDeck_, _mockDataBuilder_) {
            PanelUtils = _PanelUtils_;
            DeckUtils = _DeckUtils_;
            shuffleDeck = _shuffleDeck_;
            mockDataBuilder = _mockDataBuilder_;
        }]));
        
        beforeEach(function(){
            mockData = mockDataBuilder.newMockData();
        });
        
        it('getPanel(cardList, panelId) should retrieve the panel of the specified _id', function(){
            DeckUtils.setCardList(mockData.aspectDeck.cardList);
            var panel_1 = PanelUtils.getPanel(mockData.aspectDeck.cardList, mockData.aspect_1._id);
            var index_1 = PanelUtils.getPanelIndex(mockData.aspectDeck.cardList, mockData.aspect_1._id);
            var panel_2 = PanelUtils.getPanel(mockData.aspectDeck.cardList, mockData.aspect_5._id);
            var index_2 = PanelUtils.getPanelIndex(mockData.aspectDeck.cardList, mockData.aspect_5._id);
            expect(panel_1).toEqual(mockData.aspect_1);
            expect(index_1).toEqual(0);
            expect(panel_2).toEqual(mockData.aspect_5);
            expect(index_2).toEqual(4);
        });
        
        it('getLast(cardList) should retrieve the last panel and index from the cardList', function(){
            DeckUtils.setCardList(mockData.aspectDeck.cardList);
            DeckUtils.setCardList(mockData.traitDeck.cardList);
            var lastCard_1 = PanelUtils.getLast(mockData.aspectDeck.cardList);
            var lastCard_2 = PanelUtils.getLast(mockData.traitDeck.cardList);
            expect(lastCard_1.index).toEqual(7);
            expect(lastCard_2.index).toEqual(3);
        });
        
        it('getLowestPanel(cardList, x_coord) should retrieve the lowest panel and index of that x_coord from the cardList', function(){
            var panel_1 = PanelUtils.getLowestPanel(mockData.featDeck.cardList, 0).panel;
            var panel_2 = PanelUtils.getLowestPanel(mockData.featDeck.cardList, 15).panel;
            var panel_3 = PanelUtils.getLowestPanel(mockData.featDeck.cardList, 30).panel;
            expect(panel_1).toEqual(mockData.feat_1);
            expect(panel_2).toEqual(mockData.feat_3);
            expect(panel_3).toEqual(mockData.feat_6);
        });
        
        it('removePanel(cardList, panel) should remove panel from cardList', function(){
            PanelUtils.removePanel(mockData.traitDeck.cardList, mockData.trait_1);
            for(var i = 0; i < mockData.traitDeck.cardList.length; i++){
                expect(mockData.traitDeck.cardList[i]).not.toEqual(mockData.trait_1);
            }
        });
        
        it('getPanelData(panel) should not return false', function(){
            for(var i = 0; i < mockData.traitDeck.cardList.length; i++){
                var cardData = PanelUtils.getPanelData(mockData.traitDeck.cardList[i]);
                expect(cardData).not.toBeFalsy();
            }
        });
        
        it('setPanelData(panel, cardData) should assign cardData to the correct panel variable', function(){
            var testPanel = { panelType: 'Aspect' };
            var testData = { cardType: 'Aspect', name: 'A card for testing' };
            PanelUtils.setPanelData(testPanel, testData);
            expect(testPanel.testData).not.toBeNull();
        });
        
        it('getCardParams(panel) should not return false', function(){
            for(var i = 0; i < mockData.traitDeck.cardList.length; i++){
                var cardParams = PanelUtils.getCardParams(mockData.traitDeck.cardList[i]);
                expect(cardParams).not.toBeFalsy();
            }
        });
        
    });
})();
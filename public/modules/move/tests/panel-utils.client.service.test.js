'use strict';

(function(){
    describe('PanelUtils', function() {
        
        // Load the main application module
        beforeEach(module(ApplicationConfiguration.applicationModuleName));
        
        // Initialize global variables
        var PanelUtils, DeckUtils, mockDataBuilder, mockData;
        
        beforeEach(inject(['PanelUtils', function (_PanelUtils_) {
            PanelUtils = _PanelUtils_;
        }]));
        
        beforeEach(inject(['DeckUtils', function (_DeckUtils_) {
            DeckUtils = _DeckUtils_;
        }]));
        
        beforeEach(inject(['mockDataBuilder', function (_mockDataBuilder_) {
            mockDataBuilder = _mockDataBuilder_;
        }]));
        
        beforeEach(function(){
            mockData = mockDataBuilder.newMockData();
        });
        
        it('getPanel(cardList, x_coord, y_coord) should retrieve the panel at the specified index', function(){
            DeckUtils.setCardList(mockData.aspectDeck.cardList);
            var panel_1 = PanelUtils.getPanel(mockData.aspectDeck.cardList, 0, 0).panel;
            var index_1 = PanelUtils.getPanel(mockData.aspectDeck.cardList, 0, 0).index;
            var panel_2 = PanelUtils.getPanel(mockData.aspectDeck.cardList, 60, 0).panel;
            var index_2 = PanelUtils.getPanel(mockData.aspectDeck.cardList, 60, 0).index;
            expect(panel_1.aspectData.name).toEqual('Aspect the First');
            expect(index_1).toEqual(0);
            expect(panel_2.aspectData.name).toEqual('Aspect the Fifth');
            expect(index_2).toEqual(4);
        });
        
        it('getLastPanel(cardList) should retrieve the last panel and index from the cardList', function(){
            DeckUtils.setCardList(mockData.aspectDeck.cardList);
            DeckUtils.setCardList(mockData.traitDeck.cardList);
            var lastCard_1 = PanelUtils.getLastPanel(mockData.aspectDeck.cardList);
            var lastCard_2 = PanelUtils.getLastPanel(mockData.traitDeck.cardList);
            expect(lastCard_1.index).toEqual(7);
            expect(lastCard_2.index).toEqual(3);
        });
        
        it('getLowestPanel(cardList, x_coord) should retrieve the lowest panel and index of that x_coord from the cardList', function(){
            var panel_1 = PanelUtils.getLowestPanel(mockData.featDeck.cardList, 0).panel;
            var panel_2 = PanelUtils.getLowestPanel(mockData.featDeck.cardList, 15).panel;
            var panel_3 = PanelUtils.getLowestPanel(mockData.featDeck.cardList, 30).panel;
            expect(panel_1.featData.name).toEqual('Feat the First');
            expect(panel_2.featData.name).toEqual('Feat the Third');
            expect(panel_3.featData.name).toEqual('Feat the Sixth');
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
'use strict';

(function(){
    describe('CorePanel', function() {
        
        beforeEach(module(ApplicationConfiguration.applicationModuleName));
        
        var CorePanel, CoreStack, mockDataBuilder, mockData;
        
        beforeEach(inject(['CorePanel', function (_CorePanel_) {
            CorePanel = _CorePanel_;
        }]));
        
        beforeEach(inject(['CoreStack', function (_CoreStack_) {
            CoreStack = _CoreStack_;
        }]));
        
        beforeEach(inject(['mockDataBuilder', function (_mockDataBuilder_) {
            mockDataBuilder = _mockDataBuilder_;
        }]));
        
        beforeEach(function(){
            mockData = mockDataBuilder.newMockData();
        });
        
        it('getPanel(cardList, x_coord, y_coord) should retrieve the panel at the specified index', function(){
            CoreStack.setCardList(mockData.aspectDeck.cardList);
            var panel_1 = CorePanel.getPanel(mockData.aspectDeck.cardList, 0, 0).panel;
            var index_1 = CorePanel.getPanel(mockData.aspectDeck.cardList, 0, 0).index;
            var panel_2 = CorePanel.getPanel(mockData.aspectDeck.cardList, 60, 0).panel;
            var index_2 = CorePanel.getPanel(mockData.aspectDeck.cardList, 60, 0).index;
            expect(panel_1.aspectData.name).toEqual('Aspect the First');
            expect(index_1).toEqual(0);
            expect(panel_2.aspectData.name).toEqual('Aspect the Fifth');
            expect(index_2).toEqual(4);
        });
        
        it('removePanel(cardList, panel) should remove panel from cardList', function(){
            CorePanel.removePanel(mockData.traitDeck.cardList, mockData.trait_1);
            for(var i = 0; i < mockData.traitDeck.cardList.length; i++){
                expect(mockData.traitDeck.cardList[i]).not.toEqual(mockData.trait_1);
            }
        });
        
        it('getPanelData(panel) should not return false', function(){
            for(var i = 0; i < mockData.traitDeck.cardList.length; i++){
                var cardData = CorePanel.getPanelData(mockData.traitDeck.cardList[i]);
                expect(cardData).not.toBeFalsy();
            }
        });
        
        it('setPanelData(panel, cardData) should assign cardData to the correct panel variable', function(){
            var testPanel = { panelType: 'Aspect' };
            var testData = { cardType: 'Aspect', name: 'A card for testing' };
            CorePanel.setPanelData(testPanel, testData);
            expect(testPanel.testData).not.toBeNull();
        });
        
        it('getCardParams(panel) should not return false', function(){
            for(var i = 0; i < mockData.traitDeck.cardList.length; i++){
                var cardParams = CorePanel.getCardParams(mockData.traitDeck.cardList[i]);
                expect(cardParams).not.toBeFalsy();
            }
        });
        
    });
})();
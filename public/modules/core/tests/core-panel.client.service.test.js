'use strict';

(function(){
    describe('CorePanel', function() {
        
        beforeEach(module(ApplicationConfiguration.applicationModuleName));
        
        var CorePanel, mockDataBuilder, mockData;
        
        beforeEach(inject(['CorePanel', function (_CorePanel_) {
            CorePanel = _CorePanel_;
        }]));
        
        beforeEach(inject(['mockDataBuilder', function (_mockDataBuilder_) {
            mockDataBuilder = _mockDataBuilder_;
        }]));
        
        beforeEach(function(){
            mockData = mockDataBuilder.newMockData();
        });
        
        it('CorePanel.getPanelData(panel) should not return false', function(){
            for(var i = 0; i < mockData.traitDeck.cardList.length; i++){
                var cardData = CorePanel.getPanelData(mockData.traitDeck.cardList[i]);
                expect(cardData).not.toBeFalsy();
            }
        });
        
        it('CorePanel.setPanelData(panel, cardData) should assign cardData to the correct panel variable', function(){
            var testPanel = { panelType: 'Aspect' };
            var testData = { cardType: 'Aspect', name: 'A card for testing' };
            CorePanel.setPanelData(testPanel, testData);
            expect(testPanel.testData).not.toBeNull();
        });
        
        it('CorePanel.getCardParams(panel) should not return false', function(){
            for(var i = 0; i < mockData.traitDeck.cardList.length; i++){
                var cardParams = CorePanel.getCardParams(mockData.traitDeck.cardList[i]);
                expect(cardParams).not.toBeFalsy();
            }
        });
        
    });
})();
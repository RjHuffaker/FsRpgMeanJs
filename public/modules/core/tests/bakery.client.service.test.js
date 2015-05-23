'use strict';

(function(){
	describe('Bakery', function() {
		
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		var Bakery, CoreStack, CorePanel, mockDataBuilder, mockData;
		
		beforeEach(inject(['Bakery', function (_Bakery_) {
			Bakery = _Bakery_;
		}]));
		
		beforeEach(inject(['CoreStack', function (_CoreStack_) {
            CoreStack = _CoreStack_;
        }]));
		
		beforeEach(inject(['CorePanel', function (_CorePanel_) {
            CorePanel = _CorePanel_;
        }]));
		
		beforeEach(inject(['mockDataBuilder', function (_mockDataBuilder_) {
            mockDataBuilder = _mockDataBuilder_;
        }]));
		
		beforeEach(function(){
			mockData = mockDataBuilder.newMockData();
		});
		
		it('Bakery.getCardResource(cardType) should not return false', function(){
            var cardTypes = [ 'Aspect', 'Trait', 'Feat', 'Augment', 'Item', 'Origin' ];
            for(var i = 0; i < cardTypes.length; i++){
                var cardResource = Bakery.getCardResource(cardTypes[i]);
                expect(cardResource).not.toBeFalsy();
            }
        });
        
        it('Bakery.getNewCardResource(panel) should not return false', function(){
            for(var i = 0; i < mockData.aspectDeck.cardList.length; i++){
                var newCardResource = Bakery.getNewCardResource(mockData.aspectDeck.cardList[i]);
                expect(newCardResource).not.toBeFalsy();
            }
        });
		
	});
})();
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
		
		it('Bakery should not be undefined', function(){
			expect(Bakery).not.toBe(undefined);
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
		
		it('Bakery.expandDeck(panel, cardList) should add 15 to the x_coord of each element with the same x_coord or greater', function(){
			CoreStack.setCardList(mockData.traitDeck.cardList);
			
			Bakery.expandDeck(mockData.trait_1, mockData.traitDeck.cardList);
			expect(mockData.traitDeck.cardList[0].x_coord).toEqual(0);
			
			for(var i = 1; i < mockData.traitDeck.cardList.length; i++){
				expect(mockData.traitDeck.cardList[i].x_coord).toEqual((i+1) * 15);
			}
		});
		
		it('Bakery.collapseDeck(panel, cardList) should subtract 15 from the x_coord of each element of a higher x_coord', function(){
			CoreStack.setCardList(mockData.traitDeck.cardList);
			
			Bakery.collapseDeck(mockData.trait_1, mockData.traitDeck.cardList);
			expect(mockData.traitDeck.cardList[0].x_coord).toEqual(0);
			
			for(var i = 1; i < mockData.traitDeck.cardList.length; i++){
				expect(mockData.traitDeck.cardList[i].x_coord).toEqual((i-1) * 15);
			}
		});
		
		it('Bakery.setDeckSize() should iterate through resource.cardList and set resource.deckSize as well as the deckSize variable of each card', function(){
			CoreStack.setCardList(mockData.traitDeck.cardList);
			Bakery.setDeckSize(mockData.traitDeck);
			var _length = mockData.traitDeck.cardList.length - 1;
			expect(mockData.traitDeck.deckSize).toEqual(_length);
		});
		
		it('Bakery.toggleCardLock(panel, cardList) should toggle the panel.locked boolean in the cardList', function(){
			CoreStack.setCardList(mockData.traitDeck.cardList);
			
			Bakery.toggleCardLock(mockData.trait_1, mockData.traitDeck.cardList);
			expect(mockData.traitDeck.cardList[0].locked).toBe(true);
			
			Bakery.toggleCardLock(mockData.trait_1, mockData.traitDeck.cardList);
			expect(mockData.traitDeck.cardList[0].locked).toBe(false);
		});
		
		it('Bakery.findDependency(dependency, resource) should return the index of a dependency within resource.dependencies, or -1', function(){
			expect(Bakery.findDependency(mockData.aspectDeck, mockData.traitDeck)).toEqual(0);
			expect(Bakery.findDependency(mockData.featDeck, mockData.traitDeck)).toEqual(-1);
		});
		
		it('Bakery.toggleDependency(dependency, resource) should add or remove the dependency from resource.dependencies', function(){
			Bakery.toggleDependency(mockData.aspectDeck, mockData.traitDeck);
			expect(mockData.traitDeck.dependencies.length).toEqual(0);
			Bakery.toggleDependency(mockData.aspectDeck, mockData.traitDeck);
			expect(mockData.traitDeck.dependencies[0]).toEqual(mockData.aspectDeck);
		});
		
	});
})();
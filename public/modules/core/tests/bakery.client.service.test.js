'use strict';

(function(){
	describe('Bakery', function() {


		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		var _Bakery, should,
		traitDeck, featDeck, aspectDeck,
		deck_1, deck_2, deck_3,
		cardList_1, cardList_2, cardList_3,
		aspect_1, aspect_2, aspect_3, aspect_4,
		trait_1, trait_2, trait_3, trait_4,
		feat_1, feat_2, feat_3, feat_4,
		augment_1, augment_2, augment_3, augment_4,
		item_1, item_2, item_3, item_4,
		origin_1, origin_2, origin_3, origin_4;
		
		beforeEach(inject(['Bakery', function (Bakery) {
			_Bakery = Bakery;
		}]));

		beforeEach(function(){
			aspect_1 = { aspectData: { name: 'Aspect 1' } };
			aspect_2 = { aspectData: { name: 'Aspect 2' } };
			aspect_3 = { aspectData: { name: 'Aspect 3' } };
			aspect_4 = { aspectData: { name: 'Aspect 4' } };
			
			trait_1 = { traitData: { name: 'Trait 1' } };
			trait_2 = { traitData: { name: 'Trait 2' } };
			trait_3 = { traitData: { name: 'Trait 3' } };
			trait_4 = { traitData: { name: 'Trait 4' } };
			
			feat_1 = { featData: { name: 'Feat 1' } };
			feat_2 = { featData: { name: 'Feat 2' } };
			feat_3 = { featData: { name: 'Feat 3' } };
			feat_4 = { featData: { name: 'Feat 4' } };
			
			augment_1 = { augmentData: { name: 'Augment 1' } };
			augment_2 = { augmentData: { name: 'Augment 2' } };
			augment_3 = { augmentData: { name: 'Augment 3' } };
			augment_4 = { augmentData: { name: 'Augment 4' } };
			
			item_1 = { itemData: { name: 'Item 1' } };
			item_2 = { itemData: { name: 'Item 2' } };
			item_3 = { itemData: { name: 'Item 3' } };
			item_4 = { itemData: { name: 'Item 4' } };
			
			origin_1 = { originData: { name: 'Origin 1' } };
			origin_2 = { originData: { name: 'Origin 2' } };
			origin_3 = { originData: { name: 'Origin 3' } };
			origin_4 = { originData: { name: 'Origin 4' } };
			
			cardList_1 = [ trait_1, feat_1, augment_1, item_1, origin_1 ];
			cardList_2 = [];
			cardList_3 = [ aspect_1, aspect_2 ];
			
			aspectDeck = {
				_id: 'aspectDeck_id',
				cardList: [ aspect_1, aspect_2, aspect_3, aspect_4 ]
			};
			
			traitDeck = {
				_id: 'traitDeck_id',
				cardList: [ trait_1, trait_2, trait_3, trait_4 ],
				dependencies: [ aspectDeck ]
			};
			
			featDeck = {
				_id: 'featDeck_id',
				cardList: [ feat_1, feat_2, feat_3, feat_4 ],
				dependencies: [ aspectDeck ]
			};
			
			deck_1 = {
				_id: 'deck_1_id',
				cardList: cardList_1,
				dependencies: deck_2
			};
			
			deck_2 = {
				_id: 'deck_2_id',
				cardList: cardList_3
			};
			
			deck_3 = {
				_id: 'deck_3_id'
			};
		});

		it('Bakery.lastCard(cardList) should retrieve the last panel and index from the cardList, or 0 if empty', function(){
			_Bakery.setCardList(cardList_1);
			_Bakery.setCardList(cardList_2);
			var lastCard_1 = _Bakery.lastPanel(cardList_1);
			var lastCard_2 = _Bakery.lastPanel(cardList_2);
			expect(lastCard_1.index).toEqual(4);
			expect(lastCard_2.index).toEqual(0);
		});

		it('Bakery.deckWidth(cardList) should return the overall width of the cardList, or 15 if empty', function(){
			_Bakery.setCardList(cardList_1);
			_Bakery.setCardList(cardList_2);
			var deckWidth_1 = _Bakery.deckWidth(cardList_1);
			var deckWidth_2 = _Bakery.deckWidth(cardList_2);
			expect(deckWidth_1).toEqual(75);
			expect(deckWidth_2).toEqual(15);
		});

		it('Bakery.setCardList(cardList) should add default variables to each card in cardList', function(){
			_Bakery.setCardList(cardList_1);
			for(var i = 0; i < cardList_1.length; i++){
				expect(cardList_1[i].x_coord).toEqual(i * 15);
				expect(cardList_1[i].y_coord).toEqual(0);
				expect(cardList_1[i].x_overlap).toBe(false);
				expect(cardList_1[i].y_overlap).toBe(false);
				expect(cardList_1[i].dragging).toBe(false);
				expect(cardList_1[i].stacked).toBe(false);
				expect(cardList_1[i].locked).toBe(false);
			}
		});
		
		it('Bakery.removePanel(panel, cardList) should remove panel from cardList', function(){
			_Bakery.removePanel(feat_1, cardList_1);
			for(var i = 0; i < cardList_1.length; i++){
				expect(cardList_1[i]).not.toEqual(feat_1);
			}
		});
		
		it('Bakery.expandDeck(panel, cardList) should add 15 to the x_coord of each element with the same x_coord or greater', function(){
			_Bakery.setCardList(cardList_1);
			_Bakery.expandDeck(trait_1, cardList_1);
			expect(cardList_1[0].x_coord).toEqual(0);
			for(var i = 1; i < cardList_1.length; i++){
				expect(cardList_1[i].x_coord).toEqual((i+1) * 15);
			}
		});
		
		it('Bakery.collapseDeck(panel, cardList) should subtract 15 from the x_coord of each element of a higher x_coord', function(){
			_Bakery.setCardList(cardList_1);
			_Bakery.collapseDeck(trait_1, cardList_1);
			expect(cardList_1[0].x_coord).toEqual(0);
			for(var i = 1; i < cardList_1.length; i++){
				expect(cardList_1[i].x_coord).toEqual((i-1) * 15);
			}
		});
		
		it('Bakery.setDeckSize() should iterate through resource.cardList and set resource.deckSize as well as the cardSet variable of each card', function(){
			_Bakery.setCardList(cardList_1);
			_Bakery.setDeckSize(deck_1);
			var _length = deck_1.cardList.length - 1;
			expect(deck_1.deckSize).toEqual(_length);
		});
		
		it('Bakery.toggleCardLock(panel, cardList) should toggle the panel.locked boolean in the cardList', function(){
			_Bakery.setCardList(cardList_1);
			_Bakery.toggleCardLock(trait_1, cardList_1);
			expect(cardList_1[0].locked).toBe(true);
			_Bakery.toggleCardLock(trait_1, cardList_1);
			expect(cardList_1[0].locked).toBe(false);
		});
		
		it('Bakery.findDependency(dependency, resource) should return the index of a dependency within resource.dependencies, or -1', function(){
			expect(_Bakery.findDependency(aspectDeck, traitDeck)).toEqual(0);
			expect(_Bakery.findDependency(featDeck, traitDeck)).toEqual(-1);
		});
		
		it('Bakery.toggleDependency(dependency, resource) should add or remove the dependency from resource.dependencies', function(){
			_Bakery.toggleDependency(aspectDeck, traitDeck);
			expect(traitDeck.dependencies.length).toEqual(0);
			_Bakery.toggleDependency(aspectDeck, traitDeck);
			expect(traitDeck.dependencies[0]).toEqual(aspectDeck);
		});
		
	});
})();
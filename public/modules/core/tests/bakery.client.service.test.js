'use strict';

(function(){
	describe('Bakery', function() {


		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		var _Bakery,
		should,
		cardList_1, cardList_2, cardList_3,
		card_1, card_2, card_3, card_4,
		card_a, card_b, card_c, card_d;
		
		beforeEach(inject(['Bakery', function (Bakery) {
			_Bakery = Bakery;
		}]));

		beforeEach(function(){
			card_1 = {
				name: 'card_1',
				x_coord: 0,
				y_coord: 0
			};
			card_2 = {
				name: 'card_2',
				x_coord: 15,
				y_coord: 0
			};
			card_3 = {
				name: 'card_3',
				x_coord: 30,
				y_coord: 0
			};
			card_4 = {
				name: 'card_4',
				x_coord: 45,
				y_coord: 0
			};
			card_a = { name: 'card_a' };
			card_b = { name: 'card_b' };
			card_c = { name: 'card_c' };
			card_d = { name: 'card_d' };

			cardList_1 = [ card_1, card_2, card_3, card_4 ];
			cardList_2 = [];
			cardList_3 = [ card_a, card_b, card_c, card_d ];
		});

		it('Bakery.lastCard(cardList) should retrieve the last panel and index from the cardList, or 0 if empty', function(){
			var lastCard_1 = _Bakery.lastPanel(cardList_1);
			var lastCard_2 = _Bakery.lastPanel(cardList_2);
			expect(lastCard_1.index).toEqual(3);
			expect(lastCard_2.index).toEqual(0);

		});

		it('Bakery.deckWidth(cardList) should return the overall width of the cardList, or 15 if empty', function(){
			var deckWidth_1 = _Bakery.deckWidth(cardList_1);
			var deckWidth_2 = _Bakery.deckWidth(cardList_2);
			expect(deckWidth_1).toEqual(60);
			expect(deckWidth_2).toEqual(15);
		});

		it('Bakery.setCardList(cardList) should add default variables to each card in cardList', function(){
			_Bakery.setCardList(cardList_3);
			for(var i = 0; i < cardList_3.length; i++){
				expect(cardList_3[i].x_coord).toEqual(i * 15);
				expect(cardList_3[i].y_coord).toEqual(0);
				expect(cardList_3[i].x_overlap).toBe(false);
				expect(cardList_3[i].y_overlap).toBe(false);
				expect(cardList_3[i].dragging).toBe(false);
				expect(cardList_3[i].stacked).toBe(false);
			}
		});
		
		it('Bakery.removePanel(panel, cardList) should remove panel from the specified list', function(){
			_Bakery.removePanel(card_3, cardList_1);
			expect(cardList_1.length).toEqual(3);
		});
		
		it('Bakery.collapseDeck', function(){
			
		});
		
	});
})();
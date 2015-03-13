'use strict';

// General BREAD Factory-service.
angular.module('decks')
	.factory('BREAD', ['$stateParams', '$location', 'Authentication', '$resource', '$rootScope', 'pcsDefaults',
			function($stateParams, $location, Authentication, $resource, $rootScope, pcsDefaults){
		
		var Pcs = $resource(
			'pcs/:pcId',
			{ pcId: '@_id' },
			{ update: { method: 'PUT' } }
		);
		
		var Cards = $resource(
			'cards/:cardId:cardType',
			{ cardId: '@_id'},
			{ update: { method: 'PUT' } }
		);
		
		var Decks = $resource(
			'decks/:deckId:deckType',
			{ deckId: '@_id'},
			{ update: { method: 'PUT' } }
		);
		
		var service = {};
		
		service.resource = {
			cardList: []
		};
		
		service.lastCard = function(){
			var _last = 0;
			var _card = {};
			for(var i = 0; i < service.resource.cardList.length; i++){
				if(service.resource.cardList[i].x_coord > (_card.x_coord || 0)){
					_last = i;
					_card = service.resource.cardList[i];
				}
			}
			return _last;
		};
		
		service.deckWidth = function(){
			if(service.resource.cardList){
				return service.resource.cardList[service.lastCard()].x_coord + 15;
			} else {
				return 30;
			}
		};
		
		var setCardList = function(list){
			
			for(var i = 0; i < list.length; i++){
				list[i].x_coord = 0;
				list[i].y_coord = 0;
				list[i].x_overlap = false;
				list[i].y_overlap = false;
				list[i].dragging = false;
				list[i].stacked = false;
				service.resource.cardList.push(list[i]);
				service.resource.cardList[i].x_coord = i * 15;
			}
		};
		
		// BROWSE
		service.browsePcs = function() {
			service.resource = {};
			service.resource.cardList = [];
			Pcs.query(
				function(response){
					response.unshift({
						cardRole: 'playerOptions'
					});
					setCardList(response);
				}
			);
		};
		
		service.browseDecks = function(){
			service.resource = {};
			service.resource.cardList = [];
			Decks.query(
				function(response) {
					response.unshift({
						cardRole: 'architectOptions'
					});
					setCardList(response);
				}
			);
		};
		
		// READ
		service.readPc = function(pc) {
			service.resource = Pcs.get({
				pcId: pc._id
			}, function(response){
				
			});
		};
		
		service.readCard = function(card){
			var _card = Cards.get({
				cardId: card._id
			});
			return _card;
		};
		
		service.readDeck = function(deck){
			console.log('readDeck');
			service.resource = Decks.get({
				deckId: deck._id
			}, function(response){
				console.log(response);
			});
		};
		
		//EDIT
		service.editPc = function(pc) {
			pc.$update(function(response) {
				
			}, function(errorResponse) {
				this.error = errorResponse.data.message;
			});
		};
		
		service.editCard = function(card) {
			if(card.data){
				console.log(card);
				var _card = new Cards(card.data);
				
				_card.$update(function(response) {
					
				}, function(errorResponse) {
					console.log(errorResponse);
				});
			} else if(!card.data){
				card.$update(function(response) {
					
				}, function(errorResponse) {
					console.log(errorResponse);
				});
			}
		};
		
		service.editDeck = function(deck) {
			deck.$update(function(response) {
				
			}, function(errorResponse) {
				console.log(errorResponse);
			});
		};
		
		// ADD
		service.addPc = function(){
			var pc = new Pcs (
				pcsDefaults
			);
			
			pc.$save(function(response){
				service.resource = response;
			});
		};
		
		service.addCard = function(deck, cardType, cardNumber, saveDeck){
			var cardData = new Cards({
				cardSet: deck.deckSize,
				cardNumber: cardNumber,
				cardType: cardType
			});
			
			cardData.$save(function(response){
				deck.cardList.push({
					data: response,
					cardRole: 'featureCard',
					x_coord: cardNumber * 15,
					y_coord: 0,
					x_overlap: false,
					y_overlap: false,
					dragging: false,
					stacked: false,
					locked: false
				});
			}).then(function(response){
				if(saveDeck){
					console.log('saveDeck');
					deck.$update(function(response){
						service.resource = response;
					});
				}
			});
		};
		
		service.addDeck = function(type, size){
			console.log('addDeck');
			
			var deck = new Decks ({
				deckType: type,
				deckSize: size,
				cardList: [{
					cardRole: 'deckOptions',
					x_coord: 0,
					y_coord: 0,
					x_overlap: false,
					y_overlap: false,
					dragging: false,
					stacked: false,
					locked: false
					
				}]
			});
			
			deck.$save(
				function(response){
					for(var i = 0; i < size; i++){
						service.addCard(deck, type, i+1, (i+1 === size));
					}
				});
		};
		
		// DELETE existing Pc
		service.deletePc = function(pc) {
			if(pc){
				pc.$remove(function(response){
					for (var i in service.resource.cardList ) {
						if (service.resource.cardList[i] === pc ) {
							service.resource.cardList.splice(i, 1);
						}
					}
				});
			}
		};
		
		service.deleteCard = function(card, saveDeck, deleteDeck){
			if(card){
				console.log(card);
				
				var cardData;
				
				if(card.data._id){
					cardData = new Cards(card.data);
				} else {
					cardData = Cards.get({
						cardId: card.data
					});
				}
				
				console.log(cardData);
				
				cardData.$remove(
					function(response){
						console.log(response);
						if(saveDeck){
							for(var i in service.resource.cardList){
								if(service.resource.cardList[i] === card){
									service.resource.cardList.splice(i, 1);
								}
							}
							service.resource.$update();
						}
					});
				
				
				for(var i in service.resource.cardList){
					if(service.resource.cardList[i] === card){
						service.resource.cardList.splice(i, 1);
					}
				}
				
			}
		};
		
		service.deleteDeck = function(deck){
			if(deck){
				deck.$remove(function(response){
					for(var i in service.resource.cardList){
						if(service.resource.cardList[i] === deck){
							service.resource.cardList.splice(i, 1);
						}
					}
					for(var ii = 0; ii < response.cardList.length; ii++){
						if(response.cardList[ii].data){
							var card = new Cards(response.cardList[ii].data);
							console.log(card);
							card.$remove();
						}
					}
				});
			}
		};
		
		return service;
		
	}]);
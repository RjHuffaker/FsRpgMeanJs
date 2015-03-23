'use strict';

// General BREAD Factory-service.
angular.module('decks')
	.factory('BREAD', ['$stateParams', '$location', 'Authentication', '$resource', '$rootScope', 'pcsDefaults',
			function($stateParams, $location, Authentication, $resource, $rootScope, pcsDefaults){
		
		var Aspects = $resource(
			'aspects/:aspectId:aspectType',
			{ aspectId: '@_id' },
			{ update: { method: 'PUT' } }
		);
		
		var Cards = $resource(
			'cards/:cardId',
			{ cardId: '@_id' },
			{ update: { method: 'PUT' } }
		);
		
		var Traits = $resource(
			'traits/:traitId',
			{ traitId: '@_id' },
			{ update: { method: 'PUT' } }
		);
		
		var Feats = $resource(
			'feats/:featId',
			{ featId: '@_id' },
			{ update: { method: 'PUT' } }
		);
		
		var Augments = $resource(
			'augments/:augmentId',
			{ augmentId: '@_id' },
			{ update: { method: 'PUT' } }
		);
		
		var Items = $resource(
			'items/:itemId',
			{ itemId: '@_id' },
			{ update: { method: 'PUT' } }
		);
		
		var Origins = $resource(
			'origins/:originId',
			{ originId: '@_id' },
			{ update: { method: 'PUT' } }
		);
		
		var Decks = $resource(
			'decks/:deckId:deckType',
			{ deckId: '@_id' },
			{ update: { method: 'PUT' } }
		);
		
		var Pcs = $resource(
			'pcs/:pcId',
			{ pcId: '@_id' },
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
		
		service.toggleCardLock = function(panel){
			for(var i = 0; i < service.resource.cardList.length; i++){
				if(panel === service.resource.cardList[i]){
					service.resource.cardList[i].locked = !service.resource.cardList[i].locked;
				}
			}
		};
		
		// BROWSE
		
		service.browseAspects = function(aspectType){
			service.resource = {};
			service.resource.cardList = [];
			Aspects.query(
				function(response){
					setCardList(response);
				}
			);
		};
		
		service.browseDecks = function(){
			service.resource = {};
			service.resource.cardList = [];
			Decks.query(
				function(response){
					response.unshift({
						cardRole: 'architectOptions'
					});
					setCardList(response);
				}
			);
		};
		
		service.browsePcs = function(){
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
		
		// READ
		
		service.readAspect = function(aspect){
			var _aspect = Aspects.get({
				aspectId: aspect._id
			});
			return _aspect;
		};
		
		service.readCard = function(card){
			console.log('readCard: ' + card._id);
			console.log(card);
			
			var _card;
			
			if(card.cardType === 'Trait'){
				_card = Traits.get({
					traitId: card._id
				});
			} else if(card.cardType === 'Feat'){
				_card = Feats.get({
					featId: card._id
				});
			} else if(card.cardType === 'Augment'){
				_card = Augments.get({
					augmentId: card._id
				});
			} else if(card.cardType === 'Item'){
				_card = Items.get({
					itemId: card._id
				});
			} else if(card.cardType === 'Origin'){
				_card = Origins.get({
					originId: card._id
				});
			}
			
			_card.$promise.then(function(response){
				console.log(response);
			});
		};
		
		service.readDeck = function(deck){
			console.log('readDeck: ' + deck._id);
			console.log(deck);
			
			service.resource = Decks.get({
				deckId: deck._id
			});
			
			service.resource.$promise.then(function(response){
				console.log(response);
			});
			
		};
		
		service.readPc = function(pc) {
			service.resource = Pcs.get({
				pcId: pc._id
			}, function(response){
				
			});
		};
		
		//EDIT
		service.editAspect = function(aspect){
			aspect.$update(function(response) {
				
			}, function(errorResponse) {
				console.log(errorResponse);
			});
		};
		
		service.editCard = function(card) {
			var _card = 0;
			
			if(card.cardType === 'Trait'){
				_card = new Traits(card);
			} else if(card.cardType === 'Feat'){
				_card = new Feats(card);
			} else if(card.cardType === 'Augment'){
				_card = new Augments(card);
			} else if(card.cardType === 'Item'){
				_card = new Items(card);
			} else if(card.cardType === 'Origin'){
				_card = new Origins(card);
			}
			
			if(_card){
				_card.$update();
			}
		};
		
		service.editDeck = function(deck) {
			var _deck = new Decks(deck);
			
			_deck.$update(function(response) {
				for(var i = 0; i < deck.cardList.length; i++){
					service.editPanel(deck.cardList[i]);
				}
			}, function(errorResponse) {
				console.log(errorResponse);
			});
		};
		
		service.editPanel = function(panel){
			var _card = 0;
			
			if(panel.cardRole === 'Trait'){
				_card = new Traits(panel.traitData);
			} else if(panel.cardRole === 'Feat'){
				_card = new Feats(panel.featData);
			} else if(panel.cardRole === 'Augment'){
				_card = new Augments(panel.augmentData);
			} else if(panel.cardRole === 'Item'){
				_card = new Items(panel.itemData);
			} else if(panel.cardRole === 'Origin'){
				_card = new Origins(panel.originData);
			}
			
			if(_card){
				_card.$update();
			}
		};
		
		service.editDeckStructure = function(deck){
			deck.$update(function(response){
				
			}, function(errorResponse){
				console.log(errorResponse);
			});
		};
		
		service.editPc = function(pc) {
			pc.$update(function(response) {
				
			}, function(errorResponse) {
				this.error = errorResponse.data.message;
			});
		};
		
		// ADD
		
		service.addAspect = function(){
			var aspect = new Aspects (
				
			);
			
			aspect.$save(function(response){
				service.resource = response;
			});
		};
		
		service.addCard = function(deck, cardType, cardNumber, saveDeck){
			var cardData;
			
			if(cardType === 'Trait'){
				cardData = new Traits({
					cardSet: deck.deckSize,
					cardNumber: cardNumber,
					cardType: cardType
				});
				cardData.$save(function(response){
					deck.cardList.push({
						traitData: response,
						cardRole: cardType,
						x_coord: cardNumber * 15
					});
				}).then(function(response){
					if(saveDeck){
						deck.$update(function(response){
							service.resource = response;
						});
					}
				});
			} else if(cardType === 'Feat'){
				cardData = new Feats({
					cardSet: deck.deckSize,
					cardNumber: cardNumber,
					cardType: cardType
				});
				cardData.$save(function(response){
					deck.cardList.push({
						featData: response,
						cardRole: cardType,
						x_coord: cardNumber * 15
					});
				}).then(function(response){
					if(saveDeck){
						deck.$update(function(response){
							service.resource = response;
						});
					}
				});
			} else if(cardType === 'Augment'){
				cardData = new Augments({
					cardSet: deck.deckSize,
					cardNumber: cardNumber,
					cardType: cardType
				});
				cardData.$save(function(response){
					deck.cardList.push({
						augmentData: response,
						cardRole: cardType,
						x_coord: cardNumber * 15
					});
				}).then(function(response){
					if(saveDeck){
						deck.$update(function(response){
							service.resource = response;
						});
					}
				});
			} else if(cardType === 'Item'){
				cardData = new Items({
					cardSet: deck.deckSize,
					cardNumber: cardNumber,
					cardType: cardType
				});
				cardData.$save(function(response){
					deck.cardList.push({
						itemData: response,
						cardRole: cardType,
						x_coord: cardNumber * 15
					});
				}).then(function(response){
					if(saveDeck){
						deck.$update(function(response){
							service.resource = response;
						});
					}
				});
			} else if(cardType === 'Origin'){
				cardData = new Origins({
					cardSet: deck.deckSize,
					cardNumber: cardNumber,
					cardType: cardType
				});
				cardData.$save(function(response){
					deck.cardList.push({
						originData: response,
						cardRole: cardType,
						x_coord: cardNumber * 15
					});
				}).then(function(response){
					if(saveDeck){
						deck.$update(function(response){
							service.resource = response;
						});
					}
				});
			}
		};
		
		service.addDeck = function(type, size){
			console.log('addDeck');
			
			var deck = new Decks ({
				deckType: type,
				deckSize: size,
				cardList: [{
					cardRole: 'deckOptions',
					x_coord: 0
				}]
			});
			
			deck.$save(
				function(response){
					for(var i = 0; i < size; i++){
						service.addCard(deck, type, i+1, (i+1 === size));
					}
				});
			
			console.log(deck);
		};
		
		service.addPc = function(){
			var pc = new Pcs (
				pcsDefaults
			);
			
			pc.$save(function(response){
				service.resource = response;
			});
		};
		
		// DELETE existing Pc
		service.deleteAspect = function(aspect){
			if(aspect){
				aspect.$remove(function(response){
					for (var i in service.resource.cardList ) {
						if (service.resource.cardList[i] === aspect ) {
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
		
		return service;
		
	}]);
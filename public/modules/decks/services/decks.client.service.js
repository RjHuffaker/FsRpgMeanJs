'use strict';

// Factory-service for Browsing, Reading, Editting, Adding, and Deleting Cards.
angular.module('decks')
	.factory('Decks', ['$stateParams', '$location', 'Authentication', '$resource', '$rootScope', 'Cards',
			function($stateParams, $location, Authentication, $resource, $rootScope, Cards){
		
		var Decks = $resource(
			'decks/:deckId:deckType',
			{ deckId: '@_id'},
			{ update: { method: 'PUT' } }
		);
		
		var service = {};
		
		service.deck = {};
		
		service.cardList = [];
		
		service.card = {};
		
		var optionsPanel = {
			optionsPanel: true
		};
		
		var setCardList = function(cardList){
			for(var i = 0; i < cardList.length; i++){
				cardList[i].cardRole = 'deckSummary';
				cardList[i].cardType = 'deckSummary';
				cardList[i].x_coord = i * 15;
				cardList[i].y_coord = 0;
				cardList[i].dragging = false;
				cardList[i].stacked = false;
			}
		};
		
		// BROWSE Decks
		service.browseDecks = function(){
			service.cardList = Decks.query(
				function(response) {
					service.cardList.unshift(optionsPanel);
					setCardList(service.cardList);
				}
			);
			return {cardList: service.cardList};
		};
		
		// READ single Deck
		service.readDeck = function(deck){
			service.deck = Decks.get({
				deckId: deck._id
			}, function(response){
				console.log(response);
				service.deck.cardList.unshift(optionsPanel);
				setCardList(service.deck.cardList);
			});
			
			return service.deck;
		};
		
		// EDIT existing Deck
		service.editDeck = function(deck) {
			deck.$update(function(response) {
				setCardList(deck.cardList);
			}, function(errorResponse) {
				console.log(errorResponse);
			});
		};
		
		// ADD a new Card
		service.addDeck = function(cardNumber){
			var index;
			if(cardNumber < 1){
				index = service.cardList.length;
			} else {
				index = cardNumber;
			}
			service.deck = new Decks ({
				deckType: 'custom'
			});
			service.deck.$save(function(response) {
					for(var i in service.cardList){
						if(service.cardList[i].cardNumber >= index){
							service.cardList[i].cardNumber += 1;
							service.cardList[i].x_coord += 15;
							service.cardList[i].$update();
						}
					}
					service.cardList.push(service.deck);
					setCardList(service.deck.cardList);
				}, function(errorResponse) {
					console.log(errorResponse);
				}
			);
			
			return service.deck;
		};
		
		// DELETE existing Card
		service.deleteDeck = function(deck){
			if(deck){
				console.log('Delete:');
				console.log(deck);
				deck.$remove();
				for(var i in service.cardList){
					if(service.cardList[i] === deck){
						console.log('Delete:');
						console.log(service.cardList[i]);
						service.cardList.splice(i, 1);
					}
					if (service.cardList[i] && service.cardList[i].cardNumber > deck.cardNumber){
						console.log('reordering '+service.cardList[i].cardNumber +' / '+ deck.cardNumber);
						service.cardList[i].cardNumber -= 1;
					}
				}
				setCardList(deck.cardList);
				return {cardList: service.cardList};
			}
		};
		
		return service;
	}]);
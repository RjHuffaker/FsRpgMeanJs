'use strict';

var cardsModule = angular.module('cards');

// Factory-service for Browsing, Reading, Editting, Adding, and Deleting Cards.
cardsModule.factory('Cards', ['$stateParams', '$location', 'Authentication', '$resource', 
	function($stateParams, $location, Authentication, $resource){
		
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
		
		var service = {};
		
		service.card = {};
		
		service.cardList = [];
		
		service.cardType = 0;
		
		service.cardNew = false;
		
		service.cardSaved = false;
		
		service.lockCard = function(card){
			card.locked = true;
			card.x_index = card.cardNumber - 1;
			card.y_index = 0;
			card.x_coord = card.x_index * 250;
			card.y_coord = 0;
		};
		
		service.unlockCard = function(card){
			card.locked = false;
			card.x_index = card.cardNumber - 1;
			card.y_index = 0;
			card.x_coord = card.x_index * 250;
			card.y_coord = 0;
		};
		
		service.setCardList = function(){
			for(var i = 0; i < service.cardList.length; i++){
				service.unlockCard(service.cardList[i]);
			}
		};
		
		// BROWSE cards
		service.browseCards = function(cardType){
			service.cardType = cardType;
			switch(service.cardType){
				case 1:
					service.cardList = Traits.query(
						function(response){
							service.setCardList();
						}
					);
					break;
				case 2:
					service.cardList = Feats.query(
						function(response){
							service.setCardList();
						}
					);
					break;
				case 3:
					service.cardList = Augments.query(
						function(response){
							service.setCardList();
						}
					);
					break;
				case 4:
					service.cardList = Items.query(
						function(response){
							service.setCardList();
						}
					);
					break;
			}
		};
		
		// READ single Card
		service.readCard = function(card){
			var cardId = card._id;
			switch(service.cardType){
				case 1:
					card = Traits.get({
						traitId: cardId
					});
					break;
				case 2:
					card = Feats.get({
						featId: cardId
					});
					break;
				case 3:
					card = Augments.get({
						augmentId: cardId
					});
					break;
				case 4:
					card = Items.get({
						itemId: cardId
					});
					break;
			}
			service.unlockCard(card);
		};
		
		// EDIT existing Card
		service.editCard = function(card) {
			card.$update(function(response) {
				service.lockCard(card);
			}, function(errorResponse) {
				this.error = errorResponse.data.message;
			});
		};
		
		// ADD a new Card
		service.addCard = function(){
			switch(service.cardType){
				case 1:
					this.card = new Traits ({
						cardNumber: this.cardList.length + 1
					});
					this.card.$save(function(response) {
						service.cardList.push(service.card);
						service.unlockCard(service.card);
					}, function(errorResponse) {
						console.log(errorResponse);
					});
					break;
				case 2:
					this.card = new Feats ({
						cardNumber: this.cardList.length + 1
					});
					this.card.$save(function(response) {
						service.cardList.push(service.card);
						service.unlockCard(service.card);
					}, function(errorResponse) {
						console.log(errorResponse);
					});
					break;
				case 3:
					this.card = new Augments ({
						cardNumber: this.cardList.length + 1
					});
					this.card.$save(function(response) {
						service.cardList.push(service.card);
						service.unlockCard(service.card);
					}, function(errorResponse) {
						console.log(errorResponse);
					});
					break;
				case 4:
					this.card = new Items ({
						cardNumber: this.cardList.length + 1
					});
					this.card.$save(function(response){
						service.cardList.push(service.card);
						service.unlockCard(service.card);
					}, function(errorResponse){
						console.log(errorResponse);
					});
					break;
			}
		};
		
		// DELETE existing Card
		service.deleteCard = function(card){
			if(card){
				card.$remove();
				for(var i in service.cardList){
					if(this.cardList[i] === card ) {
						this.cardList.splice(i, 1);
					}
					if (this.cardList[i] && this.cardList[i].cardNumber > card.cardNumber){
						console.log(this.cardList[i].cardNumber +' / '+ card.cardNumber);
						this.cardList[i].cardNumber -= 1;
						this.cardList[i].x_index -= 1;
						this.cardList[i].x_coord -= card.x_dim;
					}
				}
			}
		};
		
		return service;
	}]);
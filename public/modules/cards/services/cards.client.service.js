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
		
		service.setCardList = function(){
			for(var i = 0; i < service.cardList.length; i++){
				service.cardList[i].x_index = service.cardList[i].cardNumber - 1;
				service.cardList[i].y_index = 0;
				service.cardList[i].x_coord = service.cardList[i].x_index * 250;
				service.cardList[i].y_coord = 0;
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
		service.readCard = function(){
			switch(service.cardType){
				case 1:
					service.card = Traits.get({
						traitId: $stateParams.traitId
					});
					break;
				case 2:
					service.card = Feats.get({
						featId: $stateParams.featId
					});
					break;
				case 3:
					service.card = Augments.get({
						augmentId: $stateParams.augmentId
					});
					break;
				case 4:
					service.card = Items.get({
						itemId: $stateParams.itemId
					});
					break;
			}
		};
		
		// EDIT existing Card
		service.editCard = function() {
			var card = this.card;
			
			card.$update(function() {
			
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
						service.browseCards(service.cardType);
					}, function(errorResponse) {
						console.log(errorResponse);
					});
					break;
				case 2:
					this.card = new Feats ({
						cardNumber: this.cardList.length + 1
					});
					this.card.$save(function(response) {
						service.browseCards(service.cardType);
					}, function(errorResponse) {
						console.log(errorResponse);
					});
					break;
				case 3:
					this.card = new Augments ({
						cardNumber: this.cardList.length + 1
					});
					this.card.$save(function(response) {
						service.browseCards(service.cardType);
					}, function(errorResponse) {
						console.log(errorResponse);
					});
					break;
				case 4:
					this.card = new Items ({
						cardNumber: this.cardList.length + 1
					});
					this.card.$save(function(response){
						service.browseCards(service.cardType);
					}, function(errorResponse){
						console.log(errorResponse);
					});
					break;
			}
		};
		
		// DELETE existing Card
		service.deleteCard = function(card){
			if (card) {
				card.$remove();
				for(var i in this.cardlist){
					if (this.cardlist[i] === card ) {
						this.cardlist.splice(i, 1);
					}
				}
			} else {
				this.card.$remove(function(){
					$location.path('cards');
				});
			}
			this.browseCards(this.cardType);
		};
		
		return service;
	}]);
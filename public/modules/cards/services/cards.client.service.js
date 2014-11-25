'use strict';

var cardsModule = angular.module('cards');

// Factory-service for Browsing, Reading, Editting, Adding, and Deleting Cards.
cardsModule.factory('Cards', ['$stateParams', '$location', 'Authentication', '$resource', 
	function($stateParams, $location, Authentication, $resource){
		
		var Cards = $resource(
			'cards/:cardId',
			{ pcId: '@_id' },
			{ update: { method: 'PUT' } }
		);
		
		var service = {};
		
		service.card = {};

		service.cardList = [];
		
		service.cardNew = false;
		
		service.cardSaved = false;
		
		// BROWSE Cards
		service.browseCards = function() {
			this.cardList = Cards.query(
				function(response) {
					for(var i = 0; i < service.cardList.length; i++){
						service.cardList[i].index = i;
						service.cardList[i].column = i * 25;
						service.cardList[i].overlap = false;
						if(i > 0){
							service.cardList[i].overlap = true;
						}
					}
				}
			);
		};
		
		// READ single Card
		service.readCard = function() {
			this.card = Cards.get({
				cardId: $stateParams.cardId
			});
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
		service.addCard = function() {
			// Create new Card object
			this.card = new Cards ({});
			
			this.card.$save(function(response) {
				$location.path('cards/'+response._id+'/edit');
			}, function(errorResponse) {
				this.error = errorResponse.data.message;
			});
		};
		
		// DELETE existing Card
		service.deleteCard = function(card) {
			if ( card ) { card.$remove();
				for (var i in this.cards ) {
					if (this.cards [i] === card ) {
						this.cards.splice(i, 1);
					}
				}
			} else {
				this.card.$remove(function() {
					$location.path('cards');
				});
			}
			this.browseCards();
		};
		
		return service;
	}]);
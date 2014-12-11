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
		
		service.cardNew = false;
		
		service.cardSaved = false;
		
		// BROWSE traits
		service.browseTraits = function() {
			this.cardList = Traits.query();
			for(var i = 0; i < service.cardList; i++){
				service.cardList[i].x_index = service.cardList[i].cardNumber - 1;
				service.cardList[i].y_index = 0;
				service.cardList[i].x_coord = 0;
				service.cardList[i].y_coord = 0;
			}
			console.log(this.cardList);
		};
		
		// BROWSE feats
		service.browseFeats = function() {
			this.cardList = Feats.query(
				function(response) {
				}
			);
			for(var i = 0; i < this.cardList; i++){
				this.cardList[i].x_index = this.cardList[i].cardNumber - 1;
				this.cardList[i].y_index = 0;
				this.cardList[i].x_coord = this.cardList[i].x_index * 250;
				this.cardList[i].y_coord = 0;
			}
		};
		
		// BROWSE augments
		service.browseAugments = function() {
			this.cardList = Augments.query(
				function(response) {
					for(var i = 0; i < this.cardList; i++){
						this.cardList[i].x_index = this.cardList[i].cardNumber - 1;
						this.cardList[i].y_index = 0;
						this.cardList[i].x_coord = this.cardList[i].x_index * 250;
						this.cardList[i].y_coord = 0;
					}
				}
			);
		};
		
		// BROWSE Items
		service.browseItems = function() {
			this.cardList = Items.query(
				function(response) {
					for(var i = 0; i < this.cardList; i++){
						this.cardList[i].x_index = this.cardList[i].cardNumber - 1;
						this.cardList[i].y_index = 0;
						this.cardList[i].x_coord = this.cardList[i].x_index * 250;
						this.cardList[i].y_coord = 0;
					}
				}
			);
		};
		
		// READ single Card
		service.readTrait = function() {
			this.card = Traits.get({
				traitId: $stateParams.traitId
			});
		};
		
		service.readFeat = function() {
			this.card = Feats.get({
				featId: $stateParams.featId
			});
		};
		
		service.readAugment = function() {
			this.card = Augments.get({
				augmentId: $stateParams.augmentId
			});
		};
		
		service.readItem = function() {
			this.card = Items.get({
				itemId: $stateParams.itemId
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
		service.addTrait = function() {
			this.card = new Traits ({});
			
			this.card.$save(function(response) {
				$location.path('traits/'+response._id+'/edit');
			}, function(errorResponse) {
		//		this.error = errorResponse.data.message;
				console.log(errorResponse);
			});
		};
		
		service.addFeat = function() {
			this.card = new Feats ({});
			
			this.card.$save(function(response) {
				$location.path('feats/'+response._id+'/edit');
			}, function(errorResponse) {
		//		this.error = errorResponse.data.message;
				console.log(errorResponse);
			});
		};
		
		service.addAugment = function() {
			this.card = new Augments ({});
			
			this.card.$save(function(response) {
				$location.path('augments/'+response._id+'/edit');
			}, function(errorResponse) {
		//		this.error = errorResponse.data.message;
				console.log(errorResponse);
			});
		};
		
		service.addItem = function() {
			this.card = new Items ({});
			
			this.card.$save(function(response) {
				$location.path('items/'+response._id+'/edit');
			}, function(errorResponse) {
		//		this.error = errorResponse.data.message;
				console.log(errorResponse);
			});
		};
		
		// DELETE existing Card
		service.deleteCard = function(card) {
			if ( card ) { card.$remove();
				for (var i in this.cardlist ) {
					if (this.cardlist [i] === card ) {
						this.cardlist.splice(i, 1);
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
'use strict';

// Factory-service for Browsing, Reading, Editting, Adding, and Deleting Cards.
angular.module('cards')
	.factory('Cards', ['$stateParams', '$location', 'Authentication', '$resource', '$rootScope',
			function($stateParams, $location, Authentication, $resource, $rootScope){
		
		var Cards = $resource(
			'cards/:cardId:cardType',
			{ cardId: '@_id'},
			{ update: { method: 'PUT' } }
		);
		
		var service = {};
		
		service.cardList = [];
		
		service.cardType = 'trait';
		
		service.cardNew = false;
		
		service.cardSaved = false;
		
		var optionsPanel = {
			cardType: service.cardType,
			optionsPanel: true
		};
		
		service.lockCard = function(card){
			card.locked = true;
		};
		
		service.unlockCard = function(card){
			card.locked = false;
		};
		
		service.setCardList = function(){
			for(var i = 0; i < service.cardList.length; i++){
				this.cardList[i].cardRole = 'architect';
				this.cardList[i].locked = false;
				this.cardList[i].x_coord = i * 15;
				this.cardList[i].y_coord = 0;
				this.cardList[i].dragging = false;
				this.cardList[i].stacked = false;
			}
		};
		
		service.changeDurability = function(card, add){
			if(add && card.durability.modifier < 4){
				card.durability.modifier += 1;
			} else if(!add && card.durability.modifier > 0){
				card.durability.modifier -= 1;
			}
		};
		
		service.changeSpeed = function(card, add){
			if(add && card.speed.modifier < 1){
				card.speed.modifier += 1;
			} else if(!add && card.speed.modifier > -1){
				card.speed.modifier -= 1;
			}
		};
		
		service.changeFinesse = function(card, add){
			if(add && card.finesse.modifier < 0){
				card.finesse.modifier += 1;
			} else if(!add && card.finesse.modifier > -2){
				card.finesse.modifier -= 1;
			}
		};
		
		service.changeWeight = function(card, add){
			if(add && card.weight < 9){
				card.weight += 1;
			} else if(!add && card.weight > 0){
				card.weight -= 1;
			}
		};
		
		service.changeCost = function(card, add){
			if(add && card.cost < 18){
				card.cost += 1;
			} else if(!add && card.cost > 0){
				card.cost -= 1;
			}
		};
		
		// BROWSE cards
		service.browseCards = function(cardType){
			service.cardType = cardType;
			service.cardList = Cards.query(
				{'cardType': cardType},
				function(response){
					service.cardList.unshift(optionsPanel);
					service.setCardList();
				}
			);
			
			return {cardList: service.cardList};
		};
		
		// READ single Card
		service.readCard = function(card){
			card = Cards.get({
				cardId: card._id
			});
			
			service.unlockCard(card);
		};
		
		// EDIT existing Card
		service.editCard = function(card) {
			card.$update(function(response) {
				service.unlockCard(card);
			}, function(errorResponse) {
				console.log(errorResponse);
			});
		};
		
		// ADD a new Card
		service.addCard = function(cardNumber){
			var index;
			if(cardNumber < 1){
				index = service.cardList.length;
			} else {
				index = cardNumber;
			}
			this.card = new Cards ({
				cardRole: 'architect',
				cardType: service.cardType,
				cardNumber: index,
				dragging: false,
				stacked: false
			});
			this.card.$save(function(response) {
					for(var i in service.cardList){
						if(service.cardList[i].cardNumber >= index){
							service.cardList[i].cardNumber += 1;
							service.cardList[i].x_coord += 15;
							service.cardList[i].$update();
						}
					}
					service.cardList.push(service.card);
					service.setCardList();
				}, function(errorResponse) {
					console.log(errorResponse);
				}
			);
		};
		
		// DELETE existing Card
		service.deleteCard = function(card){
			if(card){
				console.log('Delete:');
				console.log(card);
				card.$remove();
				for(var i in service.cardList){
					if(service.cardList[i] === card){
						console.log('Delete:');
						console.log(service.cardList[i]);
						service.cardList.splice(i, 1);
					}
					if (service.cardList[i] && service.cardList[i].cardNumber > card.cardNumber){
						console.log('reordering '+service.cardList[i].cardNumber +' / '+ card.cardNumber);
						service.cardList[i].cardNumber -= 1;
					}
				}
				service.setCardList();
				return {cardList: service.cardList};
			}
		};
		
		return service;
	}]);
'use strict';

// General BREAD Factory-service.
angular.module('decks')
	.factory('BREAD', ['$stateParams', '$location', 'Authentication', '$resource', '$rootScope', 'pcsDefaults',
			function($stateParams, $location, Authentication, $resource, $rootScope, pcsDefaults){
		
		var Aspects = $resource(
			'aspect/:aspectId',
			{ aspectId: '@_id' },
			{
				update: { method: 'PUT' },
				list: {
					url: '/aspects',
					method: 'GET',
					isArray: true
				},
				query: {
					url: '/aspects/:deckIds/:aspectType',
					method: 'GET',
					isArray: true,
					params: {
						deckIds: 'deckIds',
						aspectType: 'aspectType'
					}
				}
			}
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
			'deck/:deckId',
			{ deckId: '@_id' },
			{
				update: { method: 'PUT' },
				list: {
					url: '/decks',
					method: 'GET',
					isArray: true
				},
				query: {
					url: '/decks/:deckType',
					method: 'GET',
					isArray: true,
					params: { deckType: 'deckType' }
				}
			}
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
		
		service.dependencyList = [];
		
		service.findDependency = function(deck){
			var index = -1;
			for(var i = 0; i < service.resource.dependencies.length; i++){
				var dependency = service.resource.dependencies[i];
				if(dependency._id === deck._id){
					index = i;
				}
			}
			return index;
		};
		
		service.toggleDependency = function(deck){
			console.log(service.resource);
			var deckIndex = service.findDependency(deck);
			console.log(deckIndex);
			
			if (deckIndex > -1) {
				service.resource.dependencies.splice(deckIndex, 1);
			} else {
				service.resource.dependencies.push(deck);
			}
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
		
		var listDecks = function(){
			Decks.query({deckType: 'Aspect'},
				function(response){
					console.log(response);
					service.dependencyList = response;
				}
			);
		};
		
		var setCardList = function(list, destination){
			destination.cardList = list;
			for(var i = 0; i < list.length; i++){
				destination.cardList[i].x_coord = i * 15;
				destination.cardList[i].y_coord = 0;
				destination.cardList[i].x_overlap = false;
				destination.cardList[i].y_overlap = false;
				destination.cardList[i].dragging = false;
				destination.cardList[i].stacked = false;
			}
			$rootScope.$broadcast('BREAD:onDeckChange');
		};
		
		var removePanel = function(panel){
			for(var i = 0; i < service.resource.cardList.length; i++){
				if(service.resource.cardList[i] === panel ) {
					service.resource.cardList.splice(i, 1);
				}
			}
		};
		
		var shiftDeck = function(expand, panel){
			console.log(panel);
			var panel_x = panel.x_coord;
			var panel_y = panel.y_coord;
			var x_shift = expand ? 15 : -15;
			var _number = expand ? 1 : -1;
			var _length = service.resource.cardList.length-1;
			
			service.resource.deckSize = _length;
			
			for(var i = 0; i < _length+1; i++){
				var slot = service.resource.cardList[i];
				
				if(slot.aspectData){
					slot.aspectData.cardSet = _length;
				} else if(slot.traitData){
					slot.traitData.cardSet = _length;
				} else if(slot.featData){
					slot.featData.cardSet = _length;
				} else if(slot.augmentData){
					slot.augmentData.cardSet = _length;
				} else if(slot.itemData){
					slot.itemData.cardSet = _length;
				} else if(slot.originData){
					slot.originData.cardSet = _length;
				}
				console.log(panel_x);
				console.log(slot.x_coord);
				
				if(panel_x <= slot.x_coord){
					if(panel !== slot){
						slot.x_coord += x_shift;
						if(slot.aspectData){
							slot.aspectData.cardNumber += _number;
						} else if(slot.traitData){
							slot.traitData.cardNumber += _number;
						} else if(slot.featData){
							slot.featData.cardNumber += _number;
						} else if(slot.augmentData){
							slot.augmentData.cardNumber += _number;
						} else if(slot.itemData){
							slot.itemData.cardNumber += _number;
						} else if(slot.originData){
							slot.originData.cardNumber += _number;
						}
					}
				}
			}
			
			$rootScope.$broadcast('BREAD:onDeckChange');
		};
		
		service.toggleCardLock = function(panel){
			console.log(panel);
			for(var i = 0; i < service.resource.cardList.length; i++){
				if(panel === service.resource.cardList[i]){
					service.resource.cardList[i].locked = !service.resource.cardList[i].locked;
				}
			}
		};
		
		service.changeAspect = function(card, aspect){
			console.log(card.aspect);
			console.log(aspect);
			if(card.aspect === aspect){
				console.log('same');
			} else {
				card.aspect = aspect;
			}
		};
		
		// BROWSE
		service.browseAspects = function(params){
			Aspects.query(params, function(response){
				console.log(response);
				if(params.aspectType === 'Archetype'){
					service.resource.archetypeList = angular.fromJson(angular.toJson(response));
				} else if(params.aspectType === 'Allegiance'){
					service.resource.allegianceList = angular.fromJson(angular.toJson(response));
				} else if(params.aspectType === 'Race'){
					service.resource.raceList = angular.fromJson(angular.toJson(response));
				}
			});
		};
		
		
		service.browseCards = function(cardType, params, destination){
			if(cardType === 'Aspect'){
				Aspects.query(params, function(response){
					return response;
				});
			} else if(cardType === 'Trait'){
				Traits.query(params, function(response){
					return response;
				});
			} else if(cardType === 'Feat'){
				Feats.query(params, function(response){
					return response;
				});
			} else if(cardType === 'Augments'){
				Augments.query(params, function(response){
					return response;
				});
			} else if(cardType === 'Items'){
				Items.query(params, function(response){
					return response;
				});
			} else if(cardType === 'Origins'){
				Origins.query(params, function(response){
					return response;
				});
			}
		};
		
		service.browseDecks = function(param, destination){
			if(param){
				Decks.query(param, function(response){
					if(destination === service.dependencyList){
						service.dependencyList = response;
					} else {
						response.unshift({
							cardRole: 'architectOptions'
						});
						setCardList(response, service.resource);
					}
				});
			} else {
				Decks.list(function(response){
					response.unshift({
						cardRole: 'architectOptions'
					});
					setCardList(response, service.resource);
				});
			}
		};
		
		service.browsePcs = function(){
			service.resource = {};
			service.resource.cardList = [];
			Pcs.query(function(response){
				response.unshift({
					cardRole: 'playerOptions'
				});
				setCardList(response, service.resource);
			});
		};
		
		// READ
		
		service.readCard = function(panel){
			var _card;
			
			if(panel.cardRole === 'Aspect'){
				_card = Aspects.get({
					aspectId: panel.aspectData._id
				},
				function(response){
					panel.aspectData = response;
				});
			} else if(panel.cardRole === 'Trait'){
				_card = Traits.get({
					traitId: panel.traitData._id
				},
				function(response){
					panel.traitData = response;
				});
			} else if(panel.cardRole === 'Feat'){
				_card = Feats.get({
					featId: panel.featData._id
				},
				function(response){
					panel.featData = response;
				});
			} else if(panel.cardRole === 'Augment'){
				_card = Augments.get({
					augmentId: panel.augmentData._id
				},
				function(response){
					panel.augmentData = response;
				});
			} else if(panel.cardRole === 'Item'){
				_card = Items.get({
					itemId: panel.itemData._id
				},
				function(response){
					panel.itemData = response;
				});
			} else if(panel.cardRole === 'Origin'){
				_card = Origins.get({
					originId: panel.originData._id
				},
				function(response){
					panel.originData = response;
				});
			}
		};
		
		service.readDeck = function(deck){
			Decks.get({
				deckId: deck._id
			}, function(response){
				service.resource = response;
				console.log(response);
				if(response.deckType !== 'Aspect'){
					var deckIds = [];
					
					for(var i = 0; i < response.dependencies.length; i++){
						deckIds.push(response.dependencies[i]._id);
					}
					
					service.browseDecks({deckType: 'Aspect'}, service.dependencyList);
					
					service.browseAspects({
						deckIds: deckIds,
						aspectType: 'Archetype'
					});
					
					service.browseAspects({
						deckIds: deckIds,
						aspectType: 'Allegiance'
					});
					
					service.browseAspects({
						deckIds: deckIds,
						aspectType: 'Race'
					});
				}
			});
		};
		
		service.readPc = function(pc) {
			service.resource = Pcs.get({
				pcId: pc._id
			});
		};
		
		//EDIT
		
		service.editCard = function(panel){
			
			console.log(panel);
			if(panel.cardRole === 'Aspect'){
				new Aspects(panel.aspectData).$update();
			} else if(panel.cardRole === 'Trait' && panel.traitData){
				var trait = new Traits(panel.traitData);
				if(trait.aspect) trait.aspect = panel.traitData.aspect._id;
				trait.$update();
			} else if(panel.cardRole === 'Feat'){
				var feat = new Feats(panel.featData);
				if(feat.aspect) feat.aspect = panel.featData.aspect._id;
				feat.$update();
			} else if(panel.cardRole === 'Augment'){
				var augment = new Augments(panel.augmentData);
				if(augment.aspect) augment.aspect = panel.augmentData.aspect._id;
				augment.$update();
			} else if(panel.cardRole === 'Item'){
				var item = new Items(panel.itemData);
				if(item.aspect) item.aspect = panel.itemData.aspect._id;
				item.$update();
			} else if(panel.cardRole === 'Origin'){
				var origin = new Origins(panel.originData);
				if(origin.aspect) origin.aspect = panel.itemData.aspect._id;
				origin.$update();
			}
		};
		
		service.editDeck = function(deck, _editCards, _loadDeck) {
			var _deck = new Decks(deck);
			
			console.log(deck);
			
			_deck.$update(function(response) {
				if(_editCards){
					for(var i = 0; i < deck.cardList.length; i++){
						var panel = deck.cardList[i];
						service.editCard(panel);
					}
					$rootScope.$broadcast('BREAD: deckSaved');
				}
				if(_loadDeck){
					service.resource = response;
				}
			}, function(errorResponse) {
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
		
		service.addCard = function(deck, cardType, cardNumber, deckShift, deckSave){
			console.log(deck);
			var card = {
				deck: deck._id,
				cardSet: deck.deckSize,
				cardNumber: cardNumber,
				cardType: cardType
			};
			
			var panel = {
				cardRole: cardType,
				x_coord: cardNumber * 15,
				y_coord: 0
			};
			
			if(cardType === 'Aspect'){
				new Aspects( card ).$save(function(response){
					panel.aspectData = response;
					deck.cardList.push(panel);
				}).then(function(response){
					if(deckShift) shiftDeck(true, panel);
				}).then(function(response){
					if(deckSave) service.editDeck(deck, false, true);
				});
				
			} else if(cardType === 'Trait'){
				new Traits( card ).$save(function(response){
					panel.traitData = response;
					deck.cardList.push(panel);
				}).then(function(response){
					if(deckShift) shiftDeck(true, panel);
				}).then(function(response){
					if(deckSave) service.editDeck(deck, false, true);
				});
				
			} else if(cardType === 'Feat'){
				new Feats( card ).$save(function(response){
					panel.featData = response;
					deck.cardList.push(panel);
				}).then(function(response){
					if(deckShift) shiftDeck(true, panel);
				}).then(function(response){
					if(deckSave) service.editDeck(deck, false, true);
				});
			} else if(cardType === 'Augment'){
				new Augments( card ).$save(function(response){
					panel.augmentData = response;
					deck.cardList.push(panel);
				}).then(function(response){
					if(deckShift) shiftDeck(true, panel);
				}).then(function(response){
					if(deckSave) service.editDeck(deck, false, true);
				});
			} else if(cardType === 'Item'){
				new Items( card ).$save(function(response){
					panel.itemData = response;
					deck.cardList.push(panel);
				}).then(function(response){
					if(deckShift) shiftDeck(true, panel);
				}).then(function(response){
					if(deckSave) service.editDeck(deck, false, true);
				});
			} else if(cardType === 'Origin'){
				new Origins( card ).$save(function(response){
					panel.originData = response;
					deck.cardList.push(panel);
				}).then(function(response){
					if(deckShift) shiftDeck(true, panel);
				}).then(function(response){
					if(deckSave) service.editDeck(deck, false, true);
				});
			}
		};
		
		service.addDeck = function(type, size){
			console.log('addDeck');
			
			var deck = new Decks ({
				name: type+' Deck',
				deckType: type,
				deckSize: size,
				cardList: [{
					cardRole: 'deckOptions',
					x_coord: 0,
					y_coord: 0
				}]
			});
			
			deck.$save(
				function(response){
					for(var i = 0; i < size; i++){
						service.addCard(deck, type, i+1, false, (i+1 === size));
					}
					if(type !== 'Aspect'){
						service.browseDecks({deckType: 'Aspect'}, service.dependencyList);
					}
				});
		};
		
		service.addPc = function(){
			var pc = new Pcs (
				pcsDefaults
			);
			
			pc.$save(function(response){
				service.resource = response;
			});
		};
		
		// DELETE
		service.deleteCard = function(panel, _removePanel, _shiftDeck){
			var cardData = 0;
			var panel_x_coord = panel.x_coord;
			
			if(panel.cardRole === 'Aspect'){
				new Aspects(panel.aspectData).$remove(function(response){
					if(_removePanel) removePanel(panel);
				}).then(function(response){
					if(_shiftDeck) shiftDeck(false, panel);
				});
			} else if(panel.cardRole === 'Trait'){
				new Traits(panel.traitData).$remove(function(response){
					if(_removePanel) removePanel(panel);
				}).then(function(response){
					if(_shiftDeck) shiftDeck(false, panel);
				});
			} else if(panel.cardRole === 'Feat'){
				new Feats(panel.featData).$remove(function(response){
					if(_removePanel) removePanel(panel);
				}).then(function(response){
					if(_shiftDeck) shiftDeck(false, panel);
				});
			} else if(panel.cardRole === 'Augment'){
				new Augments(panel.augmentData).$remove(function(response){
					if(_removePanel) removePanel(panel);
				}).then(function(response){
					if(_shiftDeck) shiftDeck(false, panel);
				});
			} else if(panel.cardRole === 'Item'){
				new Items(panel.itemData).$remove(function(response){
					if(_removePanel) removePanel(panel);
				}).then(function(response){
					if(_shiftDeck) shiftDeck(false, panel);
				});
			} else if(panel.cardRole === 'Origin'){
				new Origins(panel.originData).$remove(function(response){
					if(_removePanel) removePanel(panel);
				}).then(function(response){
					if(_shiftDeck) shiftDeck(false, panel);
				});
			}
		};
		
		service.deleteDeck = function(deck){
			console.log(deck);
			
			for(var i = 0; i < service.resource.cardList.length; i++){
				if(service.resource.cardList[i] === deck ) {
					console.log(service.resource.cardList[i]);
				}
			}
			
			deck.$remove(
				function(response){
					removePanel(deck);
					setCardList(service.resource.cardList, service.resource);
					for(var ii = 0; ii < response.cardList.length; ii++){
						var panel = response.cardList[ii];
						service.deleteCard(panel, false, false);
						if(panel.cardRole === 'Aspect'){
							new Aspects(panel.aspectData).$remove();
						} else if(panel.cardRole === 'Trait'){
							new Traits(panel.traitData).$remove();
						} else if(panel.cardRole === 'Feat'){
							new Feats(panel.featData).$remove();
						} else if(panel.cardRole === 'Augment'){
							new Augments(panel.augmentData).$remove();
						} else if(panel.cardRole === 'Item'){
							new Items(panel.itemData).$remove();
						} else if(panel.cardRole === 'Origin'){
							new Origins(panel.originData).$remove();
						}
					}
				}
			);
		};
		
		service.deletePc = function(pc) {
			pc.$remove(function(response){
				for (var i in service.resource.cardList ) {
					if (service.resource.cardList[i] === pc ) {
						service.resource.cardList.splice(i, 1);
					}
				}
			});
		};
		
		return service;
		
	}]);
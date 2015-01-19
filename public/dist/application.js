'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'fsrpg';
	var applicationModuleVendorDependencies = ['ngResource', 'ngCookies', 'ngAnimate', 'ngTouch', 'ngSanitize', 'ui.router', 'ui.bootstrap', 'ui.utils'];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();
'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('cards');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('npcs');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('pcs');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');

'use strict';

// Configuring the Articles module
angular.module('cards').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Cards', 'cards', 'dropdown', '/cards');
		Menus.addSubMenuItem('topbar', 'cards', 'List Traits', 'traits');
		Menus.addSubMenuItem('topbar', 'cards', 'List Feats', 'feats');
		Menus.addSubMenuItem('topbar', 'cards', 'List Augments', 'augments');
		Menus.addSubMenuItem('topbar', 'cards', 'List Items', 'items');
	}
]);
'use strict';

//Setting up route
angular.module('cards').config(['$stateProvider',
	function($stateProvider) {
		// Cards state routing
		$stateProvider.
		state('listCards', {
			url: '/cards',
			templateUrl: 'modules/cards/views/list-cards.client.view.html'
		}).
		state('listTraits', {
			url: '/traits',
			templateUrl: 'modules/cards/views/list-traits.client.view.html'
		}).
		state('listFeats', {
			url: '/feats',
			templateUrl: 'modules/cards/views/list-feats.client.view.html'
		}).
		state('listAugments', {
			url: '/augments',
			templateUrl: 'modules/cards/views/list-augments.client.view.html'
		}).
		state('listItems', {
			url: '/items',
			templateUrl: 'modules/cards/views/list-items.client.view.html'
		});
	}
]);
'use strict';

var cardsModule = angular.module('cards');

// Cards controller
cardsModule.controller('CardsCtrl', ['$scope', '$location', '$log', 'DataSRVC', 'CardDeck', 'Cards',
	function($scope, $location, $log, DataSRVC, CardDeck, Cards) {
		
		$scope.dataSRVC = DataSRVC;
		
		$scope.cards = Cards;
		
		$scope.windowHeight = 0;
		
		$scope.windowScale = 0;
		
		var initialize = function(){
			toggleListeners(true);
		};
		
		var toggleListeners = function(enable){
			if(!enable) return;
			$scope.$on('$destroy', onDestroy);
			$scope.$on('screenSize:onHeightChange', onHeightChange);
		};
		
		var onDestroy = function(){
			toggleListeners(false);
		};
		
		var onHeightChange = function(event, object){
			$scope.windowHeight = object.newHeight;
			$scope.windowScale = object.newScale;
			$scope.$digest();
		};
		
		initialize();
	}
]);
'use strict';

var cardsModule = angular.module('cards');

// feature-card directive
cardsModule
	.directive('cardFeature', function(){
		return {
			restrict: 'A',
			templateUrl: '../modules/cards/views/card-feature.html'
		};
	})
	.directive('cardLogo', function(){
		return {
			restrict: 'A',
			templateUrl: '../modules/cards/views/card-logo.html'
		};
	})
	.directive('cardHeader', function(){
		return {
			restrict: 'A',
			templateUrl: '../modules/cards/views/card-header.html'
		};
	})
	.directive('cardDescription', function(){
		return {
			restrict: 'A',
			templateUrl: '../modules/cards/views/card-description.html'
		};
	})
	.directive('cardModifiers', function(){
		return {
			restrict: 'A',
			templateUrl: '../modules/cards/views/card-modifiers.html'
		};
	})
	.directive('cardBenefit', function(){
		return {
			restrict: 'A',
			templateUrl: '../modules/cards/views/card-benefit.html'
		};
	})
	.directive('cardFooter', function(){
		return {
			restrict: 'A',
			templateUrl: '../modules/cards/views/card-footer.html'
		};
	})
	.directive('cardAction', function(){
		return {
			restrict: 'A',
			templateUrl: '../modules/cards/views/card-action.html',
			scope: {
				cardAction: '='
			}
		};
	})
	.directive('cardActionTitle', function(){
		return {
			restrict: 'A',
			templateUrl: '../modules/cards/views/card-action-title.html'
		};
	})
	.directive('cardActionKeywords', function(){
		return {
			restrict: 'A',
			templateUrl: '../modules/cards/views/card-action-keywords.html'
		};
	})
	.directive('cardActionPrompt', function(){
		return {
			restrict: 'A',
			templateUrl: '../modules/cards/views/card-action-prompt.html'
		};
	})
	.directive('cardActionEffect', function(){
		return {
			restrict: 'A',
			templateUrl: '../modules/cards/views/card-action-effect.html'
		};
	})
	.directive('cardActionAttack', function(){
		return {
			restrict: 'A',
			templateUrl: '../modules/cards/views/card-action-attack.html'
		};
	})
	.directive('cardActionDefense', function(){
		return {
			restrict: 'A',
			templateUrl: '../modules/cards/views/card-action-defense.html'
		};
	})
	.directive('elasticTextarea', ['$timeout', function($timeout){
			return{
				restrict: 'A',
				link: function(scope, element, attrs){
					
					var resizeArea = function(){
						setTimeout(
							function(){
								element[0].style.height = element[0].scrollHeight + 'px';
							},
						25);
					};
					
					scope.$watch(
						function(){
							return element[0].scrollHeight;
						},
						function(newValue, oldValue){
							if(newValue !== oldValue){
								resizeArea();
							}
						}
					);
					
					resizeArea();
				}
			};
		}
	])
	.directive('fitContent', function(){
		return {
			restrict: 'A',
			link: function(scope, element, attrs){
				
				var reduceText = function(){
					setTimeout(
						function(){
							var fontSize = parseInt(element.css('font-size'));
		//					console.log('Measure: '+element[0].offsetHeight+' / ' + fontSize);
							while( element[0].offsetHeight > element.parent()[0].offsetHeight && fontSize >= 8 ){
								fontSize--;
								element.css('font-size', fontSize + 'px' );
		//						console.log('Reducing: '+element[0].offsetHeight+' / ' + parseInt(element.css('font-size')));
							}
						},
					25);
				};
				
				scope.$watch(
					function(){
						return element[0].offsetHeight;
					},
					function(newValue, oldValue){
						if(newValue > oldValue){
							reduceText();
						}
					}
				);
				
				element.css('font-size', '13px');
				reduceText();
			}
		};
	});
'use strict';

var cardsModule = angular.module('cards');

// feature-card directive
cardsModule
	.directive('cardLayout', function(){
		return {
			restrict: 'A',
			templateUrl: '../modules/cards/views/card-layout.html'
		};
	})
	.directive('cardPc1', function(){
		return {
			restrict: 'A',
			templateUrl: '../modules/pcs/views/card-pc-1.html'
		};
	})
	.directive('cardPc2', function(){
		return {
			restrict: 'A',
			templateUrl: '../modules/pcs/views/card-pc-2.html'
		};
	})
	.directive('cardPc3', function(){
		return {
			restrict: 'A',
			templateUrl: '../modules/pcs/views/card-pc-3.html'
		};
	})
	.directive('diceDropdown', function(){
		return {
			restrict: 'A',
			templateUrl: '../modules/pcs/views/dice-dropdown.html',
			scope: {
				ability: '='
			}
		};
	})
	.directive('stopEvent', function(){
		return{
			restrict: 'A',
			link: function(scope, element, attr){
				var _pressEvents = 'touchstart mousedown';
				element.on(_pressEvents, function(event){
					event.stopPropagation();
				});
			}
		};
	})
	.directive('stopClick', function(){
		return{
			restrict: 'A',
			link: function(scope, element, attr){
				element.on('click', function(event){
					event.stopPropagation();
				});
			}
		};
	});
'use strict';
var cardsModule = angular.module('cards');

// Factory-service for managing PC card deck.
cardsModule.factory('CardsDeck', ['Cards',
	function(Cards){
		var service = {};
		
		function cardByIndex(index){
			for(var i = 0; i < Cards.cardList.length; i++){
				var card = Cards.cardList[i];
				if(card.index === index){
					return i;
				}
			}
		}
		
		service.shiftLeft = function(index){
			if(index > 0){
				var _old = cardByIndex(index);
				var _new = cardByIndex(index-1);
				
				if(Cards.cardList[_old].overlap){
					Cards.cardList[_new].column += 25;
				} else {
					Cards.cardList[_new].column += 250;
				}
				
				if(Cards.cardList[_new].overlap){
					Cards.cardList[_old].column -= 25;
				} else {
					Cards.cardList[_old].column -= 250;
				}
				Cards.cardList[_old].index = index-1;
				Cards.cardList[_new].index = index;
				
			}
			if(Cards.cardList[cardByIndex(0)].overlap){
				service.toggleOverlap(0);
			}
		};
		
		service.shiftRight = function(index){
			if(index < Cards.cardList.length - 1){
				var _old = cardByIndex(index);
				var _new = cardByIndex(index+1);
				
				if(Cards.cardList[_old].overlap){
					Cards.cardList[_new].column -= 25;
				} else {
					Cards.cardList[_new].column -= 250;
				}
				
				if(Cards.cardList[_new].overlap){
					Cards.cardList[_old].column += 25;
				} else {
					Cards.cardList[_old].column += 250;
				}
				Cards.cardList[_old].index = index+1;
				Cards.cardList[_new].index = index;
			}
			if(Cards.cardList[cardByIndex(0)].overlap){
				service.toggleOverlap(0);
			}
		};
		
		service.toggleOverlap = function(index){
			var _card = cardByIndex(index);
			if(Cards.cardList[_card].overlap){
				for(var index1 = 0; index1 < Cards.cardList.length; index1++){
					if(Cards.cardList[index1].index > index-1){
						Cards.cardList[index1].column += 225;
					}
				}
				Cards.cardList[_card].overlap = false;
			} else {
				for(var index2 = 0; index2 < Cards.cardList.length; index2++){
					if(Cards.cardList[index2].index > index-1){
						Cards.cardList[index2].column -= 225;
					}
				}
				Cards.cardList[_card].overlap = true;
			}
		};
		
		return service;
	}]);
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
			card.deckType = 'card';
			card.locked = true;
			card.x_coord = (card.cardNumber - 1) * 10;
			card.y_coord = 0;
			card.dragging = false;
			card.stacked = false;
		};
		
		service.unlockCard = function(card){
			card.deckType = 'card';
			card.locked = false;
			card.x_coord = (card.cardNumber - 1) * 10;
			card.y_coord = 0;
			card.dragging = false;
			card.stacked = false;
		};
		
		service.setCardList = function(){
			for(var i = 0; i < service.cardList.length; i++){
				service.lockCard(service.cardList[i]);
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
				service.unlockCard(card);
			}, function(errorResponse) {
				console.log(errorResponse);
			});
		};
		
		// ADD a new Card
		service.addCard = function(index){
			switch(service.cardType){
				case 1:
					this.card = new Traits ({
						deckType: 'card',
						cardNumber: index,
						dragging: false,
						stacked: false
					});
					this.card.$save(function(response) {
						for(var i in service.cardList){
							if(service.cardList[i].cardNumber >= index){
								service.cardList[i].cardNumber += 1;
								service.cardList[i].x_coord += 10;
								service.cardList[i].$update();
							}
						}
						service.cardList.push(service.card);
						service.unlockCard(service.card);
					}, function(errorResponse) {
						console.log(errorResponse);
					});
					break;
				case 2:
					this.card = new Feats ({
						deckType: 'card',
						cardNumber: index,
						dragging: false,
						stacked: false
					});
					this.card.$save(function(response) {
						for(var i in service.cardList){
							if(service.cardList[i].cardNumber >= index){
								service.cardList[i].cardNumber += 1;
								service.cardList[i].x_coord += 10;
								service.cardList[i].$update();
							}
						}
						service.cardList.push(service.card);
						service.unlockCard(service.card);
					}, function(errorResponse) {
						console.log(errorResponse);
					});
					break;
				case 3:
					this.card = new Augments ({
						deckType: 'card',
						cardNumber: index,
						dragging: false,
						stacked: false
					});
					this.card.$save(function(response) {
						for(var i in service.cardList){
							if(service.cardList[i].cardNumber >= index){
								service.cardList[i].cardNumber += 1;
								service.cardList[i].x_coord += 10;
								service.cardList[i].$update();
							}
						}
						service.cardList.push(service.card);
						service.unlockCard(service.card);
					}, function(errorResponse) {
						console.log(errorResponse);
					});
					break;
				case 4:
					this.card = new Items ({
						deckType: 'card',
						cardNumber: index,
						dragging: false,
						stacked: false
					});
					this.card.$save(function(response){
						for(var i in service.cardList){
							if(service.cardList[i].cardNumber >= index){
								service.cardList[i].cardNumber += 1;
								service.cardList[i].x_coord += 10;
								service.cardList[i].$update();
							}
						}
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
						this.cardList[i].x_coord -= 10;
					}
				}
			}
		};
		
		return service;
	}]);
'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		});
	}
]);
'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus',
	function($scope, Authentication, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);
'use strict';

var coreModule = angular.module('core');

// Core Controller
coreModule.controller('HomeController', ['$scope', 'Authentication', 'CardDeck', 'HomeDemo',
	function($scope, Authentication, CardDeck, HomeDemo) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
		
		$scope.cardDeck = CardDeck;
		
		$scope.homeDemo = HomeDemo;
		
		$scope.windowHeight = 0;
		
		$scope.windowScale = 0;
		
		var initialize = function(){
			toggleListeners(true);
		};
		
		var toggleListeners = function(enable){
			if(!enable) return;
			$scope.$on('$destroy', onDestroy);
			$scope.$on('screenSize:onHeightChange', onHeightChange);
		};
		
		var onDestroy = function(){
			toggleListeners(false);
		};
		
		var onHeightChange = function(event, object){
			$scope.windowHeight = object.newHeight;
			$scope.windowScale = object.newScale;
			$scope.$digest();
		};
		
		initialize();
		
	}
]);
'use strict';

var cardsModule = angular.module('core');

// Directive for managing card decks.
cardsModule
	.directive('cardDeck', ['$document', '$parse', '$rootScope', function($document, $parse, $rootScope){
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				
				var pressed = false;
				
				var initialize = function(){
					toggleListeners(true);
				};
				
				var toggleListeners = function (enable) {
					// remove listeners
					if (!enable)return;
					
					// add listeners
					scope.$on('$destroy', onDestroy);
					element.on('mouseleave', onMouseLeave);
					scope.$on('cardPanel:onPressCard', onPress);
					scope.$on('cardPanel:onReleaseCard', onRelease);
					scope.$on('cardPanel:onMoveCard', onMoveCard);
				};
				
				var onDestroy = function(enable){
					toggleListeners(false);
				};
				
				var onPress = function(){
					pressed = true;
				};
				
				var onRelease = function(){
					pressed = false;
				};
				
				var onMoveCard = function(event, object){
					var deckOffset = element.offset();
					var deckWidth = element[0].offsetWidth;
					var deckLeftEdge = deckOffset.left;
					var deckRightEdge = deckLeftEdge + deckWidth - 25;
					
					if(object.mouseX <= deckLeftEdge){
						scope.$emit('cardDeck:unstackLeft', {
							panel: object.panel
						});
					} else if(object.mouseX >= deckRightEdge){
						scope.$emit('cardDeck:unstackRight', {
							panel: object.panel
						});
					}
					
				};
				
				var onMouseLeave = function(event){
					if(pressed){
						$rootScope.$broadcast('cardDeck:onMouseLeave');
					}
				};
				
				initialize();
			}
		};
	}]);
'use strict';

var cardsModule = angular.module('core');

// Directive for managing card decks.
cardsModule
	.directive('cardPanel', ['$document', '$parse', '$rootScope', '$window', function($document, $parse, $rootScope, $window){
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				
				Array.min = function( array ){
					return Math.min.apply( Math, array );
				};
				
				var _startX, _startY, 
					_mouseX, _mouseY,
					_moveX, _moveY,
					_cardX, _cardY,
					_slotX, _slotY,
					_startCol, _mouseCol, _cardCol,
					_startRow, _mouseRow, _cardRow,
					_moveTimer,
					windowScale = 25,
					_x_dim, _y_dim, _x_tab, _y_tab,
					_x_cover, _y_cover;
				
				var _stacked = false;
				
				var _card = $parse(attrs.card) || null;
				
				var _hasTouch = ('ontouchstart' in window);
				
				var _pressEvents = 'touchstart mousedown';
				var _moveEvents = 'touchmove mousemove';
				var _releaseEvents = 'touchend mouseup';
				
				var _pressTimer = null;
				
				var initialize = function(){
					// prevent native drag
					element.attr('draggable', 'false');
					toggleListeners(true);
				};
				
				var toggleListeners = function(enable){
					// remove listeners
					if (!enable)return;
					
					// add listeners.
					scope.$on('$destroy', onDestroy);
					scope.$watch(attrs.card, onCardChange);
					scope.$on('screenSize:onHeightChange', onHeightChange);
					scope.$on('cardPanel:onPressCard', onPressCard);
					scope.$on('cardPanel:onMoveCard', onMoveCard);
					scope.$on('cardPanel:onReleaseCard', onReleaseCard);
					scope.$on('cardDeck:onMouseLeave', onMouseLeave);
					scope.$watch('card.x_coord', resetPosition);
					scope.$watch('card.y_coord', resetPosition);
					element.on(_pressEvents, onPress);
					
					// prevent native drag for images
					 if(! _hasTouch && element[0].nodeName.toLowerCase() === 'img'){
						element.on('mousedown', function(){ return false;});
					}
				};
				
				var onDestroy = function(enable){
					toggleListeners(false);
				};
				
				var onCardChange = function(newVal, oldVal){
					_card = newVal;
					setDefaultPosition();
				};
				
				var onHeightChange = function(event, object){
					windowScale = object.newScale ? object.newScale : 25;
					console.log(windowScale);
					_x_dim = windowScale * 10;
					_y_dim = windowScale * 14;
					_x_tab = windowScale * 2;
					_y_tab = windowScale * 2;
					_x_cover = windowScale * 8;
					_y_cover = windowScale * 12;
					
					element.css({
						'height': _y_dim+'px',
						'width': _x_dim+'px',
						'top': (_card.y_coord * windowScale) + 'px',
						'left': (_card.x_coord * windowScale) + 'px'
					});
				};
				
				var setDefaultPosition = function(){
					element.css({
						'height': '350px',
						'width': '250px',
						'top': (_card.y_coord * 25) + 'px',
						'left': (_card.x_coord * 25) + 'px'
					});
				};
				
				var resetPosition = function(newVal, oldVal){
				//	if(newVal !== oldVal){
						if(element.hasClass('card-moving')){
							element.css({
								'top': (_card.y_coord * windowScale) + 'px',
								'left': (_card.x_coord * windowScale) + 'px'
							});
						}
				//	}
				};
				
				// When the element is clicked start the drag behaviour
				var onPress = function(event){
			
					// Small delay for touch devices to allow for native window scrolling
					if(_hasTouch){
						cancelPress();
						_pressTimer = setTimeout(function(){
							cancelPress();
							onLongPress(event);
						}, 100);
						
						$document.on(_moveEvents, cancelPress);
						$document.on(_releaseEvents, cancelPress);
					}else if(!_hasTouch){
						onLongPress(event);
					}
				};
				
				var cancelPress = function(){
					clearTimeout(_pressTimer);
					$document.off(_moveEvents, cancelPress);
					$document.off(_releaseEvents, cancelPress);
				};
				
				// PRESS
				// Primary "press" function
				var onLongPress = function(event){
					
					_startX = (event.pageX || event.touches[0].pageX);
					_startY = (event.pageY || event.touches[0].pageY);
					
					_moveX = 0;
					_moveY = 0;
					
					$document.on(_moveEvents, onMove);
					$document.on(_releaseEvents, onRelease);
					
					element.removeClass('card-moving');
					
					$rootScope.$broadcast('cardPanel:onPressCard', {
						startX: _startX,
						startY: _startY,
						panel: _card
					});
				};
				
				var onPressCard = function(event, object){
					
					_startCol = _card.x_coord * windowScale;
					_startRow = _card.y_coord * windowScale;
					
					var panel = object.panel;
					var panel_x = panel.x_coord;
					var panel_y = panel.y_coord;
					var panel_y_overlap = panel.y_overlap;
					
					var slot = _card;
					var slot_x = slot.x_coord;
					var slot_y = slot.y_coord;
					
					if(slot_y !== panel_y || slot_x !== panel_x){
						if(slot_x !== panel_x){ 
							element.addClass('card-moving');
						} else if(slot_x !== panel_x && slot_y > panel_y && panel_y_overlap){
							element.addClass('card-moving');
						}
					}
				};
				
				// MOVE
				// Primary "move" function
				var onMove = function(event){
					event.preventDefault();
					
					_mouseX = (event.pageX || event.touches[0].pageX);
					_mouseY = (event.pageY || event.touches[0].pageY);
					
					_mouseCol = _card.x_coord * windowScale;
					_mouseRow = _card.y_coord * windowScale;
					
					_moveX = _mouseX - _startX;
					_moveY = _mouseY - _startY;
					
					_cardX = _moveX + _startCol - (_startCol - _mouseCol);
					_cardY = _moveY + _startRow - (_startRow - _mouseRow);
					
					element.css({
						left: _moveX + _startCol + 'px',
						top: _moveY + _startRow + 'px'
					});
					
					$rootScope.$broadcast('cardPanel:onMoveCard', {
						mouseX: _mouseX,
						mouseY: _mouseY,
						moveX: _moveX,
						moveY: _moveY,
						panelX: _cardX,
						panelY: _cardY,
						panel: _card
					});
				};
				
				// Callback function to move a single card or each card in a vertical stack
				var onMoveCard = function(event, object){
					
					var mouseX = object.mouseX;
					var mouseY = object.mouseY;
					
					var moveX = object.moveX;
					var moveY = object.moveY;
					
					var vectorX = Math.abs(object.moveX);
					var vectorY = Math.abs(object.moveY);
					
					var panel = object.panel;
					var panel_x = panel.x_coord;
					var panel_y = panel.y_coord;
					var panel_x_overlap = panel.x_overlap;
					var panel_y_overlap = panel.y_overlap;
					
					var slot = _card;
					var slot_x = slot.x_coord;
					var slot_y = slot.y_coord;
					var slot_x_overlap = slot.x_overlap;
					var slot_y_overlap = slot.y_overlap;
					
					var changeX = Math.abs(panel_x - slot_x);
					
					if(slot_x === panel_x && slot_y > panel_y && panel_y_overlap){
						element.css({
							left: (_startCol + moveX) + 'px',
							top: (_startRow + moveY) + 'px'
						});
					} else if(panel_x !== slot_x || panel_y !== slot_x){
						if(crossingEdge(mouseX, mouseY) === 'top'){
							if(changeX !== 0 && changeX <= 10){
								scope.$emit('cardSlot:moveDiagonalUp', {
									slot: slot,
									panel: panel
								});
							} else if(changeX === 0 && !panel_y_overlap){
								scope.$emit('cardSlot:moveVertical', {
									slot: slot,
									panel: panel
								});
							} else {
								scope.$emit('cardSlot:moveHorizontal', {
									slot: slot,
									panel: panel
								});
							}
						} else if(crossingEdge(mouseX, mouseY) === 'bottom'){
							if(changeX !== 0 && changeX <= 10){
								scope.$emit('cardSlot:moveDiagonalDown', {
									slot: slot,
									panel: panel
								});
							} else if(changeX === 0 && !panel_y_overlap){
								scope.$emit('cardSlot:moveVertical', {
									slot: slot,
									panel: panel
								});
							} else {
								scope.$emit('cardSlot:moveHorizontal', {
									slot: slot,
									panel: panel
								});
							}
						} else if(crossingEdge(mouseX, mouseY) === 'left' || crossingEdge(mouseX, mouseY) === 'right'){
							if(vectorY * 2 > vectorX){
								if(moveY < 0){
									scope.$emit('cardSlot:moveDiagonalUp', {
										slot: slot,
										panel: panel
									});
								} else if(moveY > 0){
									scope.$emit('cardSlot:moveDiagonalDown', {
										slot: slot,
										panel: panel
									});
								}
							} else {
								scope.$emit('cardSlot:moveHorizontal', {
									slot: slot,
									panel: panel
								});
							}
						}
					}
				};
				
				// RELEASE
				// Primary "release" function
				var onRelease = function(){
					$document.off(_moveEvents, onMove);
					$document.off(_releaseEvents, onRelease);
					$rootScope.$broadcast('cardPanel:onReleaseCard', {
						panel: _card
					});
					if(_moveX <= windowScale && _moveX >= -windowScale && _moveY <= windowScale && _moveY >= -windowScale){
						$rootScope.$broadcast('cardPanel:toggleOverlap', {
							panel: _card
						});
					}
				};
				
				// General response to "release" event
				var onReleaseCard = function(event, object){
					element.addClass('card-moving');
					setTimeout(function(){
						element.css({
							left: (_card.x_coord * windowScale) + 'px',
							top: (_card.y_coord * windowScale) + 'px'
						});
					}, 0);
					
					clearTimeout(_moveTimer);
					
					_moveTimer = setTimeout(function(){
						element.removeClass('card-moving');
					}, 600);
				};
				
				// Respond to 'onMouseLeave' event similar to onRelease, but without toggling overlap
				var onMouseLeave = function(){
					$document.off(_moveEvents, onMove);
					$document.off(_releaseEvents, onRelease);
					$rootScope.$broadcast('cardPanel:onReleaseCard', {
						panel: _card
					});
				};
				
				var crossingEdge = function(mouseX, mouseY){
					
					var cardOffset = element.offset();
					var panelX = cardOffset.left;
					var panelY = cardOffset.top;
					var leftEdge = _card.x_overlap ? panelX + _x_cover : panelX;
					var rightEdge = panelX + _x_dim;
					var topEdge = panelY;
					var bottomEdge = _card.y_overlap ? panelY + _y_tab : panelY + _y_dim;
					
					if(mouseX >= leftEdge && mouseX <= rightEdge && mouseY >= topEdge && mouseY <= bottomEdge){
						var left = mouseX - leftEdge;
						var right = rightEdge - mouseX;
						var top = mouseY - topEdge;
						var bottom = bottomEdge - mouseY;
						
						var edges = [left, right, top, bottom],
						closestEdge = Math.min.apply(Math.min, edges),
						edgeNames = ['left', 'right', 'top', 'bottom'],
						edgeName = edgeNames[edges.indexOf(closestEdge)];
						
						return edgeName;
					}
				};
				
				initialize();
				
			}
		};
	}]);
'use strict';

var cardsModule = angular.module('core');

// Directive for managing card decks.
cardsModule
	.directive('cardSlot', ['$document', '$parse', '$rootScope', function($document, $parse, $rootScope){
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				var _offset, leftEdge, rightEdge,
				topEdge, bottomEdge, windowScale,
				x_dim, y_dim, x_tab, y_tab,
				x_cover, y_cover;
				
				var _slot = $parse(attrs.card) || null;
				
				var _panel = {};
				
				var initialize = function () {
					toggleListeners(true);
					_offset = element.offset();
				};
				
				Array.min = function( array ){
					return Math.min.apply( Math, array );
				};
				
				var toggleListeners = function (enable) {
					
					// remove listeners
					if (!enable)return;
					
					// add listeners
					scope.$on('$destroy', onDestroy);
					scope.$watch(attrs.card, onCardChange);
					scope.$on('screenSize:onHeightChange', onHeightChange);
					scope.$on('cardPanel:onPressCard', onPressCard);
					scope.$on('cardPanel:onMoveCard', onMoveCard);
					scope.$on('cardPanel:onReleaseCard', onReleaseCard);
				};
				
				var onDestroy = function(enable){
					toggleListeners(false);
				};
				
				var onCardChange = function(newVal, oldVal){
					_slot = newVal;
				};
				
				var onHeightChange = function(event, object){
					windowScale = object.newScale;
					x_dim = windowScale * 10;
					y_dim = windowScale * 14;
					x_tab = windowScale * 2;
					y_tab = windowScale * 2;
					x_cover = windowScale * 8;
					y_cover = windowScale * 12;
				};
				
				var onPressCard = function(event, object){
					_panel = object.panel;
				};
				
				var onMoveCard = function(event, object){
					var moveX = Math.abs(object.moveX);
					var moveY = Math.abs(object.moveY);
					var changeX = Math.abs(_panel.x_coord - _slot.x_coord);
					
					if(_slot.x_coord !== _panel.x_coord || _slot.y_coord !== _panel.y_coord){
						if(crossingEdge(object.mouseX, object.mouseY) === '_top'){
							console.log('crossing top');
							if(changeX !== 0 && changeX <= 10){
								scope.$emit('cardSlot:moveDiagonalUp', {
									slot: _slot,
									panel: _panel
								});
							} else if(changeX === 0 && !_panel.y_overlap){
								scope.$emit('cardSlot:moveVertical', {
									slot: _slot,
									panel: _panel
								});
							} else {
								scope.$emit('cardSlot:moveHorizontal', {
									slot: _slot,
									panel: _panel
								});
							}
						} else if(crossingEdge(object.mouseX, object.mouseY) === '_bottom'){
							console.log('crossing bottom');
							if(changeX !== 0 && changeX <= 10){
								scope.$emit('cardSlot:moveDiagonalDown', {
									slot: _slot,
									panel: _panel
								});
							} else if(changeX === 0 && !_panel.y_overlap){
								scope.$emit('cardSlot:moveVertical', {
									slot: _slot,
									panel: _panel
								});
							} else {
								scope.$emit('cardSlot:moveHorizontal', {
									slot: _slot,
									panel: _panel
								});
							}
						} else if(crossingEdge(object.mouseX, object.mouseY) === '_left' || crossingEdge(object.mouseX, object.mouseY) === '_right'){
							if(moveY * 2 > moveX){
								if(object.moveY < 0){
									scope.$emit('cardSlot:moveDiagonalUp', {
										slot: _slot,
										panel: _panel
									});
								} else if(object.moveY > 0){
									scope.$emit('cardSlot:moveDiagonalDown', {
										slot: _slot,
										panel: _panel
									});
								}
							} else {
								scope.$emit('cardSlot:moveHorizontal', {
									slot: _slot,
									panel: _panel
								});
							}
						}
					}
					scope.$digest();
				};
				
				var onReleaseCard = function(event, object){
					_panel = {};
				};
				
				var crossingEdge = function(mouseX, mouseY){
					_offset = element.offset();
					leftEdge = _slot.x_overlap ? _offset.left + x_cover : _offset.left;
					rightEdge = _offset.left + x_dim;
					topEdge = _offset.top;
					bottomEdge = _slot.y_overlap ? _offset.top + y_tab : _offset.top + y_dim;
					
					if(mouseX >= leftEdge && mouseX <= rightEdge && mouseY >= topEdge && mouseY <= bottomEdge){
						var _left = mouseX - leftEdge;
						var _right = rightEdge - mouseX;
						var _top = mouseY - topEdge;
						var _bottom = bottomEdge - mouseY;
						
						var edges = [_left, _right, _top, _bottom],
						closestEdge = Math.min.apply(Math.min, edges),
						edgeNames = ['_left', '_right', '_top', '_bottom'],
						edgeName = edgeNames[edges.indexOf(closestEdge)];
						
						return edgeName;
						
					} else {
						return false;
					}
				};
				
				initialize();
				
			}
		};
	}]);
'use strict';

angular.module('core')
	.directive('modalDialogWindow', function() {
		return {
			restrict: 'E',
			scope: {
				show: '='
			},
			transclude: true,
			templateUrl: '../modules/core/views/modal-window.html',
			link: function(scope, element, attrs) {
				scope.dialogStyle = {};
				if (attrs.width)
					scope.dialogStyle.width = attrs.width;
				if (attrs.height)
					scope.dialogStyle.height = attrs.height;
				scope.hideModal = function() {
					scope.show = false;
				};
			}
		};
	});
'use strict';

var coreModule = angular.module('core');

// Directive for monitoring screen height
coreModule
	.directive('screenSize', ['$rootScope', '$window', function($rootScope, $window){
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				var _window = angular.element($window);
				
				var windowHeight = 500;
				
				var windowScale = 25;
				
				var initialize = function() {
					toggleListeners(true);
				};
				
				var toggleListeners = function (enable) {
					// remove listeners
					if (!enable)return;
					
					// add listeners
					scope.$on('$destroy', onDestroy);
					_window.on('resize', onHeightChange);
					
					setTimeout( function(){
						onHeightChange();
					}, 0);
				};
				
				var onDestroy = function(enable){
					toggleListeners(false);
				};
				
				var onHeightChange = function(){
					windowHeight = $window.innerHeight;
					if(windowHeight > 500){
						windowScale = 25;
					} else if(windowHeight > 480){
						windowScale = 24;
					} else if(windowHeight > 460){
						windowScale = 23;
					} else if(windowHeight > 440){
						windowScale = 22;
					} else if(windowHeight > 420){
						windowScale = 21;
					} else if(windowHeight > 400){
						windowScale = 20;
					} else if(windowHeight > 380){
						windowScale = 19;
					} else if(windowHeight > 360){
						windowScale = 18;
					} else if(windowHeight > 340){
						windowScale = 17;
					} else if(windowHeight > 320){
						windowScale = 16;
					} else if(windowHeight < 319){
						windowScale = 15;
					}
					
					$rootScope.$broadcast('screenSize:onHeightChange', {
						newHeight: windowHeight,
						newScale: windowScale
					});
					
					scope.$digest();
				};
				
				initialize();
			}
		};
	}]);
'use strict';
var coreModule = angular.module('core');

// Factory-service for managing card-deck, card-slot and card-panel directives.
coreModule.factory('CardDeck', ['Cards', 'HomeDemo', 'Pcs', '$rootScope',
	function(Cards, HomeDemo, Pcs, $rootScope){
		var service = {};
		
		var x_dim = 10;
		var y_dim = 14;
		var x_tab = 2;
		var y_tab = 2;
		var x_cover = 8;
		var y_cover = 12;
		var _moveSpeed = 500;
		var cardMoved = false;
		var cardMoving = false;
		var moveTimer;
		
		var deckList = [];
		
		var getCardList = function(deckType){
			if(deckType === 'pc'){
				return Pcs.pc.cards;
			} else if(deckType === 'card'){
				return Cards.getCardList;
			} else if(deckType === 'home'){
				return HomeDemo.cards;
			}
		};
		
		var getCardIndex = function(deckType, x_coord, y_coord){
			var _deck = getCardList(deckType);
			var _card = {};
			for(var i = 0; i < _deck.length; i++){
				if(_deck[i].x_coord === x_coord && _deck[i].y_coord === y_coord){
					return i;
				}
			}
		};
		
		var getFirstIndex = function(deckType){
			return getCardIndex(deckType, 0, 0);
		};
		
		service.getLastIndex = function(deckType){
			var _deck = getCardList(deckType);
			var _card = {};
			var _last = 0;
			for(var i = 0; i < _deck.length; i++){
				if(_deck[i].x_coord > (_card.x_coord || 0)){
					_last = i;
					_card = _deck[i];
				}
			}
			return _last;
		};
		
		service.getDeckWidth = function(deckType){
			var _deck = getCardList(deckType);
			return _deck[service.getLastIndex(deckType)].x_coord + 10;
		};
		
		var getLastIndex = function(cardType){
			var _deck = getCardList(cardType);
			var _card = {};
			var _last = 0;
			for(var i = 0; i < _deck.length; i++){
				if(_deck[i].x_coord > (_card.x_coord || 0)){
					_last = i;
					_card = _deck[i];
				}
			}
			return _last;
		};
		
		var getLowestIndex = function(cardType, x_coord) {
			var _deck = getCardList(cardType);
			var _card = {};
			var _lowest = 0;
			for(var i = 0; i < _deck.length; i++) {
				if(_deck[i].x_coord === x_coord){
					if(_deck[i].y_coord > (_card.y_coord || -1)){
						_lowest = i;
						_card = _deck[i];
					}
				}
			}
			return _lowest;
		};
		
		var initialize = function(){
			toggleListeners(true);
		};
		
		var toggleListeners = function(enable){
			if(!enable) return;
			$rootScope.$on('$destroy', onDestroy);
			$rootScope.$on('cardPanel:onPressCard', onPressCard);
			$rootScope.$on('cardPanel:onReleaseCard', onReleaseCard);
			$rootScope.$on('cardPanel:toggleOverlap', toggleOverlap);
			
			$rootScope.$on('cardSlot:moveHorizontal', moveHorizontal);
			$rootScope.$on('cardSlot:moveDiagonalUp', moveDiagonalUp);
			$rootScope.$on('cardSlot:moveDiagonalDown', moveDiagonalDown);
			$rootScope.$on('cardSlot:moveVertical', moveVertical);
			
			$rootScope.$on('cardDeck:unstackLeft', unstackLeft);
			$rootScope.$on('cardDeck:unstackRight', unstackRight);
		};
		
		var onDestroy = function(){
			toggleListeners(false);
		};
		
		// Set move booleans
		var setCardMoving = function(interval){
			clearTimeout(moveTimer);
			cardMoving = true;
			cardMoved = true;
			moveTimer = setTimeout(function() {
				cardMoving = false;
			}, interval);
		};
		
		// Reset move variables
		var onPressCard = function(event, object){
			var panel = object.panel;
			var _deckType = panel.deckType;
			var _deck = getCardList(_deckType);
			var panel_index = getCardIndex(_deckType, panel.x_coord, panel.y_coord);
			
			cardMoved = false;
			cardMoving = false;
			
			_deck[panel_index].dragging = true;
			
			$rootScope.$digest();
		};
		
		// Reset move variables
		var onReleaseCard = function(event, object){
			var panel = object.panel;
			var _deckType = panel.deckType;
			var _deck = getCardList(_deckType);
			var panel_index = getCardIndex(_deckType, panel.x_coord, panel.y_coord);
			
			cardMoved = false;
			cardMoving = false;
			
			setTimeout(function() {
				_deck[panel_index].dragging = false;
			}, 0);
			
			$rootScope.$digest();
		};
		
		var moveHorizontal = function(event, object){
			var _slot = object.slot;
			var _panel = object.panel;
			var _deckType = _panel.deckType;
			var _deck = getCardList(_deckType);
			var _lowest_index = getLowestIndex(_deckType, _panel.x_coord);
			if(_panel.y_coord > 0 || (_panel.y_coord === 0 && _panel.stacked && !_panel.y_overlap)){
				unstackCard(_slot, _panel);
			} else if (_panel.y_coord === 0 && _slot.y_coord === 0){
				switchHorizontal(_slot, _panel);
			}
		};

		var moveDiagonalUp = function(event, object){
			var _slot = object.slot;
			var _panel = object.panel;
			var _deckType = _slot.deckType;
			var _deck = getCardList(_deckType);
			var _lowest_index = getLowestIndex(_deckType, _panel.x_coord);
			if((_panel.y_coord === 0 && _panel.y_overlap) || _deck[_lowest_index].y_coord === 0){
				stackUnder(_slot, _panel);
			} else {
				unstackCard(_slot, _panel);
			}
		};

		var moveDiagonalDown = function(event, object){
			var _slot = object.slot;
			var _panel = object.panel;
			var _deckType = _slot.deckType;
			var _deck = getCardList(_deckType);
			var _lowest_index = getLowestIndex(_deckType, _panel.x_coord);
			if(_panel.y_coord === 0 && _panel.y_overlap || _deck[_lowest_index].y_coord === 0){
				stackOver(_slot, _panel);
			} else {
				unstackCard(_slot, _panel);
			}
		};
		
		var moveVertical = function(event, object){
			switchVertical(object.slot, object.panel);
		};
		
		var unstackLeft = function(event, object){
			if(object.panel.y_coord > 0){
				var _panel = object.panel;
				var _deckType = _panel.deckType;
				var _deck = getCardList(_deckType);
				var unstack_coord = _deck[getFirstIndex(_deckType)].x_coord - x_dim;
				unstackCard({x_coord: unstack_coord}, _panel);
			}
		};
		
		var unstackRight = function(event, object){
			if(object.panel.y_coord > 0){
				var _panel = object.panel;
				var _deckType = _panel.deckType;
				var _deck = getCardList(_deckType);
				var unstack_coord = _deck[getLastIndex(_deckType)].x_coord + x_dim;
				unstackCard({x_coord: unstack_coord}, _panel);
			}
		};
		
		// Swap card order along horizontal axis
		var switchHorizontal = function(slot, panel){
			if(!cardMoving){
				var _deckType = panel.deckType;
				var _deck = getCardList(_deckType);
				
				var slot_x = slot.x_coord;
				var slot_y = slot.y_coord;
				var slot_index = getCardIndex(_deckType, slot_x, slot_y);
				var slot_x_overlap = slot.x_overlap;
				var slot_position = slot_x;
				
				var panel_x = panel.x_coord;
				var panel_y = panel.y_coord;
				var panel_index = getCardIndex(_deckType, panel_x, panel_y);
				var panel_x_overlap = panel.x_overlap;
				var panel_width = x_dim;
				
				if(slot_y === 0 && panel_y === 0){
					if(panel_x - slot_x > 0){
					// PANEL MOVING LEFT
						setCardMoving(_moveSpeed);
						
						if(slot_x === 0 && panel_x_overlap){
							slot_position = 0;
							panel_width -= 8;
							_deck[slot_index].x_overlap = true;
							_deck[panel_index].x_overlap = false;
						} else {
							if(panel_x_overlap){
								panel_width -= 8;
								slot_position -= 8;
							}
							if(slot_x_overlap){
								slot_position += 8;
							}
						}
						for(var ia = 0; ia < _deck.length; ia++){
							if(_deck[ia].x_coord >= slot_x && _deck[ia].x_coord < panel_x){
							// Modify position of each card in "SLOT" column and to the left of "PANEL" column
								_deck[ia].x_coord += panel_width;
							} else if(_deck[ia].x_coord === panel_x){
							// Modify position of each card in "PANEL" column
								_deck[ia].x_coord = slot_position;
							}
						}
					} else if(panel_x - slot_x < 0){
					// PANEL MOVING RIGHT
						setCardMoving(_moveSpeed);
						if(panel_x === 0 && slot_x_overlap){
							var first_index = getFirstIndex(_deckType);
					//		_deck[first_index].x_coord = 0;
							_deck[first_index].x_overlap = false;
							_deck[panel_index].x_overlap = true;
							panel_width -= 8;
						} else if(panel_x > 0){
							if(panel_x_overlap){
								panel_width -= 8;
							}
						}
						
						for(var ib = 0; ib < _deck.length; ib++){
							if(_deck[ib].x_coord <= slot_x && _deck[ib].x_coord > panel_x){
							// Modify position of each card in "SLOT" column
								_deck[ib].x_coord -= panel_width;
							} else if(_deck[ib].x_coord === panel_x){
							// Modify position of each card in "PANEL" column
								_deck[ib].x_coord = slot_position;
							}
						}
					}
				}
				$rootScope.$digest();
			}
		};
		
		// Swap card order along vertical axis
		var switchVertical = function(slot, panel){
			if(!cardMoving){
				var _deckType = slot.deckType;
				var _deck = getCardList(_deckType);
				
				var slot_x = slot.x_coord;
				var slot_y = slot.y_coord;
				var slot_index = getCardIndex(_deckType, slot_x, slot_y);
				var slot_y_overlap = slot.y_overlap;
				
				var panel_x = panel.x_coord;
				var panel_y = panel.y_coord;
				var panel_index = getCardIndex(_deckType, panel_x, panel_y);
				var panel_y_overlap = panel.y_overlap;
				
				var lowest_index = getLowestIndex(_deckType, slot_x);
				var lowest_y = _deck[lowest_index].y_coord;
				
				if(panel_y - slot_y > 0){
				// PANEL MOVING UP
					setCardMoving(_moveSpeed);
					
					_deck[slot_index].y_coord = panel_y;
					_deck[slot_index].y_overlap = panel_y_overlap;
					$rootScope.$digest();
					_deck[panel_index].y_coord = slot_y;
					_deck[panel_index].y_overlap = slot_y_overlap;
					
				} else if(panel_y - slot_y < 0){
				// PANEL MOVING DOWN
					setCardMoving(_moveSpeed);
					
					_deck[slot_index].y_coord = panel_y;
					_deck[slot_index].y_overlap = panel_y_overlap;
					$rootScope.$digest();
					_deck[panel_index].y_coord = slot_y;
					_deck[panel_index].y_overlap = slot_y_overlap;
				}
				$rootScope.$digest();
			}
		};
		
		var stackOver = function(slot, panel){
			if(!cardMoving && !slot.x_overlap && !panel.x_overlap){
				var _deckType = slot.deckType;
				var _deck = getCardList(_deckType);
				
				var slot_x = slot.x_coord;
				var slot_y = slot.y_coord;
				var slot_index = getCardIndex(_deckType, slot_x, slot_y);
				var slot_x_overlap = slot.x_overlap;
				var slot_y_overlap = slot.y_overlap;
				var slot_lowest_coord = _deck[getLowestIndex(_deckType, slot_x)].y_coord;
				
				var panel_x = panel.x_coord;
				var panel_y = panel.y_coord;
				var panel_index = getCardIndex(_deckType, panel_x, panel_y);
				var panel_x_overlap = panel.x_overlap;
				var panel_y_overlap = panel.y_overlap;
				var panel_lowest_coord = _deck[getLowestIndex(_deckType, panel_x)].y_coord;
				
				if(!slot_x_overlap && !panel_x_overlap){
					if(panel_x - slot_x > 0){
					// CARD STACKING FROM RIGHT
						setCardMoving(_moveSpeed);
						_deck[slot_index].y_overlap = true;
						_deck[slot_index].stacked = true;
						_deck[panel_index].stacked = true;
						_deck[getLowestIndex(_deckType, panel_x)].y_overlap = slot_y_overlap;
						for(var ia = 0; ia < _deck.length; ia++){
							if(_deck[ia].x_coord === panel_x){
								_deck[ia].y_coord += slot_y + y_tab;
							}
							if(_deck[ia].x_coord === slot_x && _deck[ia].y_coord > slot_y){
								_deck[ia].y_coord += panel_lowest_coord + y_tab;
							}
							if(_deck[ia].x_coord > slot_x){
								_deck[ia].x_coord -= x_dim;
							}
						}
						
					} else if(panel_x - slot_x < 0){
					// CARD STACKING FROM LEFT
						setCardMoving(_moveSpeed);
						_deck[slot_index].y_overlap = true;
						_deck[slot_index].stacked = true;
						_deck[panel_index].stacked = true;
						_deck[getLowestIndex(_deckType, panel_x)].y_overlap = slot_y_overlap;
						for(var ib = 0; ib < _deck.length; ib++){
							if(_deck[ib].x_coord === panel_x){
								_deck[ib].y_coord += slot_y + y_tab;
							}
							if(_deck[ib].x_coord > panel_x){
								_deck[ib].x_coord -= x_dim;
								if(_deck[ib].x_coord === panel_x && _deck[ib].y_coord > slot_y){
									_deck[ib].y_coord += panel_lowest_coord + y_tab;
								}
							}
						}
					}
				}
				$rootScope.$digest();
			}
		};
		
		
		// Stack one card behind another and reposition deck to fill the gap
		var stackUnder = function(slot, panel){
			if(!cardMoving && !slot.x_overlap && !panel.x_overlap){
				var _deckType = slot.deckType;
				var _deck = getCardList(_deckType);
				
				var panel_x = panel.x_coord;
				var panel_y = panel.y_coord;
				var panel_index = getCardIndex(_deckType, panel_x, panel_y);
				var panel_x_overlap = panel.x_overlap;
				var panel_y_overlap = panel.y_overlap;
				var panel_lowest_coord = _deck[getLowestIndex(_deckType, panel_x)].y_coord;
				
				var slot_x = slot.x_coord;
				var slot_y = slot.y_coord;
				var slot_index = getCardIndex(_deckType, slot_x, slot_y);
				var slot_lowest_coord = _deck[getLowestIndex(_deckType, slot_x)].y_coord;
				
				if(panel_x - slot_x > 0){
				//Card is stacking under from left
					setCardMoving(_moveSpeed);
					_deck[panel_index].y_overlap = true;
					_deck[slot_index].stacked = true;
					_deck[panel_index].stacked = true;
					for(var ia = 0; ia < _deck.length; ia++){
						if(_deck[ia].x_coord === slot_x){
							_deck[ia].y_coord += panel_lowest_coord + y_tab;
						}
						if(_deck[ia].x_coord > slot_x){
							_deck[ia].x_coord -= x_dim;
						}
					}
					
				} else if(panel_x - slot_x < 0){
				//Card is stacking under from right
					setCardMoving(_moveSpeed);
					_deck[panel_index].y_overlap = true;
					_deck[slot_index].stacked = true;
					_deck[panel_index].stacked = true;
					for(var ib = 0; ib < _deck.length; ib++){
						if(_deck[ib].x_coord === slot_x){
							_deck[ib].y_coord += panel_lowest_coord + y_tab;
						}
						if(_deck[ib].x_coord > panel_x){
							_deck[ib].x_coord -= x_dim;
						}
					}
				}
				$rootScope.$digest();
			}
		};
		
		// Withdraw card from stack and reposition deck to make room
		var unstackCard = function(slot, panel){
			if(!cardMoving){
				var _deckType = panel.deckType;
				var _deck = getCardList(_deckType);
				
				if(_deck[getLowestIndex(_deckType, panel.x_coord)].y_coord > 0){
					var panel_x = panel.x_coord;
					var panel_y = panel.y_coord;
					var panel_index = getCardIndex(_deckType, panel_x, panel_y);
					var panel_x_overlap = panel.x_overlap;
					var panel_y_overlap = panel.y_overlap;
					var slot_x = slot.x_coord;
					
					var new_slot_index, new_panel_index;
					
					if(panel_x - slot_x > 0){
					// Card is unstacking to the left
						setCardMoving(_moveSpeed);
						if(panel_y_overlap){
						// Unstack multiple cards to the left
							for(var ia = 0; ia < _deck.length; ia++){
								if(_deck[ia].x_coord > panel_x){
									_deck[ia].x_coord += x_dim;
								}
								if(_deck[ia].x_coord === panel_x){
									if(panel_y_overlap){
										if(_deck[ia].y_coord < panel_y){
											_deck[ia].x_coord += x_dim;
										} else if(_deck[ia].y_coord >= panel_y){
											_deck[ia].y_coord -= panel_y;
										}
									}
								}
							}
						} else if(!panel_y_overlap){
						// Unstack single card to the left
							for(var ib = 0; ib < _deck.length; ib++){
								if(_deck[ib].x_coord >= panel_x){
									if(_deck[ib].x_coord === panel_x && _deck[ib].y_coord > panel_y){
										_deck[ib].y_coord -= y_dim;
									}
									if(ib !== panel_index){
										_deck[ib].x_coord += x_dim;
									}
								}
							}
							_deck[panel_index].y_coord = 0;
							_deck[panel_index].stacked = false;
						}
						new_slot_index = getLowestIndex(_deckType, panel_x);
						new_panel_index = getLowestIndex(_deckType, panel_x + 10);
						
						_deck[new_slot_index].y_overlap = false;
						if(_deck[new_slot_index].y_coord === 0){
							_deck[new_slot_index].stacked = false;
						}
						
						_deck[new_panel_index].y_overlap = false;
						if(_deck[new_panel_index].y_coord === 0){
							_deck[new_panel_index].stacked = false;
						}
					} else if(panel_x - slot_x < 0 && !cardMoving){
					//Card is unstacking to the right
						setCardMoving(_moveSpeed);
						if(panel_y_overlap){
						// Unstack multiple cards to the right
							for(var ic = 0; ic < _deck.length; ic++){
								if(_deck[ic].x_coord > panel_x){
									_deck[ic].x_coord += x_dim;
								}
								if(_deck[ic].x_coord === panel_x){
									if(_deck[ic].y_coord >= panel_y){
										_deck[ic].x_coord += x_dim;
										_deck[ic].y_coord -= panel_y;
									}
								}
							}
						} else if(!panel_y_overlap){
						// Unstack single card to the right
							for(var id = 0; id < _deck.length; id++){
								if(_deck[id].x_coord > panel_x){
									_deck[id].x_coord += x_dim;
								}
								if(_deck[id].x_coord === panel_x && _deck[id].y_coord > panel_y){
									_deck[id].y_coord -= y_dim;
								}
							}
							_deck[panel_index].x_coord += x_dim;
							_deck[panel_index].y_coord = 0;
						}
						
						new_slot_index = getLowestIndex(_deckType, panel_x);
						new_panel_index = getLowestIndex(_deckType, slot_x);
						
						_deck[new_slot_index].y_overlap = false;
						if(_deck[new_slot_index].y_coord === 0){
							_deck[new_slot_index].stacked = false;
						}
						
						_deck[new_panel_index].y_overlap = false;
						if(_deck[new_panel_index].y_coord === 0){
							_deck[new_panel_index].stacked = false;
						}
					}
				}
				$rootScope.$digest();
			}
		};
		
		// Function for x_overlap and y_overlap
		var toggleOverlap = function(event, object){
			if(!cardMoved){
				var panel = object.panel;
				var _deckType = panel.deckType;
				var _deck = getCardList(_deckType);
				var panel_x = panel.x_coord;
				var panel_y = panel.y_coord;
				var panel_x_overlap = panel.x_overlap;
				var panel_y_overlap = panel.y_overlap;
				var panel_index = getCardIndex(_deckType, panel_x, panel_y);
				var lowest_index = getLowestIndex(_deckType, panel_x);
				var lowest_y = _deck[lowest_index].y_coord;
				
				if(panel_x > 0 && lowest_y === 0){
				// x_overlap
					if(panel_x_overlap && !cardMoving){
					// Card overlapped
						setCardMoving(_moveSpeed);
						_deck[panel_index].x_overlap = false;
						for(var ia = 0; ia < _deck.length; ia++){
							if(panel_x <= _deck[ia].x_coord){
								_deck[ia].x_coord += x_cover;
							}
						}
					} else if(!panel_x_overlap && !cardMoving){
					// Card not overlapped
						setCardMoving(_moveSpeed);
						_deck[panel_index].x_overlap = true;
						for(var ib = 0; ib < _deck.length; ib++){
							if(panel_x <= _deck[ib].x_coord){
								_deck[ib].x_coord -= x_cover;
							}
						}
					}
				} else if(panel_y !== lowest_y){
				// y_overlap
					if(panel_y_overlap && !cardMoving){
					// Card overlapped
						setCardMoving(_moveSpeed);
						_deck[panel_index].y_overlap = false;
						for(var ic = 0; ic < _deck.length; ic++){
							if(panel_x === _deck[ic].x_coord && panel_y < _deck[ic].y_coord){
								_deck[ic].y_coord += y_cover;
							}
						}
					} else if(!panel_y_overlap && !cardMoving){
					// Card not overlapped
						setCardMoving(_moveSpeed);
						_deck[panel_index].y_overlap = true;
						for(var id = 0; id < _deck.length; id++){
							if(panel_x === _deck[id].x_coord && panel_y < _deck[id].y_coord){
								_deck[id].y_coord -= y_cover;
							}
						}
					}
				}
				$rootScope.$digest();
				cardMoved = false;
			}
		};
		
		var removeCard = function(panel){
			// NOT FUNCTIONAL
			var _deckType = panel.deckType;
			var _deck = getCardList(_deckType);
			var panel_x = _deck[panel].x_coord;
			var panel_y = _deck[panel].y_coord;
			var panel_index = getCardIndex(_deckType, panel_x, panel_y);
			var panel_width = _deck[panel].x_overlap ? x_tab : x_dim;
			var panel_height = _deck[panel].y_overlap ? y_tab : y_dim;
			var lowest_y_coord = _deck[getLowestIndex(_deckType, panel_x)].y_coord;
			
			_deck.splice(panel_index, 1);
			for(var id = 0; id < _deck.length; id++){
				if(lowest_y_coord > 0){
					if(_deck[id].x_coord === panel_x && _deck[id].y_coord > panel_y){
						_deck[id].y_coord -= panel_height;
					}
					_deck[getLowestIndex(_deckType, panel_x)].y_overlap = false;
				} else if(lowest_y_coord === 0){
					if(_deck[id].x_coord > panel_x){
						_deck[id].x_coord -= panel_width;
					}
				}
			}
		};
		
		initialize();
		
		return service;
	}]);
'use strict';

// Factory-service for providing generic game data
angular.module('core').factory('DataSRVC', [
	function($rootScope){
		var service = {};
		
		service.sexArray = [
			'---',
			'Male',
			'Female'
		];
		
		service.diceList = [
			{order: 1, name: 'd__', sides: 0, image: 'modules/core/img/d___.png'},
			{order: 2, name: 'd4', sides: 4, image: 'modules/core/img/d_04.png'},
			{order: 3, name: 'd6', sides: 6, image: 'modules/core/img/d_06.png'},
			{order: 4, name: 'd6', sides: 6, image: 'modules/core/img/d_06.png'},
			{order: 5, name: 'd8', sides: 8, image: 'modules/core/img/d_08.png'},
			{order: 6, name: 'd8', sides: 8, image: 'modules/core/img/d_08.png'},
			{order: 7, name: 'd10', sides: 10, image: 'modules/core/img/d_10.png'},
			{order: 8, name: 'd10', sides: 10, image: 'modules/core/img/d_10.png'},
			{order: 9, name: 'd12', sides: 12, image: 'modules/core/img/d_12.png'}
		];
		
		service.targetTypes = [
			'Utility',
			'Close',
			'Close Area',
			'Distant',
			'Distant Area'
		];
		
		service.closeDetails = [
			'1/1', '1/2', '1/3', '1/4',
			'2/1', '2/2', '2/3', '2/4',
			'3/1', '3/2', '3/3', '3/4',
			'4/1', '4/2', '4/3'
		];
		
		service.closeAreaDetails = [
			'2x2', '3x3', '4x4', '5x5'
		];
		
		service.distantDetails = [
			'4/1', '6/1', '8/1', '10/1',
			'12/1', '14/1', '16/1', '18/1',
			'20/1', '22/1', '24/1'
		];
		
		service.distantAreaDetails = [
			'8/2x2', '10/2x2', '12/2x2', '16/2x2',
			'10/3x3', '12/3x3', '16/3x3', '20/3x3',
			'12/4x4', '16/4x4', '20/4x4'
		];
		
		service.actionKeywords = [
			'Default',
			'Single-use',
			'Thrown',
			'Reflexive',
			'Melee',
			'Ranged',
			'Evocation',
			'Invocation'
		];
		
		service.actionFrequency = [
			'Free',
			'Count: 1',
			'Count: 2',
			'Count: 3',
			'Count: 4',
			'Count: 5',
			'Disruptive',
			'Responsive'
		];
		
		service.dice = [
			'1d4',
			'1d6',
			'1d8',
			'1d10',
			'1d12'
		];
		
		service.abilities = [
			'STR',
			'PHY',
			'FLE',
			'DEX',
			'ACU',
			'INT',
			'WIS',
			'CHA'
		];
		
		service.attackTypes = [
			'Melee',
			'Ranged',
			'Evocation',
			'Invocation'
		];
		
		service.defenseTypes = [
			'Block',
			'Dodge',
			'Alertness',
			'Tenacity'
		];
		
		service.prerequisites = [
			'1d10 STR',
			'1d10 PHY',
			'1d10 FLE',
			'1d10 DEX',
			'1d10 ACU',
			'1d10 INT',
			'1d10 WIS',
			'1d10 CHA'
		];
		
		service.archetypes = [
			'General',
			'Guardian',
			'Hunter',
			'Mastermind',
			'Champion'
		];
		
		service.allegiances = [
			'Unaligned',
			'Nymaria',
			'Vakhelos',
			'Heresy',
			'Inquisition'
		];
		
		service.races = [
			'Weolda',
			'Algharr',
			'Durhok',
			'Feyal',
			'Sylthaun'
		];
		
		service.itemTypes = [
			'Melee',
			'Melee / Ranged',
			'Melee / Invocation',
			'Ranged',
			'Ranged / Melee',
			'Ranged / Evocation',
			'Evocation',
			'Evocation / Invocation',
			'Evocation / Ranged',
			'Invocation',
			'Invocation / Evocation',
			'Invocation / Melee'
		];
		
		service.itemSlots = [
			'One-handed',
			'Two-handed',
			'One-handed or Paired',
			'One-handed or Two-handed',
			'Armor',
			'Shield',
			'Gloves',
			'Boots',
			'Cloak',
			'Amulet',
			'Ring',
			'Belt',
			'Helmet',
			'Consumable',
			'Provision'
		];
		
		return service;
	}]);
'use strict';
var coreModule = angular.module('core');

// Factory-service for managing card-deck, card-slot and card-panel directives.
coreModule.factory('HomeDemo', ['$rootScope',
	function($rootScope){
	
	var service = {};
	
	service.cards = [
		{
			name: 'A Trait Card',
			cardType: 'trait',
			deckType: 'home',
			x_coord: 0,
			y_coord: 0,
			x_overlap: false,
			y_overlap: false,
			dragging: false,
			stacked: false,
			locked: true
		},
		{
			name: 'A Feat Card',
			cardType: 'feat',
			deckType: 'home',
			x_coord: 10,
			y_coord: 0,
			x_overlap: false,
			y_overlap: false,
			dragging: false,
			stacked: false,
			locked: true
		},
		{
			name: 'An Augment Card',
			cardType: 'augment',
			deckType: 'home',
			x_coord: 20,
			y_coord: 0,
			x_overlap: false,
			y_overlap: false,
			dragging: false,
			stacked: false,
			locked: true,
			description: {
				show: true,
				content: 'Truly amazing...'
			}
		},
		{
			name: 'An Item Card',
			cardType: 'item',
			deckType: 'home',
			x_coord: 30,
			y_coord: 0,
			x_overlap: false,
			y_overlap: false,
			dragging: false,
			stacked: false,
			locked: true
		},
		{
			name: 'Another Feat Card',
			cardType: 'feat',
			deckType: 'home',
			x_coord: 40,
			y_coord: 0,
			x_overlap: false,
			y_overlap: false,
			dragging: false,
			stacked: false,
			locked: true
		},
		{
			name: 'Another Item Card',
			cardType: 'item',
			deckType: 'home',
			x_coord: 50,
			y_coord: 0,
			x_overlap: false,
			y_overlap: true,
			dragging: false,
			stacked: true,
			locked: true,
			description: {
				show: true,
				content: 'This is the best one by far!!'
			}
		},
		{
			name: 'Yet Another Feat Card',
			cardType: 'feat',
			deckType: 'home',
			x_coord: 50,
			y_coord: 2,
			x_overlap: false,
			y_overlap: false,
			dragging: false,
			stacked: true,
			locked: true
		}
	];
	
	return service;
	
	}]);
'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

	function() {
		// Define a set of default roles
		this.defaultRoles = ['*'];

		// Define the menus object
		this.menus = {};

		// A private function for rendering decision 
		var shouldRender = function(user) {
			if (user) {
				if (!!~this.roles.indexOf('*')) {
					return true;
				} else {
					for (var userRoleIndex in user.roles) {
						for (var roleIndex in this.roles) {
							if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
								return true;
							}
						}
					}
				}
			} else {
				return this.isPublic;
			}

			return false;
		};

		// Validate menu existance
		this.validateMenuExistance = function(menuId) {
			if (menuId && menuId.length) {
				if (this.menus[menuId]) {
					return true;
				} else {
					throw new Error('Menu does not exists');
				}
			} else {
				throw new Error('MenuId was not provided');
			}

			return false;
		};

		// Get the menu object by menu id
		this.getMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			return this.menus[menuId];
		};

		// Add new menu object by menu id
		this.addMenu = function(menuId, isPublic, roles) {
			// Create the new menu
			this.menus[menuId] = {
				isPublic: isPublic || false,
				roles: roles || this.defaultRoles,
				items: [],
				shouldRender: shouldRender
			};

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			delete this.menus[menuId];
		};

		// Add menu item object
		this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Push new menu item
			this.menus[menuId].items.push({
				title: menuItemTitle,
				link: menuItemURL,
				menuItemType: menuItemType || 'item',
				menuItemClass: menuItemType,
				uiRoute: menuItemUIRoute || ('/' + menuItemURL),
				isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
				roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
				position: position || 0,
				items: [],
				shouldRender: shouldRender
			});

			// Return the menu object
			return this.menus[menuId];
		};

		// Add submenu item object
		this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
					// Push new submenu item
					this.menus[menuId].items[itemIndex].items.push({
						title: menuItemTitle,
						link: menuItemURL,
						uiRoute: menuItemUIRoute || ('/' + menuItemURL),
						isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
						roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
						position: position || 0,
						shouldRender: shouldRender
					});
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenuItem = function(menuId, menuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
					this.menus[menuId].items.splice(itemIndex, 1);
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeSubMenuItem = function(menuId, submenuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
					if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
						this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
					}
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		//Adding the topbar menu
		this.addMenu('topbar');
	}
]);
'use strict';

// Configuring the NPC module
angular.module('npcs').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Non-player Characters', 'npcs', '/npcs');
	}
]);
'use strict';

//Setting up route
angular.module('npcs').config(['$stateProvider',
	function($stateProvider) {
		// Npcs state routing
		$stateProvider.
		state('listNpcs', {
			url: '/npcs',
			templateUrl: 'modules/npcs/views/list-npcs.client.view.html'
		});
	}
]);
'use strict';

// Npcs controller
angular.module('npcs').controller('NpcsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Npcs',
	function($scope, $stateParams, $location, Authentication, Npcs ) {
		$scope.authentication = Authentication;

		// Create new Npc
		$scope.create = function() {
			// Create new Npc object
			var npc = new Npcs ({
				name: this.name
			});

			// Redirect after save
			npc.$save(function(response) {
				$location.path('npcs/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Npc
		$scope.remove = function( npc ) {
			if ( npc ) { npc.$remove();

				for (var i in $scope.npcs ) {
					if ($scope.npcs [i] === npc ) {
						$scope.npcs.splice(i, 1);
					}
				}
			} else {
				$scope.npc.$remove(function() {
					
				});
			}
		};

		// Update existing Npc
		$scope.update = function() {
			var npc = $scope.npc ;

			npc.$update(function() {
				
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Npcs
		$scope.find = function() {
			$scope.npcs = Npcs.query(
				function(response) {
					console.log(response);
				}
			);
		};

		// Find existing Npc
		$scope.findOne = function() {
			$scope.npc = Npcs.get({ 
				npcId: $stateParams.npcId
			});
		};
	}
]);
'use strict';

//Npcs service used to communicate Npcs REST endpoints
angular.module('npcs').factory('Npcs', ['$resource',
	function($resource) {
		return $resource('npcs/:npcId', {
			npcId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Configuring the PC module
angular.module('pcs').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Player Characters', 'pcs', '/pcs');
	}
]);
'use strict';

//Setting up route
angular.module('pcs').config(['$stateProvider',
	function($stateProvider) {
		// Pcs state routing
		$stateProvider.
		state('listPcs', {
			url: '/pcs',
			templateUrl: 'modules/pcs/views/list-pcs.client.view.html'
		}).
		state('editPc', {
			url: '/pcs/:pcId/edit',
			templateUrl: 'modules/pcs/views/edit-pc.client.view.html'
		});
	}
]);
'use strict';

var pcsModule = angular.module('pcs');

// Pcs Controller
pcsModule.controller('PcsCtrl', ['$scope', '$location', '$log', 'DataSRVC', 'CardDeck', 'Pcs', 'PcsCard1', 'PcsCard2', 'PcsCard3', 'PcsTraits', 'PcsFeats', 'PcsAugments', 'PcsItems',
	function($scope, $location, $log, DataSRVC, CardDeck, Pcs, PcsCard1, PcsCard2, PcsCard3, PcsTraits, PcsFeats, PcsAugments, PcsItems){
		
		$scope.dataSRVC = DataSRVC;
		
		$scope.cardDeck = CardDeck;
		
		$scope.pcs = Pcs;
		
		$scope.pcsCard1 = PcsCard1;
		
		$scope.pcsCard2 = PcsCard2;
		
		$scope.pcsCard3 = PcsCard3;
		
		$scope.pcsTraits = PcsTraits;
		
		$scope.pcsFeats = PcsFeats;
		
		$scope.pcsAugments = PcsAugments;
		
		$scope.pcsItems = PcsItems;
		
		$scope.windowHeight = 500;
		
		$scope.windowScale = 50;
		
		$scope.status = {
			dropdownOpen: false
		};
		
		$scope.toggleOverlay = function(open){
			$scope.status.dropdownOpen = open;
		};
		
	//	$scope.toggleDropdown = function($event) {
	//		$event.preventDefault();
	//		$event.stopPropagation();
	//		$scope.status.dropdownOpen = !$scope.status.dropdownOpen;
	//		$log.log('toggleDropdown');
	//	};
		
		$scope.newPc = function(){
			Pcs.addPc();
			Pcs.pcNew = true;
			Pcs.pcSaved = false;
		};
		
		$scope.openPc = function(pc){
			$location.path('pcs/'+pc._id+'/edit');
			Pcs.pcNew = false;
			Pcs.pcSaved = false;
		};
		
		$scope.savePc = function(){
			Pcs.editPc();
			Pcs.pcNew = false;
			Pcs.pcSaved = true;
		};
		
		$scope.exitPc = function(){
			if(Pcs.pcNew){
				Pcs.deletePc();
			}
			$location.path('pcs');
		};
		
		var initialize = function(){
			toggleListeners(true);
		};
		
		var toggleListeners = function(enable){
			if(!enable) return;
			$scope.$on('$destroy', onDestroy);
			$scope.$on('screenSize:onHeightChange', onHeightChange);
			$scope.$on('pcsCard1:updateStrPhy', updateStrPhy);
			$scope.$on('pcsCard1:updateFleDex', updateFleDex);
			$scope.$on('pcsCard1:updateAcuInt', updateAcuInt);
			$scope.$on('pcsCard1:updateWisCha', updateWisCha);
			$scope.$watch('pcsCard2.EXP', watchEXP);
			$scope.$watch('pcs.pc.experience', watchExperience);
			$scope.$watch('pcs.pc.level', watchLevel);
		};
		
		var onDestroy = function(){
			toggleListeners(false);
		};
		
		var onHeightChange = function(event, object){
			$scope.windowHeight = object.newHeight;
			$scope.windowScale = object.newScale;
		};
		
		var updateStrPhy = function(event, object){
			PcsCard1.factorBlock(object._str, object._phy);
			PcsCard2.factorHealth();
			PcsCard2.factorStamina();
			PcsCard2.factorCarryingCapacity();
		};
		
		var updateFleDex = function(event, object){
			PcsCard1.factorDodge(object._fle, object._dex);
		};
		
		var updateAcuInt = function(event, object){
			PcsCard1.factorAlertness(object._acu, object._int);
		};
		
		var updateWisCha = function(event, object){
			PcsCard1.factorTenacity(object._wis, object._cha);
		};
		
		//Watch for change in EXP input
		var watchEXP = function(newValue, oldValue){
			if(Pcs.pc && newValue !== oldValue){
				PcsCard2.EXP = parseInt(newValue);
				Pcs.pc.experience = parseInt(newValue);
			}
		};
		
		//Watch for change in experience
		var watchExperience = function(newValue, oldValue){
			if(Pcs.pc && newValue !== oldValue){
				PcsCard2.factorExperience();
				if(newValue !== PcsCard2.EXP){
					PcsCard2.EXP = newValue;
				}
			}
		};
		
		//Watch for changes in level
		var watchLevel = function(newValue, oldValue){
			if(Pcs.pc.abilities){
				PcsCard2.factorHealth();
				PcsCard2.factorStamina();
				PcsTraits.factorTraitLimit();
				PcsFeats.factorFeatLimit();
				PcsAugments.factorAugmentLimit();
			}
		};
		
		initialize();
		
}]);

'use strict';

var pcsModule = angular.module('pcs');

// Directive for managing card decks.
pcsModule
	.directive('diceBox', function() {
		return {
			restrict: 'A',
			templateUrl: '../modules/pcs/views/dice-box.html'
		};
	});
'use strict';
var cardsModule = angular.module('pcs');

// Factory-service for managing PC card deck.
cardsModule.factory('PcsAugments', ['Pcs', 'CardDeck', 
	function(Pcs, CardDeck){
		var service = {};
		
		// Factor Augment Limit
		service.factorAugmentLimit = function(){
			Pcs.pc.augmentLimit = Math.round((Pcs.pc.level || 0) / 4);
			this.validateAugments();
		};
		
		service.validateAugments = function(){
			for(var ia = 0; ia < Pcs.pc.augmentLimit; ia++){
				if(!this.augmentAtLevel(ia * 4 + 2)){
					this.addAugment(ia * 4 + 2);
				}
			}
			for(var ic = 0; ic < Pcs.pc.cards.length; ic++){
				if(Pcs.pc.cards[ic].level > Pcs.pc.level){
					CardDeck.removeCard(ic);
				}
			}
		};
		
		service.augmentAtLevel = function(level){
			var augmentAtLevel = false;
			for(var ib = 0; ib < Pcs.pc.cards.length; ib++){
				if(Pcs.pc.cards[ib].cardType === 'augment'){
					if(Pcs.pc.cards[ib].level === level){
						augmentAtLevel = true;
					}
				}
			}
			return augmentAtLevel;
		};
		
		service.addAugment = function(level){
			var newAugment = {
				name: 'Level '+level+' Augment',
				cardType: 'augment',
				x_coord: Pcs.pc.cards[Pcs.lastCard()].x_coord + 10,
				y_coord: 0,
				x_overlap: false,
				y_overlap: false,
				dragging: false,
				stacked: false,
				locked: true,
				level: level
			};
			Pcs.pc.cards.push(newAugment);
		};
		
		return service;
	}]);
'use strict';

var pcsModule = angular.module('pcs');

// Factory-service for managing pc1 data.
pcsModule.factory('PcsCard1', ['$rootScope', 'Pcs',
	function($rootScope, Pcs){
		var service = {};
		
		service.chosenDie = {};
		service.previousDie = {};
		service.chosenAbility = {};
		
		service.chooseAbility = function(ability){
			this.chosenAbility = Pcs.pc.abilities[ability];
		};
		
		service.chooseDie = function(dice){
			this.chosenDie = Pcs.pc.dicepool[dice];
			
			this.previousDie = this.chosenAbility.dice;
			
			Pcs.pc.dicepool[dice] = Pcs.pc.dicepool[0];
			
			if(this.previousDie.order > 0){
				Pcs.pc.dicepool[this.previousDie.order] = this.previousDie;
			}
			
			Pcs.pc.abilities[this.chosenAbility.order].dice = this.chosenDie;
			
			switch(this.chosenAbility.order){
				case 0:
				case 1:
					$rootScope.$broadcast('pcsCard1:updateStrPhy', {
						_str: Pcs.pc.abilities[0],
						_phy: Pcs.pc.abilities[1]
					});
					break;
				case 2:
				case 3:
					$rootScope.$broadcast('pcsCard1:updateFleDex', {
						_fle: Pcs.pc.abilities[2],
						_dex: Pcs.pc.abilities[3]
					});
					break;
				case 4:
				case 5:
					$rootScope.$broadcast('pcsCard1:updateAcuInt', {
						_acu: Pcs.pc.abilities[4],
						_int: Pcs.pc.abilities[5]
					});
					break;
				case 6:
				case 7:
					$rootScope.$broadcast('pcsCard1:updateWisCha', {
						_wis: Pcs.pc.abilities[6],
						_cha: Pcs.pc.abilities[7]
					});
					break;
			}
		};
		
		service.factorBlock = function(_str, _phy){
			if (Number(_str.dice.sides) > Number(_phy.dice.sides)){
				Pcs.pc.block = '2' + _str.dice.name;
			} else {
				Pcs.pc.block = '2' + _phy.dice.name;
			}
		};
		
		service.factorDodge = function(_fle, _dex){
			if (Number(_fle.dice.sides) > Number(_dex.dice.sides)){
				Pcs.pc.dodge = '2' + _fle.dice.name;
			} else {
				Pcs.pc.dodge = '2' + _dex.dice.name;
			}
		};
		
		service.factorAlertness = function(_acu, _int){
			if (Number(_acu.dice.sides) > Number(_int.dice.sides)){
				Pcs.pc.alertness = '2' + _acu.dice.name;
			} else {
				Pcs.pc.alertness = '2' + _int.dice.name;
			}
		};
		
		service.factorTenacity = function(_wis, _cha){
			if (Number(_wis.dice.sides) > Number(_cha.dice.sides)){
				Pcs.pc.tenacity = '2' + _wis.dice.name;
			} else {
				Pcs.pc.tenacity = '2' + _cha.dice.name;
			}
		};
		
		return service;
	}]);
'use strict';

var pcsModule = angular.module('pcs');

// Factory-service for managing pc2 data.
pcsModule.factory('PcsCard2', ['$rootScope', 'Pcs',
	function($rootScope, Pcs){
		var service = {};
		
		service.EXP = 0;
		
		if(Pcs.pc){
			service.EXP = Pcs.pc.experience;
		}
		
		service.factorExperience = function(){
			var mLevel = 0;
			var mExperience = Number(Pcs.pc.experience);
			for (var increment = 8; increment <= mExperience; increment++){
				mLevel++;
				mExperience = mExperience - increment;
			}
			Pcs.pc.level = mLevel;
		};
		
		service.factorHealth = function(){
			Pcs.pc.healthLimit = 
				Math.round(
					(Number(Pcs.pc.abilities[0].dice.sides) +
						Number(Pcs.pc.abilities[1].dice.sides)
					) * ((Pcs.pc.level || 0)/16 + 1));
			Pcs.pc.healthCurrent =
				Number(Pcs.pc.healthLimit - Pcs.pc.injury);
		};
		
		service.factorStamina = function(){
			Pcs.pc.staminaLimit = 
				Math.round(
					(Number(Pcs.pc.abilities[0].dice.sides) +
						Number(Pcs.pc.abilities[1].dice.sides)
					) * ((Pcs.pc.level || 0)/16 + 1));
			Pcs.pc.staminaCurrent =
				Number(Pcs.pc.healthLimit - Pcs.pc.injury);
		};
		
		service.factorCarryingCapacity = function(){
			Pcs.pc.carryCurrent = 0;
			Pcs.pc.carryLimit =
				Number(Pcs.pc.abilities[0].dice.sides) +
				Number(Pcs.pc.abilities[1].dice.sides);
		};
		
		return service;
	}]);
'use strict';

var pcsModule = angular.module('pcs');

// Factory-service for managing pc3 data.
pcsModule.factory('PcsCard3', ['$rootScope', 'Pcs',
	function($rootScope, Pcs){
		var service = {};
		
		return service;
	}]);
'use strict';
var cardsModule = angular.module('pcs');

// Factory-service for managing PC card deck.
cardsModule.factory('PcsFeats', ['Pcs', 'CardDeck', 
	function(Pcs, CardDeck){
		var service = {};
		
		// Factor Feat Limit
		service.factorFeatLimit = function(){
			Pcs.pc.featLimit = Math.ceil((Pcs.pc.level) / 4) || 0;
			Pcs.pc.featDeck = Pcs.pc.level;
			this.validateFeats();
		};
		
		service.validateFeats = function(){
			for(var ia = 0; ia < Pcs.pc.featDeck; ia++){
				if(!this.featAtLevel(ia + 1)){
					this.addFeat(ia + 1);
				}
			}
			for(var ic = 0; ic < Pcs.pc.cards.length; ic++){
				if(Pcs.pc.cards[ic].level > Pcs.pc.level){
					CardDeck.removeCard(ic);
				}
			}
		};
		
		service.featAtLevel = function(level){
			var featAtLevel = false;
			for(var ib = 0; ib < Pcs.pc.cards.length; ib++){
				if(Pcs.pc.cards[ib].cardType === 'feat'){
					if(Pcs.pc.cards[ib].level === level){
						featAtLevel = true;
					}
				}
			}
			return featAtLevel;
		};
		
		service.addFeat = function(level){
			var newFeat = {
				name: 'Level '+level+' Feat',
				cardType: 'feat',
				x_coord: Pcs.pc.cards[Pcs.lastCard()].x_coord + 10,
				y_coord: 0,
				x_overlap: false,
				y_overlap: false,
				dragging: false,
				stacked: false,
				locked: true,
				level: level
			};
			Pcs.pc.cards.push(newFeat);
		};
		
		return service;
	}]);
'use strict';
var cardsModule = angular.module('pcs');

// Factory-service for managing PC card deck.
cardsModule.factory('PcsItems', ['Pcs',
	function(Pcs){
		var service = {};
		
		
		
		return service;
	}]);
'use strict';
var cardsModule = angular.module('pcs');

// Factory-service for managing PC card deck.
cardsModule.factory('PcsTraits', ['Pcs', 'CardDeck', 
	function(Pcs, CardDeck){
		var service = {};
		
		// Factor Trait Limit
		service.factorTraitLimit = function(){
			Pcs.pc.traitLimit = Math.floor((Pcs.pc.level || 0) / 4 + 1);
			this.validateTraits();
		};
		
		service.validateTraits = function(){
			for(var ia = 0; ia < Pcs.pc.traitLimit; ia++){
				if(!this.traitAtLevel(ia * 4)){
					this.addTrait(ia * 4);
				}
			}
			for(var ic = 0; ic < Pcs.pc.cards.length; ic++){
				if(Pcs.pc.cards[ic].level > Pcs.pc.level){
					CardDeck.removeCard(ic);
				}
			}
		};
		
		service.traitAtLevel = function(level){
			var traitAtLevel = false;
			for(var ib = 0; ib < Pcs.pc.cards.length; ib++){
				if(Pcs.pc.cards[ib].cardType === 'trait'){
					if(Pcs.pc.cards[ib].level === level){
						traitAtLevel = true;
					}
				}
			}
			return traitAtLevel;
		};
		
		service.addTrait = function(level){
			var newTrait = {
				name: 'Level '+level+' Trait',
				cardType: 'trait',
				x_coord: Pcs.pc.cards[Pcs.lastCard()].x_coord + 10,
				y_coord: 0,
				x_overlap: false,
				y_overlap: false,
				dragging: false,
				stacked: false,
				locked: true,
				level: level
			};
			Pcs.pc.cards.push(newTrait);
		};
		
		return service;
	}]);
'use strict';

var pcsModule = angular.module('pcs');

// Factory-service for Browsing, Reading, Editting, Adding, and Deleting PCs.
pcsModule.factory('Pcs', ['$stateParams', '$location', 'Authentication', '$resource', 
	function($stateParams, $location, Authentication, $resource){
		
		var Pcs = $resource(
			'pcs/:pcId',
			{ pcId: '@_id' },
			{ update: { method: 'PUT' } }
		);
		
		var service = {};
		
		service.pc = {};
		
		service.lastCard = function(){
			var _last = 0;
			var _card = {};
			for(var i = 0; i < this.pc.cards.length; i++){
				if(this.pc.cards[i].x_index > (_card.x_index || 0)){
					_last = i;
					_card = this.pc.cards[i];
				}
			}
			return _last;
		};
		
		service.deckWidth = function(){
			if(this.pc.cards){
				return this.pc.cards[this.lastCard()].x_coord + 10;
			} else {
				return 40;
			}
		};
		
		service.pcList = [];
		
		service.pcNew = false;
		
		service.pcSaved = false;
		
		// BROWSE Pcs
		service.browsePcs = function() {
			this.pcList = Pcs.query(
				function(response) {
					
				}
			);
		};
		
		// READ single Pc
		service.readPc = function() {
			this.pc = Pcs.get({
				pcId: $stateParams.pcId
			});
		};
		
		// EDIT existing Pc
		service.editPc = function() {
			var pc = this.pc;
			
			pc.$update(function() {
				
			}, function(errorResponse) {
				this.error = errorResponse.data.message;
			});
		};
		
		// ADD a new Pc
		service.addPc = function() {
			// Create new Pc object
			this.pc = new Pcs ({
				abilities: [
					{ name: 'Strength', order: 0, dice: { name: 'd__', image: 'modules/core/img/d___.png', sides: '0', order: 0 } },
					{ name: 'Physique', order: 1, dice: { name: 'd__', image: 'modules/core/img/d___.png', sides: '0', order: 0 } },
					{ name: 'Flexibility', order: 2, dice: { name: 'd__', image: 'modules/core/img/d___.png', sides: '0', order: 0 } },
					{ name: 'Dexterity', order: 3, dice: { name: 'd__', image: 'modules/core/img/d___.png', sides: '0', order: 0 } },
					{ name: 'Acuity', order: 4, dice: { name: 'd__', image: 'modules/core/img/d___.png', sides: '0', order: 0 } },
					{ name: 'Intelligence', order: 5, dice: { name: 'd__', image: 'modules/core/img/d___.png', sides: '0', order: 0 } },
					{ name: 'Wisdom', order: 6, dice: { name: 'd__', image: 'modules/core/img/d___.png', sides: '0', order: 0 } },
					{ name: 'Charisma', order: 7, dice: { name: 'd__', image: 'modules/core/img/d___.png', sides: '0', order: 0 } }
				],
				dicepool: [
					{ name: 'd__', image: 'modules/core/img/d___.png', sides: '0', order: 0 },
					{ name: 'd4', image: 'modules/core/img/d_04.png', sides: '4', order: 1 },
					{ name: 'd6', image: 'modules/core/img/d_06.png', sides: '6', order: 2 },
					{ name: 'd6', image: 'modules/core/img/d_06.png', sides: '6', order: 3 },
					{ name: 'd8', image: 'modules/core/img/d_08.png', sides: '8', order: 4 },
					{ name: 'd8', image: 'modules/core/img/d_08.png', sides: '8', order: 5 },
					{ name: 'd10', image: 'modules/core/img/d_10.png', sides: '10', order: 6 },
					{ name: 'd10', image: 'modules/core/img/d_10.png', sides: '10', order: 7 },
					{ name: 'd12', image: 'modules/core/img/d_12.png', sides: '12', order: 8 }
				],
				cards: [
					{
						cardType: 'pc1',
						deckType: 'pc',
						x_coord: 0,
						y_coord: 0,
						x_overlap: false,
						y_overlap: false,
						dragging: false,
						stacked: false,
						locked: true
					},
					{
						cardType: 'pc2',
						deckType: 'pc',
						x_coord: 10,
						y_coord: 0,
						x_overlap: false,
						y_overlap: false,
						dragging: false,
						stacked: false,
						locked: true
					},
					{
						cardType: 'pc3',
						deckType: 'pc',
						x_coord: 20,
						y_coord: 0,
						x_overlap: false,
						y_overlap: false,
						dragging: false,
						stacked: false,
						locked: true,
					},
					{
						name: 'Level 0 Trait',
						cardType: 'trait',
						deckType: 'pc',
						x_coord: 30,
						y_coord: 0,
						x_overlap: false,
						y_overlap: false,
						dragging: false,
						stacked: false,
						locked: true,
						level: 0
					}
				]
			});
			
			this.pc.$save(function(response) {
				$location.path('pcs/'+response._id+'/edit');
			}, function(errorResponse) {
				this.error = errorResponse.data.message;
			});
		};
		
		// DELETE existing Pc
		service.deletePc = function(pc) {
			if ( pc ) { pc.$remove();
				for (var i in this.pcs ) {
					if (this.pcs [i] === pc ) {
						this.pcs.splice(i, 1);
					}
				}
			} else {
				this.pc.$remove(function() {
					$location.path('pcs');
				});
			}
			this.browsePcs();
		};
		
		return service;
	}]);
'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour 
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);
'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('profile', {
			url: '/settings/profile',
			templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
		}).
		state('password', {
			url: '/settings/password',
			templateUrl: 'modules/users/views/settings/change-password.client.view.html'
		}).
		state('accounts', {
			url: '/settings/accounts',
			templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
		}).
		state('signup', {
			url: '/signup',
			templateUrl: 'modules/users/views/authentication/signup.client.view.html'
		}).
		state('signin', {
			url: '/signin',
			templateUrl: 'modules/users/views/authentication/signin.client.view.html'
		}).
		state('forgot', {
			url: '/password/forgot',
			templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
		}).
		state('reset-invlaid', {
			url: '/password/reset/invalid',
			templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
		}).
		state('reset-success', {
			url: '/password/reset/success',
			templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
		}).
		state('reset', {
			url: '/password/reset/:token',
			templateUrl: 'modules/users/views/password/reset-password.client.view.html'
		});
	}
]);
'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, $stateParams, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		// Submit forgotten password account id
		$scope.askForPasswordReset = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/forgot', $scope.credentials).success(function(response) {
				// Show user success message and clear form
				$scope.credentials = null;
				$scope.success = response.message;

			}).error(function(response) {
				// Show user error message and clear form
				$scope.credentials = null;
				$scope.error = response.message;
			});
		};

		// Change user password
		$scope.resetUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$location.path('/password/reset/success');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid){
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);
	
				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);

'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [

	function() {
		var _this = this;

		_this._data = {
			user: window.user
		};

		return _this._data;
	}
]);
'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
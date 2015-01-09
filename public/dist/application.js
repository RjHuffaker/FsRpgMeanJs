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

// Cards controller
angular.module('cards').controller('CardsCtrl', ['$scope', '$location', '$log', 'DataSRVC', 'Cards', 'CardsDeck',
	function($scope, $location, $log, DataSRVC, Cards, CardsDeck) {
		
		$scope.dataSRVC = DataSRVC;
		
		$scope.cards = Cards;
		
		$scope.cardsDeck = CardsDeck;
		
		var moveHorizontal = function(event, object){
			console.log('moveHorizontal');
		};

		var moveDiagonalUp = function(event, object){
			console.log('moveDiagonalUp');
		};

		var moveDiagonalDown = function(event, object){
			console.log('moveDiagonalDown');
		};
		
		var moveVertical = function(event, object){
			console.log('moveVertical');
		};
		
		var unstackLeft = function(event, object){
			console.log('unstackLeft');
		};
		
		var unstackRight = function(event, object){
			console.log('unstackRight');
		};
		
		var toggleOverlap = function(event, object){
			console.log('toggleOverlap');
		};
		
		var onReleaseCard = function(){
			console.log('onReleaseCard');
		};
		
		$scope.$on('cardSlot:moveHorizontal', moveHorizontal);
		$scope.$on('cardSlot:moveDiagonalUp', moveDiagonalUp);
		$scope.$on('cardSlot:moveDiagonalDown', moveDiagonalDown);
		$scope.$on('cardSlot:moveVertical', moveVertical);
		
		$scope.$on('cardDeck:unstackLeft', unstackLeft);
		$scope.$on('cardDeck:unstackRight', unstackRight);
		$scope.$on('cardPanel:toggleOverlap', toggleOverlap);
		$scope.$on('cardPanel:onReleaseCard', onReleaseCard);
		
	}
]);
'use strict';

var cardsModule = angular.module('cards');

// Directive for managing card decks.
cardsModule
	.directive('cardDeck', ['$document', '$parse', '$rootScope', function($document, $parse, $rootScope){
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				
				var pressed = false;
				
				var initialize = function() {
					toggleListeners(true);
				};
				
				var toggleListeners = function (enable) {
					// remove listeners
					if (!enable)return;
					
					// add listeners
					scope.$on('$destroy', onDestroy);
					element.on('mouseleave', onMouseLeave);
					scope.$on('cardPanel:onPressCard', onPress);
					scope.$on('cardPanel:onPressStack', onPress);
					scope.$on('cardPanel:onReleaseCard', onRelease);
					scope.$on('cardPanel:onMoveCard', onMoveCard);
					scope.$on('cardPanel:onMoveStack', onMoveCard);
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
					var _offset = element.offset();
					var _width = element[0].offsetWidth;
					var leftEdge = _offset.left;
					var rightEdge = leftEdge + _width - 25;
					
					if(object.mouseX <= leftEdge){
						scope.$emit('cardDeck:unstackLeft', {
							panel: object.panel
						});
					} else if(object.mouseX >= rightEdge){
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
							console.log('Measure: '+element[0].offsetHeight+' / ' + fontSize);
							while( element[0].offsetHeight > element.parent()[0].offsetHeight && fontSize >= 8 ){
								fontSize--;
								element.css('font-size', fontSize + 'px' );
								console.log('Reducing: '+element[0].offsetHeight+' / ' + parseInt(element.css('font-size')));
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

// Directive for managing card decks.
cardsModule
	.directive('cardPanel', ['$document', '$parse', '$rootScope', '$window', function($document, $parse, $rootScope, $window){
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				
				element.css({
					cursor: 'move'
				});
				
				var _startX, _startY, 
					_mouseX, _mouseY,
					_moveX, _moveY,
					_panelX, _panelY,
					_startCol, _mouseCol, _panelCol,
					_startRow, _mouseRow, _panelRow,
					windowScale;
				
				var _stacked = false;
				
				var _panel = $parse(attrs.card) || null;
				
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
					scope.$on('cardPanel:onMoveCard', onMoveCard);
					scope.$on('cardPanel:onReleaseCard', onReleaseCard);
					scope.$on('cardDeck:onMouseLeave', onMouseLeave);
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
					_panel = newVal;
				};
				
				var onHeightChange = function(event, object){
					windowScale = object.newScale;
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
					
					_startCol = _panel.x_coord * windowScale;
					_startRow = _panel.y_coord * windowScale;
					
					$document.on(_moveEvents, onMove);
					$document.on(_releaseEvents, onRelease);
					
					$rootScope.$broadcast('cardPanel:onPressCard', {
						startX: _startX,
						startY: _startY,
						panel: _panel
					});
				};
				
				// MOVE
				// Primary "move" function
				var onMove = function(event){
					event.preventDefault();
					
					_mouseX = (event.pageX || event.touches[0].pageX);
					_mouseY = (event.pageY || event.touches[0].pageY);
					
					_mouseCol = _panel.x_coord * windowScale;
					_mouseRow = _panel.y_coord * windowScale;
					
					_panelCol = _mouseCol - _startCol;
					_panelRow = _mouseRow - _startRow;
					
					_moveX = _mouseX - _startX;
					_moveY = _mouseY - _startY;
					
					_panelX = _moveX - _panelCol;
					_panelY = _moveY - _panelRow;
					
					element.css({
						position: 'relative',
						left: _panelX + 'px',
						top: _panelY + 'px'
					});
					
					$rootScope.$broadcast('cardPanel:onMoveCard', {
						mouseX: _mouseX,
						mouseY: _mouseY,
						moveX: _moveX,
						moveY: _moveY,
						panelX: _panelX,
						panelY: _panelY,
						panel: _panel
					});
				};
				
				// Callback function to move a single card or each card in a vertical stack
				var onMoveCard = function(event, object){
					if(_panel.stacked && _panel.x_index === object.panel.x_index){
						if(_panel.y_index > object.panel.y_index){
							element.css({
								left: object.panelX + 'px',
								top: object.panelY + 'px'
							});
						}
					}
				};
				
				// RELEASE
				// Primary "release" function
				var onRelease = function(){
					$document.off(_moveEvents, onMove);
					$document.off(_releaseEvents, onRelease);
					if(_moveX <= 15 && _moveX >= -15 && _moveY <= 15 && _moveY >= -15){
						$rootScope.$broadcast('cardPanel:toggleOverlap', {
							panel: _panel
						});
					}
					$rootScope.$broadcast('cardPanel:onReleaseCard', {
						panel: _panel
					});
					_stacked = false;
				};
				
				// Respond to 'onMouseLeave' event similar to onRelease, but without toggling overlap
				var onMouseLeave = function(){
					$document.off(_moveEvents, onMove);
					$document.off(_releaseEvents, onRelease);
					$rootScope.$broadcast('cardPanel:onReleaseCard', {
						panel: _panel
					});
				};
				
				// Return cards to their normal state
				var onReleaseCard = function(){
					element.removeClass('dragging');
					element.parent().removeClass('dragging');
					element.css({
						position: 'absolute',
						left: '0px',
						top: '0px'
					});
					_stacked = false;
				};
				
				initialize();
				
			}
		};
	}]);
'use strict';

var cardsModule = angular.module('cards');

// Directive for managing card decks.
cardsModule
	.directive('cardSlot', ['$document', '$parse', '$rootScope', function($document, $parse, $rootScope){
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				var _offset, leftEdge, rightEdge,
				topEdge, bottomEdge, windowScale,
				x_dim, y_dim, x_tab, y_tab;
				
				var _slot = $parse(attrs.card) || null;
				
				var _panel = {};
				
				var x_index = -1, y_index = -1;
				
				var initialize = function () {
					toggleListeners(true);
					_offset = element.offset();
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
				};
				
				var onPressCard = function(event, object){
					_panel = object.panel;
				};
				
				var onMoveCard = function(event, object){
					if(isTouching(object.mouseX, object.mouseY)){
						var moveX = Math.abs(object.moveX);
						var moveY = Math.abs(object.moveY);
						if(_slot.x_index !== _panel.x_index){
							if(moveY * 2 > moveX){
								if(object.moveY < 0 && !_slot.x_overlap){
								// Moving up
									scope.$emit('cardSlot:moveDiagonalUp', {
										slot: _slot,
										panel: _panel
									});
								} else if(object.moveY > 0 && !_slot.x_overlap){
								// Moving down
									scope.$emit('cardSlot:moveDiagonalDown', {
										slot: _slot,
										panel: _panel
									});
								}
							} else if(moveY < moveX){
								
								scope.$emit('cardSlot:moveHorizontal', {
									slot: _slot,
									panel: _panel
								});
							}
						} else if(_slot.x_index === _panel.x_index && _slot.y_index !== _panel.y_index){
							if(moveY > moveX * 2 && !object.panel.y_overlap){
								scope.$emit('cardSlot:moveVertical', {
									slot: _slot,
									panel: _panel
								});
							}
						}
					} else if(isAbove(object.mouseX, object.mouseY)){
						if(_slot.y_index === 0){
							if(_slot.x_index !== _panel.x_index){
								scope.$emit('cardSlot:moveDiagonalUp', {
									slot: _slot,
									panel: _panel
								});
							}
						}
					} else if(isBelow(object.mouseX, object.mouseY)){
						if(_panel.y_index !== 0){
							if(_slot.x_index !== _panel.x_index){
								scope.$emit('cardSlot:moveDiagonalDown', {
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
				
				var isAbove = function(mouseX, mouseY){
					_offset = element.offset();
					leftEdge = _offset.left;
					rightEdge = leftEdge + x_dim;
					topEdge = _offset.top;
					
					return mouseX >= leftEdge && mouseX <= rightEdge && mouseY <= topEdge;
				};
				
				var isBelow = function(mouseX, mouseY){
					_offset = element.offset();
					leftEdge = _offset.left;
					rightEdge = _offset.left + x_dim;
					bottomEdge = _offset.top + y_dim;
					
					return mouseX >= leftEdge && mouseX <= rightEdge && mouseY >= bottomEdge;
				};
				
				var isLeft = function(mouseX, mouseY){
					_offset = element.offset();
					leftEdge = _offset.left;
					topEdge = _offset.top;
					bottomEdge = _offset.top + y_dim;
					
					return mouseX <= leftEdge && mouseY >= topEdge && mouseY <= bottomEdge;
				};
				
				var isRight = function(mouseX, mouseY){
					_offset = element.offset();
					rightEdge = _offset.left + x_dim;
					topEdge = _offset.top;
					bottomEdge = _offset.top + y_dim;
					
					return mouseX >= rightEdge && mouseY >= topEdge && mouseY <= bottomEdge;
				};
				
				var isTouching = function(mouseX, mouseY){
					_offset = element.offset();
					leftEdge = _offset.left;
					rightEdge = _offset.left + x_dim;
					topEdge = _offset.top;
					bottomEdge = _offset.top + y_dim;
					
					if(_slot.x_overlap){
						leftEdge = _offset.left + x_dim;
					}
					
					if(_slot.y_overlap){
						bottomEdge = _offset.top + 50;
					}
					
					return mouseX >= leftEdge && mouseX <= rightEdge && mouseY >= topEdge && mouseY <= bottomEdge;
				};
				
				initialize();
				
			}
		};
	}]);
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
						cardNumber: index
					});
					this.card.$save(function(response) {
						for(var i in service.cardList){
							if(service.cardList[i].cardNumber >= index){
								service.cardList[i].cardNumber += 1;
								service.cardList[i].x_index += 1;
								service.cardList[i].x_coord += 250;
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
						cardNumber: index
					});
					this.card.$save(function(response) {
						for(var i in service.cardList){
							if(service.cardList[i].cardNumber >= index){
								service.cardList[i].cardNumber += 1;
								service.cardList[i].x_index += 1;
								service.cardList[i].x_coord += 250;
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
						cardNumber: index
					});
					this.card.$save(function(response) {
						for(var i in service.cardList){
							if(service.cardList[i].cardNumber >= index){
								service.cardList[i].cardNumber += 1;
								service.cardList[i].x_index += 1;
								service.cardList[i].x_coord += 250;
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
						cardNumber: index
					});
					this.card.$save(function(response){
						for(var i in service.cardList){
							if(service.cardList[i].cardNumber >= index){
								service.cardList[i].cardNumber += 1;
								service.cardList[i].x_index += 1;
								service.cardList[i].x_coord += 250;
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
						this.cardList[i].x_coord -= 250;
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
coreModule.controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
		
	}
]);
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
				
				var windowHeight = $window.innerHeight;
				
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
					}, 50);
				};
				
				var onDestroy = function(enable){
					toggleListeners(false);
				};
				
				var onHeightChange = function(newVal, oldVal){
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
					} else {
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
pcsModule.controller('PcsCtrl', ['$scope', '$location', '$log', 'DataSRVC', 'Pcs', 'PcsCardDeck', 'PcsCard1', 'PcsCard2', 'PcsCard3', 'PcsTraits', 'PcsFeats', 'PcsAugments', 'PcsItems',
	function($scope, $location, $log, DataSRVC, Pcs, PcsCardDeck, PcsCard1, PcsCard2, PcsCard3, PcsTraits, PcsFeats, PcsAugments, PcsItems){
		
		$scope.dataSRVC = DataSRVC;
		
		$scope.pcs = Pcs;
		
		$scope.pcsCardDeck = PcsCardDeck;
		
		$scope.pcsCard1 = PcsCard1;
		
		$scope.pcsCard2 = PcsCard2;
		
		$scope.pcsCard3 = PcsCard3;
		
		$scope.pcsTraits = PcsTraits;
		
		$scope.pcsFeats = PcsFeats;
		
		$scope.pcsAugments = PcsAugments;
		
		$scope.pcsItems = PcsItems;
		
		$scope.windowHeight = 0;
		
		$scope.windowScale = 0;
		
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
		
		var moveHorizontal = function(event, object){
			if((object.panel.y_overlap && object.panel.y_index === 0) || Pcs.pc.cards[Pcs.lowestCard(object.panel.x_index)].y_index === 0){
				PcsCardDeck.switchHorizontal(object.slot, object.panel);
			} else {
				PcsCardDeck.unstackCard(object.slot, object.panel);
			}
		};

		var moveDiagonalUp = function(event, object){
			if((object.panel.y_index === 0 && object.panel.y_overlap) || Pcs.pc.cards[Pcs.lowestCard(object.panel.x_index)].y_index === 0){
				PcsCardDeck.stackUnder(object.slot, object.panel);
			} else {
				PcsCardDeck.unstackCard(object.slot, object.panel);
			}
		};

		var moveDiagonalDown = function(event, object){
			if((object.panel.y_index === 0 && object.panel.y_overlap) || Pcs.pc.cards[Pcs.lowestCard(object.panel.x_index)].y_index === 0){
				PcsCardDeck.stackOver(object.slot, object.panel);
			} else {
				PcsCardDeck.unstackCard(object.slot, object.panel);
			}
		};
		
		var moveVertical = function(event, object){
			PcsCardDeck.switchVertical(object.slot, object.panel);
		};
		
		var unstackLeft = function(event, object){
			if(object.panel.y_index > 0){
				PcsCardDeck.unstackCard({x_index: -1}, object.panel);
			}
		};
		
		var unstackRight = function(event, object){
			if(object.panel.y_index > 0){
				var unstack_index = Pcs.pc.cards[Pcs.lastCard()].x_index + 1;
				PcsCardDeck.unstackCard({x_index: unstack_index}, object.panel);
			}
		};
		
		var toggleOverlap = function(event, object){
			PcsCardDeck.toggleOverlap(object.panel);
		};
		
		var onReleaseCard = function(event, object){
			PcsCardDeck.onReleaseCard(object.panel);
		};
		
		var onPressCard = function(event, object){
			PcsCardDeck.onPressCard(object.panel);
			$scope.$digest();
		};
		
		var onHeightChange = function(event, object){
			$scope.windowHeight = object.newHeight;
			$scope.windowScale = object.newScale;
		};
		
		$scope.$on('cardSlot:moveHorizontal', moveHorizontal);
		$scope.$on('cardSlot:moveDiagonalUp', moveDiagonalUp);
		$scope.$on('cardSlot:moveDiagonalDown', moveDiagonalDown);
		$scope.$on('cardSlot:moveVertical', moveVertical);
		
		$scope.$on('cardDeck:unstackLeft', unstackLeft);
		$scope.$on('cardDeck:unstackRight', unstackRight);
		$scope.$on('screenSize:onHeightChange', onHeightChange);
		
		$scope.$on('cardPanel:toggleOverlap', toggleOverlap);
		$scope.$on('cardPanel:onPressCard', onPressCard);
		$scope.$on('cardPanel:onReleaseCard', onReleaseCard);
		
		
		$scope.$on('pcsCard1:updateStrPhy', function(event, object){
			PcsCard1.factorBlock(object._str, object._phy);
			PcsCard2.factorHealth();
			PcsCard2.factorStamina();
			PcsCard2.factorCarryingCapacity();
		});
		
		$scope.$on('pcsCard1:updateFleDex', function(event, object){
			PcsCard1.factorDodge(object._fle, object._dex);
		});
		
		$scope.$on('pcsCard1:updateAcuInt', function(event, object){
			PcsCard1.factorAlertness(object._acu, object._int);
		});
		
		$scope.$on('pcsCard1:updateWisCha', function(event, object){
			PcsCard1.factorTenacity(object._wis, object._cha);
		});
		
		//Watch for change in EXP input
		$scope.$watch('pcsCard2.EXP', function(newValue, oldValue){
			if(Pcs.pc && newValue !== oldValue){
				PcsCard2.EXP = parseInt(newValue);
				Pcs.pc.experience = parseInt(newValue);
			}
		});
		
		//Watch for change in experience
		$scope.$watch('pcs.pc.experience', function(newValue, oldValue){
			if(Pcs.pc && newValue !== oldValue){
				PcsCard2.factorExperience();
				if(newValue !== PcsCard2.EXP){
					PcsCard2.EXP = newValue;
				}
			}
		});
		
		//Watch for changes in level
		$scope.$watch('pcs.pc.level', function(newValue, oldValue, scope){
			if(Pcs.pc.abilities){
				PcsCard2.factorHealth();
				PcsCard2.factorStamina();
				PcsTraits.factorTraitLimit();
				PcsFeats.factorFeatLimit();
				PcsAugments.factorAugmentLimit();
			}
		});
		
}]);

'use strict';

angular.module('core')
	.directive('diceBox', function() {
		return {
			restrict: 'A',
			templateUrl: '../modules/pcs/views/dice-box.html'
		};
	});
'use strict';
var cardsModule = angular.module('pcs');

// Factory-service for managing PC card deck.
cardsModule.factory('PcsAugments', ['Pcs', 'PcsCardDeck', 
	function(Pcs, PcsCardDeck){
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
					PcsCardDeck.removeCard(ic);
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
				x_index: Pcs.pc.cards[Pcs.lastCard()].x_index + 1,
				y_index: 0,
				x_coord: Pcs.pc.cards[Pcs.lastCard()].x_coord + 250,
				y_coord: 0,
				x_dim: 250,
				y_dim: 350,
				x_overlap: false,
				y_overlap: false,
				locked: true,
				level: level
			};
			Pcs.pc.cards.push(newAugment);
		};
		
		return service;
	}]);
'use strict';
var cardsModule = angular.module('pcs');

// Factory-service for managing PC card deck.
cardsModule.factory('PcsCardDeck', ['Pcs',
	function(Pcs){
		var service = {};
		
		var x_dim = 10;
		var y_dim = 14;
		var x_tab = 2;
		var y_tab = 2;
		var x_cover = x_dim - x_tab;
		var y_cover = y_dim - y_tab;
		var _moveSpeed = 500;
		service.cardMoved = false;		// Disables overlap functions if current press has already triggered another function
		service.isMoving = false;
		service.movingUp = false;
		service.movingDown = false;
		service.movingLeft = false;
		service.movingRight = false;
		
		// Set move booleans
		service.setMovingUp = function(interval){
			service.movingUp = true;
			service.cardMoved = true;
			setTimeout(
				function () {
					service.movingUp = false;
				},
			interval);
		};
		
		service.setMovingDown = function(interval){
			service.movingDown = true;
			service.cardMoved = true;
			setTimeout(
				function(){
					service.movingDown = false;
				},
			interval);
		};
		
		service.setMovingLeft = function(interval){
			service.movingLeft = true;
			service.cardMoved = true;
			setTimeout(
				function(){
					service.movingLeft = false;
				},
			interval);
		};
		
		service.setMovingRight = function(interval){
			service.movingRight = true;
			service.cardMoved = true;
			setTimeout(
				function(){
					service.movingRight = false;
				},
			interval);
		};
		
		// Set state variables
		service.onPressCard = function(panel){
			var panel_x_index = panel.x_index;
			var panel_y_index = panel.y_index;
			var panel_y_overlap = panel.y_overlap;
			
			for(var ia = 0; ia < Pcs.pc.cards.length; ia++){
				if(Pcs.pc.cards[ia].x_index === panel_x_index){
					if(Pcs.pc.cards[ia].y_index === panel.y_index && !panel.y_overlap){
						Pcs.pc.cards[ia].dragging = true;
						Pcs.pc.cards[ia].stacked = false;
					} else if(Pcs.pc.cards[ia].y_index >= panel.y_index && panel.y_overlap){
						Pcs.pc.cards[ia].dragging = true;
						Pcs.pc.cards[ia].stacked = true;
					}
				}
			}
		};
		
		// Reset move variables
		service.onReleaseCard = function(panel){
			service.cardMoved = false;
			service.movingUp = false;
			service.movingDown = false;
			service.movingLeft = false;
			service.movingRight = false;
			
			var panel_x_index = panel.x_index;
			var panel_y_index = panel.y_index;
			var panel_y_overlap = panel.y_overlap;
			
			for(var ia = 0; ia < Pcs.pc.cards.length; ia++){
				if(Pcs.pc.cards[ia].x_index === panel_x_index){
					Pcs.pc.cards[ia].dragging = false;
				}
			}
		};
		
		// Swap card order along horizontal axis
		service.switchHorizontal = function(slot, panel){
			
			var slot_x_index = slot.x_index;
			var slot_y_index = slot.y_index;
			var slot_x_overlap = slot.x_overlap;
			
			var panel_x_index = panel.x_index;
			var panel_y_index = panel.y_index;
			var panel_x_overlap = panel.x_overlap;
			
			if(slot_y_index === 0 && panel_y_index === 0){
				if(panel_x_index - slot_x_index === 1 && !service.movingRight){
				// PANEL MOVING LEFT
					this.setMovingLeft(_moveSpeed);
					for(var ia = 0; ia < Pcs.pc.cards.length; ia++){
						if(Pcs.pc.cards[ia].x_index === slot_x_index){
						// Modify position of each card in "SLOT" column
							Pcs.pc.cards[ia].x_index += 1;
							if(slot_x_index > 0){
								if(panel_x_overlap){
									Pcs.pc.cards[ia].x_coord += x_cover;
								} else {
									Pcs.pc.cards[ia].x_coord += x_dim;
								}
							} else {
								Pcs.pc.cards[ia].x_coord = x_dim;
								Pcs.pc.cards[ia].x_overlap = false;
							}
						} else if(Pcs.pc.cards[ia].x_index === panel_x_index){
						// Modify position of each card in "PANEL" column
							Pcs.pc.cards[ia].x_index -= 1;
							if(slot_x_index > 0){
								if(slot_x_overlap){
									Pcs.pc.cards[ia].x_coord -= x_tab;
								} else {
									Pcs.pc.cards[ia].x_coord -= x_dim;
								}
							} else {
								Pcs.pc.cards[ia].x_coord = 0;
								Pcs.pc.cards[ia].x_overlap = false;
							}
						} else if(slot_x_index === 0 && panel_x_overlap){
							Pcs.pc.cards[ia].x_coord += x_cover;
						}
					}
				} else if(slot_x_index - panel_x_index === 1 && !service.movingLeft){
				// PANEL MOVING RIGHT
					this.setMovingRight(_moveSpeed);
					for(var ib = 0; ib < Pcs.pc.cards.length; ib++){
						if(Pcs.pc.cards[ib].x_index === slot_x_index){
						// Modify position of each card in "SLOT" column
							Pcs.pc.cards[ib].x_index -= 1;
							if(panel_x_index > 0){
								if(panel_x_overlap){
									Pcs.pc.cards[ib].x_coord -= x_tab;
								} else {
									Pcs.pc.cards[ib].x_coord -= x_dim;
								}
							} else {
								Pcs.pc.cards[ib].x_coord = 0;
								Pcs.pc.cards[ib].x_overlap = false;
							}
						} else if(Pcs.pc.cards[ib].x_index === panel_x_index){
						// Modify position of each card in "PANEL" column
							Pcs.pc.cards[ib].x_index += 1;
							if(panel_x_index > 0){
								if(slot_x_overlap){
									Pcs.pc.cards[ib].x_coord += x_tab;
								} else {
									Pcs.pc.cards[ib].x_coord += x_dim;
								}
							} else {
								Pcs.pc.cards[ib].x_coord = x_dim;
								Pcs.pc.cards[ib].x_overlap = false;
							}
						} else if(panel_x_index === 0 && slot_x_overlap){
							Pcs.pc.cards[ib].x_coord += x_cover;
						}
					}
				}
			}
		};
		
		// Swap card order along vertical axis
		service.switchVertical = function(slot, panel){
			var slot_index = Pcs.cardByIndex(slot.x_index, slot.y_index);
			var slot_x_index = slot.x_index;
			var slot_y_index = slot.y_index;
			var slot_y_coord = slot.y_coord;
			var slot_y_overlap = slot.y_overlap;
			
			var panel_index = Pcs.cardByIndex(panel.x_index, panel.y_index);
			var panel_x_index = panel.x_index;
			var panel_y_index = panel.y_index;
			var panel_y_coord = panel.y_coord;
			var panel_y_overlap = panel.y_overlap;
			
			if(panel_y_index - slot_y_index === 1 && !service.movingDown){
			// PANEL MOVING UP
				this.setMovingUp(_moveSpeed);
				
				Pcs.pc.cards[slot_index].y_index = panel_y_index;
				Pcs.pc.cards[panel_index].y_index = slot_y_index;
				Pcs.pc.cards[panel_index].y_coord = Pcs.pc.cards[panel_index].y_index * y_tab;
				Pcs.pc.cards[panel_index].y_overlap = false;
				
				for(var ia = 0; ia < Pcs.pc.cards.length; ia++){
					if(Pcs.pc.cards[ia].x_index === slot_x_index){
						if(Pcs.pc.cards[ia].y_index < slot_y_index){
						// Card is above panel
							Pcs.pc.cards[ia].y_coord = Pcs.pc.cards[ia].y_index * y_tab;
							Pcs.pc.cards[ia].y_overlap = true;
						} else if(Pcs.pc.cards[ia].y_index > slot_y_index){
						// card is below panel
							Pcs.pc.cards[ia].y_coord = y_cover + Pcs.pc.cards[ia].y_index * y_tab;
							if(Pcs.pc.cards[ia].y_index < Pcs.pc.cards[Pcs.lowestCard(slot_x_index)].y_index){
								Pcs.pc.cards[ia].y_overlap = true;
							} else {
								Pcs.pc.cards[ia].y_overlap = false;
							}
						}
					}
				}
			} else if(slot_y_index - panel_y_index === 1 && !service.movingUp){
			// PANEL MOVING DOWN
				this.setMovingDown(_moveSpeed);
				Pcs.pc.cards[slot_index].y_index = panel_y_index;
				Pcs.pc.cards[panel_index].y_index = slot_y_index;
				Pcs.pc.cards[panel_index].y_coord = Pcs.pc.cards[panel_index].y_index * y_tab;
				Pcs.pc.cards[panel_index].y_overlap = false;
				
				for(var ib = 0; ib < Pcs.pc.cards.length; ib++){
					if(Pcs.pc.cards[ib].x_index === slot_x_index){
						if(Pcs.pc.cards[ib].y_index < slot_y_index){
						// Card is above panel
							Pcs.pc.cards[ib].y_coord = Pcs.pc.cards[ib].y_index * y_tab;
							Pcs.pc.cards[ib].y_overlap = true;
						} else if(Pcs.pc.cards[ib].y_index > slot_y_index){
						// card is below panel
							Pcs.pc.cards[ib].y_coord = y_cover + Pcs.pc.cards[ib].y_index * y_tab;
							if(Pcs.pc.cards[ib].y_index < Pcs.pc.cards[Pcs.lowestCard(slot_x_index)].y_index){
								Pcs.pc.cards[ib].y_overlap = true;
							} else {
								Pcs.pc.cards[ib].y_overlap = false;
							}
						}
					}
				}
			}
		};
		
		service.stackOver = function(slot, panel){
			var slot_index = Pcs.cardByIndex(slot.x_index, slot.y_index);
			var panel_index = Pcs.cardByIndex(panel.x_index, panel.y_index);
			
			var slot_x_index = slot.x_index;
			var slot_y_index = slot.y_index;
			var slot_x_coord = slot.x_coord;
			var slot_y_coord = slot.y_coord;
			var slot_x_overlap = slot.x_overlap;
			var slot_y_overlap = slot.y_overlap;
			var slot_lowest_index = Pcs.pc.cards[Pcs.lowestCard(slot_x_index)].y_index;
			var slot_lowest_coord = Pcs.pc.cards[Pcs.lowestCard(slot_x_index)].y_coord;
			
			var panel_x_index = panel.x_index;
			var panel_y_index = panel.y_index;
			var panel_x_coord = panel.x_coord;
			var panel_y_coord = panel.y_coord;
			var panel_x_overlap = panel.x_overlap;
			var panel_y_overlap = panel.y_overlap;
			var panel_lowest_index = Pcs.pc.cards[Pcs.lowestCard(panel_x_index)].y_index;
			var panel_lowest_coord = Pcs.pc.cards[Pcs.lowestCard(panel_x_index)].y_coord;
			
			if(panel_x_index - slot_x_index === 1 && !service.movingRight){
			// CARD STACKING FROM RIGHT
				this.setMovingRight(_moveSpeed);
				Pcs.pc.cards[slot_index].y_overlap = true;
				Pcs.pc.cards[Pcs.lowestCard(panel_x_index)].y_overlap = slot_y_overlap;
				for(var ia = 0; ia < Pcs.pc.cards.length; ia++){
					if(Pcs.pc.cards[ia].x_index === panel_x_index){
						Pcs.pc.cards[ia].y_coord += slot_y_coord + y_tab;
						Pcs.pc.cards[ia].y_index += slot_y_index + 1;
					}
					if(Pcs.pc.cards[ia].x_index === slot_x_index && Pcs.pc.cards[ia].y_index > slot_y_index){
						Pcs.pc.cards[ia].y_coord += panel_lowest_coord + y_tab;
						Pcs.pc.cards[ia].y_index += panel_lowest_index + 1;
					}
					if(Pcs.pc.cards[ia].x_index > slot_x_index){
						Pcs.pc.cards[ia].x_coord -= x_dim;
						Pcs.pc.cards[ia].x_index -= 1;
					}
				}
				
			} else if(slot_x_index - panel_x_index === 1 && !service.movingLeft){
			// CARD STACKING FROM LEFT
				this.setMovingLeft(_moveSpeed);
				Pcs.pc.cards[slot_index].y_overlap = true;
				Pcs.pc.cards[Pcs.lowestCard(panel_x_index)].y_overlap = slot_y_overlap;
				for(var ib = 0; ib < Pcs.pc.cards.length; ib++){
					if(Pcs.pc.cards[ib].x_index === panel_x_index){
						Pcs.pc.cards[ib].y_coord += slot_y_coord + y_tab;
						Pcs.pc.cards[ib].y_index += slot_y_index + 1;
					}
					if(Pcs.pc.cards[ib].x_index > panel_x_index){
						Pcs.pc.cards[ib].x_coord -= x_dim;
						Pcs.pc.cards[ib].x_index -= 1;
						if(Pcs.pc.cards[ib].x_index === panel_x_index && Pcs.pc.cards[ib].y_index > slot_y_index){
							Pcs.pc.cards[ib].y_coord += panel_lowest_coord + y_tab;
							Pcs.pc.cards[ib].y_index += panel_lowest_index + 1;
						}
					}
				}
			}
		};
		
		
		// Stack one card behind another and reposition deck to fill the gap
		service.stackUnder = function(slot, panel){
			var panel_index = Pcs.cardByIndex(panel.x_index, panel.y_index);
			
			var panel_x_index = panel.x_index;
			var panel_y_index = panel.y_index;
			var panel_x_coord = panel.x_coord;
			var panel_y_coord = panel.y_coord;
			var panel_x_overlap = panel.x_overlap;
			var panel_y_overlap = panel.y_overlap;
			var panel_lowest_index = Pcs.pc.cards[Pcs.lowestCard(panel_x_index)].y_index;
			var panel_lowest_coord = Pcs.pc.cards[Pcs.lowestCard(panel_x_index)].y_coord;
			
			var slot_x_index = slot.x_index;
			var slot_y_index = slot.y_index;
			var slot_lowest_index = Pcs.pc.cards[Pcs.lowestCard(slot_x_index)].y_index;
			var slot_lowest_coord = Pcs.pc.cards[Pcs.lowestCard(slot_x_index)].y_coord;
			
			if(panel_x_index - slot_x_index === 1 && !service.movingRight){
			//Card is stacking under from left
				this.setMovingLeft(_moveSpeed);
				Pcs.pc.cards[panel_index].y_overlap = true;
				for(var ia = 0; ia < Pcs.pc.cards.length; ia++){
					if(Pcs.pc.cards[ia].x_index === slot_x_index){
						Pcs.pc.cards[ia].y_coord += panel_lowest_coord + y_tab;
						Pcs.pc.cards[ia].y_index += panel_lowest_index + 1;
					}
					if(Pcs.pc.cards[ia].x_index > slot_x_index){
						Pcs.pc.cards[ia].x_coord -= x_dim;
						Pcs.pc.cards[ia].x_index -= 1;
					}
				}
				
			} else if(slot_x_index - panel_x_index === 1 && !service.movingLeft){
			//Card is stacking under from right
				this.setMovingRight(_moveSpeed);
				Pcs.pc.cards[panel_index].y_overlap = true;
				for(var ib = 0; ib < Pcs.pc.cards.length; ib++){
					if(Pcs.pc.cards[ib].x_index === slot_x_index){
						Pcs.pc.cards[ib].y_coord += panel_lowest_coord + y_tab;
						Pcs.pc.cards[ib].y_index += panel_lowest_index + 1;
					}
					if(Pcs.pc.cards[ib].x_index > panel_x_index){
						Pcs.pc.cards[ib].x_coord -= x_dim;
						Pcs.pc.cards[ib].x_index -= 1;
					}
				}
			}
		};
		
		// Withdraw card from stack and reposition deck to make room
		service.unstackCard = function(slot, panel){
			if(Pcs.pc.cards[Pcs.lowestCard(panel.x_index)].y_index > 0){
				var panel_index = Pcs.cardByIndex(panel.x_index, panel.y_index);
				
				var panel_x_index = panel.x_index;
				var panel_y_index = panel.y_index;
				var panel_x_coord = panel.x_coord;
				var panel_y_coord = panel.y_coord;
				var panel_x_overlap = panel.x_overlap;
				var panel_y_overlap = panel.y_overlap;
				
				var slot_x_index = slot.x_index;
				
				if(panel_x_index - slot_x_index === 1  && !service.movingLeft){
				// Card is unstacking to the left
					this.setMovingRight(_moveSpeed);
					if(panel_y_overlap){
					// Unstack multiple cards to the left
						for(var ia = 0; ia < Pcs.pc.cards.length; ia++){
							if(Pcs.pc.cards[ia].x_index > panel_x_index){
								Pcs.pc.cards[ia].x_coord += x_dim;
								Pcs.pc.cards[ia].x_index += 1;
							}
							if(Pcs.pc.cards[ia].x_index === panel_x_index){
								if(panel_y_overlap){
									if(Pcs.pc.cards[ia].y_index < panel_y_index){
										Pcs.pc.cards[ia].x_coord += x_dim;
										Pcs.pc.cards[ia].x_index += 1;
									} else if(Pcs.pc.cards[ia].y_index >= panel_y_index){
										Pcs.pc.cards[ia].y_coord -= panel_y_coord;
										Pcs.pc.cards[ia].y_index -= panel_y_index;
									}
								}
							}
						}
					} else if(!panel_y_overlap){							// Unstack single card to the left
						for(var ib = 0; ib < Pcs.pc.cards.length; ib++){
							if(Pcs.pc.cards[ib].x_index >= panel_x_index){
								if(Pcs.pc.cards[ib].x_index === panel_x_index && Pcs.pc.cards[ib].y_index > panel_y_index){
									Pcs.pc.cards[ib].y_coord -= y_dim;
									Pcs.pc.cards[ib].y_index -= 1;
								}
								if(ib !== panel_index){
									Pcs.pc.cards[ib].x_coord += x_dim;
									Pcs.pc.cards[ib].x_index += 1;
								}
							}
						}
						Pcs.pc.cards[panel_index].y_coord = 0;
						Pcs.pc.cards[panel_index].y_index = 0;
					}
					Pcs.pc.cards[Pcs.lowestCard(panel_x_index + 1)].y_overlap = false;
				} else if(slot_x_index - panel_x_index === 1 && !service.movingLeft){
				//Card is unstacking to the right
					this.setMovingLeft(_moveSpeed);
					if(panel_y_overlap){
					// Unstack multiple cards to the right
						for(var ic = 0; ic < Pcs.pc.cards.length; ic++){
							if(Pcs.pc.cards[ic].x_index > panel_x_index){
								Pcs.pc.cards[ic].x_coord += x_dim;
								Pcs.pc.cards[ic].x_index += 1;
							}
							if(Pcs.pc.cards[ic].x_index === panel_x_index){
								if(Pcs.pc.cards[ic].y_index >= panel_y_index){
									Pcs.pc.cards[ic].x_index += 1;
									Pcs.pc.cards[ic].x_coord += x_dim;
									Pcs.pc.cards[ic].y_index -= panel_y_index;
									Pcs.pc.cards[ic].y_coord -= panel_y_coord;
								}
							}
						}
					} else if(!panel_y_overlap){
					// Unstack single (un-overlapped) card to the right
						for(var id = 0; id < Pcs.pc.cards.length; id++){
							if(Pcs.pc.cards[id].x_index > panel_x_index){
								Pcs.pc.cards[id].x_coord += x_dim;
								Pcs.pc.cards[id].x_index += 1;
							}
							if(Pcs.pc.cards[id].x_index === panel_x_index && Pcs.pc.cards[id].y_index > panel_y_index){
								Pcs.pc.cards[id].y_coord -= y_dim;
								Pcs.pc.cards[id].y_index -= 1;
							}
						}
						Pcs.pc.cards[panel_index].x_coord += x_dim;
						Pcs.pc.cards[panel_index].x_index += 1;
						Pcs.pc.cards[panel_index].y_coord = 0;
						Pcs.pc.cards[panel_index].y_index = 0;
					}
					Pcs.pc.cards[Pcs.lowestCard(panel_x_index)].y_overlap = false;
				}
			}
		};
		
		// Gatekeeper function for x_overlap and y_overlap
		service.toggleOverlap = function(card){
			if(!service.cardMoved){
				if(card.x_index > 0 && Pcs.pc.cards[Pcs.lowestCard(card.x_index)].y_index === 0){
					this.toggle_X_Overlap(card);
				} else if(card.y_index !== Pcs.pc.cards[Pcs.lowestCard(card.x_index)].y_index){
					this.toggle_Y_Overlap(card);
				}
			}
		};
		
		service.toggle_X_Overlap = function(card){
			var x_index = card.x_index;
			var y_index = card.y_index;
			var _card = Pcs.cardByIndex(x_index, y_index);
			if(x_index > 0){
				if(Pcs.pc.cards[_card].x_overlap && !this.movingLeft){
				// Card overlapped
					this.setMovingRight(_moveSpeed);
					for(var ia = 0; ia < Pcs.pc.cards.length; ia++){
						if(x_index <= Pcs.pc.cards[ia].x_index){
							Pcs.pc.cards[ia].x_coord += x_cover;
						}
					}
					Pcs.pc.cards[_card].x_overlap = false;
				} else if(!Pcs.pc.cards[_card].x_overlap && !this.movingRight){
				// Card not overlapped
					this.setMovingLeft(_moveSpeed);
					for(var ib = 0; ib < Pcs.pc.cards.length; ib++){
						if(x_index <= Pcs.pc.cards[ib].x_index){
							Pcs.pc.cards[ib].x_coord -= x_cover;
						}
					}
					Pcs.pc.cards[_card].x_overlap = true;
				}
			}
		};
		
		service.toggle_Y_Overlap = function(card){
			var card_x_index = card.x_index;
			var card_y_index = card.y_index;
			var card_index = Pcs.cardByIndex(card_x_index, card_y_index);
			var card_y_overlap = card.y_overlap;
			var lowest_index = Pcs.lowestCard(card_x_index);
			var lowest_y_index = Pcs.pc.cards[lowest_index].y_index;
			
			if(card_y_index < lowest_y_index){
				if(Pcs.pc.cards[card_index].y_overlap && !this.movingUp){
				// Card overlapped
					this.setMovingDown(_moveSpeed);
					Pcs.pc.cards[card_index].y_coord = Pcs.pc.cards[card_index].y_index * y_tab;
					Pcs.pc.cards[card_index].y_overlap = false;
					for(var ia = 0; ia < Pcs.pc.cards.length; ia++){
						if(Pcs.pc.cards[ia].x_index === card_x_index){
							if(Pcs.pc.cards[ia].y_index < card_y_index){
								Pcs.pc.cards[ia].y_coord = Pcs.pc.cards[ia].y_index * y_tab;
								Pcs.pc.cards[ia].y_overlap = true;
							} else if(Pcs.pc.cards[ia].y_index > card_y_index){
								Pcs.pc.cards[ia].y_coord = y_cover + Pcs.pc.cards[ia].y_index * y_tab;
								if(Pcs.pc.cards[ia].y_index < lowest_y_index){
									Pcs.pc.cards[ia].y_overlap = true;
								}
							}
						}
					}
				} else if(!Pcs.pc.cards[card_index].y_overlap && !this.movingDown){
				// Card not overlapped
					this.setMovingUp(_moveSpeed);
					for(var ib = 0; ib < Pcs.pc.cards.length; ib++){
						if(card_x_index === Pcs.pc.cards[ib].x_index){
							Pcs.pc.cards[ib].y_coord = Pcs.pc.cards[ib].y_index * y_tab;
							if(Pcs.pc.cards[ib].y_index < lowest_y_index){
								Pcs.pc.cards[ib].y_overlap = true;
							}
						}
					}
					Pcs.pc.cards[card_index].y_overlap = true;
				}
			}
		};
		
		service.removeCard = function(card){
			var card_x_index = Pcs.pc.cards[card].x_index;
			var card_width = Pcs.pc.cards[card].x_overlap ? x_tab : Pcs.pc.cards[card].x_dim;
			var card_y_index = Pcs.pc.cards[card].y_index;
			var card_height = Pcs.pc.cards[card].y_overlap ? y_tab : Pcs.pc.cards[card].y_dim;
			var lowest_y_index = Pcs.pc.cards[Pcs.lowestCard(card_x_index)].y_index;
			Pcs.pc.cards.splice(card, 1);
			for(var id = 0; id < Pcs.pc.cards.length; id++){
				if(lowest_y_index > 0){
					if(lowest_y_index > 0 ){
						if(Pcs.pc.cards[id].x_index === card_x_index && Pcs.pc.cards[id].y_index > card_y_index){
							Pcs.pc.cards[id].y_index -= 1;
							Pcs.pc.cards[id].y_coord -= card_height;
						}
						Pcs.pc.cards[Pcs.lowestCard(card_x_index)].y_overlap = false;
					}
				} else if(lowest_y_index === 0){
					if(Pcs.pc.cards[id].x_index > card_x_index){
						Pcs.pc.cards[id].x_index -= 1;
						Pcs.pc.cards[id].x_coord -= card_width;
					}
				}
			}
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
cardsModule.factory('PcsFeats', ['Pcs', 'PcsCardDeck', 
	function(Pcs, PcsCardDeck){
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
					PcsCardDeck.removeCard(ic);
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
				x_index: Pcs.pc.cards[Pcs.lastCard()].x_index + 1,
				y_index: 0,
				x_coord: Pcs.pc.cards[Pcs.lastCard()].x_coord + 250,
				y_coord: 0,
				x_overlap: false,
				y_overlap: false,
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
cardsModule.factory('PcsTraits', ['Pcs', 'PcsCardDeck', 
	function(Pcs, PcsCardDeck){
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
					PcsCardDeck.removeCard(ic);
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
				x_index: Pcs.pc.cards[Pcs.lastCard()].x_index + 1,
				y_index: 0,
				x_coord: Pcs.pc.cards[Pcs.lastCard()].x_coord + 250,
				y_coord: 0,
				x_dim: 250,
				y_dim: 350,
				x_overlap: false,
				y_overlap: false,
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
		
		service.cardByIndex = function(x_index, y_index){
			var card = {};
			for(var i = 0; i < this.pc.cards.length; i++){
				if(this.pc.cards[i].x_index === x_index && this.pc.cards[i].y_index === y_index){
					return i;
				}
			}
		};
		
		service.firstCard = function(){
			return this.cardByIndex(0, 0);
		};
		
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
		
		service.lowestCard = function(x_index) {
			var _lowest = 0;
			var _card = {};
			for(var i = 0; i < this.pc.cards.length; i++) {
				if(this.pc.cards[i].x_index === x_index){
					if(this.pc.cards[i].y_index > (_card.y_index || -1)){
						_lowest = i;
						_card = this.pc.cards[i];
					}
				}
			}
			return _lowest;
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
						x_index: 0,
						y_index: 0,
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
						x_index: 1,
						y_index: 0,
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
						x_index: 2,
						y_index: 0,
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
						x_index: 3,
						y_index: 0,
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
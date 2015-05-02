'use strict';

// Directive for managing card decks.
angular.module('decks')
	.directive('cardDeck', ['$rootScope', '$window', 'CardDeck', 'Bakery', function($rootScope, $window, CardDeck, Bakery){
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
					scope.$on('screenSize:onHeightChange', onHeightChange);
					scope.$on('CardDeck:setDeckWidth', setDeckWidth);
					scope.$on('cardPanel:onPressCard', onPress);
					scope.$on('cardPanel:onReleaseCard', onRelease);
					scope.$on('cardPanel:onMoveCard', onMoveCard);
				};
				
				var onDestroy = function(enable){
					toggleListeners(false);
				};
				
				var onHeightChange = function(event, object){
					var windowHeight = object.newHeight;
					element.css({
						'height': windowHeight+'px'
					});
				};
				
				var setDeckWidth = function(event, object){
					var deckWidth = object.deckWidth + 3;
					element.css({
						'width': deckWidth+'em'
					});
				};
				
				var getElementFontSize = function(){
					return parseFloat(
						$window.getComputedStyle(element[0], null).getPropertyValue('font-size')
					);
				};
				
				var convertEm = function(value) {
					return value * getElementFontSize();
				};
				
				var onPress = function(){
					pressed = true;
				};
				
				var onRelease = function(){
					pressed = false;
				};
				
				var onMoveCard = function(event, object){
					
					var deckOffset = element.offset();
					var deckWidth = Bakery.deckWidth(Bakery.resource.cardList);
					var deckLeftEdge = deckOffset.left;
					var deckRightEdge = convertEm(deckWidth + 3);
					
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
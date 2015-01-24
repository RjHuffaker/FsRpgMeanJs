'use strict';

var cardsModule = angular.module('core');

// Directive for managing card decks.
cardsModule
	.directive('cardDeck', ['$rootScope', '$window', 'CardDeck', function($rootScope, $window, CardDeck){
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
						'width': windowHeight+'px'
						
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
					var deckWidth = element[0].offsetWidth;
					var deckLeftEdge = deckOffset.left;
					var deckRightEdge = deckLeftEdge + deckWidth - convertEm(3);
					
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
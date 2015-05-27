'use strict';

// Directive for managing card decks.
angular.module('move')
	.directive('deckStack', ['$rootScope', '$window', 'Bakery', 'MoveStack', 'MoveHub', function($rootScope, $window, Bakery, MoveStack, MoveHub){
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
					scope.$on('MoveStack:setDeckWidth', setDeckWidth);
					scope.$on('cardPanel:onPressCard', onPress);
					scope.$on('cardPanel:onReleaseCard', onRelease);
					scope.$on('cardPanel:onMoveCard', onMoveCard);
				};
				
				var onDestroy = function(enable){
					toggleListeners(false);
				};
				
				var onHeightChange = function(event, object){
					var windowHeight = object.newHeight-50;
					element.css({
						'height': windowHeight+'px'
					});
				};
				
				var setDeckWidth = function(){
					var deckWidth = MoveStack.getDeckWidth(Bakery.resource.cardList);
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
					var deckWidth = MoveStack.getDeckWidth(Bakery.resource.cardList);
					var deckLeftEdge = deckOffset.left;
					var deckRightEdge = convertEm(deckWidth + 3);
					
					if(object.mouseX <= deckLeftEdge){
						MoveHub.unstackLeft(object.panel);
					} else if(object.mouseX >= deckRightEdge){
						MoveHub.unstackRight(object.panel);
					}
					
				};
				
				var onMouseLeave = function(event){
					if(pressed){
						$rootScope.$broadcast('deckStack:onMouseLeave');
					}
				};
				
				initialize();
			}
		};
	}]);
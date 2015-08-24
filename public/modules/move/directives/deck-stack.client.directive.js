'use strict';

// Directive for managing card decks.
angular.module('move')
	.directive('deckStack', ['$rootScope', '$window', 'Bakery', 'PanelUtils', 'DeckUtils', 'unstackCard', function($rootScope, $window, Bakery, PanelUtils, DeckUtils, unstackCard){
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
					scope.$on('DeckUtils:setDeckWidth', setDeckWidth);
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
					var deckWidth = DeckUtils.getDeckWidth(Bakery.resource.cardList);
					element.css({
						'width': deckWidth+'em'
					});
				};
				
				var getElementFontSize = function(){
					return parseFloat(
						$window.getComputedStyle(element[0], null).getPropertyValue('font-size')
					);
				};
				
				var getCardList = function(){
					return Bakery.resource.cardList;
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
					
					var _deckOffset = element.offset();
					var _deckWidth = DeckUtils.getDeckWidth(Bakery.resource.cardList);
					var _deckLeftEdge = _deckOffset.left;
					var _deckRightEdge = convertEm(_deckWidth + 3);
					var _deck = getCardList();
					
					if(object.mouseX <= _deckLeftEdge){
						var _first = PanelUtils.getFirst(_deck);
						unstackCard(_deck, _first, object.panel);
					} else if(object.mouseX >= _deckRightEdge){
						var _last = PanelUtils.getLast(_deck);
						unstackCard(_deck, _last, object.panel);
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
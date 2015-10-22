'use strict';

// Directive for managing card decks.
angular.module('move').directive('deckStack', ['$rootScope', '$window', 'Bakery', 'PanelUtils', 'DeckUtils', 'movePanel',
	function($rootScope, $window, Bakery, PanelUtils, DeckUtils, movePanel){
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
					var _panel = object.panel;
					
					var _panelStart = PanelUtils.getClusterStart(_deck, _panel._id);
					var _panelStartPrev = PanelUtils.getPrev(_deck, _panelStart._id);
					var _panelEnd = PanelUtils.getClusterEnd(_deck, _panel._id);
					var _panelEndNext = PanelUtils.getNext(_deck, _panelEnd._id);
					
					if(object.mouseX <= _deckLeftEdge && PanelUtils.hasPrev(_panel)){
						movePanel(_deck, _panelStartPrev, object.panel, 'right', object.moveX, object.moveY);
					} else if(object.mouseX >= _deckRightEdge && PanelUtils.hasPrev(_panel)){
						var _slot = PanelUtils.getPrev(_deck);
						movePanel(_deck, _panelStartPrev, object.panel, 'left', object.moveX, object.moveY);
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
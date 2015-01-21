'use strict';

var cardsModule = angular.module('core');

// Directive for managing card decks.
cardsModule
	.directive('cardDeck', ['$document', '$parse', '$rootScope', '$window', function($document, $parse, $rootScope, $window){
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				
				var pressed = false;
				
				var _window = angular.element($window);
				
				var _windowHeight, _windowScale;
				
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
					_windowHeight = object.newHeight;
					_windowScale = object.newScale;
					
					element.css({
						'height': _windowHeight+'px'
					});
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
					var deckRightEdge = deckLeftEdge + deckWidth - _windowScale;
					
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
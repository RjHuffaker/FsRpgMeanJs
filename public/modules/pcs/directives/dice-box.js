'use strict';

// Directive for managing ability dice
angular.module('pcs')
	.directive('diceBox', ['$window', 'CardDeck', function($window, CardDeck) {
		return {
			restrict: 'A',
			templateUrl: '../modules/pcs/views/dice-box.html',
			link: function(scope, element, attrs) {
				
				var initialize = function(){
					// prevent native drag
					element.attr('draggable', 'false');
					toggleListeners(true);
				};
				
				var toggleListeners = function(enable){
					if (!enable)return;
					
					scope.$on('$destroy', onDestroy);
					scope.$on('ability:onPress', setPosition);
					scope.$on('ability:setPosition', setPosition);
				};
				
				var onDestroy = function(enable){
					toggleListeners(false);
				};
				
				var getElementFontSize = function() {
					return parseFloat(
						$window.getComputedStyle(element[0], null).getPropertyValue('font-size')
					);
				};
				
				var convertEm = function(value) {
					return value * getElementFontSize();
				};
				
				var setPosition = function(event, object){
					var _caret = object.caret;
					var _topEdge = object.topEdge;
					var _leftEdge = object.leftEdge;
					element.removeClass('top-caret');
					element.removeClass('bottom-caret');
					element.addClass(_caret);
					element.css({
						'top': _topEdge+'px',
						'left': _leftEdge+'px'
					});
				};
				
				initialize();
				
			}
		};
	}])
	.directive('ability', ['$parse', '$rootScope', '$window', 'CardDeck', 'PcsCard1', function($parse, $rootScope, $window, CardDeck, PcsCard1){
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				
				var _ability = $parse(attrs.ability) || null;
				
				var _width;
				
				var _pressEvents = 'touchstart mousedown';
				
				var initialize = function(){
					// prevent native drag
					element.attr('draggable', 'false');
					toggleListeners(true);
					onHeightChange();
				};
				
				var toggleListeners = function(enable){
					if (!enable)return;
					
					scope.$on('$destroy', onDestroy);
					scope.$watch(attrs.ability, onAbilityChange);
					scope.$on('screenSize:onHeightChange', onHeightChange);
					element.on(_pressEvents, onPress);
				};
				
				var onDestroy = function(enable){
					toggleListeners(false);
				};
				
				var getElementFontSize = function() {
					return parseFloat(
						$window.getComputedStyle(element[0], null).getPropertyValue('font-size')
					);
				};
				
				var convertEm = function(value) {
					return value * getElementFontSize();
				};
				
				var onAbilityChange = function(newVal, oldVal){
					_ability = newVal;
				};
				
				var getPosition = function(){
					var offset = element.offset();
					var caret = _ability.order < 4 ? 'top-caret' : 'bottom-caret';
					var topEdge = _ability.order < 4 ? offset.top + convertEm(3) : offset.top - convertEm(9);
					var leftEdge = offset.left - convertEm(0.5);
					return {
						caret: caret,
						topEdge: topEdge,
						leftEdge: leftEdge,
						ability: _ability
					};
				};
				
				
				var onHeightChange = function(event, object){
					if(_ability.order === PcsCard1.chosenAbility.order){
						$rootScope.$broadcast('ability:setPosition', getPosition());
					}
				};
				
				var onPress = function(){
					$rootScope.$broadcast('ability:onPress', getPosition());
				};
				
				initialize();
			}
		};
	}]);
'use strict';

var pcsModule = angular.module('pcs');

// Directive for managing ability dice
pcsModule
	.directive('diceBox', ['CardDeck', function(CardDeck) {
		return {
			restrict: 'A',
			templateUrl: '../modules/pcs/views/dice-box.html',
			link: function(scope, element, attrs) {
				
				var _topEdge, _leftEdge, _height, _width;
				
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
				
				var setPosition = function(event, object){
					_height = CardDeck.windowScale * 5.4;
					_width = CardDeck.windowScale * 5.4;
					_topEdge = object.topEdge;
					_leftEdge = object.leftEdge;
					element.css({
						'height': _height+'px',
						'width': _width+'px',
						'top': _topEdge+'px',
						'left': _leftEdge+'px'
					});
				};
				
				initialize();
				
			}
		};
	}])
	.directive('ability', ['$parse', '$rootScope', 'CardDeck', 'PcsCard1', function($parse, $rootScope, CardDeck, PcsCard1){
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
				
				var onAbilityChange = function(newVal, oldVal){
					_ability = newVal;
					element.css({
						'width': _width+'px',
					});
				};
				
				var getPosition = function(){
					var offset = element.offset();
					var topEdge = _ability.order < 4 ? offset.top + _width : offset.top - CardDeck.windowScale * 5.4;
					var leftEdge = offset.left;
					return {
						ability: _ability,
						topEdge: topEdge,
						leftEdge: leftEdge
					};
				};
				
				
				var onHeightChange = function(event, object){
					_width = CardDeck.windowScale * 1.4;
					element.css({
						'width': _width+'px',
					});
					if(_ability.order === PcsCard1.chosenAbility.order){
						$rootScope.$broadcast('ability:setPosition', getPosition());
					}
				};
				
				var onPress = function(){
					var offset = element.offset();
					var topEdge = _ability.order < 4 ? offset.top + _width : offset.top - CardDeck.windowScale * 5.4;
					var leftEdge = offset.left;
					
					$rootScope.$broadcast('ability:onPress', getPosition());
					
				};
				
				initialize();
			}
		};
	}]);
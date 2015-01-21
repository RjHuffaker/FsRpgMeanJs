'use strict';

var pcsModule = angular.module('pcs');

// Directive for managing ability dice
pcsModule
	.directive('diceBox', function() {
		return {
			restrict: 'A',
			templateUrl: '../modules/pcs/views/dice-box.html',
			link: function(scope, element, attrs) {
				
				var _topEdge, _leftEdge, _windowScale = 15, _height = 75, _width = 75;
				
				var initialize = function(){
					// prevent native drag
					element.attr('draggable', 'false');
					toggleListeners(true);
				};
				
				var toggleListeners = function(enable){
					if (!enable)return;
					
					scope.$on('$destroy', onDestroy);
					scope.$on('screenSize:onHeightChange', onHeightChange);
					scope.$on('ability:onPress', chooseAbility);
				};
				
				var onDestroy = function(enable){
					toggleListeners(false);
				};
				
				var onHeightChange = function(event, object){
					_windowScale = object.newScale ? object.newScale : 15;
					_height = _windowScale * 5.4;
					_width = _windowScale * 5.4;
					element.css({
						'height': _height+'px',
						'width': _width+'px'
					});
				};
				
				var chooseAbility = function(event, object){
					console.log('choose ability:');
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
	})
	.directive('ability', ['$parse', '$rootScope', function($parse, $rootScope){
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				
				scope.diceImage = null;
				
				var _ability = $parse(attrs.ability) || null;
				
				var _windowScale = 15;
				
				var _width = 21;
				
				var _pressEvents = 'touchstart mousedown';
				
				var initialize = function(){
					// prevent native drag
					element.attr('draggable', 'false');
					toggleListeners(true);
				};
				
				var toggleListeners = function(enable){
					if (!enable)return;
					
					scope.$on('$destroy', onDestroy);
					scope.$watch(attrs.ability, onAbilityChange);
					$rootScope.$on('screenSize:onHeightChange', onHeightChange);
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
				
				
				var onHeightChange = function(event, object){
					_windowScale = object.newScale ? object.newScale : 15;
					_width = _windowScale * 1.4;
					element.css({
						'width': _width+'px',
					});
				};
				
				var onPress = function(){
					var offset = element.offset();
					var topEdge = _ability.order < 4 ? offset.top + _width : offset.top - _windowScale * 5.4;
					var leftEdge = offset.left;
					
					$rootScope.$broadcast('ability:onPress', {
						ability: _ability,
						topEdge: topEdge,
						leftEdge: leftEdge
					});
					
				};
				
				initialize();
			}
		};
	}]);
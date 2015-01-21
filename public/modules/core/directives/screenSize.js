'use strict';

var coreModule = angular.module('core');

// Directive for monitoring screen height
coreModule
	.directive('screenSize', ['$rootScope', '$window', function($rootScope, $window){
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				
				var _window = angular.element($window);
				
				var _windowHeight;
				
				var _windowWidth;
				
				var _windowScale;
				
				var initialize = function() {
					toggleListeners(true);
					setTimeout(function(){
						onHeightChange();
					}, 0);
				};
				
				var toggleListeners = function (enable) {
					// remove listeners
					if (!enable)return;
					
					// add listeners
					scope.$on('$destroy', onDestroy);
					_window.on('resize', onHeightChange);
				};
				
				var onDestroy = function(enable){
					toggleListeners(false);
				};
				
				var onHeightChange = function(){
					
					_windowHeight = _window.height();
					
					if(_windowHeight > 500){
						_windowScale = 25;
					} else if(_windowHeight < 320){
						_windowScale = 15;
					} else {
						_windowScale = _windowHeight / 20;
					}
					
					console.log(_windowHeight+','+_windowScale);
					
					$rootScope.$broadcast('screenSize:onHeightChange', {
						newHeight: _windowHeight,
						newScale: _windowScale
					});
					
					
				};
				
				angular.element(document).ready(function () {
					initialize();
				});
				
		//		initialize();
			}
		};
	}]);
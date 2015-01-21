'use strict';

var coreModule = angular.module('core');

// Directive for monitoring screen height
coreModule
	.directive('screenSize', ['$rootScope', '$window', function($rootScope, $window){
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				var _window = angular.element($window);
				
				var _windowHeight = 320;
				
				var _windowScale = 15;
				
				var initialize = function() {
					toggleListeners(true);
					measureScreen();
				};
				
				var toggleListeners = function (enable) {
					// remove listeners
					if (!enable)return;
					
					// add listeners
					scope.$on('$destroy', onDestroy);
					_window.on('resize', onHeightChange);
					
					setTimeout( function(){
						onHeightChange();
					}, 0);
				};
				
				var onDestroy = function(enable){
					toggleListeners(false);
				};
				
				var onHeightChange = function(){
					measureScreen();
				};
				
				var measureScreen = function(){
					_windowHeight = $window.innerHeight;
					console.log(_windowHeight);
					if(_windowHeight > 500){
						_windowScale = 25;
					} else if(_windowHeight >= 480){
						_windowScale = 24;
					} else if(_windowHeight >= 460){
						_windowScale = 23;
					} else if(_windowHeight >= 440){
						_windowScale = 22;
					} else if(_windowHeight >= 420){
						_windowScale = 21;
					} else if(_windowHeight >= 400){
						_windowScale = 20;
					} else if(_windowHeight >= 380){
						_windowScale = 19;
					} else if(_windowHeight >= 360){
						_windowScale = 18;
					} else if(_windowHeight >= 340){
						_windowScale = 17;
					} else if(_windowHeight >= 320){
						_windowScale = 16;
					} else {
						_windowScale = 15;
					}
					
					$rootScope.$broadcast('screenSize:onHeightChange', {
						newHeight: _windowHeight,
						newScale: _windowScale
					});
				};
				
				initialize();
			}
		};
	}]);
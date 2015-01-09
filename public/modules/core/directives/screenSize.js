'use strict';

var coreModule = angular.module('core');

// Directive for monitoring screen height
coreModule
	.directive('screenSize', ['$rootScope', '$window', function($rootScope, $window){
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				var _window = angular.element($window);
				
				var windowHeight = $window.innerHeight;
				
				var windowScale = 25;
				
				var initialize = function() {
					toggleListeners(true);
				};
				
				var toggleListeners = function (enable) {
					// remove listeners
					if (!enable)return;
					
					// add listeners
					scope.$on('$destroy', onDestroy);
					_window.on('resize', onHeightChange);
					
					setTimeout( function(){
						onHeightChange();
					}, 50);
				};
				
				var onDestroy = function(enable){
					toggleListeners(false);
				};
				
				var onHeightChange = function(newVal, oldVal){
					windowHeight = $window.innerHeight;
					if(windowHeight > 500){
						windowScale = 25;
					} else if(windowHeight > 480){
						windowScale = 24;
					} else if(windowHeight > 460){
						windowScale = 23;
					} else if(windowHeight > 440){
						windowScale = 22;
					} else if(windowHeight > 420){
						windowScale = 21;
					} else if(windowHeight > 400){
						windowScale = 20;
					} else if(windowHeight > 380){
						windowScale = 19;
					} else if(windowHeight > 360){
						windowScale = 18;
					} else if(windowHeight > 340){
						windowScale = 17;
					} else if(windowHeight > 320){
						windowScale = 16;
					} else {
						windowScale = 15;
					}
					
					$rootScope.$broadcast('screenSize:onHeightChange', {
						newHeight: windowHeight,
						newScale: windowScale
					});
					
					scope.$digest();
				};
				
				initialize();
			}
		};
	}]);
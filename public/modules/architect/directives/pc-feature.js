'use strict';

var architectModule = angular.module('architect');

// feature-card directive
architectModule
	.directive('pcFeature', function(){
		return {
			restrict: 'A',
			templateUrl: '../modules/architect/views/pc-feature.html'
		};
	})
	.directive('cardLogo', ['$rootScope', function($rootScope){
		return {
			restrict: 'A',
			templateUrl: '../modules/architect/views/card-logo.html'
		};
	}])
	.directive('cardHeader', function(){
		return {
			restrict: 'A',
			templateUrl: '../modules/architect/views/card-header.html'
		};
	})
	.directive('cardDescription', function(){
		return {
			restrict: 'A',
			templateUrl: '../modules/architect/views/card-description.html'
		};
	})
	.directive('cardModifiers', function(){
		return {
			restrict: 'A',
			templateUrl: '../modules/architect/views/card-modifiers.html'
		};
	})
	.directive('cardBenefit', function(){
		return {
			restrict: 'A',
			templateUrl: '../modules/architect/views/card-benefit.html'
		};
	})
	.directive('cardFooter', function(){
		return {
			restrict: 'A',
			templateUrl: '../modules/architect/views/card-footer.html'
		};
	})
	.directive('cardAction', function(){
		return {
			restrict: 'A',
			templateUrl: '../modules/architect/views/card-action.html',
			scope: {
				cardAction: '='
			}
		};
	})
	.directive('cardActionIcon', function(){
		return {
			restrict: 'A',
			templateUrl: '../modules/architect/views/card-action-icon.html'
		};
	})
	.directive('cardActionTitle', function(){
		return {
			restrict: 'A',
			templateUrl: '../modules/architect/views/card-action-title.html'
		};
	})
	.directive('cardActionKeywords', function(){
		return {
			restrict: 'A',
			templateUrl: '../modules/architect/views/card-action-keywords.html'
		};
	})
	.directive('cardActionPrompt', function(){
		return {
			restrict: 'A',
			templateUrl: '../modules/architect/views/card-action-prompt.html'
		};
	})
	.directive('cardActionEffect', function(){
		return {
			restrict: 'A',
			templateUrl: '../modules/architect/views/card-action-effect.html'
		};
	})
	.directive('cardActionAttack', function(){
		return {
			restrict: 'A',
			templateUrl: '../modules/architect/views/card-action-attack.html'
		};
	})
	.directive('cardActionDefense', function(){
		return {
			restrict: 'A',
			templateUrl: '../modules/architect/views/card-action-defense.html'
		};
	})
	.directive('elasticTextarea', ['$timeout', function($timeout){
			return{
				restrict: 'A',
				link: function(scope, element, attrs){
					
					var resizeArea = function(){
						setTimeout(
							function(){
								element[0].style.height = element[0].scrollHeight + 'px';
							},
						25);
					};
					
					scope.$watch(
						function(){
							return element[0].scrollHeight;
						},
						function(newValue, oldValue){
							if(newValue !== oldValue){
								resizeArea();
							}
						}
					);
					
					resizeArea();
				}
			};
		}
	])
	.directive('fitContent', function(){
		return {
			restrict: 'A',
			link: function(scope, element, attrs){
				
				var reduceText = function(){
					setTimeout(
						function(){
							var fontSize = parseInt(element.css('font-size'));
							console.log('Measure: '+element[0].offsetHeight+' / ' + element.parent()[0].offsetHeight);
							while( element[0].offsetHeight > element.parent()[0].offsetHeight && fontSize >= 6 ){
								fontSize--;
								element.css('font-size', fontSize + 'px' );
								console.log('Reducing: '+element[0].offsetHeight+' / ' + parseInt(element.css('font-size')));
							}
						},
					25);
				};
				
				scope.$watch(
					function(){
						return element[0].offsetHeight;
					},
					function(newValue, oldValue){
						if(newValue > oldValue){
							reduceText();
						}
					}
				);
				
				element.css('font-size', '16px');
				reduceText();
			}
		};
	});
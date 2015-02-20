'use strict';

var architectModule = angular.module('architect');

// feature-card directive
architectModule
	.directive('cardPcSummary', function(){
		return {
			restrict: 'A',
			replace: true,
			templateUrl: '../modules/player/views/card-pc-summary.html'
		};
	})
	.directive('cardCampaignSummary', function(){
		return {
			restrict: 'A',
			templateUrl: '../modules/campaign/views/card-campaign-summary.html'
		};
	})
	.directive('cardPc1', function(){
		return {
			restrict: 'A',
			templateUrl: '../modules/player/views/card-pc-1.html'
		};
	})
	.directive('cardPc2', function(){
		return {
			restrict: 'A',
			templateUrl: '../modules/player/views/card-pc-2.html'
		};
	})
	.directive('cardPc3', function(){
		return {
			restrict: 'A',
			templateUrl: '../modules/player/views/card-pc-3.html'
		};
	})
	.directive('diceDropdown', function(){
		return {
			restrict: 'A',
			templateUrl: '../modules/player/views/dice-dropdown.html',
			scope: {
				ability: '='
			}
		};
	})
	.directive('stopEvent', function(){
		return{
			restrict: 'A',
			link: function(scope, element, attr){
				var _pressEvents = 'touchstart mousedown';
				element.on(_pressEvents, function(event){
					event.stopPropagation();
				});
			}
		};
	})
	.directive('stopClick', function(){
		return{
			restrict: 'A',
			link: function(scope, element, attr){
				element.on('click', function(event){
					event.stopPropagation();
				});
			}
		};
	});
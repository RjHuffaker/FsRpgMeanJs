'use strict';

var cardsModule = angular.module('cards');

// feature-card directive
cardsModule
	.directive('cardLayout', function(){
		return {
			restrict: 'A',
			templateUrl: '../modules/cards/views/card-layout.html'
		};
	})
	.directive('cardPc1', function(){
		return {
			restrict: 'A',
			templateUrl: '../modules/pcs/views/card-pc-1.html'
		};
	})
	.directive('cardPc2', function(){
		return {
			restrict: 'A',
			templateUrl: '../modules/pcs/views/card-pc-2.html'
		};
	})
	.directive('cardPc3', function(){
		return {
			restrict: 'A',
			templateUrl: '../modules/pcs/views/card-pc-3.html'
		};
	})
	.directive('stopEvent', function(){
		return{
			restrict: 'A',
			link: function(scope, element, attr){
				var _pressEvents = 'touchstart mousedown';
				element.bind(_pressEvents, function(e){
					e.stopPropagation();
				});
			}
		};
	})
	.directive('stopClick', function(){
		return{
			restrict: 'A',
			link: function(scope, element, attr){
				element.bind('click', function(e){
					e.stopPropagation();
				});
			}
		};
	});
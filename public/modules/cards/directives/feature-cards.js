'use strict';

var cardsModule = angular.module('cards');

// feature-card directive
cardsModule
	.directive('cardFeature', function () {
		return {
			restrict: 'A',
			templateUrl: '../modules/cards/views/card-feature.html'
		};
	})
	.directive('cardPc1', function () {
		return {
			restrict: 'A',
			templateUrl: '../modules/pcs/views/card-pc-1.html'
		};
	})
	.directive('cardPc2', function () {
		return {
			restrict: 'A',
			templateUrl: '../modules/pcs/views/card-pc-2.html'
		};
	})
	.directive('cardPc3', function () {
		return {
			restrict: 'A',
			templateUrl: '../modules/pcs/views/card-pc-3.html'
		};
	})
	.directive('cardTrait', function () {
		return {
			restrict: 'A',
			templateUrl: '../modules/cards/views/card-trait.html'
		};
	})
	.directive('editTrait', function () {
		return {
			restrict: 'A',
			templateUrl: '../modules/cards/views/edit-trait.html'
		};
	})
	.directive('cardFeat', function () {
		return {
			restrict: 'A',
			templateUrl: '../modules/cards/views/card-feat.html'
		};
	})
	.directive('editFeat', function () {
		return {
			restrict: 'A',
			templateUrl: '../modules/cards/views/edit-feat.html'
		};
	})
	.directive('cardAugment', function () {
		return {
			restrict: 'A',
			templateUrl: '../modules/cards/views/card-augment.html'
		};
	})
	.directive('editAugment', function () {
		return {
			restrict: 'A',
			templateUrl: '../modules/cards/views/edit-augment.html'
		};
	})
	.directive('cardItem', function () {
		return {
			restrict: 'A',
			templateUrl: '../modules/cards/views/card-item.html'
		};
	})
	.directive('editItem', function () {
		return {
			restrict: 'A',
			templateUrl: '../modules/cards/views/edit-item.html'
		};
	})
	.directive('cardMenu', function () {
		return {
			restrict: 'A',
			templateUrl: '../modules/cards/views/card-menu.html'
		};
	})
	.directive('cardAction', function () {
		return {
			restrict: 'A',
			templateUrl: '../modules/cards/views/card-action.html'
		};
	})
	.directive('editAction', function () {
		return {
			restrict: 'A',
			templateUrl: '../modules/cards/views/edit-action.html',
			scope: {
				editAction: '='
			}
		};
	})
	.directive('elastic', [
		'$timeout',
		function($timeout) {
			return{
				restrict: 'A',
				link: function($scope, element) {
					$scope.resize = function() {
						console.log('resize');
						if(element[0].scrollHeight > 0){
							return element[0].style.height = "" + element[0].scrollHeight + "px";
						}
					};
					$timeout($scope.resize, 100);
				}
			};
		}
	])
	.directive('stopEvent', function(){
		return{
			restrict: 'A',
			link: function(scope, element, attr){
				element.bind('mousedown', function(e){
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
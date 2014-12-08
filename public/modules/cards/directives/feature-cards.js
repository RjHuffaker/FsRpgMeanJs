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
	.directive('cardFeat', function () {
		return {
			restrict: 'A',
			templateUrl: '../modules/cards/views/card-feat.html'
		};
	})
	.directive('cardAugment', function () {
		return {
			restrict: 'A',
			templateUrl: '../modules/cards/views/card-augment.html'
		};
	})
	.directive('cardItem', function () {
		return {
			restrict: 'A',
			templateUrl: '../modules/cards/views/card-item.html'
		};
	})
	.directive('stopEvent', function () {
		return {
			restrict: 'A',
			link: function (scope, element, attr) {
				element.bind('mousedown', function (e) {
					e.stopPropagation();
				});
			}
		};
	});
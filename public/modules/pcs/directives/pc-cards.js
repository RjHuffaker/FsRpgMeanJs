'use strict';

var pcsModule = angular.module('pcs');

// pc-card directive
pcsModule
	.directive('pcCard', function () {
		return {
			restrict: 'A',
			templateUrl: '../modules/pcs/views/pc-card.html'
		};
	})
	.directive('pc1', function () {
		return {
			restrict: 'A',
			templateUrl: '../modules/pcs/views/pc-1.html'
		};
	})
	.directive('pc2', function () {
		return {
			restrict: 'A',
			templateUrl: '../modules/pcs/views/pc-2.html'
		};
	})
	.directive('pc3', function () {
		return {
			restrict: 'A',
			templateUrl: '../modules/pcs/views/pc-3.html'
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
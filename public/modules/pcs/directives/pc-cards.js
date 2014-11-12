'use strict';

var pcsModule = angular.module('pcs');

// pc-card-1 directive
pcsModule
	.directive('pcCard', function () {
		return {
			restrict: 'A',
			templateUrl: '../modules/pcs/views/pc-card-basic.html',
			scope: {
				card: '='
			}
		};
	})
	.directive('pcCard1', function () {
		return {
			restrict: 'A',
			templateUrl: '../modules/pcs/views/pc-card-1.html',
			scope: {
				card: '='
			}
		};
	})
	.directive('pcCard2', function () {
		return {
			restrict: 'A',
			templateUrl: '../modules/pcs/views/pc-card-2.html',
			scope: {
				card: '='
			}
		};
	})
	.directive('pcCard3', function () {
		return {
			restrict: 'A',
			templateUrl: '../modules/pcs/views/pc-card-3.html',
			scope: {
				card: '='
			}
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
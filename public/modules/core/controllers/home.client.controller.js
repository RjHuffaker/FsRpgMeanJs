'use strict';

var coreModule = angular.module('core');

// Core Controller
coreModule.controller('HomeController', ['$scope', 'Authentication', 'CardService',
	function($scope, Authentication, CardService) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
		
		// Link to data service
		$scope.CardSRVC = CardService;
		
	}
]);
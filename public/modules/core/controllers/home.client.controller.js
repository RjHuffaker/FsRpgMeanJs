'use strict';

var coreModule = angular.module('core');

// Core Controller
coreModule.controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
		
	}
]);
'use strict';

// Factory-service for providing generic game data
angular.module('core').factory('DataSRVC', [
	function($rootScope){
		var service = {};
		
		service.sexArray = [
			'---',
			'Male',
			'Female'
		];
		
		service.diceList = [
			{order: 1, name: 'd__', sides: 0, image: 'modules/core/img/d___.png'},
			{order: 2, name: 'd4', sides: 4, image: 'modules/core/img/d_04.png'},
			{order: 3, name: 'd6', sides: 6, image: 'modules/core/img/d_06.png'},
			{order: 4, name: 'd6', sides: 6, image: 'modules/core/img/d_06.png'},
			{order: 5, name: 'd8', sides: 8, image: 'modules/core/img/d_08.png'},
			{order: 6, name: 'd8', sides: 8, image: 'modules/core/img/d_08.png'},
			{order: 7, name: 'd10', sides: 10, image: 'modules/core/img/d_10.png'},
			{order: 8, name: 'd10', sides: 10, image: 'modules/core/img/d_10.png'},
			{order: 9, name: 'd12', sides: 12, image: 'modules/core/img/d_12.png'}
		];
		
		return service;
	}]);
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
		
		service.actionTypes = [
			'-',
			'Utility',
			'Close 1/1',
			'Close 2/1',
			'Close 3/1',
			'Close Area 2x2',
			'Close Area 3x3',
			'Close Area 4x4',
			'Distant 8/1',
			'Distant 12/1',
			'Distant 16/1',
			'Distant Area 8/2x2',
			'Distant Area 12/3x3',
			'Distant Area 16/4x4'
		];
		
		return service;
	}]);
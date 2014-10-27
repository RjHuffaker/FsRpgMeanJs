

// Factory-service for managing stuff
angular.module('core').factory('CardService', [
	function($http, $rootScope){
		var service = {};
		
		service.cardList = [
			{ name: 'Item 1', position: [0, 0], overlap: 0 },
			{ name: 'Item 2', position: [0, 1], overlap: 0 },
			{ name: 'Item 3', position: [0, 2], overlap: 0 },
			{ name: 'Item 4', position: [0, 3], overlap: 0 },
			{ name: 'Item 5', position: [0, 4], overlap: 0 },
			{ name: 'Item 6', position: [0, 5], overlap: 0 },
			{ name: 'Item 7', position: [0, 6], overlap: 0 },
			{ name: 'Item 8', position: [0, 7], overlap: 0 }
		];
		
		return service;
	}]);
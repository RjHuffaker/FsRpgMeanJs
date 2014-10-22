'use strict';

//Pcs service used to communicate Pcs REST endpoints
angular.module('pcs').factory('Pcs', ['$resource',
	function($resource) {
		return $resource('pcs/:pcId', {
			pcId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
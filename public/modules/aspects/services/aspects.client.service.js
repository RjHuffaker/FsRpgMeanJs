'use strict';

//Aspects service used to communicate Aspects REST endpoints
angular.module('aspects').factory('Aspects', ['$resource',
	function($resource) {
		return $resource('aspects/:aspectId', { aspectId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
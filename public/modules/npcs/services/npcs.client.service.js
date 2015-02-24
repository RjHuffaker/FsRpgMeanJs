'use strict';

//Npcs service used to communicate Npcs REST endpoints
angular.module('npcs').factory('Npcs', ['$resource',
	function($resource) {
		return $resource('npcs/:npcId', {
			npcId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
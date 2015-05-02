'use strict';

// General BREAD Factory-service.
angular.module('cards').factory('Items', ['$resource',
        function($resource){
            return $resource(
                'items/:itemId',
                {
                    itemId: '@_id'
                },
                {
                    update: {
                        method: 'PUT'
                    }
                }
            );
        }]);
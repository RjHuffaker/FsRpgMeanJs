'use strict';

// General BREAD Factory-service.
angular.module('cards').factory('Augments', ['$resource',
        function($resource){
            return $resource(
                'augments/:augmentId',
                {
                    augmentId: '@_id'
                },
                {
                    update: {
                        method: 'PUT'
                    }
                }
            );
        }]);
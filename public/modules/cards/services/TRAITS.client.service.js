'use strict';

// General BREAD Factory-service.
angular.module('cards').factory('Traits', ['$resource',
        function($resource){
            return $resource(
                'traits/:traitId',
                {
                    traitId: '@_id'
                },
                {
                    update: {
                        method: 'PUT'
                    }
                }
            );
        }]);
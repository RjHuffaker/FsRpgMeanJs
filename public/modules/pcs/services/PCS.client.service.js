'use strict';

// General BREAD Factory-service.
angular.module('decks').factory('Pcs', ['$resource',
        function($resource){
            return $resource(
                'pcs/:pcId',
                {
                    pcId: '@_id'
                },
                {
                    update: {
                        method: 'PUT'
                    }
                }
            );
        }]);
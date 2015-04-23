'use strict';

// General BREAD Factory-service.
angular.module('cards').factory('Aspects', ['$resource',
        function($resource){
            return $resource(
                'aspect/:aspectId',
                {
                    aspectId: '@_id'
                },
                {
                    update: {
                    method: 'PUT' },
                    list: {
                        url: '/aspects',
                        method: 'GET',
                        isArray: true
                    },
                    query: {
                        url: '/aspects/:deckId',
                        method: 'GET',
                        isArray: true,
                        params: {
                            deckId: '@_id'
                        }
                    }
                }
            );
        }]);
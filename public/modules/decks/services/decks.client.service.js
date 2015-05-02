'use strict';

// General BREAD Factory-service.
angular.module('decks').factory('Decks', ['$resource',
        function($resource){
            return $resource(
                'deck/:deckId',
                {
                    deckId: '@_id'
                },
                {
                    update: {
                        method: 'PUT'
                    },
                    list: {
                        url: '/decks',
                        method: 'GET',
                        isArray: true
                    },
                    query: {
                        url: '/decks/:deckType',
                        method: 'GET',
                        isArray: true,
                        params: { deckType: 'deckType' }
                    }
                }
            );
        }]);
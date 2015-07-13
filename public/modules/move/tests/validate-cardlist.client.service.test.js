'use strict';

// Factory-service for managing card-deck, card-slot and card-panel directives.
angular.module('move').factory('validateCardList', ['CoreVars', 'DeckUtils',
    function(CoreVars, DeckUtils){
        return function(cardList){
            var _refArray = DeckUtils.getRefArray(cardList);
            
            for(var i = 0; i < _refArray.length; i++){
                var _previous = cardList[_refArray[i - 1]] || null;
                var _current = cardList[_refArray[i]];
                var _next = cardList[_refArray[i + 1]] || null;
                
                var testLog = 'validate: ';
                if(_previous){
                    testLog = testLog.concat(_previous.x_coord+'/'+_previous.y_coord+'/'+_previous._id+' - ');
                } else {
                    testLog = testLog.concat('null - ');
                }
                
                testLog = testLog.concat(' '+_current.x_coord+'/'+_current.y_coord+'/'+_current._id+' - ');
                
                if(_next){
                    testLog = testLog.concat(_next.x_coord+'/'+_next.y_coord+'/'+_next._id+' - ');
                } else {
                    testLog = testLog.concat('null - ');
                }
                
                console.log(testLog);
                
            }
        };
        
    }]);
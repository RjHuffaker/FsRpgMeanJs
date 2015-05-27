'use strict';

// Directive for managing ability dice
angular.module('pcs')
    .directive('ability', ['$parse', '$rootScope', '$window', 'abilityDice', function($parse, $rootScope, $window, abilityDice){
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                
                var _ability = $parse(attrs.ability) || null;
                
                var _width;
                
                var _pressEvents = 'touchstart mousedown';
                
                var initialize = function(){
                    // prevent native drag
                    element.attr('draggable', 'false');
                    toggleListeners(true);
                    onHeightChange();
                };
                
                var toggleListeners = function(enable){
                    if (!enable)return;
                    
                    scope.$on('$destroy', onDestroy);
                    scope.$watch(attrs.ability, onAbilityChange);
                    scope.$on('screenSize:onHeightChange', onHeightChange);
                    element.on(_pressEvents, onPress);
                };
                
                var onDestroy = function(enable){
                    toggleListeners(false);
                };
                
                var getElementFontSize = function() {
                    return parseFloat(
                        $window.getComputedStyle(element[0], null).getPropertyValue('font-size')
                    );
                };
                
                var convertEm = function(value) {
                    return value * getElementFontSize();
                };
                
                var onAbilityChange = function(newVal, oldVal){
                    _ability = newVal;
                };
                
                var getAbility = function(){
                    var offset = element.offset();
                    var caret = _ability.order < 4 ? 'top-caret' : 'bottom-caret';
                    var topEdge = _ability.order < 4 ? offset.top + convertEm(3) : offset.top - convertEm(9);
                    var leftEdge = offset.left - convertEm(0.5);
                    return {
                        caret: caret,
                        topEdge: topEdge,
                        leftEdge: leftEdge,
                        ability: _ability
                    };
                };
                
                
                var onHeightChange = function(event, object){
                    if(_ability.order === abilityDice.chosenAbility.order){
                        $rootScope.$broadcast('ability:setPosition', getAbility());
                    }
                };
                
                var onPress = function(){
                    abilityDice.chooseAbility(_ability);
                    $rootScope.$broadcast('ability:onPress', getAbility());
                };
                
                initialize();
            }
        };
    }]);
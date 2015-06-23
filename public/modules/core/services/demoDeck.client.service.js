'use strict';

angular.module('core').factory('demoDeck', ['StackUtils', 'PanelUtils', function(StackUtils, PanelUtils){
    return {
        dependencies: [],
        deckType: '',
        deckSize: 3,
        cardList: [
            {
                _id: 'demoCard1',
                panelType: 'deckDemo',
                x_coord: 0,
                y_coord: 0,
                content: 'Here is a basic demonstration of a card-deck layout. While additional features may be accessed via the menu bar, this simple demo serves to show how card-objects may be manipulated by the user in much the same way as a physical deck of cards.'
            },
            {
                _id: 'demoCard2',
                panelType: 'deckDemo',
                x_coord: 15,
                y_coord: 0,
                aboveId: 'demoCard3',
                content: 'Note that the content of each card may vary, and has no relation whatsoever to its actual position. Click again to cover it back up.'
            },
            {
                _id: 'demoCard3',
                panelType: 'deckDemo',
                x_coord: 15,
                y_coord: 3,
                belowId: 'demoCard2',
                content: 'Cards may be stacked vertically. Click on an covered card to uncover it.'
            },
            {
                _id: 'demoCard4',
                panelType: 'deckDemo',
                x_coord: 30,
                y_coord: 0,
                rightId: 'demoCard5',
                content: 'Cards can also be stacked horizontally, but only if they are not already stacked vertically.'
            },
            {
                _id: 'demoCard5',
                panelType: 'deckDemo',
                x_coord: 33,
                y_coord: 0,
                leftId: 'demoCard4',
                content: 'Both vertical and horizontal stacks may be reordered as a single entity.'
            },
            {
                _id: 'demoCard6',
                panelType: 'deckDemo',
                x_coord: 48,
                y_coord: 0,
                content: 'The content of each card can also be modified by the user (TODO: add input field).'
            },
            {
                _id: 'demoCard7',
                panelType: 'deckDemo',
                x_coord: 63,
                y_coord: 0,
                content: 'More coming soon!'
            }
        ]
    };
}]);
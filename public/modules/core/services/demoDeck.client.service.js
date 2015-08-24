'use strict';

angular.module('core').factory('demoDeck', [function(){
    return {
        dependencies: [],
        deckType: '',
        deckSize: 3,
        cardList: [
            {
                _id: 'DC1',
                panelType: 'deckDemo',
                x_coord: 0,
                y_coord: 0,
                x_dim: 10,
                y_dim: 14,
                above: {
                    adjacent: null,
                    overlap: null
                },
                below: {
                    adjacent: null,
                    overlap: null
                },
                left: {
                    adjacent: null,
                    overlap: null
                },
                right: {
                    adjacent: 'DC2',
                    overlap: null
                },
                content: 'Here is a basic demonstration of a card-deck layout. While additional features may be accessed via the menu bar, this simple demo serves to show how card-objects may be manipulated by the user, much the same as you might a physical deck of cards.'
            },
            {
                _id: 'DC2',
                panelType: 'deckDemo',
                x_coord: 10,
                y_coord: 0,
                x_dim: 10,
                y_dim: 14,
                above: {
                    adjacent: null,
                    overlap: null
                },
                below: {
                    adjacent: null,
                    overlap: null
                },
                left: {
                    adjacent: 'DC1',
                    overlap: null
                },
                right: {
                    adjacent: 'DC3',
                    overlap: null
                },
                content: 'For starters, cards can be moved around freely, automatically returning to their position unless moved to a new position.'
            },
            {
                _id: 'DC3',
                panelType: 'deckDemo',
                x_coord: 20,
                y_coord: 0,
                x_dim: 10,
                y_dim: 14,
                above: {
                    adjacent: null,
                    overlap: null
                },
                below: {
                    adjacent: null,
                    overlap: null
                },
                left: {
                    adjacent: 'DC2',
                    overlap: null
                },
                right: {
                    adjacent: 'DC4',
                    overlap: null
                },
                content: 'Note that the content of each card may vary, and has no relation whatsoever to its actual position. Click again to cover it back up.'
            },
            {
                _id: 'DC4',
                panelType: 'deckDemo',
                x_coord: 30,
                y_coord: 0,
                x_dim: 10,
                y_dim: 14,
                above: {
                    adjacent: null,
                    overlap: null
                },
                below: {
                    adjacent: null,
                    overlap: null
                },
                left: {
                    adjacent: 'DC3',
                    overlap: null
                },
                right: {
                    adjacent: 'DC5',
                    overlap: null
                },
                content: 'Cards may be stacked vertically. Click on an covered card to uncover it.'
            },
            {
                _id: 'DC5',
                panelType: 'deckDemo',
                x_coord: 40,
                y_coord: 0,
                x_dim: 10,
                y_dim: 14,
                above: {
                    adjacent: null,
                    overlap: null
                },
                below: {
                    adjacent: null,
                    overlap: null
                },
                left: {
                    adjacent: 'DC4',
                    overlap: null
                },
                right: {
                    adjacent: 'DC6',
                    overlap: null
                },
                content: 'Cards can also be stacked horizontally, but only if they are not already stacked vertically.'
            },
            {
                _id: 'DC6',
                panelType: 'deckDemo',
                x_coord: 50,
                y_coord: 0,
                x_dim: 10,
                y_dim: 14,
                above: {
                    adjacent: null,
                    overlap: null
                },
                below: {
                    adjacent: null,
                    overlap: null
                },
                left: {
                    adjacent: 'DC5',
                    overlap: null
                },
                right: {
                    adjacent: 'DC7',
                    overlap: null
                },
                content: 'Both vertical and horizontal stacks may be reordered as a single entity.'
            },
            {
                _id: 'DC7',
                panelType: 'deckDemo',
                x_coord: 60,
                y_coord: 0,
                x_dim: 10,
                y_dim: 14,
                above: {
                    adjacent: null,
                    overlap: null
                },
                below: {
                    adjacent: null,
                    overlap: null
                },
                left: {
                    adjacent: 'DC6',
                    overlap: null
                },
                right: {
                    adjacent: 'DC8',
                    overlap: null
                },
                content: 'The content of each card can also be modified by the user (TODO: add input field).'
            },
            {
                _id: 'DC8',
                panelType: 'deckDemo',
                x_coord: 70,
                y_coord: 0,
                x_dim: 10,
                y_dim: 14,
                above: {
                    adjacent: null,
                    overlap: null
                },
                below: {
                    adjacent: null,
                    overlap: null
                },
                left: {
                    adjacent: 'DC7',
                    overlap: null
                },
                right: {
                    adjacent: null,
                    overlap: null
                },
                content: 'More coming soon! Recently refactored panel "getter" and "setter" methods to return a specific panel based upon its unique objectId, instead of its x/y coordinates. This should allow for more reliable and flexible stacking, including the possibility of overlapping horizontal and vertical stacks.'
            }
        ]
    };
}]);
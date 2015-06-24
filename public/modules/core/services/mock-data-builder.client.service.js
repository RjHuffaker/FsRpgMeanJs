'use strict';

angular.module('core').factory('mockDataBuilder', function() {
    var service = {};
    
    service.newMockData = function(){
        var mockData = {};
        
        mockData.aspect_1 = {
            _id: 'aspect_1_id',
            panelType: 'Aspect',
            aspectData: {
                name: 'Aspect the First',
                cardType: 'Aspect',
                cardNumber: 1
            }
        };
        
        mockData.aspect_2 = {
            _id: 'aspect_2_id',
            panelType: 'Aspect',
            aspectData: {
                name: 'Aspect the Second',
                cardType: 'Aspect',
                cardNumber: 2
            }
        };
        
        mockData.aspect_3 = {
            _id: 'aspect_3_id',
            panelType: 'Aspect',
            aspectData: {
                name: 'Aspect the Third',
                cardType: 'Aspect',
                cardNumber: 3
            }
        };
        
        mockData.aspect_4 = {
            _id: 'aspect_4_id',
            panelType: 'Aspect',
            aspectData: {
                name: 'Aspect the Fourth',
                cardType: 'Aspect',
                cardNumber: 4
            }
        };
        
        mockData.aspect_5 = {
            _id: 'aspect_5_id',
            panelType: 'Aspect',
            aspectData: {
                name: 'Aspect the Fifth',
                cardType: 'Aspect',
                cardNumber: 5
            }
        };
        
        mockData.aspect_6 = {
            _id: 'aspect_6_id',
            panelType: 'Aspect',
            aspectData: {
                name: 'Aspect the Sixth',
                cardType: 'Aspect',
                cardNumber: 6
            }
        };
        
        mockData.aspect_7 = {
            _id: 'aspect_7_id',
            panelType: 'Aspect',
            aspectData: {
                name: 'Aspect the Seventh',
                cardType: 'Aspect',
                cardNumber: 7
            }
        };
        
        mockData.aspect_8 = {
            _id: 'aspect_8_id',
            panelType: 'Aspect',
            aspectData: {
                name: 'Aspect the Eighth',
                cardType: 'Aspect',
                cardNumber: 8
            }
        };
        
        mockData.aspectDeck = {
            _id: 'aspectDeck_id',
            dependencies: [],
            cardList: [ 
                mockData.aspect_1, mockData.aspect_2,
                mockData.aspect_3, mockData.aspect_4,
                mockData.aspect_5, mockData.aspect_6,
                mockData.aspect_7, mockData.aspect_8
            ]
        };
        
        mockData.trait_1 = {
            _id: 'trait_1_id',
            panelType: 'Trait',
            traitData: {
                name: 'Trait the First',
                cardType: 'Trait',
                cardNumber: 1
            }
        };
        
        mockData.trait_2 = {
            _id: 'trait_2_id',
            panelType: 'Trait',
            traitData: {
                name: 'Trait the Second',
                cardType: 'Trait',
                cardNumber: 2
            }
        };
        
        mockData.trait_3 = {
            _id: 'trait_3_id',
            panelType: 'Trait',
            traitData: {
                name: 'Trait the Third',
                cardType: 'Trait',
                cardNumber: 3
            }
        };
        
        mockData.trait_4 = {
            _id: 'trait_4_id',
            panelType: 'Trait',
            traitData: {
                name: 'Trait the Fourth',
                cardType: 'Trait',
                cardNumber: 4
            }
        };
        
        mockData.traitDeck = {
            _id: 'traitDeck_id',
            dependencies: [
                { _id: 'aspectDeck_id' }
            ],
            cardList: [
                mockData.trait_1, mockData.trait_2,
                mockData.trait_3, mockData.trait_4
            ]
        };
        
        mockData.feat_1 = {
            _id: 'feat_1_id',
            panelType: 'Feat',
            x_coord: 0,
            y_coord: 0,
            featData: {
                name: 'Feat the First',
                cardType: 'Feat',
                cardNumber: 1
            }
        };
        
        mockData.feat_2 = {
            _id: 'feat_2_id',
            panelType: 'Feat',
            x_coord: 15,
            y_coord: 0,
            featData: {
                name: 'Feat the Second',
                cardType: 'Feat',
                cardNumber: 2
            }
        };
        
        mockData.feat_3 = {
            _id: 'feat_3_id',
            panelType: 'Feat',
            x_coord: 15,
            y_coord: 3,
            featData: {
                name: 'Feat the Third',
                cardType: 'Feat',
                cardNumber: 3
            }
        };
        
        mockData.feat_4 = {
            _id: 'feat_4_id',
            panelType: 'Feat',
            x_coord: 30,
            y_coord: 0,
            featData: {
                name: 'Feat the Fourth',
                cardType: 'Feat',
                cardNumber: 4
            }
        };
        
        mockData.feat_5 = {
            _id: 'feat_5_id',
            panelType: 'Feat',
            x_coord: 30,
            y_coord: 3,
            featData: {
                name: 'Feat the Fifth',
                cardType: 'Feat',
                cardNumber: 5
            }
        };
        
        mockData.feat_6 = {
            _id: 'feat_6_id',
            panelType: 'Feat',
            x_coord: 30,
            y_coord: 6,
            featData: {
                name: 'Feat the Sixth',
                cardType: 'Feat',
                cardNumber: 6
            }
        };
        
        mockData.feat_7 = {
            _id: 'feat_7_id',
            panelType: 'Feat',
            x_coord: 45,
            y_coord: 0,
            featData: {
                name: 'Feat the Seventh',
                cardType: 'Feat',
                cardNumber: 7
            }
        };
        
        mockData.feat_8 = {
            _id: 'feat_8_id',
            panelType: 'Feat',
            x_coord: 45,
            y_coord: 3,
            featData: {
                name: 'Feat the Eighth',
                cardType: 'Feat',
                cardNumber: 8
            }
        };
        
        mockData.feat_9 = {
            _id: 'feat_9_id',
            panelType: 'Feat',
            x_coord: 45,
            y_coord: 6,
            featData: {
                name: 'Feat the Ninth',
                cardType: 'Feat',
                cardNumber: 9
            }
        };
        
        mockData.feat_10 = {
            _id: 'feat_10_id',
            panelType: 'Feat',
            x_coord: 45,
            y_coord: 9,
            featData: {
                name: 'Feat the Tenth',
                cardType: 'Feat',
                cardNumber: 10
            }
        };
        
        mockData.featDeck = {
            _id: 'featDeck_id',
            dependencies: [],
            cardList: [
                mockData.feat_1, mockData.feat_2,
                mockData.feat_3, mockData.feat_4,
                mockData.feat_5, mockData.feat_6,
                mockData.feat_7, mockData.feat_8,
                mockData.feat_9, mockData.feat_10
            ]
        };
        
        return mockData;
    };
    
    
    
    return service;
});
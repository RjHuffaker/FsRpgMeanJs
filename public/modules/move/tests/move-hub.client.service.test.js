'use strict';

(function(){
    describe('MoveHub', function() {
        
        beforeEach(module(ApplicationConfiguration.applicationModuleName));
        
        var MoveHub, DeckUtils, PanelUtils, mockDataBuilder, mockData;
        
        beforeEach(inject(['MoveHub', function (_MoveHub_) {
            MoveHub = _MoveHub_;
        }]));
        
        beforeEach(inject(['DeckUtils', function (_DeckUtils_) {
            DeckUtils = _DeckUtils_;
        }]));
        
        beforeEach(inject(['PanelUtils', function (_PanelUtils_) {
            PanelUtils = _PanelUtils_;
        }]));
        
        beforeEach(inject(['mockDataBuilder', function (_mockDataBuilder_) {
            mockDataBuilder = _mockDataBuilder_;
        }]));
        
        beforeEach(function(){
            mockData = mockDataBuilder.newMockData();
        });
        
    });
})();
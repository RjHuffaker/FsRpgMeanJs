'use strict';

(function(){
    describe('switchHorizontal', function() {
        
        beforeEach(module(ApplicationConfiguration.applicationModuleName));
        
        var switchHorizontal, DeckUtils, validateCardList, mockDataBuilder, mockData;
        
        beforeEach(inject(['switchHorizontal', 'DeckUtils', 'mockDataBuilder', 'validateCardList',
            function (_switchHorizontal_, _DeckUtils_, _mockDataBuilder_, _validateCardList_) {
            switchHorizontal = _switchHorizontal_;
            DeckUtils = _DeckUtils_;
            mockDataBuilder = _mockDataBuilder_;
            validateCardList = _validateCardList_;
        }]));
        
        
        beforeEach(function(){
            mockData = mockDataBuilder.newMockData();
        });
        
        it('switchHorizontal(cardlist, slot, panel) should switch the positions of an adjacent slot and panel', function(){
            var cardList = mockData.featDeck.cardList;
            var slot = cardList[0];
            var slot_x_old = slot.x_coord;
            var panel = cardList[1];
            var panel_x_old = panel.x_coord;
        //    switchHorizontal(cardList, slot, panel);
        //    console.log('slot.x_coord: '+slot.x_coord+' slot_x_old: '+slot_x_old);
        //    console.log('panel.x_coord: '+panel.x_coord+' panel_x_old: '+panel_x_old);
        //    expect(slot.x_coord).toEqual(panel_x_old);
        //    expect(panel.x_coord).toEqual(slot_x_old);
        //    validateCardList(mockData.featDeck.cardList);
        });
        
    });
})();
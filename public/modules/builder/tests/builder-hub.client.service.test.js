'use strict';

(function(){
    describe('BuilderHub', function() {
        
        beforeEach(module(ApplicationConfiguration.applicationModuleName));
        
        var BuilderHub, MoveStack, MovePanel, mockDataBuilder, mockData;
        
        beforeEach(inject(['BuilderHub', function (_BuilderHub_) {
            BuilderHub = _BuilderHub_;
        }]));
        
        beforeEach(inject(['MoveStack', function (_MoveStack_) {
            MoveStack = _MoveStack_;
        }]));
        
        beforeEach(inject(['MovePanel', function (_MovePanel_) {
            MovePanel = _MovePanel_;
        }]));
        
        beforeEach(inject(['mockDataBuilder', function (_mockDataBuilder_) {
            mockDataBuilder = _mockDataBuilder_;
        }]));
        
        beforeEach(function(){
            mockData = mockDataBuilder.newMockData();
        });
        
        it('toggleCardLock(panel, cardList) should toggle the panel.locked boolean in the cardList', function(){
            MoveStack.setCardList(mockData.traitDeck.cardList);
            
            BuilderHub.toggleCardLock(mockData.trait_1, mockData.traitDeck.cardList);
            expect(mockData.traitDeck.cardList[0].locked).toBe(true);
            
            BuilderHub.toggleCardLock(mockData.trait_1, mockData.traitDeck.cardList);
            expect(mockData.traitDeck.cardList[0].locked).toBe(false);
        });
        
        it('findDependency(dependency, resource) should return the index of a dependency within resource.dependencies, or -1', function(){
            expect(BuilderHub.findDependency(mockData.aspectDeck, mockData.traitDeck)).toEqual(0);
            expect(BuilderHub.findDependency(mockData.featDeck, mockData.traitDeck)).toEqual(-1);
        });
        
        it('toggleDependency(dependency, resource) should add or remove the dependency from resource.dependencies', function(){
            BuilderHub.toggleDependency(mockData.aspectDeck, mockData.traitDeck);
            expect(mockData.traitDeck.dependencies.length).toEqual(0);
            BuilderHub.toggleDependency(mockData.aspectDeck, mockData.traitDeck);
            expect(mockData.traitDeck.dependencies[0]).toEqual(mockData.aspectDeck);
        });
        
        // TODO changeAspect
        
    });
})();
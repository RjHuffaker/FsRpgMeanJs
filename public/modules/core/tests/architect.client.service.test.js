'use strict';

(function(){
    describe('Architect', function() {
        
        beforeEach(module(ApplicationConfiguration.applicationModuleName));
        
        var Architect, CoreStack, CorePanel, mockDataBuilder, mockData;
        
        beforeEach(inject(['Architect', function (_Architect_) {
            Architect = _Architect_;
        }]));
        
        beforeEach(inject(['CoreStack', function (_CoreStack_) {
            CoreStack = _CoreStack_;
        }]));
        
        beforeEach(inject(['CorePanel', function (_CorePanel_) {
            CorePanel = _CorePanel_;
        }]));
        
        beforeEach(inject(['mockDataBuilder', function (_mockDataBuilder_) {
            mockDataBuilder = _mockDataBuilder_;
        }]));
        
        beforeEach(function(){
            mockData = mockDataBuilder.newMockData();
        });
        
        it('toggleCardLock(panel, cardList) should toggle the panel.locked boolean in the cardList', function(){
            CoreStack.setCardList(mockData.traitDeck.cardList);
            
            Architect.toggleCardLock(mockData.trait_1, mockData.traitDeck.cardList);
            expect(mockData.traitDeck.cardList[0].locked).toBe(true);
            
            Architect.toggleCardLock(mockData.trait_1, mockData.traitDeck.cardList);
            expect(mockData.traitDeck.cardList[0].locked).toBe(false);
        });
        
        it('findDependency(dependency, resource) should return the index of a dependency within resource.dependencies, or -1', function(){
            expect(Architect.findDependency(mockData.aspectDeck, mockData.traitDeck)).toEqual(0);
            expect(Architect.findDependency(mockData.featDeck, mockData.traitDeck)).toEqual(-1);
        });
        
        it('toggleDependency(dependency, resource) should add or remove the dependency from resource.dependencies', function(){
            Architect.toggleDependency(mockData.aspectDeck, mockData.traitDeck);
            expect(mockData.traitDeck.dependencies.length).toEqual(0);
            Architect.toggleDependency(mockData.aspectDeck, mockData.traitDeck);
            expect(mockData.traitDeck.dependencies[0]).toEqual(mockData.aspectDeck);
        });
        
        // TODO changeAspect
        
    });
})();
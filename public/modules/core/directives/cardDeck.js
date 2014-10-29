angular.module('core')
	.directive('deckList', ['CardService', function (CardService) {
		'use strict';
		return {
			restrict: 'EAC',
			link: function( scope, element, attrs ) {
				
			}
		};
	}])
	.directive('cardPanel', function(CardService, $document){
		'use strict';
		return {
			restrict: 'C',
			scope: {
				card: '='
			},
			link: function(scope, element, attr) {
				
				var startX = 0,
					currentX = 0;
				element.css({
					cursor: 'move'
				});

				function mousemove(event){
					if (element.hasClass('card-moving')){
						currentX = event.clientX - startX;
						element.css({
							left: currentX + 'px'
						});
						if(currentX < 0){
							
						} else if (currentX > 0){
							
						}
						console.log(currentX);
						
					}
				}
				
				function mouseup(){
					console.log('mouseup');
					element.removeClass('card-moving');
					if (currentX < 225){
						toggleOverlap(scope.card);
					}
					element.css({
						left: '0px'
					});
					startX = 0;
					currentX = 0;
					$document.off('mousemove', mousemove);
					$document.off('mouseup', mouseup);
				}
				
				function toggleOverlap(card){
					CardService.cardList[card].overlap = !CardService.cardList[card].overlap;
				};
				
				function toggleInvisible(card){
					CardService.cardList[card].invisible = !CardService.cardList[card].invisible;
				}
				
				element.on('mousedown', function(event){
					// Prevent default dragging of selected content
					element.addClass('card-moving');
					startX = event.clientX;
					
					event.preventDefault();
					$document.on('mousemove', mousemove);
					$document.on('mouseup', mouseup);
					
				});
			}
		};
	});
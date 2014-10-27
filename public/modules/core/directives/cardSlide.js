

// 
angular.module('core')
	.directive('cardSlide', ['CardService', function (CardService) {
		return {
			restrict: 'EAC',
			link: function( scope, element, attrs ) {
				scope.toggleOverlap = function(card){
					CardService.cardList[card].overlap = 1 - CardService.cardList[card].overlap;
				}
			}
		};
	}])
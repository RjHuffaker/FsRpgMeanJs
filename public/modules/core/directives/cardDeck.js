angular.module('core')
	.directive('cardPanel', ['$document', '$parse', '$rootScope', 'CardService', function($document, $parse, $rootScope, CardService){
		'use strict';
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				
				var _startX, _startY, _startCol,
					_mouseX, _mouseY, _mouseCol,
					_cardX, _cardY, _cardCol,
					_offsetX, _offsetY, _width;
				
				var _card = $parse(attrs.card) || null;
				var _index = $parse(attrs.index) || null;
				
				var _hasTouch = ('ontouchstart' in document.documentElement);
				var _pressEvents = 'touchstart mousedown';
				var _moveEvents = 'touchmove mousemove';
				var _releaseEvents = 'touchend mouseup';
				
				var _pressTimer = null;

				var initialize = function () {
					element.attr('draggable', 'false'); // prevent native drag
					toggleListeners(true);
				};
				
				var toggleListeners = function (enable) {
					// remove listeners
					
					if (!enable)return;
					// add listeners.
					scope.$watch(attrs.index, onIndexChange);
					scope.$watch(attrs.card, onCardChange);
					scope.$on('$destroy', onDestroy);
					element.on(_pressEvents, onPress);
					if(! _hasTouch){
						element.on('mousedown', function(){ return false;}); // prevent native drag
					}
				};
				var onDestroy = function (enable) {
					toggleListeners(false);
				};
				
				var onIndexChange = function(newVal, oldVal){
					_index = newVal;
				};
				
				var onCardChange = function(newVal, oldVal){
					_card = newVal;
				};
				
				element.css({
					cursor: 'move'
				});
				
				 // When the element is clicked start the drag behaviour
				var onPress = function(event) {
					
					// Disable press events until current press event is resolved
					$document.off(_pressEvents, onPress);
					
					// Small delay for touch devices to allow for native window scrolling
					if(_hasTouch){
						cancelPress();
						_pressTimer = setTimeout(function(){
							cancelPress();
							onLongPress(event);
						}, 100);
						
						$document.on(_moveEvents, cancelPress);
						$document.on(_releaseEvents, cancelPress);
					}else{
						onLongPress(event);
					}

				};
				
				var cancelPress = function() {
					clearTimeout(_pressTimer);
					$document.off(_moveEvents, cancelPress);
					$document.off(_releaseEvents, cancelPress);
					$document.on(_pressEvents, onPress);
				};
				
				var onLongPress = function(event){
					event.preventDefault();
					element.addClass('dragging');
					element.parent().addClass('dragging');
					
					_startX = (event.pageX || event.originalEvent.touches[0].pageX);
					_startY = (event.pageY || event.originalEvent.touches[0].pageY);
					
					_offsetX = event.offsetX;
					_offsetY = event.offsetY;
					
					getColumnOffset(_card.index);
					
					_width = element[0].offsetWidth;
					_startCol = getColumnOffset(_card.index);
					
					$document.on(_moveEvents, onMove);
					$document.on(_releaseEvents, onRelease);
				};
				
				var onMove = function(event){
					
					_mouseX = (event.pageX || event.originalEvent.touches[0].pageX);
					_mouseY = (event.pageY || event.originalEvent.touches[0].pageY);
					
					_mouseCol = getColumnOffset(_card.index);
					_cardCol = _mouseCol - _startCol;
					
					_cardX = _mouseX - _startX - _cardCol;
					_cardY = _mouseY - _startY;
					
					moveCard(_cardX, _cardY);
					
					if(_card.overlap){
						if(_cardX + _offsetX < 225){
							shiftLeft();
						} else if (_cardX + _offsetX > 250){
							shiftRight();
						}
					} else {
						if(_cardX + _offsetX < 0){
							shiftLeft();
						} else if (_cardX + _offsetX > _width){
							shiftRight();
						}
					}
				};
				
				var onRelease = function(){
					event.preventDefault();
					if(_cardX > -_width){
						if(_cardX < _width){
							toggleOverlap();
						}
					}
					
					element.removeClass('dragging');
					element.parent().removeClass('dragging');
					moveCard(0, 0);
					
					$document.off(_moveEvents, onMove);
					$document.off(_releaseEvents, onRelease);
				};
				
				var column;
				
				function getColumnOffset(index){
					var column = 0;
					for(var i = 0; i < index; i++){
						if(CardService.cardList[i].overlap){
							column += 25;
						} else {
							column += 250;
						}
					}
					return column;
				}
				
				function shiftLeft(){
					element.parent().parent().removeClass('slide-left');
					element.parent().parent().addClass('slide-right');
					$rootScope.$broadcast('cardDeck:onCardMoved', {
						oldIndex: _index,
						newIndex: _index - 1
					});
				}
				
				function shiftRight(){
					element.parent().parent().removeClass('slide-right');
					element.parent().parent().addClass('slide-left');
					$rootScope.$broadcast('cardDeck:onCardMoved', {
						oldIndex: _index,
						newIndex: _index + 1
					});
				}
				
				function moveCard(x, y){
					element.css({
						left: x + 'px',
						top: y + 'px'
					});
				}
				
				function toggleOverlap(){
					if(_card.index !== 0){
			//			CardService.toggleOverlap(_index);
					}
				}
				
				initialize();
				
			}
		};
	}])
	.directive('cardSlot', ['CardService', function(CardService){
		'use strict';
		return {
			restrict: 'A',
			link: function(scope, element, attr) {
				
			}
		};
	}]);
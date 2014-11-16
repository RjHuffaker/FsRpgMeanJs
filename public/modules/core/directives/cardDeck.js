'use strict';

angular.module('core')
	.directive('cardPanel', ['$document', '$parse', '$rootScope', function($document, $parse, $rootScope){
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				
				var _startX, _startY, 
					_mouseX, _mouseY,
					_moveX, _moveY,
					_cardX, _cardY,
					_startCol, _mouseCol, _cardCol,
					_offsetX, _offsetY, _width;
					
				var _moved = false;
				
				var _card = $parse(attrs.card) || null;
				
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
					
					_moved = false;
					
					_width = element[0].offsetWidth;
					_startCol = _card.column;
					
					$document.on(_moveEvents, onMove);
					$document.on(_releaseEvents, onRelease);
				};
				
				var onMove = function(event){
					
					_mouseX = (event.pageX || event.originalEvent.touches[0].pageX);
					_mouseY = (event.pageY || event.originalEvent.touches[0].pageY);
					
					_mouseCol = _card.column;
					_cardCol = _mouseCol - _startCol;
					
					_moveX = _mouseX - _startX;
					_moveY = _mouseY - _startY;
					
					_cardX = _moveX - _cardCol;
					_cardY = _moveY;
					
					moveCard(_cardX, _cardY);
					
					if(_card.overlap){
						if(_cardX + _offsetX < 225){
							if(_moveX < 0){
								shiftLeft();
								_moved = true;
							}
						} else if (_cardX + _offsetX > 250){
							if(_moveX > 0){
								shiftRight();
								_moved = true;
							}
						}
					} else {
						if(_cardX + _offsetX < 0){
							shiftLeft();
							_moved = true;
						} else if (_cardX + _offsetX > 250){
							shiftRight();
							_moved = true;
						}
					}
				};
				
				var onRelease = function(){
					event.preventDefault();
					if(!_moved){
						toggleOverlap();
					}
					
					element.removeClass('dragging');
					element.parent().removeClass('dragging');
					moveCard(0, 0);
					
					$document.off(_moveEvents, onMove);
					$document.off(_releaseEvents, onRelease);
				};
				
				function shiftLeft(){
					$rootScope.$broadcast('cardDeck:shiftLeft', {
						index: _card.index
					});
				}
				
				function shiftRight(){
					$rootScope.$broadcast('cardDeck:shiftRight', {
						index: _card.index
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
						$rootScope.$broadcast('cardDeck:toggleOverlap', {
							index: _card.index
						});
					}
				}
				
				initialize();
				
			}
		};
	}]);
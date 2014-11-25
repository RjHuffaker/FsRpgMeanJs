'use strict';

angular.module('core')
	.directive('cardPanel', ['$document', '$parse', '$rootScope', function($document, $parse, $rootScope){
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				
				var _startX, _startY, 
					_mouseX, _mouseY,
					_moveX = 0, _moveY = 0,
					_panelX, _panelY,
					_startCol, _mouseCol, _panelCol,
					_startRow, _mouseRow, _panelRow;
					
				var _shifted = false;
				
				var _panel = $parse(attrs.card) || null;
				
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
					_panel = newVal;
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
					
					_shifted = false;
					
					_startX = (event.pageX || event.originalEvent.touches[0].pageX);
					_startY = (event.pageY || event.originalEvent.touches[0].pageY);
					
					_startCol = _panel.x_coord;
					_startRow = _panel.y_coord;
					
					$document.on(_moveEvents, onMove);
					$document.on(_releaseEvents, onRelease);
					
					$rootScope.$broadcast('cardDeck:onLongPress', {
						panel: _panel
					});
					
				};
				
				var onMove = function(event){
					
					_mouseX = (event.pageX || event.originalEvent.touches[0].pageX);
					_mouseY = (event.pageY || event.originalEvent.touches[0].pageY);
					
					_mouseCol = _panel.x_coord;
					_mouseRow = _panel.y_coord;
					
					_panelCol = _mouseCol - _startCol;
					_panelRow = _mouseRow - _startRow;
					
					_moveX = _mouseX - _startX;
					_moveY = _mouseY - _startY;
					
					_panelX = _moveX - _panelCol;
					_panelY = _moveY - _panelRow;
					
					moveCard(_panelX, _panelY);
					
					$rootScope.$broadcast('cardDeck:onMove', {
						mouseX: _mouseX,
						mouseY: _mouseY,
						moveX: _moveX,
						moveY: _moveY,
						panel: _panel
					});
				};
				
				var onRelease = function(){
					event.preventDefault();
					
					element.removeClass('dragging');
					element.parent().removeClass('dragging');
					moveCard(0, 0);
					
					$rootScope.$broadcast('cardDeck:onRelease', {
						panel: _panel
					});
					
					$document.off(_moveEvents, onMove);
					$document.off(_releaseEvents, onRelease);
				};
				
				function moveCard(x, y){
					element.css({
						left: x + 'px',
						top: y + 'px'
					});
				}
				
				initialize();
				
			}
		};
	}])
	.directive('cardSlot', ['$document', '$parse', '$rootScope', function($document, $parse, $rootScope){
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
			
				var _offset;
				
				var _slot = $parse(attrs.card) || null;
				
				var x_index = -1, y_index = -1;
				
				var initialize = function () {
					toggleListeners();
					_offset = element.offset();
				};
				
				var toggleListeners = function () {
					scope.$watch(attrs.card, onCardChange);
					scope.$on('cardDeck:onLongPress', onLongPress);
					scope.$on('cardDeck:onMove', onMove);
					scope.$on('cardDeck:onRelease', onRelease);
				};
				
				var onCardChange = function(newVal, oldVal){
					_slot = newVal;
				};
				
				var onLongPress = function(event, object){
					x_index = object.panel.x_index;
					y_index = object.panel.y_index;
				};
				
				var onMove = function(event, object){
					if(isAbove(object.mouseX, object.mouseY)){
						if(!element.hasClass('cardMoving')){
							shiftUp(object.panel);
						}
					}
					
					if(isBelow(object.mouseX, object.mouseY)){
						if(!element.hasClass('cardMoving')){
							shiftDown(object.panel);
						}
					}
					
					if(isBetween(object.mouseX, object.mouseY)){
						if(!element.hasClass('cardMoving')){
							if(_slot.x_index < object.panel.x_index){
								shiftLeft(object.panel);
							} else if(_slot.x_index > object.panel.x_index){
								shiftRight(object.panel);
							}
						}
					}
				};
				
				var onRelease = function(event, object){
					if(_slot.x_index === object.panel.x_index && _slot.y_index === object.panel.y_index){
						if(_slot.x_index === x_index && _slot.y_index === y_index){
							$rootScope.$broadcast('cardDeck:toggle_X_Overlap', {
								card: object.panel
							});
							x_index = -1;
							y_index = -1;
						}
					}
				};
				
				var shiftUp = function(card){
					setMotion();
					$rootScope.$broadcast('cardDeck:shiftUp', {
						card: card
					});
				};
				
				var shiftDown = function(card){
					setMotion();
					$rootScope.$broadcast('cardDeck:shiftDown', {
						card: card
					});
				};
				
				var shiftLeft = function(card){
					setMotion();
					$rootScope.$broadcast('cardDeck:shiftLeft', {
						card: card
					});
				};
				
				var shiftRight = function(card){
					setMotion();
					$rootScope.$broadcast('cardDeck:shiftRight', {
						card: card
					});
				};
				
				var setMotion = function(){
					element.addClass('cardMoving');
					setTimeout (
						function () {
							element.removeClass('cardMoving');
						},
					500);
				};
				
				var isAbove = function(mouseX, mouseY){
					_offset = element.offset();
					var leftEdge = _offset.left;
					var rightEdge = leftEdge + 250;
					var topEdge = _offset.top;
					
					if(_slot.x_overlap){
						leftEdge = _offset.left + 225;
					}
					return mouseX >= leftEdge && mouseX <= rightEdge && mouseY < topEdge;
				};
				
				var isBelow = function(mouseX, mouseY){
					_offset = element.offset();
					var leftEdge = _offset.left;
					var rightEdge = leftEdge + 250;
					var bottomEdge = _offset.top + 350;
					
					if(_slot.x_overlap){
						leftEdge = _offset.left + 225;
					}
					return mouseX >= leftEdge && mouseX <= rightEdge && mouseY > bottomEdge;
				};
				
				var isBetween = function(mouseX, mouseY){
					_offset = element.offset();
					var leftEdge = _offset.left;
					var rightEdge = leftEdge + 250;
					var topEdge = _offset.top;
					var bottomEdge = topEdge + 350;
					
					if(_slot.x_overlap){
						leftEdge = _offset.left + 225;
					}
					
					return mouseX >= leftEdge && mouseX <= rightEdge && mouseY >= topEdge && mouseY <= bottomEdge;
				};
				
				initialize();
				
			}
		};
	}]);
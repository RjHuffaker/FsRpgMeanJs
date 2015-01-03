'use strict';

var cardsModule = angular.module('cards');

// Directive for managing card decks.
cardsModule
	.directive('cardPanel', ['$document', '$parse', '$rootScope', function($document, $parse, $rootScope){
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				
				var _startX, _startY, 
					_mouseX, _mouseY,
					_moveX, _moveY,
					_panelX, _panelY,
					_startCol, _mouseCol, _panelCol,
					_startRow, _mouseRow, _panelRow;
				
				var _stacked = false;
				
				var _panel = $parse(attrs.card) || null;
				
				var _hasTouch = ('ontouchstart' in document.documentElement);
				var _pressEvents = 'touchstart mousedown';
				var _moveEvents = 'touchmove mousemove';
				var _releaseEvents = 'touchend mouseup';
				
				var _pressTimer = null;

				var initialize = function(){
					// prevent native drag
					element.attr('draggable', 'false');
					toggleListeners(true);
				};
				
				var toggleListeners = function(enable){
					// remove listeners
					if (!enable)return;
					
					// add listeners.
					scope.$watch(attrs.card, onCardChange);
					scope.$on('$destroy', onDestroy);
					scope.$on('cardPanel:onPressCard', onPressCard);
					scope.$on('cardPanel:onMoveCard', onMoveCard);
					scope.$on('cardPanel:onReleaseCard', onReleaseCard);
					scope.$on('cardDeck:onMouseLeave', onMouseLeave);
					element.on(_pressEvents, onPress);
					
					// prevent native drag
					if(! _hasTouch){
						console.log('touchy-touchy');
						element.on('mousedown', function(){
							return false;
						});
					}
				};
				
				var onDestroy = function(enable){
					toggleListeners(false);
				};
				
				var onCardChange = function(newVal, oldVal){
					_panel = newVal;
				};
				
				element.css({
					cursor: 'move'
				});
				
				 // When the element is clicked start the drag behaviour
				var onPress = function(event){
					
					// Disable press events until current press event is resolved
					$document.off(_pressEvents, onPress);
					
					// Small delay for touch devices to allow for native window scrolling
					if(_hasTouch){
						console.log(event);
						cancelPress();
						_pressTimer = setTimeout(function(){
							cancelPress();
							console.log('touchy-longpress');
							onLongPress(event);
						}, 100);
						
						$document.on(_moveEvents, cancelPress);
						$document.on(_releaseEvents, cancelPress);
					}else{
						onLongPress(event);
					}

				};
				
				var cancelPress = function(){
					clearTimeout(_pressTimer);
					$document.off(_moveEvents, cancelPress);
					$document.off(_releaseEvents, cancelPress);
				};
				
				// PRESS
				// Primary "press" function
				var onLongPress = function(event){
					event.preventDefault();
					
					_startX = (event.pageX || event.originalEvent.touches[0].pageX);
					_startY = (event.pageY || event.originalEvent.touches[0].pageY);
					
					_moveX = 0;
					_moveY = 0;
					
					_startCol = _panel.x_coord;
					_startRow = _panel.y_coord;
					
					$document.on(_moveEvents, onMove);
					$document.on(_releaseEvents, onRelease);
					
					$rootScope.$broadcast('cardPanel:onPressCard', {
						startX: _startX,
						startY: _startY,
						panel: _panel
					});
				};
				
				// Adds 'dragging' class to card currently pressed and any overlapping cards
				var onPressCard = function(event, object){
					if(_panel.x_index === object.panel.x_index){
						if(_panel.y_index === object.panel.y_index){
							element.addClass('dragging');
							element.parent().addClass('dragging');
							_stacked = false;
						} else if(object.panel.y_overlap && _panel.y_index >= object.panel.y_index){
							element.addClass('dragging');
							element.parent().addClass('dragging');
							_stacked = true;
						}
					}
				};
				
				// MOVE
				// Primary "move" function
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

					$rootScope.$broadcast('cardPanel:onMoveCard', {
						mouseX: _mouseX,
						mouseY: _mouseY,
						moveX: _moveX,
						moveY: _moveY,
						panelX: _panelX,
						panelY: _panelY,
						panel: _panel
					});
				};
				
				// Callback function to move a single card or each card in a vertical stack
				var onMoveCard = function(event, object){
					if(_panel.x_index === object.panel.x_index){
						if(_panel.y_index === object.panel.y_index){
							element.css({
								left: object.panelX + 'px',
								top: object.panelY + 'px'
							});
						} else if(_stacked && _panel.y_index > object.panel.y_index){
							element.css({
								left: object.panelX + 'px',
								top: object.panelY + 'px'
							});
						}
					}
				};
				
				// RELEASE
				// Primary "release" function
				var onRelease = function(){
					event.preventDefault();
					$document.off(_moveEvents, onMove);
					$document.off(_releaseEvents, onRelease);
					if(_moveX <= 15 && _moveX >= -15 && _moveY <= 15 && _moveY >= -15){
						$rootScope.$broadcast('cardPanel:toggleOverlap', {
							panel: _panel
						});
					}
					$rootScope.$broadcast('cardPanel:onReleaseCard', {
						panel: _panel
					});
					_stacked = false;
				};
				
				// Respond to 'onMouseLeave' event similar to onRelease, but without toggling overlap
				var onMouseLeave = function(){
					event.preventDefault();
					$document.off(_moveEvents, onMove);
					$document.off(_releaseEvents, onRelease);
					$rootScope.$broadcast('cardPanel:onReleaseCard', {
						panel: _panel
					});
				};
				
				// Return cards to their normal state
				var onReleaseCard = function(){
					element.removeClass('dragging');
					element.parent().removeClass('dragging');
					element.css({
						left: '0px',
						top: '0px'
					});
					_stacked = false;
				};
				
				initialize();
				
			}
		};
	}])
	.directive('cardSlot', ['$document', '$parse', '$rootScope', function($document, $parse, $rootScope){
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
			
				var _offset,
				leftEdge, rightEdge,
				topEdge, bottomEdge;
				
				var _slot = $parse(attrs.card) || null;
				
				var _panel = {};
				
				var x_index = -1, y_index = -1;
				
				var initialize = function () {
					toggleListeners();
					_offset = element.offset();
				};
				
				var toggleListeners = function () {
					scope.$watch(attrs.card, onCardChange);
					scope.$on('cardPanel:onPressCard', onPressCard);
					scope.$on('cardPanel:onMoveCard', onMoveCard);
					scope.$on('cardPanel:onReleaseCard', onReleaseCard);
				};
				
				var onCardChange = function(newVal, oldVal){
					_slot = newVal;
				};
				
				var onPressCard = function(event, object){
					_panel = object.panel;
				};
				
				var onMoveCard = function(event, object){
					if(isTouching(object.mouseX, object.mouseY)){
						var moveX = Math.abs(object.moveX);
						var moveY = Math.abs(object.moveY);
						if(_slot.x_index !== _panel.x_index){
							if(moveY * 2 > moveX){
								if(object.moveY < 0 && !_slot.x_overlap){
								// Moving up
									$rootScope.$broadcast('cardSlot:moveDiagonalUp', {
										slot: _slot,
										panel: _panel
									});
								} else if(object.moveY > 0 && !_slot.x_overlap){
								// Moving down
									$rootScope.$broadcast('cardSlot:moveDiagonalDown', {
										slot: _slot,
										panel: _panel
									});
								}
							} else if(moveY < moveX){
								$rootScope.$broadcast('cardSlot:moveHorizontal', {
									slot: _slot,
									panel: _panel
								});
							}
						} else if(_slot.x_index === _panel.x_index && _slot.y_index !== _panel.y_index){
							if(moveY > moveX * 2 && !object.panel.y_overlap){
								$rootScope.$broadcast('cardSlot:moveVertical', {
									slot: _slot,
									panel: _panel
								});
							}
						}
					} else if(isAbove(object.mouseX, object.mouseY)){
						if(_slot.y_index === 0){
							if(_slot.x_index !== _panel.x_index){
								$rootScope.$broadcast('cardSlot:moveDiagonalUp', {
									slot: _slot,
									panel: _panel
								});
							}
						}
					} else if(isBelow(object.mouseX, object.mouseY)){
						if(_panel.y_index !== 0){
							if(_slot.x_index !== _panel.x_index){
								$rootScope.$broadcast('cardSlot:moveDiagonalDown', {
									slot: _slot,
									panel: _panel
								});
							}
						}
					}
				};
				
				var onReleaseCard = function(event, object){
					_panel = {};
				};
				
				var isAbove = function(mouseX, mouseY){
					_offset = element.offset();
					leftEdge = _offset.left;
					rightEdge = leftEdge + 250;
					topEdge = _offset.top;
					
					return mouseX >= leftEdge && mouseX <= rightEdge && mouseY <= topEdge;
				};
				
				var isBelow = function(mouseX, mouseY){
					_offset = element.offset();
					leftEdge = _offset.left;
					rightEdge = _offset.left + 250;
					bottomEdge = _offset.top + 350;
					
					return mouseX >= leftEdge && mouseX <= rightEdge && mouseY >= bottomEdge;
				};
				
				var isLeft = function(mouseX, mouseY){
					_offset = element.offset();
					leftEdge = _offset.left;
					topEdge = _offset.top;
					bottomEdge = _offset.top + 350;
					
					return mouseX <= leftEdge && mouseY >= topEdge && mouseY <= bottomEdge;
				};
				
				var isRight = function(mouseX, mouseY){
					_offset = element.offset();
					rightEdge = _offset.left + 250;
					topEdge = _offset.top;
					bottomEdge = _offset.top + 350;
					
					return mouseX >= rightEdge && mouseY >= topEdge && mouseY <= bottomEdge;
				};
				
				var isTouching = function(mouseX, mouseY){
					_offset = element.offset();
					leftEdge = _offset.left;
					rightEdge = _offset.left + 250;
					topEdge = _offset.top;
					bottomEdge = _offset.top + 350;
					
					if(_slot.x_overlap){
						leftEdge = _offset.left + 225;
					}
					
					if(_slot.y_overlap){
						bottomEdge = _offset.top + 50;
					}
					
					return mouseX >= leftEdge && mouseX <= rightEdge && mouseY >= topEdge && mouseY <= bottomEdge;
				};
				
				initialize();
				
			}
		};
	}])
	.directive('cardDeck', ['$document', '$parse', '$rootScope', function($document, $parse, $rootScope){
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				
				var pressed = false;
				
				var initialize = function() {
					element.on('mouseleave', onMouseLeave);
					scope.$on('cardPanel:onPressCard', onPress);
					scope.$on('cardPanel:onPressStack', onPress);
					scope.$on('cardPanel:onReleaseCard', onRelease);
					scope.$on('cardPanel:onMoveCard', onMoveCard);
					scope.$on('cardPanel:onMoveStack', onMoveCard);
				};
				
				var onPress = function(){
					pressed = true;
				};
				
				var onRelease = function(){
					pressed = false;
				};
				
				var onMoveCard = function(event, object){
					var _offset = element.offset();
					var _width = element[0].offsetWidth;
					var leftEdge = _offset.left;
					var rightEdge = leftEdge + _width - 25;
					
					if(object.mouseX <= leftEdge){
						$rootScope.$broadcast('cardDeck:unstackLeft', {
							panel: object.panel
						});
					} else if(object.mouseX >= rightEdge){
						$rootScope.$broadcast('cardDeck:unstackRight', {
							panel: object.panel
						});
					}
					
				};
				
				var onMouseLeave = function(event){
					if(pressed){
						$rootScope.$broadcast('cardDeck:onMouseLeave');
					}
				};
				
				initialize();
			}
		};
	}]);
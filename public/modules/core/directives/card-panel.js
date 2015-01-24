'use strict';

var cardsModule = angular.module('core');

// Directive for managing card decks.
cardsModule
	.directive('cardPanel', ['$document', '$parse', '$rootScope', '$window', 'CardDeck', function($document, $parse, $rootScope, $window, CardDeck){
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				
				Array.min = function( array ){
					return Math.min.apply( Math, array );
				};
				
				var _startX, _startY, 
					_mouseX, _mouseY,
					_moveX, _moveY,
					_cardX, _cardY,
					_slotX, _slotY,
					_startCol, _mouseCol, _cardCol,
					_startRow, _mouseRow, _cardRow,
					_moveTimer,
					_x_dim = 15, _y_dim = 21,
					_x_tab = 3, _y_tab = 3,
					_x_cover = 12, _y_cover = 18;
				
				var _stacked = false;
				
				var _card = $parse(attrs.card) || null;
				
				var _hasTouch = ('ontouchstart' in window);
				
				var _pressEvents = 'touchstart mousedown';
				var _moveEvents = 'touchmove mousemove';
				var _releaseEvents = 'touchend mouseup';
				
				var _pressTimer = null;
				
				var initialize = function(){
					// prevent native drag
					element.attr('draggable', 'false');
					toggleListeners(true);
					setPosition();
				};
				
				var toggleListeners = function(enable){
					// remove listeners
					if (!enable)return;
					
					// add listeners.
					scope.$on('$destroy', onDestroy);
					scope.$watch(attrs.card, onCardChange);
					scope.$on('screenSize:onHeightChange', onHeightChange);
					scope.$on('cardPanel:onPressCard', onPressCard);
					scope.$on('cardPanel:onMoveCard', onMoveCard);
					scope.$on('cardPanel:onReleaseCard', onReleaseCard);
					scope.$on('cardDeck:onMouseLeave', onMouseLeave);
					scope.$watch('card.x_coord', resetPosition);
					scope.$watch('card.y_coord', resetPosition);
					element.on(_pressEvents, onPress);
					
					// prevent native drag for images
					 if(! _hasTouch && element[0].nodeName.toLowerCase() === 'img'){
						element.on('mousedown', function(){ return false;});
					}
				};
				
				var onDestroy = function(enable){
					toggleListeners(false);
				};
				
				var onCardChange = function(newVal, oldVal){
					_card = newVal;
					setPosition();
				};
				
				var getElementFontSize = function() {
					return parseFloat(
						$window.getComputedStyle(element[0], null).getPropertyValue('font-size')
					);
				};
				
				var convertEm = function(value) {
					return value * getElementFontSize();
				};
				
				
				var onHeightChange = function(event, object){
					_x_dim = convertEm(15);
					_y_dim = convertEm(21);
					_x_tab = convertEm(3);
					_y_tab = convertEm(3);
					_x_cover = convertEm(12);
					_y_cover = convertEm(18);
					
					setPosition();
				};
				
				var resetPosition = function(newVal, oldVal){
					if(element.hasClass('card-moving')){
						setPosition();
					}
				};
				
				var setPosition = function(){
					element.css({
						'height': _y_dim+'px',
						'width': _x_dim+'px',
						'top': _card.y_coord + 'em',
						'left': _card.x_coord + 'em'
					});
				};
				
				// When the element is clicked start the drag behaviour
				var onPress = function(event){
			
					// Small delay for touch devices to allow for native window scrolling
					if(_hasTouch){
						cancelPress();
						_pressTimer = setTimeout(function(){
							cancelPress();
							onLongPress(event);
						}, 100);
						
						$document.on(_moveEvents, cancelPress);
						$document.on(_releaseEvents, cancelPress);
					}else if(!_hasTouch){
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
					
					_startX = (event.pageX || event.touches[0].pageX);
					_startY = (event.pageY || event.touches[0].pageY);
					
					_moveX = 0;
					_moveY = 0;
					
					$document.on(_moveEvents, onMove);
					$document.on(_releaseEvents, onRelease);
					
					element.removeClass('card-moving');
					
					$rootScope.$broadcast('cardPanel:onPressCard', {
						startX: _startX,
						startY: _startY,
						panel: _card
					});
				};
				
				var onPressCard = function(event, object){
					
					_startCol = convertEm(_card.x_coord);
					_startRow = convertEm(_card.y_coord);
					
					var panel = object.panel;
					var panel_x = panel.x_coord;
					var panel_y = panel.y_coord;
					var panel_y_overlap = panel.y_overlap;
					
					var slot = _card;
					var slot_x = slot.x_coord;
					var slot_y = slot.y_coord;
					
					if(slot_y !== panel_y || slot_x !== panel_x){
						if(slot_x !== panel_x){
							element.addClass('card-moving');
						} else if(slot_x !== panel_x && slot_y > panel_y && panel_y_overlap){
							element.addClass('card-moving');
						} else if(slot_x === panel_x && !panel_y_overlap){
							element.addClass('card-moving');
						}
					}
				};
				
				// MOVE
				// Primary "move" function
				var onMove = function(event){
					event.preventDefault();
					
					_mouseX = (event.pageX || event.touches[0].pageX);
					_mouseY = (event.pageY || event.touches[0].pageY);
					
					_mouseCol = convertEm(_card.x_coord);
					_mouseRow = convertEm(_card.y_coord);
					
					_moveX = _mouseX - _startX;
					_moveY = _mouseY - _startY;
					
					_cardX = _moveX + _startCol - (_startCol - _mouseCol);
					_cardY = _moveY + _startRow - (_startRow - _mouseRow);
					
					element.css({
						left: _moveX + _startCol + 'px',
						top: _moveY + _startRow + 'px'
					});
					
					$rootScope.$broadcast('cardPanel:onMoveCard', {
						mouseX: _mouseX,
						mouseY: _mouseY,
						moveX: _moveX,
						moveY: _moveY,
						panelX: _cardX,
						panelY: _cardY,
						panel: _card
					});
				};
				
				// Callback function to move a single card or each card in a vertical stack
				var onMoveCard = function(event, object){
					
					var mouseX = object.mouseX;
					var mouseY = object.mouseY;
					
					var moveX = object.moveX;
					var moveY = object.moveY;
					
					var vectorX = Math.abs(object.moveX);
					var vectorY = Math.abs(object.moveY);
					
					var panel = object.panel;
					var panel_x = panel.x_coord;
					var panel_y = panel.y_coord;
					var panel_x_overlap = panel.x_overlap;
					var panel_y_overlap = panel.y_overlap;
					
					var slot = _card;
					var slot_x = slot.x_coord;
					var slot_y = slot.y_coord;
					var slot_x_overlap = slot.x_overlap;
					var slot_y_overlap = slot.y_overlap;
					
					var changeX = Math.abs(panel_x - slot_x);
					
					if(slot_x === panel_x && slot_y > panel_y && panel_y_overlap){
						element.css({
							left: (_startCol + moveX) + 'px',
							top: (_startRow + moveY) + 'px'
						});
					} else if(panel_x !== slot_x || panel_y !== slot_x){
						if(crossingEdge(mouseX, mouseY) === 'top'){
							if(changeX !== 0 && changeX <= 10){
								scope.$emit('cardSlot:moveDiagonalUp', {
									slot: slot,
									panel: panel
								});
							} else if(changeX === 0 && !panel_y_overlap){
								scope.$emit('cardSlot:moveVertical', {
									slot: slot,
									panel: panel
								});
							} else {
								scope.$emit('cardSlot:moveHorizontal', {
									slot: slot,
									panel: panel
								});
							}
						} else if(crossingEdge(mouseX, mouseY) === 'bottom'){
							if(changeX !== 0 && changeX <= 10){
								scope.$emit('cardSlot:moveDiagonalDown', {
									slot: slot,
									panel: panel
								});
							} else if(changeX === 0 && !panel_y_overlap){
								scope.$emit('cardSlot:moveVertical', {
									slot: slot,
									panel: panel
								});
							} else {
								scope.$emit('cardSlot:moveHorizontal', {
									slot: slot,
									panel: panel
								});
							}
						} else if(crossingEdge(mouseX, mouseY) === 'left' || crossingEdge(mouseX, mouseY) === 'right'){
							if(vectorY * 2 > vectorX){
								if(moveY < 0){
									scope.$emit('cardSlot:moveDiagonalUp', {
										slot: slot,
										panel: panel
									});
								} else if(moveY > 0){
									scope.$emit('cardSlot:moveDiagonalDown', {
										slot: slot,
										panel: panel
									});
								}
							} else {
								scope.$emit('cardSlot:moveHorizontal', {
									slot: slot,
									panel: panel
								});
							}
						}
					}
				};
				
				// RELEASE
				// Primary "release" function
				var onRelease = function(){
					$document.off(_moveEvents, onMove);
					$document.off(_releaseEvents, onRelease);
					$rootScope.$broadcast('cardPanel:onReleaseCard', {
						panel: _card
					});
					if(_moveX <= convertEm(1) && _moveX >= -convertEm(1) && _moveY <= convertEm(1) && _moveY >= -convertEm(1)){
						$rootScope.$broadcast('cardPanel:toggleOverlap', {
							panel: _card
						});
					}
				};
				
				// General response to "release" event
				var onReleaseCard = function(event, object){
					element.addClass('card-moving');
					setTimeout(function(){
						element.css({
							left: _card.x_coord + 'em',
							top: _card.y_coord + 'em'
						});
					}, 0);
					
					clearTimeout(_moveTimer);
					
					_moveTimer = setTimeout(function(){
						element.removeClass('card-moving');
					}, 600);
				};
				
				// Respond to 'onMouseLeave' event similar to onRelease, but without toggling overlap
				var onMouseLeave = function(){
					$document.off(_moveEvents, onMove);
					$document.off(_releaseEvents, onRelease);
					$rootScope.$broadcast('cardPanel:onReleaseCard', {
						panel: _card
					});
				};
				
				var crossingEdge = function(mouseX, mouseY){
					
					var cardOffset = element.offset();
					var panelX = cardOffset.left;
					var panelY = cardOffset.top;
					var leftEdge = _card.x_overlap ? panelX + _x_cover : panelX;
					var rightEdge = panelX + _x_dim;
					var topEdge = panelY;
					var bottomEdge = _card.y_overlap ? panelY + _y_tab : panelY + _y_dim;
					
					if(mouseX >= leftEdge && mouseX <= rightEdge && mouseY >= topEdge && mouseY <= bottomEdge){
						var left = mouseX - leftEdge;
						var right = rightEdge - mouseX;
						var top = mouseY - topEdge;
						var bottom = bottomEdge - mouseY;
						
						var edges = [left, right, top, bottom],
						closestEdge = Math.min.apply(Math.min, edges),
						edgeNames = ['left', 'right', 'top', 'bottom'],
						edgeName = edgeNames[edges.indexOf(closestEdge)];
						
						return edgeName;
					}
				};
				
				initialize();
				
			}
		};
	}]);
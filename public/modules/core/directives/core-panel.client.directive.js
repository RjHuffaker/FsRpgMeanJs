'use strict';

// Directive for managing card decks.
angular.module('core')
	.directive('corePanel', ['$document', '$parse', '$rootScope', '$window', 'Bakery', 'CoreMove', function($document, $parse, $rootScope, $window, Bakery, CoreMove){
		return {
			restrict: 'A',
			templateUrl: '../modules/core/views/core-panel.html',
			link: function(scope, element, attrs){
				
				Array.min = function(array){
					return Math.min.apply(Math, array);
				};
				
				var _startX, _startY, 
					_mouseX, _mouseY,
					_moveX, _moveY,
					_panelX, _panelY,
					_slotX, _slotY,
					_startCol, _mouseCol, _panelCol,
					_startRow, _mouseRow, _panelRow,
					_moveTimer,
					_x_dim, _y_dim,
					_x_tab, _y_tab,
					_x_cover, _y_cover;
				
				var _dropdownOpen = false;
				
				var _stacked = false;
				
				var _panel = $parse(attrs.panel) || null;
				
				var _hasTouch = ('ontouchstart' in window);
				
				var _pressEvents = 'touchstart mousedown';
				var _moveEvents = 'touchmove mousemove';
				var _releaseEvents = 'touchend mouseup';
				
				var _pressTimer = null;
				
				var initialize = function(){
					// prevent native drag
					element.attr('draggable', 'false');
					toggleListeners(true);
					$document.ready(function () {
						onHeightChange();
					});
				};
				
				var toggleListeners = function(enable){
					// remove listeners
					if (!enable)return;
					
					// add listeners
					scope.$on('$destroy', onDestroy);
					scope.$watch(attrs.panel, onCardChange);
					scope.$on('screenSize:onHeightChange', onHeightChange);
					scope.$on('corePanel:onPressCard', onPressCard);
					scope.$on('corePanel:onMoveCard', onMoveCard);
					scope.$on('corePanel:onReleaseCard', onReleaseCard);
					scope.$on('coreStack:onMouseLeave', onMouseLeave);
					scope.$on('CardsCtrl:onDropdown', onDropdown);
					scope.$on('Bakery:onDeckChange', onReleaseCard);
					scope.$watch('panel.x_coord', resetPosition);
					scope.$watch('panel.y_coord', resetPosition);
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
					_panel = newVal;
					
					element.css({
						top: '0',
						left: '-21em'
					});
					
					setTimeout(function(){
						setPosition();
				//		setOffset();
					}, 0);
				};
				
				var onDropdown = function(event, object){
					_dropdownOpen = object.isOpen;
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
					//	setOffset();
					}
				};
				
				var setPosition = function(){
					element.css({
						top: _panel.y_coord + 'em',
						left: _panel.x_coord + 'em'
					});
				};
				
				var setOffset = function(){
					var offset = Math.random()*0.2 - 0.1;
					element.css({
						'-ms-transform': 'translate('+offset+'em,'+offset+'em)',
						'-webkit-transform': 'translate('+offset+'em,'+offset+'em)',
						'transform': 'translate('+offset+'em,'+offset+'em)'
					});
				};
				
				// When the element is clicked start the drag behaviour
				var onPress = function(event){
					if(!_dropdownOpen){
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
					} else {
						$document.triggerHandler('click');
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
					
					$rootScope.$broadcast('corePanel:onPressCard', {
						startX: _startX,
						startY: _startY,
						panel: _panel
					});
				};
				
				var onPressCard = function(event, object){
					
					_startCol = convertEm(_panel.x_coord);
					_startRow = convertEm(_panel.y_coord);
					
					var panel = object.panel;
					var panel_x = panel.x_coord;
					var panel_y = panel.y_coord;
					var panel_y_overlap = panel.y_overlap;
					
					var slot = _panel;
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
					
					_mouseCol = convertEm(_panel.x_coord);
					_mouseRow = convertEm(_panel.y_coord);
					
					_moveX = _mouseX - _startX;
					_moveY = _mouseY - _startY;
					
					_panelX = _moveX + _startCol - (_startCol - _mouseCol);
					_panelY = _moveY + _startRow - (_startRow - _mouseRow);
					
					element.css({
						left: _moveX + _startCol + 'px',
						top: _moveY + _startRow + 'px'
					});
					
					$rootScope.$broadcast('corePanel:onMoveCard', {
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
					
					var slot = _panel;
					var slot_x = slot.x_coord;
					var slot_y = slot.y_coord;
					var slot_x_overlap = slot.x_overlap;
					var slot_y_overlap = slot.y_overlap;
					
					var changeX = Math.abs(panel_x - slot_x);
					var changeY = Math.abs(panel_y - slot_y);
					
					if(changeX === 0 && slot_y > panel_y && panel_y_overlap){
						if(!element.hasClass('card-moving')){	//Enables moving all cards within a stack
							element.css({
								left: (_startCol + moveX) + 'px',
								top: (_startRow + moveY) + 'px'
							});
						}
					} else if(changeX > 0 || changeY > 0){
						if(crossingEdge(mouseX, mouseY) === 'top'){
							if(vectorX > 0 && !slot_y_overlap && !slot_x_overlap && !panel_x_overlap){
								console.log('corePanel:moveDiagonalUp');
								scope.$emit('corePanel:moveDiagonalUp', {
									slot: slot,
									panel: panel
								});
							} else if(changeX === 0 && !panel_y_overlap){
								console.log('corePanel:moveVertical');
								scope.$emit('corePanel:moveVertical', {
									slot: slot,
									panel: panel
								});
							} else {
								console.log('corePanel:moveHorizontal');
								scope.$emit('corePanel:moveHorizontal', {
									slot: slot,
									panel: panel
								});
							}
						} else if(crossingEdge(mouseX, mouseY) === 'bottom'){
							if(changeX > 0 && changeX <= _x_dim){
								console.log('corePanel:moveDiagonalDown');
								scope.$emit('corePanel:moveDiagonalDown', {
									slot: slot,
									panel: panel
								});
							} else if(changeX === 0 && !panel_y_overlap){
								console.log('corePanel:moveVertical');
								scope.$emit('corePanel:moveVertical', {
									slot: slot,
									panel: panel
								});
							} else {
								console.log('corePanel:moveHorizontal');
								scope.$emit('corePanel:moveHorizontal', {
									slot: slot,
									panel: panel
								});
							}
						} else if(crossingEdge(mouseX, mouseY) === 'left' || crossingEdge(mouseX, mouseY) === 'right'){
							if(vectorY * 2 > vectorX){
								if(moveY < 0){
									console.log('corePanel:moveDiagonalUp');
									scope.$emit('corePanel:moveDiagonalUp', {
										slot: slot,
										panel: panel
									});
								} else if(moveY > 0){
									console.log('corePanel:moveDiagonalDown');
									scope.$emit('corePanel:moveDiagonalDown', {
										slot: slot,
										panel: panel
									});
								}
							} else {
								console.log('corePanel:moveHorizontal');
								scope.$emit('corePanel:moveHorizontal', {
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
					$rootScope.$broadcast('corePanel:onReleaseCard', {
						panel: _panel
					});
					if(_moveX <= convertEm(1) && _moveX >= -convertEm(1) && _moveY <= convertEm(1) && _moveY >= -convertEm(1)){
						$rootScope.$broadcast('corePanel:toggleOverlap', {
							panel: _panel
						});
					}
				};
				
				// General response to "release" event
				var onReleaseCard = function(event, object){
					element.addClass('card-moving');
					setTimeout(function(){
						setPosition();
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
					$rootScope.$broadcast('corePanel:onReleaseCard', {
						panel: _panel
					});
				};
				
				var crossingEdge = function(mouseX, mouseY){
					
					var cardOffset = element.offset();
					var slotX = cardOffset.left;
					var slotY = cardOffset.top;
					var leftEdge = _panel.x_overlap ? slotX + _x_cover : slotX;
					var rightEdge = slotX + _x_dim;
					var topEdge = slotY;
					var bottomEdge = _panel.y_overlap ? slotY + _y_tab : slotY + _y_dim;
					
				//	console.log('testing '+_panel.name+':  X '+_panel.x_overlap+':'+leftEdge+'>'+mouseX+'>'+rightEdge+'  Y '+_panel.y_overlap+':'+topEdge+'>'+mouseY+'>'+bottomEdge);
					
					if(mouseX >= leftEdge && mouseX <= rightEdge && mouseY >= topEdge && mouseY <= bottomEdge){
						var left = mouseX - leftEdge;
						var right = rightEdge - mouseX;
						var top = mouseY - topEdge;
						var bottom = bottomEdge - mouseY;
						
						var edges = [left, right, top, bottom],
						closestEdge = Math.min.apply(Math.min, edges),
						edgeNames = ['left', 'right', 'top', 'bottom'],
						edgeName = edgeNames[edges.indexOf(closestEdge)];
						
				//		console.log('crossing '+edgeName+' edge of '+_panel.name+':  X '+_panel.x_overlap+':'+leftEdge+'>'+mouseX+'>'+rightEdge+'  Y '+_panel.y_overlap+':'+topEdge+'>'+mouseY+'>'+bottomEdge);
						
						return edgeName;
					}
				};
				
				initialize();
				
			}
		};
	}]);
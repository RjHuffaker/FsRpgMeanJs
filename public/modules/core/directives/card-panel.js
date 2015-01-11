'use strict';

var cardsModule = angular.module('core');

// Directive for managing card decks.
cardsModule
	.directive('cardPanel', ['$document', '$parse', '$rootScope', '$window', function($document, $parse, $rootScope, $window){
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				
				element.css({
					cursor: 'move'
				});
				
				var _startX, _startY, 
					_mouseX, _mouseY,
					_moveX, _moveY,
					_panelX, _panelY,
					_startCol, _mouseCol, _panelCol,
					_startRow, _mouseRow, _panelRow,
					windowScale;
				
				var _stacked = false;
				
				var _panel = $parse(attrs.card) || null;
				
				var _hasTouch = ('ontouchstart' in window);
				
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
					scope.$on('$destroy', onDestroy);
					scope.$watch(attrs.card, onCardChange);
					scope.$on('screenSize:onHeightChange', onHeightChange);
					scope.$on('cardPanel:onMoveCard', onMoveCard);
					scope.$on('cardPanel:onReleaseCard', onReleaseCard);
					scope.$on('cardDeck:onMouseLeave', onMouseLeave);
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
				};
				
				var onHeightChange = function(event, object){
					windowScale = object.newScale;
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
					
					_startCol = _panel.x_coord * windowScale;
					_startRow = _panel.y_coord * windowScale;
					
					$document.on(_moveEvents, onMove);
					$document.on(_releaseEvents, onRelease);
					
					$rootScope.$broadcast('cardPanel:onPressCard', {
						startX: _startX,
						startY: _startY,
						panel: _panel
					});
				};
				
				// MOVE
				// Primary "move" function
				var onMove = function(event){
					event.preventDefault();
					
					_mouseX = (event.pageX || event.touches[0].pageX);
					_mouseY = (event.pageY || event.touches[0].pageY);
					
					_mouseCol = _panel.x_coord * windowScale;
					_mouseRow = _panel.y_coord * windowScale;
					
					_panelCol = _mouseCol - _startCol;
					_panelRow = _mouseRow - _startRow;
					
					_moveX = _mouseX - _startX;
					_moveY = _mouseY - _startY;
					
					_panelX = _moveX - _panelCol;
					_panelY = _moveY - _panelRow;
					
					element.css({
						left: _panelX + 'px',
						top: _panelY + 'px'
					});
					
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
					if(_panel.stacked && _panel.x_index === object.panel.x_index){
						if(_panel.y_index > object.panel.y_index){
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
						position: 'absolute',
						left: '0px',
						top: '0px'
					});
					_stacked = false;
				};
				
				initialize();
				
			}
		};
	}]);
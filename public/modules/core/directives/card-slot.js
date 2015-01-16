'use strict';

var cardsModule = angular.module('core');

// Directive for managing card decks.
cardsModule
	.directive('cardSlot', ['$document', '$parse', '$rootScope', function($document, $parse, $rootScope){
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				var _offset, leftEdge, rightEdge,
				topEdge, bottomEdge, windowScale,
				x_dim, y_dim, x_tab, y_tab,
				x_cover, y_cover;
				
				var _slot = $parse(attrs.card) || null;
				
				var _panel = {};
				
				var initialize = function () {
					toggleListeners(true);
					_offset = element.offset();
				};
				
				Array.min = function( array ){
					return Math.min.apply( Math, array );
				};
				
				var toggleListeners = function (enable) {
					
					// remove listeners
					if (!enable)return;
					
					// add listeners
					scope.$on('$destroy', onDestroy);
					scope.$watch(attrs.card, onCardChange);
					scope.$on('screenSize:onHeightChange', onHeightChange);
					scope.$on('cardPanel:onPressCard', onPressCard);
					scope.$on('cardPanel:onMoveCard', onMoveCard);
					scope.$on('cardPanel:onReleaseCard', onReleaseCard);
				};
				
				var onDestroy = function(enable){
					toggleListeners(false);
				};
				
				var onCardChange = function(newVal, oldVal){
					_slot = newVal;
				};
				
				var onHeightChange = function(event, object){
					windowScale = object.newScale;
					x_dim = windowScale * 10;
					y_dim = windowScale * 14;
					x_tab = windowScale * 2;
					y_tab = windowScale * 2;
					x_cover = windowScale * 8;
					y_cover = windowScale * 12;
				};
				
				var onPressCard = function(event, object){
					_panel = object.panel;
				};
				
				var onMoveCard = function(event, object){
					var moveX = Math.abs(object.moveX);
					var moveY = Math.abs(object.moveY);
					var changeX = Math.abs(_panel.x_coord - _slot.x_coord);
					
					if(_slot.x_coord !== _panel.x_coord || _slot.y_coord !== _panel.y_coord){
						if(crossingEdge(object.mouseX, object.mouseY) === '_top'){
							console.log('crossing top');
							if(changeX !== 0 && changeX <= 10){
								scope.$emit('cardSlot:moveDiagonalUp', {
									slot: _slot,
									panel: _panel
								});
							} else if(changeX === 0 && !_panel.y_overlap){
								scope.$emit('cardSlot:moveVertical', {
									slot: _slot,
									panel: _panel
								});
							} else {
								scope.$emit('cardSlot:moveHorizontal', {
									slot: _slot,
									panel: _panel
								});
							}
						} else if(crossingEdge(object.mouseX, object.mouseY) === '_bottom'){
							console.log('crossing bottom');
							if(changeX !== 0 && changeX <= 10){
								scope.$emit('cardSlot:moveDiagonalDown', {
									slot: _slot,
									panel: _panel
								});
							} else if(changeX === 0 && !_panel.y_overlap){
								scope.$emit('cardSlot:moveVertical', {
									slot: _slot,
									panel: _panel
								});
							} else {
								scope.$emit('cardSlot:moveHorizontal', {
									slot: _slot,
									panel: _panel
								});
							}
						} else if(crossingEdge(object.mouseX, object.mouseY) === '_left' || crossingEdge(object.mouseX, object.mouseY) === '_right'){
							if(moveY * 2 > moveX){
								if(object.moveY < 0){
									scope.$emit('cardSlot:moveDiagonalUp', {
										slot: _slot,
										panel: _panel
									});
								} else if(object.moveY > 0){
									scope.$emit('cardSlot:moveDiagonalDown', {
										slot: _slot,
										panel: _panel
									});
								}
							} else {
								scope.$emit('cardSlot:moveHorizontal', {
									slot: _slot,
									panel: _panel
								});
							}
						}
					}
					scope.$digest();
				};
				
				var onReleaseCard = function(event, object){
					_panel = {};
				};
				
				var crossingEdge = function(mouseX, mouseY){
					_offset = element.offset();
					leftEdge = _slot.x_overlap ? _offset.left + x_cover : _offset.left;
					rightEdge = _offset.left + x_dim;
					topEdge = _offset.top;
					bottomEdge = _slot.y_overlap ? _offset.top + y_tab : _offset.top + y_dim;
					
					if(mouseX >= leftEdge && mouseX <= rightEdge && mouseY >= topEdge && mouseY <= bottomEdge){
						var _left = mouseX - leftEdge;
						var _right = rightEdge - mouseX;
						var _top = mouseY - topEdge;
						var _bottom = bottomEdge - mouseY;
						
						var edges = [_left, _right, _top, _bottom],
						closestEdge = Math.min.apply(Math.min, edges),
						edgeNames = ['_left', '_right', '_top', '_bottom'],
						edgeName = edgeNames[edges.indexOf(closestEdge)];
						
						return edgeName;
						
					} else {
						return false;
					}
				};
				
				initialize();
				
			}
		};
	}]);
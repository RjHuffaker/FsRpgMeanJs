'use strict';

var cardsModule = angular.module('cards');

// Directive for managing card decks.
cardsModule
	.directive('cardSlot', ['$document', '$parse', '$rootScope', function($document, $parse, $rootScope){
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				var _offset, leftEdge, rightEdge,
				topEdge, bottomEdge, windowScale,
				x_dim, y_dim, x_tab, y_tab;
				
				var _slot = $parse(attrs.card) || null;
				
				var _panel = {};
				
				var x_index = -1, y_index = -1;
				
				var initialize = function () {
					toggleListeners(true);
					_offset = element.offset();
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
									scope.$emit('cardSlot:moveDiagonalUp', {
										slot: _slot,
										panel: _panel
									});
								} else if(object.moveY > 0 && !_slot.x_overlap){
								// Moving down
									scope.$emit('cardSlot:moveDiagonalDown', {
										slot: _slot,
										panel: _panel
									});
								}
							} else if(moveY < moveX){
								
								scope.$emit('cardSlot:moveHorizontal', {
									slot: _slot,
									panel: _panel
								});
							}
						} else if(_slot.x_index === _panel.x_index && _slot.y_index !== _panel.y_index){
							if(moveY > moveX * 2 && !object.panel.y_overlap){
								scope.$emit('cardSlot:moveVertical', {
									slot: _slot,
									panel: _panel
								});
							}
						}
					} else if(isAbove(object.mouseX, object.mouseY)){
						if(_slot.y_index === 0){
							if(_slot.x_index !== _panel.x_index){
								scope.$emit('cardSlot:moveDiagonalUp', {
									slot: _slot,
									panel: _panel
								});
							}
						}
					} else if(isBelow(object.mouseX, object.mouseY)){
						if(_panel.y_index !== 0){
							if(_slot.x_index !== _panel.x_index){
								scope.$emit('cardSlot:moveDiagonalDown', {
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
				
				var isAbove = function(mouseX, mouseY){
					_offset = element.offset();
					leftEdge = _offset.left;
					rightEdge = leftEdge + x_dim;
					topEdge = _offset.top;
					
					return mouseX >= leftEdge && mouseX <= rightEdge && mouseY <= topEdge;
				};
				
				var isBelow = function(mouseX, mouseY){
					_offset = element.offset();
					leftEdge = _offset.left;
					rightEdge = _offset.left + x_dim;
					bottomEdge = _offset.top + y_dim;
					
					return mouseX >= leftEdge && mouseX <= rightEdge && mouseY >= bottomEdge;
				};
				
				var isLeft = function(mouseX, mouseY){
					_offset = element.offset();
					leftEdge = _offset.left;
					topEdge = _offset.top;
					bottomEdge = _offset.top + y_dim;
					
					return mouseX <= leftEdge && mouseY >= topEdge && mouseY <= bottomEdge;
				};
				
				var isRight = function(mouseX, mouseY){
					_offset = element.offset();
					rightEdge = _offset.left + x_dim;
					topEdge = _offset.top;
					bottomEdge = _offset.top + y_dim;
					
					return mouseX >= rightEdge && mouseY >= topEdge && mouseY <= bottomEdge;
				};
				
				var isTouching = function(mouseX, mouseY){
					_offset = element.offset();
					leftEdge = _offset.left;
					rightEdge = _offset.left + x_dim;
					topEdge = _offset.top;
					bottomEdge = _offset.top + y_dim;
					
					if(_slot.x_overlap){
						leftEdge = _offset.left + x_dim;
					}
					
					if(_slot.y_overlap){
						bottomEdge = _offset.top + 50;
					}
					
					return mouseX >= leftEdge && mouseX <= rightEdge && mouseY >= topEdge && mouseY <= bottomEdge;
				};
				
				initialize();
				
			}
		};
	}]);
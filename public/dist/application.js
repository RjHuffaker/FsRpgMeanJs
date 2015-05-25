'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'fsrpg';
	var applicationModuleVendorDependencies = ['ngResource', 'ngCookies', 'ngAnimate', 'ngTouch', 'ngSanitize', 'ui.router', 'ui.bootstrap', 'ui.utils', 'btford.socket-io'];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();
'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('campaigns');

'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('cards');

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('decks');

'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('npcs');

'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('pcs');

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');

'use strict';

angular.module('campaigns').controller('CampaignsController', ['$scope', 'Socket',
	function($scope, Socket) {
		
		$scope.messages = [];
		
		$scope.users = [];
		
		var init = function(){
			$scope.name = window.user.username;
			$scope.messages.push({
				user: '',
				text: $scope.name+' has joined.'
			});
			Socket.emit('user:init', {
				name: window.user.username
			});
		};
		
		Socket.on('user:init', function(data){
			console.log(data);
			for(var message in data.messages){
				$scope.messages.push(message);
			}
			for(var user in data.users){
				$scope.users.push(user);
			}
		});
		
		Socket.on('send:message', function (message) {
			$scope.messages.push(message);
		});

		Socket.on('user:join', function (data) {
			$scope.messages.push({
				user: '',
				text: data.name + ' has joined.'
			});
			$scope.users.push(data.name);
		});

		  // add a message to the conversation when a user disconnects or leaves the room
		Socket.on('user:left', function (data) {
			$scope.messages.push({
				user: 'chatroom',
				text: data.name + ' has left.'
			});
		});

		$scope.messages = [];

		$scope.sendMessage = function () {
			if($scope.message){
				Socket.emit('send:message', {
					user: $scope.name,
					text: $scope.message
				});

				// add the message to our model locally
				$scope.messages.push({
					user: $scope.name,
					text: $scope.message
				});

				// clear message box
				$scope.message = '';
			}
		};
		
		init();
		
	}]);

'use strict';

angular.module('campaigns').factory('Campaigns', ['$stateParams', '$location', 'Authentication', '$resource', 
	function($stateParams, $location, Authentication, $resource){
		
		var Campaigns = $resource(
			'campaigns/:campaignId',
			{ campaignId: '@_id' },
			{ update: { method: 'PUT' } }
		);
		
		var service = {};
		
		service.campaign = {};
		
		service.campaignList = [];
		
		// BROWSE Campaigns
		service.browseCampaigns = function() {
			this.campaignList = Campaigns.query(
				function(response) {
					
				}
			);
		};
		
		// READ single Campaign
		service.readCampaign = function() {
			this.campaign = Campaigns.get({
				campaignId: $stateParams.campaignId
			});
		};
		
		// EDIT existing Campaign
		service.editCampaign = function() {
			var campaign = this.campaign;
			
			campaign.$update(function() {
				
			}, function(errorResponse) {
				this.error = errorResponse.data.message;
			});
		};
		
		// ADD a new Campaign
		service.addCampaign = function() {
			// Create new Campaign object
			this.campaign = new Campaigns ({
			
			});
			
			this.campaign.$save(function(response) {
				$location.path('campaign/campaigns/'+response._id+'/edit');
			}, function(errorResponse) {
				this.error = errorResponse.data.message;
			});
		};
		
		// DELETE existing Pc
		service.deleteCampaign = function(campaign) {
			if ( campaign ) { campaign.$remove();
				for (var i in this.campaigns ) {
					if (this.campaigns [i] === campaign ) {
						this.campaigns.splice(i, 1);
					}
				}
			} else {
				this.campaign.$remove(function() {
					$location.path('campaign/campaigns');
				});
			}
			this.browseCampaigns();
		};
		
		
		return service;
	}
]);
'use strict';

// feature-card directive
angular.module('cards')
	.directive('cardForm', ["$rootScope", function($rootScope){
		return {
			restrict: 'A',
			require: '^form',
			link: function(scope, element, attr){
				scope.$on('Bakery: deckSaved', function(){
					scope.featureCardForm.$setPristine();
				});
			}
		};
	}])
	.directive('cardLogo', ['$rootScope', function($rootScope){
		return {
			restrict: 'A',
			templateUrl: '../modules/cards/views/card-logo.html'
		};
	}])
	.directive('cardHeader', function(){
		return {
			restrict: 'A',
			templateUrl: '../modules/cards/views/card-header.html'
		};
	})
	.directive('cardDescription', function(){
		return {
			restrict: 'A',
			templateUrl: '../modules/cards/views/card-description.html'
		};
	})
	.directive('cardModifiers', function(){
		return {
			restrict: 'A',
			templateUrl: '../modules/cards/views/card-modifiers.html'
		};
	})
	.directive('cardBenefit', function(){
		return {
			restrict: 'A',
			templateUrl: '../modules/cards/views/card-benefit.html'
		};
	})
	.directive('cardFooter', function(){
		return {
			restrict: 'A',
			templateUrl: '../modules/cards/views/card-footer.html'
		};
	})
	.directive('cardAction', ['DataSRVC', function(DataSRVC){
		return {
			restrict: 'A',
			templateUrl: '../modules/cards/views/card-action.html',
			scope: {
				cardAction: '=', panel: '='
			},
			link: function(scope, element, attrs){
				scope.dataSRVC = DataSRVC;
			}
		};
	}])
	.directive('cardActionIcon', function(){
		return {
			restrict: 'A',
			templateUrl: '../modules/cards/views/card-action-icon.html'
		};
	})
	.directive('cardActionTitle', function(){
		return {
			restrict: 'A',
			templateUrl: '../modules/cards/views/card-action-title.html'
		};
	})
	.directive('cardActionKeywords', function(){
		return {
			restrict: 'A',
			templateUrl: '../modules/cards/views/card-action-keywords.html'
		};
	})
	.directive('cardActionPrompt', function(){
		return {
			restrict: 'A',
			templateUrl: '../modules/cards/views/card-action-prompt.html'
		};
	})
	.directive('cardActionEffect', function(){
		return {
			restrict: 'A',
			templateUrl: '../modules/cards/views/card-action-effect.html'
		};
	})
	.directive('cardActionAttack', function(){
		return {
			restrict: 'A',
			templateUrl: '../modules/cards/views/card-action-attack.html'
		};
	})
	.directive('cardActionDefense', function(){
		return {
			restrict: 'A',
			templateUrl: '../modules/cards/views/card-action-defense.html'
		};
	})
	.directive('originStats', function(){
		return {
			restrict: 'A',
			templateUrl: '../modules/cards/views/origin-stats.html'
		};
	})
	.directive('originDefenses', function(){
		return {
			restrict: 'A',
			templateUrl: '../modules/cards/views/origin-defenses.html'
		};
	})
	.directive('diceDropdown', function(){
		return {
			restrict: 'A',
			templateUrl: '../modules/pcs/views/dice-dropdown.html',
			scope: {
				ability: '='
			}
		};
	})
	.directive('stopEvent', function(){
		return{
			restrict: 'A',
			link: function(scope, element, attrs){
				var _pressEvents = 'touchstart mousedown';
				element.on(_pressEvents, function(event){
					if(!scope.panel.x_overlap && !scope.panel.y_overlap){
						event.stopPropagation();
					}
				});
			}
		};
	})
	.directive('stopClick', function(){
		return{
			restrict: 'A',
			link: function(scope, element, attrs){
				element.on('click', function(event){
					event.stopPropagation();
				});
			}
		};
	})
	.directive('elasticTextarea', ['$timeout', function($timeout){
			return{
				restrict: 'A',
				link: function(scope, element, attrs){
					
					var resizeArea = function(){
						setTimeout(
							function(){
								element[0].style.height = element[0].scrollHeight + 'px';
							},
						25);
					};
					
					scope.$watch(
						function(){
							return element[0].scrollHeight;
						},
						function(newValue, oldValue){
							if(newValue !== oldValue){
								resizeArea();
							}
						}
					);
					
					resizeArea();
				}
			};
		}
	])
	.directive('fitContent', function(){
		return {
			restrict: 'A',
			scope: false,
			link: function(scope, element, attrs){
				
				var reduceText = function(){
					setTimeout(
						function(){
							var fontSize = parseInt(element.css('font-size'));
				//			console.log('Measure: '+element[0].offsetHeight+' / ' + element.parent()[0].offsetHeight);
							while( element[0].offsetHeight > element.parent()[0].offsetHeight && fontSize >= 6 ){
								fontSize--;
								element.css('font-size', fontSize + 'px' );
				//				console.log('Reducing: '+element[0].offsetHeight+' / ' + parseInt(element.css('font-size')));
							}
						},
					25);
				};
				
				scope.$watch(
					function(){
						return element[0].offsetHeight;
					},
					function(newValue, oldValue){
						if(newValue > oldValue){
							reduceText();
						}
					}
				);
				
				reduceText();
			}
		};
	});
'use strict';

// feature-card directive
angular.module('cards')
	.directive('playerOptions', function(){
		return {
			restrict: 'A',
			templateUrl: '../modules/core/views/options-player.html'
		};
	})
	.directive('pcSummary', function(){
		return {
			restrict: 'A',
			templateUrl: '../modules/pcs/views/pc-summary.html'
		};
	})
	.directive('pcOptions', function(){
		return {
			restrict: 'A',
			templateUrl: '../modules/pcs/views/pc-options.html'
		};
	})
	.directive('cardPc1', function(){
		return {
			restrict: 'A',
			templateUrl: '../modules/pcs/views/card-pc-1.html'
		};
	})
	.directive('cardPc2', function(){
		return {
			restrict: 'A',
			templateUrl: '../modules/pcs/views/card-pc-2.html'
		};
	})
	.directive('cardPc3', function(){
		return {
			restrict: 'A',
			templateUrl: '../modules/pcs/views/card-pc-3.html'
		};
	})
	.directive('featureCard', ['DataSRVC', 'Bakery', 'Architect', function(DataSRVC, Bakery, Architect){
		return {
			restrict: 'A',
			templateUrl: '../modules/cards/views/feature-card.html',
			scope: { card: '=', panel: '=' },
			link: function(scope, element, attrs){
				scope.Bakery = Bakery;
				scope.dataSRVC = DataSRVC;
				scope.Architect = Architect;
			}
		};
	}])
	.directive('narratorOptions', function(){
		return {
			restrict: 'A',
			templateUrl: '../modules/core/views/options-narrator.html'
		};
	})
	.directive('npcSummary', function(){
		return {
			restrict: 'A',
			templateUrl: '../modules/npcs/views/npc-summary.html'
		};
	})
	.directive('npcOptions', function(){
		return {
			restrict: 'A',
			templateUrl: '../modules/npcs/views/npc-options.html'
		};
	})
	.directive('npcOrigin', function(){
		return {
			restrict: 'A',
			templateUrl: '../modules/npcs/views/npc-origin.html'
		};
	})
	.directive('architectOptions', function(){
		return {
			restrict: 'A',
			templateUrl: '../modules/core/views/options-architect.html'
		};
	})
	.directive('deckSummary', function(){
		return {
			restrict: 'A',
			templateUrl: '../modules/decks/views/deck-summary.html'
		};
	})
	.directive('deckOptions', function(){
		return {
			restrict: 'A',
			templateUrl: '../modules/decks/views/deck-options.html'
		};
	})
	.directive('campaignSummary', function(){
		return {
			restrict: 'A',
			templateUrl: '../modules/campaigns/views/campaign-summary.html'
		};
	})
	.directive('campaignOptions', function(){
		return {
			restrict: 'A',
			templateUrl: '../modules/campaigns/views/campaign-options.html'
		};
	});
'use strict';

// General BREAD Factory-service.
angular.module('cards').factory('Aspects', ['$resource',
        function($resource){
            return $resource(
                'aspect/:aspectId',
                {
                    aspectId: '@_id'
                },
                {
                    update: {
                    method: 'PUT' },
                    list: {
                        url: '/aspects',
                        method: 'GET',
                        isArray: true
                    },
                    query: {
                        url: '/aspects/:deckId',
                        method: 'GET',
                        isArray: true,
                        params: {
                            deckId: '@_id'
                        }
                    }
                }
            );
        }]);
'use strict';

// General BREAD Factory-service.
angular.module('cards').factory('Augments', ['$resource',
        function($resource){
            return $resource(
                'augments/:augmentId',
                {
                    augmentId: '@_id'
                },
                {
                    update: {
                        method: 'PUT'
                    }
                }
            );
        }]);
'use strict';

angular.module('cards').factory('CardsBread', ['$stateParams', '$location', 'Authentication', '$resource', '$rootScope', 'Bakery', 'CoreStack', 'CorePanel', function($stateParams, $location, Authentication, $resource, $rootScope, Bakery, CoreStack, CorePanel){
    var service = {};
    
    var editDeck = function(deck, _loadDeck) {
        var _deck = new Bakery.Decks(deck);

        _deck.$update(function(response) {
            if(_loadDeck){
                Bakery.resource = response;
            }
        }, function(errorResponse) {
            console.log(errorResponse);
        });
    };
    
    //BROWSE
    service.browse = function(cardType, params, destination){
        var cardParams = CorePanel.getCardParams(params);
        Bakery.getCardResource(cardType).query(cardParams, function(response){
            return response;
        });
    };
    
    //READ
    service.read = function(panel, callback){
        var params = CorePanel.getCardParams(panel);
        Bakery.getCardResource(panel.panelType).get(
            params,
        function(response){
            callback(panel, response);
        });
    };
    
    //EDIT
    service.edit = function(panel){
        var cardResource = Bakery.getNewCardResource(panel);
        if(panel.panelType !== 'Aspect'){
            var panelData = CorePanel.getPanelData(panel);
            if(panelData.aspect) cardResource.aspect = panelData.aspect._id;
        }
        cardResource.$update();
    };
    
    //ADD
    service.add = function(deck, cardType, cardNumber, deckShift, deckSave){
        var card = {
            deck: deck._id,
            deckSize: deck.deckSize,
            deckName: deck.name,
            cardNumber: cardNumber,
            cardType: cardType
        };

        var panel = {
            panelType: cardType,
            x_coord: cardNumber * 15,
            y_coord: 0
        };
        
        CorePanel.setPanelData(panel, card);
        
        var cardResource = Bakery.getNewCardResource(panel);
        
        cardResource.$save(function(response){
            CorePanel.setPanelData(panel, response);
            deck.cardList.push(panel);
            Bakery.setDeckSize(Bakery.resource);
        }).then(function(response){
            if(deckShift) CorePanel.expandDeck(panel, Bakery.resource.cardList);
        }).then(function(response){
            if(deckSave) editDeck(deck, true);
        });
    };
    
    //DELETE
    service.delete = function(panel, deck){
        if(panel.panelType === 'architectOptions') return;
        
        var cardResource = Bakery.getNewCardResource(panel);
        cardResource.$remove(function(response){
                if(deck) CorePanel.removePanel(deck.cardList, panel);
            }).then(function(response){
                if(deck) CorePanel.setDeckSize(deck);
            }).then(function(response){
                if(deck) CorePanel.collapseDeck(panel, deck.cardList);
            }).then(function(response){
                if(deck) editDeck(deck, false);
        });
    };
    
    return service;
    
}]);
'use strict';

// General BREAD Factory-service.
angular.module('cards').factory('Feats', ['$resource',
        function($resource){
            return $resource(
                'feats/:featId',
                {
                    featId: '@_id'
                },
                {
                    update: {
                        method: 'PUT'
                    }
                }
            );
        }]);
'use strict';

// General BREAD Factory-service.
angular.module('cards').factory('Items', ['$resource',
        function($resource){
            return $resource(
                'items/:itemId',
                {
                    itemId: '@_id'
                },
                {
                    update: {
                        method: 'PUT'
                    }
                }
            );
        }]);
'use strict';

// General BREAD Factory-service.
angular.module('cards').factory('Origins', ['$resource',
        function($resource){
            return $resource(
                'origins/:originId',
                {
                    originId: '@_id'
                },
                {
                    update: {
                        method: 'PUT'
                    }
                }
            );
        }]);
'use strict';

// General BREAD Factory-service.
angular.module('cards').factory('Traits', ['$resource',
        function($resource){
            return $resource(
                'traits/:traitId',
                {
                    traitId: '@_id'
                },
                {
                    update: {
                        method: 'PUT'
                    }
                }
            );
        }]);
'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		});
	}
]);
'use strict';

// Core Controller
angular.module('core')
	.controller('CoreController', ['$location', '$scope', '$rootScope', '$window', 'Authentication', 'Bakery', 'CardsBread', 'DecksBread', 'PcsBread', 'DataSRVC', 'PcsCard1', 'PcsCard2', 'PcsCard3', 'PcsTraits', 'PcsFeats', 'PcsAugments', 'PcsItems', 'Architect', 'Player', 'CoreVars',
		function($location, $scope, $rootScope, $window, Authentication, Bakery, CardsBread, DecksBread, PcsBread, DataSRVC, PcsCard1, PcsCard2, PcsCard3, PcsTraits, PcsFeats, PcsAugments, PcsItems, Architect, Player, CoreVars) {
			
			// This provides Authentication context.
			$scope.authentication = Authentication;
			
			$scope.Bakery = Bakery;
            
			$scope.dataSRVC = DataSRVC;
			
			$scope.pcsCard1 = PcsCard1;
			
			$scope.pcsCard2 = PcsCard2;
			
			$scope.pcsCard3 = PcsCard3;
			
			$scope.pcsTraits = PcsTraits;
			
			$scope.pcsFeats = PcsFeats;
			
			$scope.pcsAugments = PcsAugments;
			
			$scope.pcsItems = PcsItems;
			
			$scope.Architect = Architect;
			
		//	$scope.Player = Player;
			
			$scope.CoreVars = CoreVars;
			
			var pcNew = false;
			
			var initialize = function(){
				toggleListeners(true);
			};
			
			var toggleListeners = function(enable){
				if (!enable) return;
				$scope.$on('$destroy', onDestroy);
				$scope.$on('screenSize:onHeightChange', onHeightChange);
				$scope.$on('ability:onPress', Player.chooseAbility);
        		$scope.$on('PcsCard1:updateAbility', Player.updateAbility);
				$scope.$watch('CoreVars.EXP', Player.watchEXP);
				$scope.$watch('Bakery.resource.experience', Player.watchExperience);
				$scope.$watch('Bakery.resource.level', Player.watchLevel);
			};
			
			var onDestroy = function(){
				toggleListeners(false);
			};
			
			var onHeightChange = function(event, object){
				$scope.windowHeight = object.newHeight;
				$scope.$digest();
			};
			
            //BROWSE Functions
            $scope.browsePcs = function(){
				PcsBread.browse();
			};
			
			$scope.browseDecks = function(param){
				DecksBread.browse(param);
			};
            
            //READ Functions
            $scope.readCard = function(card){
				CardsBread.read(card, CardsBread.setPanelData);
			};
            
            $scope.readDeck = function(deck){
				DecksBread.read(deck);
			};
            
			$scope.readPc = function(pc){
				PcsBread.read(pc);
				pcNew = false;
			};
			
            //ADD Functions
            $scope.addCard = function(deck, cardType, cardNumber, deckShift, deckSave){
				CardsBread.add(deck, cardType, cardNumber, deckShift, deckSave);
			};
            
            $scope.addDeck = function(type, size){
				DecksBread.add(type, size);
			};
            
            $scope.addPc = function(){
				PcsBread.add();
				pcNew = true;
			};
            
            //EDIT Functions
            $scope.editCard = function(card){
				CardsBread.edit(card);
			};
            
            $scope.editDeck = function(deck){
				DecksBread.edit(deck);
			};
            
             $scope.editPc = function(pc){
				PcsBread.edit(pc);
				pcNew = false;
			};
            
            //DELETE Functions
            $scope.deleteCard = function(panel){
				CardsBread.delete(panel, Bakery.resource);
			};
            
			$scope.deleteDeck = function(deck){
				DecksBread.delete(deck, Bakery.resource);
			};
            
            $scope.deletePc = function(pc){
				PcsBread.delete(pc, Bakery.resource);
			};
			
            //Misc Handler Functions
			$scope.exitPc = function(pc){
				if(pcNew){
					PcsBread.delete(pc, Bakery.resource);
				}
				$scope.browsePcs();
			};
			
			
			$scope.changeFeatureCard = function(card){
				$scope.modalShown = true;
				$scope.modalDeckShown = true;
				PcsTraits.browseCards();
			};
			
	 		$scope.status = {
	 			isopen: false
	 		};
		 	
	 		$scope.toggled = function(open){
	 			$scope.status.isopen = open;
	 			$rootScope.$broadcast('CardsCtrl:onDropdown', {
	 				isOpen: $scope.status.isopen
	 			});
	 		};
			
			initialize();
			
		}
	]);
'use strict';

angular.module('core').controller('HeaderController', ['$document', '$rootScope', '$scope', 'Authentication', 'Menus', 'CardsBread', 'DecksBread', 'PcsBread', function($document, $rootScope, $scope, Authentication, Menus, CardsBread, DecksBread, PcsBread) {
    $scope.authentication = Authentication;
    $scope.isCollapsed = false;
    $scope.menu = Menus.getMenu('topbar');

    $scope.toggleCollapsibleMenu = function() {
        $scope.isCollapsed = !$scope.isCollapsed;
    };

    // Collapse the menu after navigation
    $scope.$on('$stateChangeSuccess', function() {
        $scope.isCollapsed = false;
    });
    
    $scope.browseDecks = function(param){
        DecksBread.browse(param);
        $scope.isCollapsed = false;
    };
    
    $scope.browseCampaigns = function(){
        console.log('stub');
    };
    
     $scope.browsePcs = function(){
        PcsBread.browse();
        $scope.isCollapsed = false;
    };
    
    $scope.browseNpcs = function(){
        console.log('stub');
    };
    
}]);
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
								CoreMove.moveDiagonalUp(slot, panel);
							} else if(changeX === 0 && !panel_y_overlap){
								console.log('corePanel:moveVertical');
								CoreMove.moveVertical(slot, panel);
							} else {
								console.log('corePanel:moveHorizontal');
								CoreMove.moveHorizontal(slot, panel);
							}
						} else if(crossingEdge(mouseX, mouseY) === 'bottom'){
							if(changeX > 0 && changeX <= _x_dim){
								console.log('corePanel:moveDiagonalDown');
								CoreMove.moveDiagonalDown(slot, panel);
							} else if(changeX === 0 && !panel_y_overlap){
								console.log('corePanel:moveVertical');
								CoreMove.moveVertical(slot, panel);
							} else {
								console.log('corePanel:moveHorizontal');
								CoreMove.moveHorizontal(slot, panel);
							}
						} else if(crossingEdge(mouseX, mouseY) === 'left' || crossingEdge(mouseX, mouseY) === 'right'){
							if(vectorY * 2 > vectorX){
								if(moveY < 0){
									console.log('corePanel:moveDiagonalUp');
									CoreMove.moveDiagonalUp(slot, panel);
								} else if(moveY > 0){
									console.log('corePanel:moveDiagonalDown');
									CoreMove.moveDiagonalDown(slot, panel);
								}
							} else {
								console.log('corePanel:moveHorizontal');
								CoreMove.moveHorizontal(slot, panel);
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
						CoreMove.triggerOverlap(_panel);
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
'use strict';

// Directive for managing card decks.
angular.module('core')
	.directive('coreStack', ['$rootScope', '$window', 'Bakery', 'CoreStack', 'CoreMove', function($rootScope, $window, Bakery, CoreStack, CoreMove){
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				
				var pressed = false;
				
				var initialize = function(){
					toggleListeners(true);
				};
				
				var toggleListeners = function (enable) {
					// remove listeners
					if (!enable)return;
					
					// add listeners
					scope.$on('$destroy', onDestroy);
					element.on('mouseleave', onMouseLeave);
					scope.$on('screenSize:onHeightChange', onHeightChange);
					scope.$on('CoreStack:setDeckWidth', setDeckWidth);
					scope.$on('corePanel:onPressCard', onPress);
					scope.$on('corePanel:onReleaseCard', onRelease);
					scope.$on('corePanel:onMoveCard', onMoveCard);
				};
				
				var onDestroy = function(enable){
					toggleListeners(false);
				};
				
				var onHeightChange = function(event, object){
					var windowHeight = object.newHeight-50;
					element.css({
						'height': windowHeight+'px'
					});
				};
				
				var setDeckWidth = function(){
					var deckWidth = CoreStack.getDeckWidth(Bakery.resource.cardList);
					element.css({
						'width': deckWidth+'em'
					});
				};
				
				var getElementFontSize = function(){
					return parseFloat(
						$window.getComputedStyle(element[0], null).getPropertyValue('font-size')
					);
				};
				
				var convertEm = function(value) {
					return value * getElementFontSize();
				};
				
				var onPress = function(){
					pressed = true;
				};
				
				var onRelease = function(){
					pressed = false;
				};
				
				var onMoveCard = function(event, object){
					
					var deckOffset = element.offset();
					var deckWidth = CoreStack.getDeckWidth(Bakery.resource.cardList);
					var deckLeftEdge = deckOffset.left;
					var deckRightEdge = convertEm(deckWidth + 3);
					
					if(object.mouseX <= deckLeftEdge){
						CoreMove.unstackLeft(object.panel);
					} else if(object.mouseX >= deckRightEdge){
						CoreMove.unstackRight(object.panel);
					}
					
				};
				
				var onMouseLeave = function(event){
					if(pressed){
						$rootScope.$broadcast('coreStack:onMouseLeave');
					}
				};
				
				initialize();
			}
		};
	}]);
'use strict';

angular.module('core')
	.directive('modalDialogWindow', function() {
		return {
			restrict: 'E',
			scope: {
				show: '='
			},
			transclude: true,
			templateUrl: '../modules/core/views/modal-window.html',
			link: function(scope, element, attrs) {
				scope.dialogStyle = {};
				if (attrs.width)
					scope.dialogStyle.width = attrs.width;
				if (attrs.height)
					scope.dialogStyle.height = attrs.height;
				scope.hideModal = function() {
					scope.show = false;
				};
			}
		};
	});
'use strict';

var coreModule = angular.module('core');

// Directive for monitoring screen height
coreModule
	.directive('screenSize', ['$rootScope', '$window', function($rootScope, $window){
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				
				var _window = angular.element($window);
				
				var _windowHeight;
				
				var initialize = function() {
					toggleListeners(true);
					setTimeout(function(){
						onHeightChange();
					}, 0);
				};
				
				var toggleListeners = function (enable) {
					// remove listeners
					if (!enable)return;
					
					// add listeners
					scope.$on('$destroy', onDestroy);
					_window.on('resize', onHeightChange);
				};
				
				var onDestroy = function(enable){
					toggleListeners(false);
				};
				
				var onHeightChange = function(){
					_windowHeight = _window.height();
					$rootScope.$broadcast('screenSize:onHeightChange', {
						newHeight: _windowHeight
					});
				};
				
				angular.element(document).ready(function () {
					initialize();
				});
				
				initialize();
			}
		};
	}]);
'use strict';

angular.module('core').factory('Architect', ['$rootScope', 'Bakery', 'DecksBread', function($rootScope, Bakery, DecksBread) {
    
    var service = {};
    
    // Used by card-logo.html and feature-card.html
    service.toggleCardLock = function(panel, cardList){
        for(var i = 0; i < cardList.length; i++){
            if (panel === cardList[i]){
                cardList[i].locked = !cardList[i].locked;
            }
        }
    };
    
    // Used by deck-options.html and 'toggleDependency'
    service.findDependency = function(deck, resource){
        var index = -1;
        for(var i = 0; i < resource.dependencies.length; i++){
            var dependency = resource.dependencies[i];
            if (dependency._id === deck._id){
                index = i;
            }
        }
        return index;
    };

    // Used by core.client.controller
    service.toggleDependency = function(deck, resource){
        var deckIndex = service.findDependency(deck, resource);

        if (deckIndex > -1) {
            resource.dependencies.splice(deckIndex, 1);
        } else {
            resource.dependencies.push(deck);
        }
        
        for(var i = 0; i < resource.dependencies.length; i++){
            DecksBread.browseAspects(resource.dependencies[i]);
        }
    };
    
    // Used by card-header.html
    service.changeAspect = function(card, aspect){
        console.log(card);
        console.log(aspect);
        if (card.aspect !== aspect){
            card.aspect = aspect;
        }
    };
    
    return service;
    
}]);
'use strict';

// General BREAD Factory-service.
angular.module('core').factory('Bakery', ['$stateParams', '$location', 'Authentication', '$resource', '$rootScope', 'Decks', 'CoreStack', 'CorePanel', 'Pcs', 'Aspects', 'Traits', 'Feats', 'Augments', 'Items', 'Origins', function($stateParams, $location, Authentication, $resource, $rootScope, Decks, CoreStack, CorePanel, Pcs, Aspects, Traits, Feats, Augments, Items, Origins){
	var service = {};
    
    service.Decks = Decks;
    
    service.Pcs = Pcs;
    
    service.Aspects = Aspects;
    
    service.Traits = Traits;
    
    service.Feats = Feats;
    
    service.Augments = Augments;
    
    service.Items = Items;
    
    service.Origins = Origins;
    
    service.resource = {
		cardList: []
	};
    
    service.getCardResource = function(cardType){
        switch(cardType){
            case 'Aspect':
                return service.Aspects;
            case 'Trait':
                return service.Traits;
            case 'Feat':
                return service.Feats;
            case 'Augment':
                return service.Augments;
            case 'Item':
                return service.Items;
            case 'Origin':
                return service.Origins;
            default:
                return false;
        }
    };
    
    service.getNewCardResource = function(panel){
        switch(panel.panelType){
            case 'Aspect':
                return new service.Aspects(panel.aspectData);
            case 'Trait':
                return new service.Traits(panel.traitData);
            case 'Feat':
                return new service.Feats(panel.featData);
            case 'Augment':
                return new service.Augments(panel.augmentData);
            case 'Item':
                return new service.Items(panel.itemData);
            case 'Origin':
                return new service.Origins(panel.originData);
            default:
                return false;
        }
    };
    
    return service;
}]);
'use strict';

// Factory-service for managing card-deck, card-slot and card-panel directives.
angular.module('core').factory('CoreMove', ['$rootScope', 'CoreVars', 'Bakery', 'CorePanel', 'CoreStack', 'switchHorizontal', 'switchVertical', 'stackOver', 'stackUnder', 'unstackCard', 'toggleOverlap',
	function($rootScope, CoreVars, Bakery, CorePanel, CoreStack, switchHorizontal, switchVertical, stackOver, stackUnder, unstackCard, toggleOverlap){
		
		var service = {};
		
		service.windowHeight = 0;
		
		var getCardList = function(){
			return Bakery.resource.cardList;
		};
		
		var initialize = function(){
			toggleListeners(true);
		};
		
		var toggleListeners = function(enable){
			if(!enable) return;
			$rootScope.$on('screenSize:onHeightChange', onHeightChange);
			
			$rootScope.$on('corePanel:onPressCard', onPressCard);
			$rootScope.$on('corePanel:onReleaseCard', onReleaseCard);
		};
		
		var onHeightChange = function(event, object){
			service.windowHeight = object.newHeight;
		};
		
		// Reset move variables
		var onPressCard = function(event, object){
			var _deck = getCardList();
			var panel = object.panel;
			var panel_x = panel.x_coord;
			var panel_y = panel.y_coord;
			var panel_index = CorePanel.getPanel(_deck, panel_x, panel_y).index;
			
			CoreVars.cardMoved = false;
			if(_deck[panel_index].y_overlap){
				for(var ia = 0; ia < _deck.length; ia++){
					if(_deck[ia].x_coord === panel_x && _deck[ia].y_coord >= panel_y){
						_deck[ia].dragging = true;
					}
				}
			} else {
				_deck[panel_index].dragging = true;
			}
		};
		
		// Reset move variables
		var onReleaseCard = function(event, object){
			var _deck = getCardList();
			
			CoreVars.cardMoved = false;
			for(var ia = 0; ia < _deck.length; ia++){
				_deck[ia].dragging = false;
			}
		};
		
		service.triggerOverlap = function(panel){
			if(!CoreVars.cardMoved){
				var _deck = getCardList();
				toggleOverlap(_deck, panel);
			}
		};
		
		service.moveHorizontal = function(slot, panel){
			var _deck = getCardList();
			var _lowest_index = CoreStack.getLowestPanel(_deck, panel.x_coord).index;
			if(panel.y_coord > 0 || (panel.y_coord === 0 && panel.stacked && !panel.y_overlap)){
				console.log('unstackCard');
				unstackCard(_deck, slot, panel);
			} else if (panel.y_coord === 0){
				console.log('switchHorizontal');
				switchHorizontal(_deck, slot, panel);
			}
		};

		service.moveDiagonalUp = function(slot, panel){
			var _deck = getCardList();
			var _lowest_index = CoreStack.getLowestPanel(_deck, panel.x_coord).index;
			if(panel.y_coord === 0){
				stackUnder(_deck, slot, panel);
			} else {
				unstackCard(_deck, slot, panel);
			}
		};

		service.moveDiagonalDown = function(slot, panel){
			var _deck = getCardList();
			var _lowest_index = CoreStack.getLowestPanel(_deck, panel.x_coord).index;
			if(panel.y_coord === 0){
				stackOver(_deck, slot, panel);
			} else {
				unstackCard(_deck, slot, panel);
			}
		};
		
		service.moveVertical = function(slot, panel){
			var _deck = getCardList();
			switchVertical(_deck, slot, panel);
		};
		
		service.unstackLeft = function(panel){
			if(panel.y_coord > 0){
				var _deck = getCardList();
				var unstack_coord = CorePanel.getPanel(_deck, 0, 0).panel.x_coord - CoreVars.x_dim;
				unstackCard(_deck, {x_coord: unstack_coord}, panel);
			}
		};
		
		service.unstackRight = function(panel){
			if(panel.y_coord > 0){
				var _deck = getCardList();
				var _last = CoreStack.getLastPanel(_deck);
				var unstack_coord = _last.panel.x_coord + CoreVars.x_dim;
				unstackCard(_deck, {x_coord: unstack_coord}, panel);
			}
		};
		
		initialize();
		
		return service;
	}]);

'use strict';

// Panel helper-functions
angular.module('core').factory('CorePanel', ['$rootScope', '$resource', function($rootScope, $resource) {
    
    var service = {};
    
    service.getPanel = function(cardList, x_coord, y_coord){
        if (cardList.length > 0){
            var _index = 0;
            var _panel = { x_coord: 0 };
            for(var i = 0; i < cardList.length; i++){
                if (cardList[i].x_coord === x_coord && cardList[i].y_coord === y_coord){
                    return{
                        index: i, panel: cardList[i]
                    };
                }
            }
        }
    };
    
    service.removePanel = function(panel, cardList){
        for(var i = 0; i < cardList.length; i++){
            if (cardList[i] === panel ) {
                cardList.splice(i, 1);
            }
        }
    };
    
    service.getPanelData = function(panel){
        switch(panel.panelType){
            case 'Aspect':
                return panel.aspectData;
            case 'Trait':
                return panel.traitData;
            case 'Feat':
                return panel.featData;
            case 'Augment':
                return panel.augmentData;
            case 'Item':
                return panel.itemData;
            case 'Origin':
                return panel.originData;
            default:
                return false;
        }
    };
    
    service.setPanelData = function(panel, cardData){
        switch(panel.panelType){
            case 'Aspect':
                panel.aspectData = cardData;
                break;
            case 'Trait':
                panel.traitData = cardData;
                break;
            case 'Feat':
                panel.featData = cardData;
                break;
            case 'Augment':
                panel.augmentData = cardData;
                break;
            case 'Item':
                panel.itemData = cardData;
                break;
            case 'Origin':
                panel.originData = cardData;
                break;
            default:
                return false;
        }
    };
    
    service.getCardParams = function(panel){
        var cardId;
        switch(panel.panelType){
            case 'Aspect':
                cardId = panel.aspectData._id;
                return { aspectId: panel.aspectData._id };
            case 'Trait':
                cardId = panel.traitData._id;
                return { traitId: panel.traitData._id };
            case 'Feat':
                cardId = panel.featData._id;
                return { featId: panel.featData._id };
            case 'Augment':
                cardId = panel.augmentData._id;
                return { augmentId: panel.augmentData._id };
            case 'Item':
                cardId = panel.itemData._id;
                return { itemId: panel.itemData._id };
            case 'Origin':
                cardId = panel.originData._id;
                return { originId: panel.originData._id };
            default:
                return false;
        }
    };
    
    service.expandDeck = function(panel, cardList){
        var panel_x_coord = panel.x_coord;
        var panel_y_coord = panel.y_coord;
        
        for(var i = 0; i < cardList.length; i++){
            var slot = cardList[i];
            
            var slotData = service.getPanelData(slot);
            if (slot !== panel && slot.x_coord >= panel_x_coord){
                slot.x_coord += 15;
                slotData.cardNumber++;
            }
        }
        $rootScope.$broadcast('corePanel:onReleaseCard');
    };
    
    service.collapseDeck = function(panel, cardList){
        var panel_x_coord = panel.x_coord;
        var panel_y_coord = panel.y_coord;
        
        for(var i = 0; i < cardList.length; i++){
            var slot = cardList[i];
            var slotData = service.getPanelData(slot);
            if (slot.x_coord > panel_x_coord){
                slot.x_coord -= 15;
                slotData.cardNumber--;
            }
        }
        $rootScope.$broadcast('corePanel:onReleaseCard');
    };
    
    service.setDeckSize = function(resource){
        var _length = resource.cardList.length - 1;
        resource.deckSize = _length;
        for(var i = 0; i < resource.cardList.length; i++){
            var panel = resource.cardList[i];
            var panelData = service.getPanelData(panel);
            panelData.deckSize = _length;
        }
    };
    
    return service;
    
}]);
'use strict';

// Stack helper-functions
angular.module('core').factory('CoreStack', ['$rootScope', function($rootScope) {
    
    var service = {};
    
    service.getLastPanel = function(cardList){
        var _index = 0;
        var _panel = { x_coord: 0 };
        if(cardList.length > 0){
            for(var i = 0; i < cardList.length; i++){
                if(cardList[i].x_coord > (_panel.x_coord || -1)){
                    _index = i;
                    _panel = cardList[i];
                }
            }
        }
        return {
            index: _index, panel: _panel
        };  
    };
    
    service.getLowestPanel = function(cardList, x_coord){
        var _index = 0;
        var _panel = { y_coord: 0 };
        if(cardList.length > 0){
            for(var i = 0; i < cardList.length; i++){
                if(cardList[i].x_coord === x_coord){
                    if(cardList[i].y_coord > (_panel.y_coord || -1)){
                        _index = i;
                        _panel = cardList[i];
                    }
                }
            }
        }
        return {
            index: _index, panel: _panel
        };
    };
    
    service.getDeckWidth = function(cardList){
        var lastPanel = service.getLastPanel(cardList);
        return lastPanel.panel.x_coord + 15;
    };
    
    service.setDeckWidth = function(cardList){
        var _deckWidth = service.getDeckWidth(cardList);
        $rootScope.$broadcast('CoreStack:setDeckWidth', {
            deckWidth: _deckWidth
        });
    };
    
    service.setCardList = function(cardList){
        for(var i = 0; i < cardList.length; i++){
            cardList[i].x_coord = i * 15;
            cardList[i].y_coord = 0;
            cardList[i].x_overlap = false;
            cardList[i].y_overlap = false;
            cardList[i].dragging = false;
            cardList[i].stacked = false;
            cardList[i].locked = false;
        }
        $rootScope.$broadcast('corePanel:onReleaseCard');
    };
    
    service.getColumnArray = function(cardList, x_coord){
        var _column = [];
        for(var i =0; i < cardList.length; i++){
            if (cardList[i].x_coord === x_coord){
                _column.push(i);
            }
        }
        return _column;
    };
    
    service.setColumnVars = function(cardList, x_coord){
        var _lowest = service.getLowestPanel(cardList, x_coord);
        if (_lowest.panel.y_coord > 0){
            var _column = service.getColumnArray(cardList, x_coord);
            _column.sort(function(a, b){
                return cardList[a].y_coord - cardList[b].y_coord;
            });
            for(var i = 0; i < _column.length; i++){
                cardList[_column[i]].stacked = true;
                if (_column[i] === _lowest.index){
                    cardList[_column[i]].y_overlap = false;
                } else {
                    var _panel = cardList[_column[i]];
                    var _next = cardList[_column[i+1]];
                    if (_next.y_coord - _panel.y_coord === 3){
                        _panel.y_overlap = true;
                    } else if(_next.y_coord - _panel.y_coord === 21){
                        _panel.y_overlap = false;
                    }
                }
            }
        } else {
            cardList[_lowest.index].stacked = false;
            cardList[_lowest.index].y_overlap = false;
        }
    };
    
    
    return service;
    
}]);
'use strict';

// Factory-service for managing card-deck, card-slot and card-panel directives.
angular.module('core').factory('CoreVars', ['$rootScope', 'Bakery', 'CorePanel', 'CoreStack',
    function($rootScope, Bakery, CorePanel, CoreStack){
        var service = {};
        
        service.experience = 0;
        service.x_dim = 15;
        service.y_dim = 21;
        service.x_tab = 3;
        service.y_tab = 3;
        service.x_cover = 12;
        service.y_cover = 18;
        service.cardMoved = false;
        service.cardMoving = false;
        var moveSpeed = 800;
        var moveTimer;
        
        service.modalShown = false;
        service.diceBoxShown = false;
        service.modalDeckShown = false;
        
        // Set move booleans
        service.setCardMoving = function(){
            clearTimeout(moveTimer);
            service.cardMoving = true;
            service.cardMoved = true;
            moveTimer = setTimeout(function(){
                service.cardMoving = false;
                CoreStack.setDeckWidth(Bakery.resource.cardList);
            }, moveSpeed);
        };
        
        service.hideModal = function(){
            service.modalShown = false;
            service.diceBoxShown = false;
            service.modalDeckShown = false;
        };
        
        return service;
        
    }]);
'use strict';

// Factory-service for providing generic game data
angular.module('core').factory('DataSRVC', [
	function($rootScope){
		var service = {};
		
		service.sexArray = [
			'---',
			'Male',
			'Female'
		];
		
		service.diceList = [
			{order: 1, name: 'd__', sides: 0, image: 'modules/core/img/d___.png'},
			{order: 2, name: 'd4', sides: 4, image: 'modules/core/img/d_04.png'},
			{order: 3, name: 'd6', sides: 6, image: 'modules/core/img/d_06.png'},
			{order: 4, name: 'd6', sides: 6, image: 'modules/core/img/d_06.png'},
			{order: 5, name: 'd8', sides: 8, image: 'modules/core/img/d_08.png'},
			{order: 6, name: 'd8', sides: 8, image: 'modules/core/img/d_08.png'},
			{order: 7, name: 'd10', sides: 10, image: 'modules/core/img/d_10.png'},
			{order: 8, name: 'd10', sides: 10, image: 'modules/core/img/d_10.png'},
			{order: 9, name: 'd12', sides: 12, image: 'modules/core/img/d_12.png'}
		];
		
		service.aspectTypes = [
			'Archetype',
			'Allegiance',
			'Race'
		];
		
		service.targetTypes = [
			'Utility',
			'Close',
			'Close Area',
			'Distant',
			'Distant Area'
		];
		
		service.closeDetails = [
			'1/1', '1/2', '1/3', '1/4',
			'2/1', '2/2', '2/3', '2/4',
			'3/1', '3/2', '3/3', '3/4',
			'4/1', '4/2', '4/3'
		];
		
		service.closeAreaDetails = [
			'2x2', '3x3', '4x4', '5x5'
		];
		
		service.distantDetails = [
			'4/1', '6/1', '8/1', '10/1',
			'12/1', '14/1', '16/1', '18/1',
			'20/1', '22/1', '24/1'
		];
		
		service.distantAreaDetails = [
			'8/2x2', '10/2x2', '12/2x2', '16/2x2',
			'10/3x3', '12/3x3', '16/3x3', '20/3x3',
			'12/4x4', '16/4x4', '20/4x4'
		];
		
		service.actionKeywords = [
			'Default',
			'Single-use',
			'Thrown',
			'Reflexive',
			'Melee',
			'Ranged',
			'Evocation',
			'Invocation'
		];
		
		service.actionFrequency = [
			'Free',
			'Count: 1',
			'Count: 2',
			'Count: 3',
			'Count: 4',
			'Count: 5',
			'Disruptive',
			'Responsive'
		];
		
		service.dice = [
			'1d4',
			'1d6',
			'1d8',
			'1d10',
			'1d12'
		];
		
		service.abilities = [
			'STR',
			'PHY',
			'FLE',
			'DEX',
			'ACU',
			'INT',
			'WIS',
			'CHA'
		];
		
		service.attackTypes = [
			'Melee',
			'Ranged',
			'Evocation',
			'Invocation'
		];
		
		service.defenseTypes = [
			'Block',
			'Dodge',
			'Alertness',
			'Tenacity'
		];
		
		service.prerequisites = [
			'1d10 STR',
			'1d10 PHY',
			'1d10 FLE',
			'1d10 DEX',
			'1d10 ACU',
			'1d10 INT',
			'1d10 WIS',
			'1d10 CHA'
		];
		
		service.itemTypes = [
			'Melee',
			'Melee / Ranged',
			'Melee / Invocation',
			'Ranged',
			'Ranged / Melee',
			'Ranged / Evocation',
			'Evocation',
			'Evocation / Invocation',
			'Evocation / Ranged',
			'Invocation',
			'Invocation / Evocation',
			'Invocation / Melee'
		];
		
		service.itemSlots = [
			'One-handed',
			'Two-handed',
			'One-handed or Paired',
			'One-handed or Two-handed',
			'Armor',
			'Shield',
			'Gloves',
			'Boots',
			'Cloak',
			'Amulet',
			'Ring',
			'Belt',
			'Helmet',
			'Consumable',
			'Provision'
		];
		
		return service;
	}]);
'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

	function() {
		// Define a set of default roles
		this.defaultRoles = ['*'];

		// Define the menus object
		this.menus = {};

		// A private function for rendering decision 
		var shouldRender = function(user) {
			if (user) {
				if (!!~this.roles.indexOf('*')) {
					return true;
				} else {
					for (var userRoleIndex in user.roles) {
						for (var roleIndex in this.roles) {
							if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
								return true;
							}
						}
					}
				}
			} else {
				return this.isPublic;
			}

			return false;
		};

		// Validate menu existance
		this.validateMenuExistance = function(menuId) {
			if (menuId && menuId.length) {
				if (this.menus[menuId]) {
					return true;
				} else {
					throw new Error('Menu does not exists');
				}
			} else {
				throw new Error('MenuId was not provided');
			}

			return false;
		};

		// Get the menu object by menu id
		this.getMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			return this.menus[menuId];
		};

		// Add new menu object by menu id
		this.addMenu = function(menuId, isPublic, roles) {
			// Create the new menu
			this.menus[menuId] = {
				isPublic: isPublic || false,
				roles: roles || this.defaultRoles,
				items: [],
				shouldRender: shouldRender
			};
			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			delete this.menus[menuId];
		};

		// Add menu item object
		this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Push new menu item
			this.menus[menuId].items.push({
				title: menuItemTitle,
				link: menuItemURL,
				menuItemType: menuItemType || 'item',
				menuItemClass: menuItemType,
				uiRoute: menuItemUIRoute || ('/' + menuItemURL),
				isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
				roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
				position: position || 0,
				items: [],
				shouldRender: shouldRender
			});
			
			// Return the menu object
			return this.menus[menuId];
		};

		// Add submenu item object
		this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
					// Push new submenu item
					this.menus[menuId].items[itemIndex].items.push({
						title: menuItemTitle,
						link: menuItemURL,
						uiRoute: menuItemUIRoute || ('/' + menuItemURL),
						isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
						roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
						position: position || 0,
						shouldRender: shouldRender
					});
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenuItem = function(menuId, menuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);
			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
					this.menus[menuId].items.splice(itemIndex, 1);
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeSubMenuItem = function(menuId, submenuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
					if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
						this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
					}
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		//Adding the topbar menu
		this.addMenu('topbar');
	}
]);
'use strict';

angular.module('core').factory('mockDataBuilder', function() {
    var service = {};
    
    service.newMockData = function(){
        var mockData = {};
        
        mockData.aspect_1 = {
            panelType: 'Aspect',
            aspectData: {
                name: 'Aspect the First',
                cardType: 'Aspect',
                cardNumber: 1
            }
        };
        
        mockData.aspect_2 = {
            panelType: 'Aspect',
            aspectData: {
                name: 'Aspect the Second',
                cardType: 'Aspect',
                cardNumber: 2
            }
        };
        
        mockData.aspect_3 = {
            panelType: 'Aspect',
            aspectData: {
                name: 'Aspect the Third',
                cardType: 'Aspect',
                cardNumber: 3
            }
        };
        
        mockData.aspect_4 = {
            panelType: 'Aspect',
            aspectData: {
                name: 'Aspect the Fourth',
                cardType: 'Aspect',
                cardNumber: 4
            }
        };
        
        mockData.aspect_5 = {
            panelType: 'Aspect',
            aspectData: {
                name: 'Aspect the Fifth',
                cardType: 'Aspect',
                cardNumber: 5
            }
        };
        
        mockData.aspect_6 = {
            panelType: 'Aspect',
            aspectData: {
                name: 'Aspect the Sixth',
                cardType: 'Aspect',
                cardNumber: 6
            }
        };
        
        mockData.aspect_7 = {
            panelType: 'Aspect',
            aspectData: {
                name: 'Aspect the Seventh',
                cardType: 'Aspect',
                cardNumber: 7
            }
        };
        
        mockData.aspect_8 = {
            panelType: 'Aspect',
            aspectData: {
                name: 'Aspect the Eighth',
                cardType: 'Aspect',
                cardNumber: 8
            }
        };
        
        mockData.aspectDeck = {
            _id: 'aspectDeck_id',
            dependencies: [],
            cardList: [ 
                mockData.aspect_1, mockData.aspect_2,
                mockData.aspect_3, mockData.aspect_4,
                mockData.aspect_5, mockData.aspect_6,
                mockData.aspect_7, mockData.aspect_8
            ]
        };
        
        mockData.trait_1 = {
            panelType: 'Trait',
            traitData: {
                name: 'Trait the First',
                cardType: 'Trait',
                cardNumber: 1
            }
        };
        
        mockData.trait_2 = {
            panelType: 'Trait',
            traitData: {
                name: 'Trait the Second',
                cardType: 'Trait',
                cardNumber: 2
            }
        };
        
        mockData.trait_3 = {
            panelType: 'Trait',
            traitData: {
                name: 'Trait the Third',
                cardType: 'Trait',
                cardNumber: 3
            }
        };
        
        mockData.trait_4 = {
            panelType: 'Trait',
            traitData: {
                name: 'Trait the Fourth',
                cardType: 'Trait',
                cardNumber: 4
            }
        };
        
        mockData.traitDeck = {
            _id: 'traitDeck_id',
            dependencies: [
                { _id: 'aspectDeck_id' }
            ],
            cardList: [
                mockData.trait_1, mockData.trait_2,
                mockData.trait_3, mockData.trait_4
            ]
        };
        
        mockData.feat_1 = {
            panelType: 'Feat',
            x_coord: 0,
            y_coord: 0,
            featData: {
                name: 'Feat the First',
                cardType: 'Feat',
                cardNumber: 1
            }
        };
        
        mockData.feat_2 = {
            panelType: 'Feat',
            x_coord: 15,
            y_coord: 0,
            featData: {
                name: 'Feat the Second',
                cardType: 'Feat',
                cardNumber: 2
            }
        };
        
        mockData.feat_3 = {
            panelType: 'Feat',
            x_coord: 15,
            y_coord: 21,
            featData: {
                name: 'Feat the Third',
                cardType: 'Feat',
                cardNumber: 3
            }
        };
        
        mockData.feat_4 = {
            panelType: 'Feat',
            x_coord: 30,
            y_coord: 21,
            featData: {
                name: 'Feat the Fourth',
                cardType: 'Feat',
                cardNumber: 4
            }
        };
        
        mockData.feat_5 = {
            panelType: 'Feat',
            x_coord: 30,
            y_coord: 0,
            featData: {
                name: 'Feat the Fifth',
                cardType: 'Feat',
                cardNumber: 5
            }
        };
        
        mockData.feat_6 = {
            panelType: 'Feat',
            x_coord: 30,
            y_coord: 42,
            featData: {
                name: 'Feat the Sixth',
                cardType: 'Feat',
                cardNumber: 6
            }
        };
        
        
        
        mockData.feat_7 = {
            panelType: 'Feat',
            x_coord: 45,
            y_coord: 0,
            featData: {
                name: 'Feat the Seventh',
                cardType: 'Feat',
                cardNumber: 7
            }
        };
        
        mockData.feat_8 = {
            panelType: 'Feat',
            x_coord: 45,
            y_coord: 3,
            featData: {
                name: 'Feat the Eighth',
                cardType: 'Feat',
                cardNumber: 8
            }
        };
        
        mockData.feat_9 = {
            panelType: 'Feat',
            x_coord: 45,
            y_coord: 24,
            featData: {
                name: 'Feat the Ninth',
                cardType: 'Feat',
                cardNumber: 9
            }
        };
        
        mockData.feat_10 = {
            panelType: 'Feat',
            x_coord: 45,
            y_coord: 27,
            featData: {
                name: 'Feat the Tenth',
                cardType: 'Feat',
                cardNumber: 10
            }
        };
        
        mockData.featDeck = {
            _id: 'featDeck_id',
            dependencies: [],
            cardList: [
                mockData.feat_1, mockData.feat_2,
                mockData.feat_3, mockData.feat_4,
                mockData.feat_5, mockData.feat_6,
                mockData.feat_7, mockData.feat_8,
                mockData.feat_9, mockData.feat_10
            ]
        };
        
        return mockData;
    };
    
    
    
    return service;
});
'use strict';

angular.module('core').factory('Player', ['$rootScope', 'CoreVars', 'Bakery', 'PcsCard1', 'PcsCard2', 'PcsTraits', 'PcsFeats', 'PcsAugments', function($rootScope, CoreVars, Bakery, PcsCard1, PcsCard2, PcsTraits, PcsFeats, PcsAugments) {
    
    var service = {};
    
    service.updateAbility = function(event, object){
        console.log('updateAbility');
        console.log(object);
        
        var abilityPair = object.abilityPair;
        var ability1 = object.ability1;
        var ability2 = object.ability2;
        switch(abilityPair){
            case 1:
                PcsCard1.factorBlock(ability1, ability2);
                PcsCard2.factorHealth();
                PcsCard2.factorStamina();
                PcsCard2.factorCarryingCapacity();
                break;
            case 2:
                PcsCard1.factorDodge(ability1, ability2);
                break;
            case 3:
                PcsCard1.factorAlertness(ability1, ability2);
                break;
            case 4:
                PcsCard1.factorTenacity(ability1, ability2);
                break;
        }
    };
    
    service.chooseAbility = function(event, object){
        CoreVars.modalShown = true;
        CoreVars.diceBoxShown = true;
    };
    
    //Watch for change in EXP input
    service.watchEXP = function(newValue, oldValue){
        if (Bakery.resource.deckType === 'pc' && newValue !== oldValue){
            CoreVars.EXP = parseInt(newValue);
            Bakery.resource.experience = parseInt(newValue);
        }
    };
    
    //Watch for change in experience
    service.watchExperience = function(newValue, oldValue){
        if (Bakery.resource.deckType === 'pc' && newValue !== oldValue){
            PcsCard2.factorExperience();
            if (newValue !== PcsCard2.EXP){
                CoreVars.EXP = newValue;
            }
        }
    };
    
    //Watch for changes in level
    service.watchLevel = function(newValue, oldValue){
        if (Bakery.resource.deckType === 'pc'){
            PcsCard2.factorHealth();
            PcsCard2.factorStamina();
            PcsTraits.factorTraitLimit();
            PcsFeats.factorFeatLimit();
            PcsAugments.factorAugmentLimit();
        }
    };
    
    return service;
    
}]);
'use strict';

//socket factory that provides the socket service
angular.module('core').factory('Socket', ['socketFactory',
    function(socketFactory) {
		var mSocket = socketFactory({
			ioSocket: socket
		});
		return mSocket;
    }
]);
'use strict';

// Factory-service for managing card-deck, card-slot and card-panel directives.
angular.module('core').factory('stackOver', ['$rootScope', 'CoreVars', 'Bakery', 'CorePanel', 'CoreStack',
    function($rootScope, CoreVars, Bakery, CorePanel, CoreStack){
        
        return function(cardList, slot, panel){
            if(!CoreVars.cardMoving && !slot.x_overlap && !panel.x_overlap){
                
                var slot_x = slot.x_coord;
                var slot_y = slot.y_coord;
                var slot_index = CorePanel.getPanel(cardList, slot_x, slot_y).index;
                var slot_x_overlap = slot.x_overlap;
                var slot_y_overlap = slot.y_overlap;
                
                var panel_x = panel.x_coord;
                var panel_y = panel.y_coord;
                var panel_index = CorePanel.getPanel(cardList, panel_x, panel_y).index;
                var panel_x_overlap = panel.x_overlap;
                var panel_y_overlap = panel.y_overlap;
                var panel_lowest_index = CoreStack.getLowestPanel(cardList, panel_x).index;
                var panel_lowest_coord = cardList[panel_lowest_index].y_coord;
                
                var newColumn = panel_x > slot_x ? slot_x : slot_x - CoreVars.x_dim;
                
                if(!slot_x_overlap && !panel_x_overlap){
                    CoreVars.setCardMoving();
                    for(var ia = 0; ia < cardList.length; ia++){
                        if(!cardList[ia].dragging && cardList[ia].x_coord === newColumn && cardList[ia].y_coord > slot_y){
                            cardList[ia].y_coord += panel_lowest_coord + CoreVars.y_tab;
                        }
                        if(cardList[ia].dragging){
                            cardList[ia].x_coord = slot_x;
                            cardList[ia].y_coord += slot_y + CoreVars.y_tab - panel_y;
                        }
                        if(cardList[ia].x_coord > panel_x && panel_y === 0){
                            cardList[ia].x_coord -= CoreVars.x_dim;
                        }
                    }
                    CoreStack.setColumnVars(cardList, newColumn);
                    CoreStack.setColumnVars(cardList, slot_x);
                    CoreStack.setColumnVars(cardList, panel_x);
                }
                $rootScope.$digest();
            }
        };
        
    }]);
'use strict';

// Factory-service for managing card-deck, card-slot and card-panel directives.
angular.module('core').factory('stackUnder', ['$rootScope', 'CoreVars', 'Bakery', 'CorePanel', 'CoreStack',
    function($rootScope, CoreVars, Bakery, CorePanel, CoreStack){
        
        // Stack one card behind another and reposition deck to fill the gap
        return function(cardList, slot, panel){
            if(!CoreVars.cardMoving && !slot.x_overlap && !panel.x_overlap){
                
                var panel_x = panel.x_coord;
                var panel_y = panel.y_coord;
                var panel_index = CorePanel.getPanel(cardList, panel_x, panel_y).index;
                var panel_x_overlap = panel.x_overlap;
                var panel_y_overlap = panel.y_overlap;
                var panel_lowest_coord = CoreStack.getLowestPanel(cardList, panel_x).panel.y_coord;
                
                var slot_x = slot.x_coord;
                var slot_y = slot.y_coord;
                var slot_index = CorePanel.getPanel(cardList, slot_x, slot_y).index;
                var slot_lowest_coord = CoreStack.getLowestPanel(cardList, slot_x).panel.y_coord;
                var newColumn = panel_x > slot_x ? slot_x : slot_x - CoreVars.x_dim;
                
                CoreVars.setCardMoving();
                for(var ia = 0; ia < cardList.length; ia++){
                    if(!cardList[ia].dragging && cardList[ia].x_coord === slot_x){
                        cardList[ia].y_coord += panel_lowest_coord + CoreVars.y_tab;
                    }
                    if(cardList[ia].x_coord > panel_x){
                        cardList[ia].x_coord -= CoreVars.x_dim;
                    }
                    if(cardList[ia].dragging){
                        cardList[ia].x_coord = newColumn;
                    }
                }
                CoreStack.setColumnVars(cardList, newColumn);
                CoreStack.setColumnVars(cardList, slot_x);
                CoreStack.setColumnVars(cardList, panel_x);
                $rootScope.$digest();
            }
        };
        
    }]);
'use strict';

// Factory-service for managing card-deck, card-slot and card-panel directives.
angular.module('core').factory('switchHorizontal', ['$rootScope', 'CoreVars', 'Bakery', 'CorePanel', 'CoreStack',
    function($rootScope, CoreVars, Bakery, CorePanel, CoreStack){
        
        return function(cardList, slot, panel){
            console.log('switchHorizontal');
            if(!CoreVars.cardMoving){
                
                var slot_x = slot.x_coord;
                var slot_y = slot.y_coord;
                var slot_index = CorePanel.getPanel(cardList, slot_x, slot_y).index;
                var slot_x_overlap = slot.x_overlap;
                var slot_position = slot_x;
                
                var panel_x = panel.x_coord;
                var panel_y = panel.y_coord;
                var panel_index = CorePanel.getPanel(cardList, panel_x, panel_y).index;
                var panel_x_overlap = panel.x_overlap;
                var panel_width = CoreVars.x_dim;
                
                if(panel_x - slot_x > 0){
                // PANEL MOVING LEFT
                    CoreVars.setCardMoving();
                    
                    if(slot_x === 0 && panel_x_overlap){
                        slot_position = 0;
                        panel_width -= CoreVars.x_cover;
                        cardList[slot_index].x_overlap = true;
                        cardList[panel_index].x_overlap = false;
                    } else {
                        if(panel_x_overlap){
                            panel_width -= CoreVars.x_cover;
                            slot_position -= CoreVars.x_cover;
                        }
                        if(slot_x_overlap){
                            slot_position += CoreVars.x_cover;
                        }
                    }
                    for(var ia = 0; ia < cardList.length; ia++){
                        if(cardList[ia].x_coord >= slot_x && cardList[ia].x_coord < panel_x){
                        // Modify position of each card in "SLOT" column and to the left of "PANEL" column
                            cardList[ia].x_coord += panel_width;
                        } else if(cardList[ia].x_coord === panel_x){
                        // Modify position of each card in "PANEL" column
                            cardList[ia].x_coord = slot_position;
                        }
                    }
                } else if(panel_x - slot_x < 0){
                // PANEL MOVING RIGHT
                    CoreVars.setCardMoving();
                    if(panel_x === 0 && slot_x_overlap){
                        var first_index = CorePanel.getPanel(cardList, 0, 0);
                //      cardList[first_index].x_coord = 0;
                        cardList[first_index].x_overlap = false;
                        cardList[panel_index].x_overlap = true;
                        panel_width -= CoreVars.x_cover;
                    } else if(panel_x > 0){
                        if(panel_x_overlap){
                            panel_width -= CoreVars.x_cover;
                        }
                    }
                    
                    for(var ib = 0; ib < cardList.length; ib++){
                        if(cardList[ib].x_coord <= slot_x && cardList[ib].x_coord > panel_x){
                        // Modify position of each card in "SLOT" column
                            cardList[ib].x_coord -= panel_width;
                        } else if(cardList[ib].x_coord === panel_x){
                        // Modify position of each card in "PANEL" column
                            cardList[ib].x_coord = slot_position;
                        }
                    }
                }
                $rootScope.$digest();
            }
        };
        
    }]);
'use strict';

// Factory-service for managing card-deck, card-slot and card-panel directives.
angular.module('core').factory('switchVertical', ['$rootScope', 'CoreVars', 'Bakery', 'CorePanel', 'CoreStack',
    function($rootScope, CoreVars, Bakery, CorePanel, CoreStack){
        
        return function(cardList, slot, panel){
            console.log('switchVertical');
            if(!CoreVars.cardMoving){
                
                var slot_x = slot.x_coord;
                var slot_y = slot.y_coord;
                var slot_index = CorePanel.getPanel(cardList, slot_x, slot_y).index;
                var slot_y_overlap = slot.y_overlap;
                
                var panel_x = panel.x_coord;
                var panel_y = panel.y_coord;
                
                var panel_index = CorePanel.getPanel(cardList, panel_x, panel_y).index;
                var panel_y_overlap = panel.y_overlap;
                
                var lowest_index = CoreStack.getLowestPanel(cardList, slot_x).index;
                var lowest_y = cardList[lowest_index].y_coord;
                
                if(panel_y - slot_y > 0){
                // PANEL MOVING UP
                    CoreVars.setCardMoving();
                    
                    cardList[slot_index].y_coord = panel_y;
                    cardList[slot_index].y_overlap = panel_y_overlap;
                    $rootScope.$digest();
                    cardList[panel_index].y_coord = slot_y;
                    cardList[panel_index].y_overlap = slot_y_overlap;
                    
                } else if(panel_y - slot_y < 0){
                // PANEL MOVING DOWN
                    CoreVars.setCardMoving();
                    
                    cardList[slot_index].y_coord = panel_y;
                    cardList[slot_index].y_overlap = panel_y_overlap;
                    $rootScope.$digest();
                    cardList[panel_index].y_coord = slot_y;
                    cardList[panel_index].y_overlap = slot_y_overlap;
                }
                $rootScope.$digest();
            }
        };
        
    }]);
'use strict';

// Factory-service for managing card-deck, card-slot and card-panel directives.
angular.module('core').factory('toggleOverlap', ['$rootScope', 'CoreVars', 'Bakery', 'CorePanel', 'CoreStack',
    function($rootScope, CoreVars, Bakery, CorePanel, CoreStack){
        
        return function(cardList, panel){
            if(!CoreVars.cardMoved){
                
                var panel_x = panel.x_coord;
                var panel_y = panel.y_coord;
                var panel_x_overlap = panel.x_overlap;
                var panel_y_overlap = panel.y_overlap;
                var panel_index = CorePanel.getPanel(cardList, panel_x, panel_y).index;
                var lowest_index = CoreStack.getLowestPanel(cardList, panel_x).index;
                var lowest_y = cardList[lowest_index].y_coord;
                
                if(panel_x > 0 && lowest_y === 0){
                // x_overlap
                    if(panel_x_overlap && !CoreVars.cardMoving){
                    // Card overlapped
                        CoreVars.setCardMoving();
                        cardList[panel_index].x_overlap = false;
                        for(var ia = 0; ia < cardList.length; ia++){
                            if(panel_x <= cardList[ia].x_coord){
                                cardList[ia].x_coord += CoreVars.x_cover;
                            }
                        }
                    } else if(!panel_x_overlap && !CoreVars.cardMoving){
                    // Card not overlapped
                        CoreVars.setCardMoving();
                        cardList[panel_index].x_overlap = true;
                        for(var ib = 0; ib < cardList.length; ib++){
                            if(panel_x <= cardList[ib].x_coord){
                                cardList[ib].x_coord -= CoreVars.x_cover;
                            }
                        }
                    }
                } else if(panel_y !== lowest_y){
                // y_overlap
                    if(panel_y_overlap && !CoreVars.cardMoving){
                    // Card overlapped
                        CoreVars.setCardMoving();
                        cardList[panel_index].y_overlap = false;
                        for(var ic = 0; ic < cardList.length; ic++){
                            if(panel_x === cardList[ic].x_coord && panel_y < cardList[ic].y_coord){
                                cardList[ic].y_coord += CoreVars.y_cover;
                            }
                        }
                    } else if(!panel_y_overlap && !CoreVars.cardMoving){
                    // Card not overlapped
                        CoreVars.setCardMoving();
                        cardList[panel_index].y_overlap = true;
                        for(var id = 0; id < cardList.length; id++){
                            if(panel_x === cardList[id].x_coord && panel_y < cardList[id].y_coord){
                                cardList[id].y_coord -= CoreVars.y_cover;
                            }
                        }
                    }
                }
                $rootScope.$digest();
                CoreVars.cardMoved = false;
            }
        };
        
    }]);
'use strict';

// Factory-service for managing card-deck, card-slot and card-panel directives.
angular.module('core').factory('unstackCard', ['$rootScope', 'CoreVars', 'Bakery', 'CorePanel', 'CoreStack',
    function($rootScope, CoreVars, Bakery, CorePanel, CoreStack){
        
        return function(cardList, slot, panel){
            if(!CoreVars.cardMoving){
                
                if(CoreStack.getLowestPanel(cardList, panel.x_coord).panel.y_coord > 0){
                    var panel_x = panel.x_coord;
                    var panel_y = panel.y_coord;
                    var panel_index = CorePanel.getPanel(cardList, panel_x, panel_y).index;
                    var panel_x_overlap = panel.x_overlap;
                    var panel_y_overlap = panel.y_overlap;
                    var slot_x = slot.x_coord;
                    
                    var new_slot_index, new_panel_index;
                    
                    if(panel_x - slot_x > 0){
                    // Card is unstacking to the left
                        CoreVars.setCardMoving();
                        if(panel_y_overlap){
                        // Unstack multiple cards to the left
                            for(var ia = 0; ia < cardList.length; ia++){
                                if(cardList[ia].x_coord > panel_x){
                                    cardList[ia].x_coord += CoreVars.x_dim;
                                }
                                if(cardList[ia].x_coord === panel_x){
                                    if(panel_y_overlap){
                                        if(cardList[ia].y_coord < panel_y){
                                            cardList[ia].x_coord += CoreVars.x_dim;
                                        } else if(cardList[ia].y_coord >= panel_y){
                                            cardList[ia].y_coord -= panel_y;
                                        }
                                    }
                                }
                            }
                        } else if(!panel_y_overlap){
                        // Unstack single card to the left
                            for(var ib = 0; ib < cardList.length; ib++){
                                if(cardList[ib].x_coord >= panel_x){
                                    if(cardList[ib].x_coord === panel_x && cardList[ib].y_coord > panel_y){
                                        cardList[ib].y_coord -= CoreVars.y_dim;
                                    }
                                    if(ib !== panel_index){
                                        cardList[ib].x_coord += CoreVars.x_dim;
                                    }
                                }
                            }
                            cardList[panel_index].y_coord = 0;
                            cardList[panel_index].stacked = false;
                        }
                        new_slot_index = CoreStack.getLowestPanel(cardList, panel_x).index;
                        new_panel_index = CoreStack.getLowestPanel(cardList, panel_x + CoreVars.x_dim).index;
                        
                        cardList[new_slot_index].y_overlap = false;
                        if(cardList[new_slot_index].y_coord === 0){
                            cardList[new_slot_index].stacked = false;
                        }
                        
                        cardList[new_panel_index].y_overlap = false;
                        if(cardList[new_panel_index].y_coord === 0){
                            cardList[new_panel_index].stacked = false;
                        }
                    } else if(panel_x - slot_x < 0 && !CoreVars.cardMoving){
                    //Card is unstacking to the right
                        CoreVars.setCardMoving();
                        if(panel_y_overlap){
                        // Unstack multiple cards to the right
                            for(var ic = 0; ic < cardList.length; ic++){
                                if(cardList[ic].x_coord > panel_x){
                                    cardList[ic].x_coord += CoreVars.x_dim;
                                }
                                if(cardList[ic].x_coord === panel_x){
                                    if(cardList[ic].y_coord >= panel_y){
                                        cardList[ic].x_coord += CoreVars.x_dim;
                                        cardList[ic].y_coord -= panel_y;
                                    }
                                }
                            }
                        } else if(!panel_y_overlap){
                        // Unstack single card to the right
                            for(var id = 0; id < cardList.length; id++){
                                if(cardList[id].x_coord > panel_x){
                                    cardList[id].x_coord += CoreVars.x_dim;
                                }
                                if(cardList[id].x_coord === panel_x && cardList[id].y_coord > panel_y){
                                    cardList[id].y_coord -= CoreVars.y_dim;
                                }
                            }
                            cardList[panel_index].x_coord += CoreVars.x_dim;
                            cardList[panel_index].y_coord = 0;
                        }
                        
                        new_slot_index = CoreStack.getLowestPanel(cardList, panel_x).index;
                        new_panel_index = CoreStack.getLowestPanel(cardList, slot_x).index;
                        
                        cardList[new_slot_index].y_overlap = false;
                        if(cardList[new_slot_index].y_coord === 0){
                            cardList[new_slot_index].stacked = false;
                        }
                        
                        cardList[new_panel_index].y_overlap = false;
                        if(cardList[new_panel_index].y_coord === 0){
                            cardList[new_panel_index].stacked = false;
                        }
                    }
                }
                $rootScope.$digest();
            }
        };
        
    }]);
'use strict';

angular.module('decks').factory('DecksBread', ['$stateParams', '$location', 'Authentication', '$resource', '$rootScope', 'Bakery', 'CoreStack', 'CorePanel', 'CardsBread', function($stateParams, $location, Authentication, $resource, $rootScope, Bakery, CoreStack, CorePanel, CardsBread){
    
    var service = {};
    
    service.browseAspects = function(deck){
        Bakery.resource.archetypeList = [];
        Bakery.resource.allegianceList = [];
        Bakery.resource.raceList = [];
        Bakery.Aspects.query({deckId: deck._id}, function(response){
            for(var i = 0; i < response.length; i++){
                if(response[i].aspectType === 'Archetype'){
                    Bakery.resource.archetypeList.push(response[i]);
                } else if(response[i].aspectType === 'Allegiance'){
                    Bakery.resource.allegianceList.push(response[i]);
                } else if(response[i].aspectType === 'Race'){
                    Bakery.resource.raceList.push(response[i]);
                }
            }
        });
    };
    
    service.browseDependencies = function(){
        Bakery.Decks.query({deckType: 'Aspect'}, function(response){
            Bakery.dependencyDecks = response;
        });
    };
    
    //BROWSE
    service.browse = function(param){
        Bakery.resource = {};
        if(param){
            Bakery.Decks.query(param, function(response){
                response.unshift({
                    panelType: 'architectOptions'
                });
                Bakery.resource.cardList = response;
                CoreStack.setCardList(Bakery.resource.cardList);
            });
        } else {
            Bakery.Decks.list(function(response){
                response.unshift({
                    panelType: 'architectOptions'
                });
                Bakery.resource.cardList = response;
                CoreStack.setCardList(Bakery.resource.cardList);
            });
        }
    };
    
    //READ
    service.read = function(deck){
        Bakery.Decks.get({
            deckId: deck._id
        }, function(response){
            Bakery.resource = response;
            if(response.deckType !== 'Aspect'){
                
                service.browseDependencies();

                for(var i = 0; i < response.dependencies.length; i++){
                    service.browseAspects(response.dependencies[i]);
                }
            }
        });
    };
    
    //EDIT
    service.edit = function(deck, _editCards, _loadDeck) {
        var _deck = new Bakery.Decks(deck);

        _deck.$update(function(response) {
            if(_editCards){
                for(var i = 0; i < deck.cardList.length; i++){
                    var panel = deck.cardList[i];
                    CardsBread.edit(panel);
                }
                $rootScope.$broadcast('Bakery: deckSaved');
            }
            if(_loadDeck){
                service.resource = response;
            }
        }, function(errorResponse) {
            console.log(errorResponse);
        });
    };
    
    //ADD
    service.add = function(type, size){
        var deck = new Bakery.Decks ({
            name: type+' Deck',
            deckType: type,
            deckSize: size,
            cardList: [{
                panelType: 'deckOptions',
                x_coord: 0,
                y_coord: 0
            }]
        });

        deck.$save(
            function(response){
                for(var i = 0; i < size; i++){
                    CardsBread.add(deck, type, i+1, false, (i+1 === size));
                }
                if(type !== 'Aspect'){
                    service.browseDependencies();
                }
            });
    };
    
    //DELETE
    service.delete = function(deck, resource){
        deck.$remove(function(response){
            CorePanel.removePanel(deck, resource.cardList);
            CorePanel.setDeckSize(resource);
            CorePanel.collapseDeck(deck, resource.cardList);
        });
    };
    
    return service;
    
}]);
'use strict';

// General BREAD Factory-service.
angular.module('decks').factory('Decks', ['$resource',
        function($resource){
            return $resource(
                'deck/:deckId',
                {
                    deckId: '@_id'
                },
                {
                    update: {
                        method: 'PUT'
                    },
                    list: {
                        url: '/decks',
                        method: 'GET',
                        isArray: true
                    },
                    query: {
                        url: '/decks/:deckType',
                        method: 'GET',
                        isArray: true,
                        params: { deckType: 'deckType' }
                    }
                }
            );
        }]);
'use strict';

// Npcs controller
angular.module('npcs').controller('NpcsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Npcs',
	function($scope, $stateParams, $location, Authentication, Npcs ) {
		$scope.authentication = Authentication;

		// Create new Npc
		$scope.create = function() {
			// Create new Npc object
			var npc = new Npcs ({
				name: this.name
			});

			// Redirect after save
			npc.$save(function(response) {
				$location.path('npcs/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Npc
		$scope.remove = function( npc ) {
			if ( npc ) { npc.$remove();

				for (var i in $scope.npcs ) {
					if ($scope.npcs [i] === npc ) {
						$scope.npcs.splice(i, 1);
					}
				}
			} else {
				$scope.npc.$remove(function() {
					
				});
			}
		};

		// Update existing Npc
		$scope.update = function() {
			var npc = $scope.npc ;

			npc.$update(function() {
				
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Npcs
		$scope.find = function() {
			$scope.npcs = Npcs.query(
				function(response) {
					console.log(response);
				}
			);
		};

		// Find existing Npc
		$scope.findOne = function() {
			$scope.npc = Npcs.get({ 
				npcId: $stateParams.npcId
			});
		};
	}
]);
'use strict';

//Npcs service used to communicate Npcs REST endpoints
angular.module('npcs').factory('Npcs', ['$resource',
	function($resource) {
		return $resource('npcs/:npcId', {
			npcId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Directive for managing ability dice
angular.module('pcs')
    .directive('ability', ['$parse', '$rootScope', '$window', 'PcsCard1', function($parse, $rootScope, $window, PcsCard1){
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                
                var _ability = $parse(attrs.ability) || null;
                
                var _width;
                
                var _pressEvents = 'touchstart mousedown';
                
                var initialize = function(){
                    // prevent native drag
                    element.attr('draggable', 'false');
                    toggleListeners(true);
                    onHeightChange();
                };
                
                var toggleListeners = function(enable){
                    if (!enable)return;
                    
                    scope.$on('$destroy', onDestroy);
                    scope.$watch(attrs.ability, onAbilityChange);
                    scope.$on('screenSize:onHeightChange', onHeightChange);
                    element.on(_pressEvents, onPress);
                };
                
                var onDestroy = function(enable){
                    toggleListeners(false);
                };
                
                var getElementFontSize = function() {
                    return parseFloat(
                        $window.getComputedStyle(element[0], null).getPropertyValue('font-size')
                    );
                };
                
                var convertEm = function(value) {
                    return value * getElementFontSize();
                };
                
                var onAbilityChange = function(newVal, oldVal){
                    _ability = newVal;
                };
                
                var getPosition = function(){
                    var offset = element.offset();
                    var caret = _ability.order < 4 ? 'top-caret' : 'bottom-caret';
                    var topEdge = _ability.order < 4 ? offset.top + convertEm(3) : offset.top - convertEm(9);
                    var leftEdge = offset.left - convertEm(0.5);
                    return {
                        caret: caret,
                        topEdge: topEdge,
                        leftEdge: leftEdge,
                        ability: _ability
                    };
                };
                
                
                var onHeightChange = function(event, object){
                    if(_ability.order === PcsCard1.chosenAbility.order){
                        $rootScope.$broadcast('ability:setPosition', getPosition());
                    }
                };
                
                var onPress = function(){
                    $rootScope.$broadcast('ability:onPress', getPosition());
                };
                
                initialize();
            }
        };
    }]);
'use strict';

// Directive for managing dice box
angular.module('pcs')
	.directive('diceBox', ['$window', function($window) {
		return {
			restrict: 'A',
			templateUrl: '../modules/pcs/views/dice-box.html',
			link: function(scope, element, attrs) {
				
				var initialize = function(){
					// prevent native drag
					element.attr('draggable', 'false');
					toggleListeners(true);
				};
				
				var toggleListeners = function(enable){
					if (!enable)return;
					
					scope.$on('$destroy', onDestroy);
					scope.$on('ability:onPress', setPosition);
					scope.$on('ability:setPosition', setPosition);
				};
				
				var onDestroy = function(enable){
					toggleListeners(false);
				};
				
				var getElementFontSize = function() {
					return parseFloat(
						$window.getComputedStyle(element[0], null).getPropertyValue('font-size')
					);
				};
				
				var convertEm = function(value) {
					return value * getElementFontSize();
				};
				
				var setPosition = function(event, object){
					var _caret = object.caret;
					var _topEdge = object.topEdge;
					var _leftEdge = object.leftEdge;
					element.removeClass('top-caret');
					element.removeClass('bottom-caret');
					element.addClass(_caret);
					element.css({
						'top': _topEdge+'px',
						'left': _leftEdge+'px'
					});
				};
				
				initialize();
				
			}
		};
	}]);
'use strict';

// Directive for managing modal deck
angular.module('pcs')
	.directive('modalDeck', ['$window', function($window) {
		return {
			restrict: 'A',
			templateUrl: '../modules/pcs/views/modal-deck.html',
			link: function(scope, element, attrs) {
				
			}
		};
	}]);
'use strict';

// Factory-service for managing PC card deck.
angular.module('pcs').factory('PcsAugments', ['Bakery', 'CoreStack',
	function(Bakery, CoreStack){
		
		var service = {};
		
		// Factor Augment Limit
		service.factorAugmentLimit = function(){
			Bakery.resource.augmentLimit = Math.round((Bakery.resource.level || 0) / 4);
			this.validateAugments();
		};
		
		service.validateAugments = function(){
			for(var ia = 0; ia < Bakery.resource.augmentLimit; ia++){
				if(!this.augmentAtLevel(ia * 4 + 2)){
					this.addAugment(ia * 4 + 2);
				}
			}
			for(var ic = 0; ic < Bakery.resource.cardList.length; ic++){
				if(Bakery.resource.cardList[ic].level > Bakery.resource.level){
					console.log('TODO: remove card');
				}
			}
		};
		
		service.augmentAtLevel = function(level){
			var augmentAtLevel = false;
			for(var ib = 0; ib < Bakery.resource.cardList.length; ib++){
				if(Bakery.resource.cardList[ib].panelType === 'Augment'){
					if(Bakery.resource.cardList[ib].level === level){
						augmentAtLevel = true;
					}
				}
			}
			return augmentAtLevel;
		};
		
		service.addAugment = function(level){
			var newAugment = {
				panelType: 'Augment',
				x_coord: CoreStack.getLastPanel(Bakery.resource.cardList).panel.x_coord + 15,
				y_coord: 0,
				x_overlap: false,
				y_overlap: false,
				dragging: false,
				stacked: false,
				locked: true,
				level: level,
				augmentData: {
					name: 'Level '+level+' Augment'
				}
			};
			Bakery.resource.cardList.push(newAugment);
		};
		
		return service;
	}]);
'use strict';

angular.module('pcs').factory('PcsBread', ['$stateParams', '$location', 'Authentication', '$resource', '$rootScope', 'Bakery', 'CoreStack', 'CorePanel', 'pcsDefaults', function($stateParams, $location, Authentication, $resource, $rootScope, Bakery, CoreStack, CorePanel, pcsDefaults){
    var service = {};
    
    //BROWSE
    service.browse = function(){
        Bakery.resource = {};
        Bakery.resource.cardList = [];
        Bakery.Pcs.query(function(response){
            response.unshift({
                panelType: 'playerOptions'
            });
            Bakery.resource.cardList = response;
            CoreStack.setCardList(Bakery.resource.cardList);
        });
    };
    
    //READ
    service.read = function(pc) {
        Bakery.resource = Bakery.Pcs.get({
            pcId: pc._id
        });
    };
    
    //EDIT
    service.edit = function(pc) {
        pc.$update(function(response) {

        }, function(errorResponse) {
            this.error = errorResponse.data.message;
        });
    };
    
    //ADD
    service.add = function(){
        var pc = new Bakery.Pcs (
            pcsDefaults
        );

        pc.$save(function(response){
            Bakery.resource = response;
        });
    };
    
    //DELETE
    service.delete = function(pc, resource){
        pc.$remove(function(response){
            CorePanel.removePanel(pc, resource.cardList);
            CorePanel.setDeckSize(resource);
            CorePanel.collapseDeck(pc, resource.cardList);
        });
    };
    
    return service;
    
}]);
'use strict';

// Factory-service for managing pc1 data.
angular.module('pcs').factory('PcsCard1', ['$rootScope', 'Bakery', 'CoreVars',
	function($rootScope, Bakery, CoreVars){
		var service = {};
		
		service.chosenDie = {};
		service.previousDie = {};
		service.chosenAbility = {};
		
		service.chooseAbility = function(ability){
			service.chosenAbility = Bakery.resource.abilities[ability];
		};
		
		$rootScope.$on('ability:onPress', function(event, object){
			console.log(object);
			service.chosenAbility = Bakery.resource.abilities[object.ability.order];
		});
		
		service.chooseDie = function(dice){
			CoreVars.modalShown = false;
			CoreVars.diceBoxShown = false;
			
			var _abilityPair;
			var _ability1;
			var _ability2;
			
			this.chosenDie = Bakery.resource.dicepool[dice];
			
			this.previousDie = this.chosenAbility.dice;
			
			Bakery.resource.dicepool[dice] = Bakery.resource.dicepool[0];
			
			if(this.previousDie.order > 0){
				Bakery.resource.dicepool[this.previousDie.order] = this.previousDie;
			}
			
			Bakery.resource.abilities[this.chosenAbility.order].dice = this.chosenDie;
			
			switch(this.chosenAbility.order){
				case 0:
				case 1:
					_abilityPair = 1;
					_ability1 = Bakery.resource.abilities[0];
					_ability2 =  Bakery.resource.abilities[1];
					break;
				case 2:
				case 3:
					_abilityPair = 2;
					_ability1 = Bakery.resource.abilities[2];
					_ability2 =  Bakery.resource.abilities[3];
					break;
				case 4:
				case 5:
					_abilityPair = 3;
					_ability1 = Bakery.resource.abilities[4];
					_ability2 =  Bakery.resource.abilities[5];
					break;
				case 6:
				case 7:
					_abilityPair = 4;
					_ability1 = Bakery.resource.abilities[6];
					_ability2 =  Bakery.resource.abilities[7];
					break;
			}
			
			$rootScope.$broadcast('pcsCard1:updateAbility', {
				abilityPair: _abilityPair,
				ability1: _ability1,
				ability2: _ability2
			});
		};
		
		service.factorBlock = function(_str, _phy){
			if (Number(_str.dice.sides) > Number(_phy.dice.sides)){
				Bakery.resource.block = '2' + _str.dice.name;
			} else {
				Bakery.resource.block = '2' + _phy.dice.name;
			}
		};
		
		service.factorDodge = function(_fle, _dex){
			if (Number(_fle.dice.sides) > Number(_dex.dice.sides)){
				Bakery.resource.dodge = '2' + _fle.dice.name;
			} else {
				Bakery.resource.dodge = '2' + _dex.dice.name;
			}
		};
		
		service.factorAlertness = function(_acu, _int){
			if (Number(_acu.dice.sides) > Number(_int.dice.sides)){
				Bakery.resource.alertness = '2' + _acu.dice.name;
			} else {
				Bakery.resource.alertness = '2' + _int.dice.name;
			}
		};
		
		service.factorTenacity = function(_wis, _cha){
			if (Number(_wis.dice.sides) > Number(_cha.dice.sides)){
				Bakery.resource.tenacity = '2' + _wis.dice.name;
			} else {
				Bakery.resource.tenacity = '2' + _cha.dice.name;
			}
		};
		
		return service;
	}]);
'use strict';

// Factory-service for managing pc2 data.
angular.module('pcs').factory('PcsCard2', ['$rootScope', 'Bakery', 'PcsTraits',
	function($rootScope, Bakery, PcsTraits){
		var service = {};
		
		service.factorExperience = function(){
			var mLevel = 0;
			var mExperience = Number(Bakery.resource.experience);
			for (var increment = 8; increment <= mExperience; increment++){
				mLevel++;
				mExperience = mExperience - increment;
			}
			Bakery.resource.level = mLevel;
		};
		
		service.factorHealth = function(){
			Bakery.resource.healthLimit = 
				Math.round(
					(Number(Bakery.resource.abilities[0].dice.sides) +
						Number(Bakery.resource.abilities[1].dice.sides)
					) * ((Bakery.resource.level || 0)/16 + 1));
			Bakery.resource.healthCurrent =
				Number(Bakery.resource.healthLimit - Bakery.resource.injury);
		};
		
		service.factorStamina = function(){
			Bakery.resource.staminaLimit = 
				Math.round(
					(Number(Bakery.resource.abilities[0].dice.sides) +
						Number(Bakery.resource.abilities[1].dice.sides)
					) * ((Bakery.resource.level || 0)/16 + 1));
			Bakery.resource.staminaCurrent =
				Number(Bakery.resource.healthLimit - Bakery.resource.injury);
		};
		
		service.factorCarryingCapacity = function(){
			Bakery.resource.carryCurrent = 0;
			Bakery.resource.carryLimit =
				Number(Bakery.resource.abilities[0].dice.sides) +
				Number(Bakery.resource.abilities[1].dice.sides);
		};
		
		return service;
	}]);
'use strict';

// Factory-service for managing pc3 data.
angular.module('pcs').factory('PcsCard3', ['$rootScope', 'Bakery',
	function($rootScope, Bakery){
		var service = {};
		
		return service;
	}]);
'use strict';

angular.module('pcs').factory('pcsDefaults', [function(){
		
		var defaultStats = {
			abilities: [
				{ name: 'Strength', order: 0, dice: { name: 'd__', image: 'modules/core/img/d___.png', sides: '0', order: 0 } },
				{ name: 'Physique', order: 1, dice: { name: 'd__', image: 'modules/core/img/d___.png', sides: '0', order: 0 } },
				{ name: 'Flexibility', order: 2, dice: { name: 'd__', image: 'modules/core/img/d___.png', sides: '0', order: 0 } },
				{ name: 'Dexterity', order: 3, dice: { name: 'd__', image: 'modules/core/img/d___.png', sides: '0', order: 0 } },
				{ name: 'Acuity', order: 4, dice: { name: 'd__', image: 'modules/core/img/d___.png', sides: '0', order: 0 } },
				{ name: 'Intelligence', order: 5, dice: { name: 'd__', image: 'modules/core/img/d___.png', sides: '0', order: 0 } },
				{ name: 'Wisdom', order: 6, dice: { name: 'd__', image: 'modules/core/img/d___.png', sides: '0', order: 0 } },
				{ name: 'Charisma', order: 7, dice: { name: 'd__', image: 'modules/core/img/d___.png', sides: '0', order: 0 } }
			],
			dicepool: [
				{ name: 'd__', image: 'modules/core/img/d___.png', sides: '0', order: 0 },
				{ name: 'd4', image: 'modules/core/img/d_04.png', sides: '4', order: 1 },
				{ name: 'd6', image: 'modules/core/img/d_06.png', sides: '6', order: 2 },
				{ name: 'd6', image: 'modules/core/img/d_06.png', sides: '6', order: 3 },
				{ name: 'd8', image: 'modules/core/img/d_08.png', sides: '8', order: 4 },
				{ name: 'd8', image: 'modules/core/img/d_08.png', sides: '8', order: 5 },
				{ name: 'd10', image: 'modules/core/img/d_10.png', sides: '10', order: 6 },
				{ name: 'd10', image: 'modules/core/img/d_10.png', sides: '10', order: 7 },
				{ name: 'd12', image: 'modules/core/img/d_12.png', sides: '12', order: 8 }
			],
			cardList: [
				{
					panelType: 'pc1',
					x_coord: 0,
					y_coord: 0,
					x_overlap: false,
					y_overlap: false,
					dragging: false,
					stacked: false,
					locked: true
				},
				{
					panelType: 'pc2',
					x_coord: 15,
					y_coord: 0,
					x_overlap: false,
					y_overlap: false,
					dragging: false,
					stacked: false,
					locked: true
				},
				{
					panelType: 'pc3',
					x_coord: 30,
					y_coord: 0,
					x_overlap: false,
					y_overlap: false,
					dragging: false,
					stacked: false,
					locked: true,
				},
				{
					panelType: 'Trait',
					x_coord: 45,
					y_coord: 0,
					x_overlap: false,
					y_overlap: false,
					dragging: false,
					stacked: false,
					locked: true,
					level: 0,
					traitData: {
						name: 'Level 0 Trait'
					}
				}
			]
		};
		
		return defaultStats;
		
	}]);
'use strict';

// Factory-service for managing PC card deck.
angular.module('pcs').factory('PcsFeats', ['Bakery', 'CoreStack',
	function(Bakery, CoreStack){
		
		var service = {};
		
		// Factor Feat Limit
		service.factorFeatLimit = function(){
			Bakery.resource.featLimit = Math.ceil((Bakery.resource.level) / 4) || 0;
			Bakery.resource.featDeck = Bakery.resource.level;
			this.validateFeats();
		};
		
		service.validateFeats = function(){
			for(var ia = 0; ia < Bakery.resource.featDeck; ia++){
				if(!this.featAtLevel(ia + 1)){
					this.addFeat(ia + 1);
				}
			}
			for(var ic = 0; ic < Bakery.resource.cardList.length; ic++){
				if(Bakery.resource.cardList[ic].level > Bakery.resource.level){
					console.log('TODO: remove card');
				}
			}
		};
		
		service.featAtLevel = function(level){
			var featAtLevel = false;
			for(var ib = 0; ib < Bakery.resource.cardList.length; ib++){
				if(Bakery.resource.cardList[ib].panelType === 'Feat'){
					if(Bakery.resource.cardList[ib].level === level){
						featAtLevel = true;
					}
				}
			}
			return featAtLevel;
		};
		
		service.addFeat = function(level){
			var newFeat = {
				panelType: 'Feat',
				x_coord: CoreStack.getLastPanel(Bakery.resource.cardList).panel.x_coord + 15,
				y_coord: 0,
				x_overlap: false,
				y_overlap: false,
				dragging: false,
				stacked: false,
				locked: true,
				level: level,
				featData: {
					name: 'Level '+level+' Feat'
				}
			};
			Bakery.resource.cardList.push(newFeat);
		};
		
		return service;
	}]);

'use strict';

// Factory-service for managing PC items.
angular.module('pcs').factory('PcsItems', ['Bakery',
	function(Bakery){
		var service = {};
		
		
		
		return service;
	}]);


'use strict';

// Factory-service for managing PC traits
angular.module('pcs').factory('PcsTraits', ['Bakery', 'CoreStack',
	function(Bakery, CoreStack){
		
		var service = {};
		
		// Factor Trait Limit
		service.factorTraitLimit = function(){
			Bakery.resource.traitLimit = Math.floor((Bakery.resource.level || 0) / 4 + 1);
			this.validateTraits();
		};
		
		service.validateTraits = function(){
			for(var ia = 0; ia < Bakery.resource.traitLimit; ia++){
				if(!this.traitAtLevel(ia * 4)){
					this.addTrait(ia * 4);
				}
			}
			for(var ic = 0; ic < Bakery.resource.cardList.length; ic++){
				if(Bakery.resource.cardList[ic].level > Bakery.resource.level){
					console.log('TODO: remove card');
				}
			}
		};
		
		service.traitAtLevel = function(level){
			var traitAtLevel = false;
			for(var ib = 0; ib < Bakery.resource.cardList.length; ib++){
				if(Bakery.resource.cardList[ib].panelType === 'Trait'){
					if(Bakery.resource.cardList[ib].level === level){
						traitAtLevel = true;
					}
				}
			}
			return traitAtLevel;
		};
		
		service.addTrait = function(level){
			var newTrait = {
				panelType: 'Trait',
				x_coord: CoreStack.getLastPanel(Bakery.resource.cardList).panel.x_coord + 15,
				y_coord: 0,
				x_overlap: false,
				y_overlap: false,
				dragging: false,
				stacked: false,
				locked: true,
				level: level,
				traitData: {
					name: 'Level '+level+' Trait'
				}
			};
			Bakery.resource.cardList.push(newTrait);
		};
		
		return service;
	}]);
'use strict';

// General BREAD Factory-service.
angular.module('decks').factory('Pcs', ['$resource',
        function($resource){
            return $resource(
                'pcs/:pcId',
                {
                    pcId: '@_id'
                },
                {
                    update: {
                        method: 'PUT'
                    }
                }
            );
        }]);
'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour 
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);
'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('profile', {
			url: '/settings/profile',
			templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
		}).
		state('password', {
			url: '/settings/password',
			templateUrl: 'modules/users/views/settings/change-password.client.view.html'
		}).
		state('accounts', {
			url: '/settings/accounts',
			templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
		}).
		state('signup', {
			url: '/signup',
			templateUrl: 'modules/users/views/authentication/signup.client.view.html'
		}).
		state('signin', {
			url: '/signin',
			templateUrl: 'modules/users/views/authentication/signin.client.view.html'
		}).
		state('forgot', {
			url: '/password/forgot',
			templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
		}).
		state('reset-invlaid', {
			url: '/password/reset/invalid',
			templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
		}).
		state('reset-success', {
			url: '/password/reset/success',
			templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
		}).
		state('reset', {
			url: '/password/reset/:token',
			templateUrl: 'modules/users/views/password/reset-password.client.view.html'
		});
	}
]);
'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, $stateParams, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		// Submit forgotten password account id
		$scope.askForPasswordReset = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/forgot', $scope.credentials).success(function(response) {
				// Show user success message and clear form
				$scope.credentials = null;
				$scope.success = response.message;

			}).error(function(response) {
				// Show user error message and clear form
				$scope.credentials = null;
				$scope.error = response.message;
			});
		};

		// Change user password
		$scope.resetUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$location.path('/password/reset/success');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid){
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);
	
				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);

'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [

	function() {
		var _this = this;

		_this._data = {
			user: window.user
		};

		return _this._data;
	}
]);
'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
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
ApplicationConfiguration.registerModule('builder');

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
ApplicationConfiguration.registerModule('move');

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('narrator');
'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('npcs');

'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('pcs');

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('player');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');

'use strict';

angular.module('core').factory('BuilderHub', ['$rootScope', 'Bakery', 'DecksBread', function($rootScope, Bakery, DecksBread) {
    
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
					if(!scope.panel.left.overlap && !scope.panel.above.overlap){
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
			templateUrl: '../modules/player/views/options-player.html'
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
	.directive('featureCard', ['DataSRVC', 'Bakery', 'BuilderHub', function(DataSRVC, Bakery, BuilderHub){
		return {
			restrict: 'A',
			templateUrl: '../modules/cards/views/feature-card.html',
			scope: { card: '=', panel: '=' },
			link: function(scope, element, attrs){
				scope.Bakery = Bakery;
				scope.dataSRVC = DataSRVC;
				scope.BuilderHub = BuilderHub;
			}
		};
	}])
	.directive('narratorOptions', function(){
		return {
			restrict: 'A',
			templateUrl: '../modules/narrator/views/options-narrator.html'
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
	.directive('builderOptions', function(){
		return {
			restrict: 'A',
			templateUrl: '../modules/builder/views/options-builder.html'
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
	})
	.directive('deckDemo', function(){
		return {
			restrict: 'A',
			templateUrl: '../modules/core/views/deck-demo.html'
		};
	});
'use strict';

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

angular.module('cards').factory('CardsBread', ['Bakery', 'PanelUtils', 'DeckUtils',
    function(Bakery, PanelUtils, DeckUtils){
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
            var cardParams = PanelUtils.getCardParams(params);
            Bakery.getCardResource(cardType).query(cardParams, function(response){
                return response;
            });
        };
        
        //READ
        service.read = function(panel, callback){
            var params = PanelUtils.getCardParams(panel);
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
                var panelData = PanelUtils.getPanelData(panel);
                if(panelData.aspect) cardResource.aspect = panelData.aspect._id;
            }
            cardResource.$update();
        };
        
        //ADD
        service.add = function(resource, prevId, cardNumber, callback){
            
            var _prev;
            
            if(prevId){
                _prev = PanelUtils.getPanel(resource.cardList, prevId);
            } else {
                _prev = PanelUtils.getLast(resource.cardList).panel;
            }
            
            console.log('add: _prev._id = '+_prev._id);
            
            var _next = PanelUtils.getNext(resource.cardList, _prev._id).panel;
            
            var card = {
                deck: resource._id,
                deckName: resource.name,
                deckSize: resource.deckSize,
                cardNumber: cardNumber,
                cardType: resource.deckType
            };
            
            var panel = {
                panelType: resource.deckType,
                x_coord: _prev.x_coord + 15,
                y_coord: 0
            };
            
            PanelUtils.setPanelData(panel, card);
            
            var cardResource = Bakery.getNewCardResource(panel);
            
            cardResource.$save(function(response){
                PanelUtils.setPanelData(panel, response);
                resource.cardList.push(panel);
            }).then(function(response){
                if(callback) callback(response);
            });
        };
        
        //DELETE
        service.delete = function(resource, panel){
            if(panel.panelType === 'architectOptions') return;
            
            var cardResource = Bakery.getNewCardResource(panel);
            cardResource.$remove(function(response){
                if(resource) PanelUtils.removePanel(resource.cardList, panel);
            }).then(function(response){
                if(resource) DeckUtils.setDeckSize(resource);
            }).then(function(response){
                if(resource) DeckUtils.collapseDeck(resource.cardList, panel);
            }).then(function(response){
                if(resource) editDeck(resource, false);
            });
        };
        
        return service;
        
    }]);
'use strict';

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

angular.module('cards').factory('Notes', ['$resource',
        function($resource){
            return $resource(
                'notes/:noteId',
                {
                    noteId: '@_id'
                },
                {
                    update: {
                        method: 'PUT'
                    }
                }
            );
        }]);
'use strict';

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
	.controller('CoreController', ['$scope', '$rootScope', 'Authentication', 'Bakery', 'CardsBread', 'DecksBread', 'PcsBread', 'DataSRVC', 'PcsTraits', 'PcsFeats', 'PcsAugments', 'PcsItems', 'BuilderHub', 'PlayerHub', 'CoreVars', 'DeckUtils', 'shuffleDeck',
		function($scope, $rootScope, Authentication, Bakery, CardsBread, DecksBread, PcsBread, DataSRVC, PcsTraits, PcsFeats, PcsAugments, PcsItems, BuilderHub, PlayerHub, CoreVars, DeckUtils, shuffleDeck) {
			
			// This provides Authentication context.
			$scope.authentication = Authentication;
			
			$scope.Bakery = Bakery;
            
			$scope.dataSRVC = DataSRVC;
			
			$scope.pcsTraits = PcsTraits;
			
			$scope.pcsFeats = PcsFeats;
			
			$scope.pcsAugments = PcsAugments;
			
			$scope.pcsItems = PcsItems;
			
			$scope.BuilderHub = BuilderHub;
			
			$scope.PlayerHub = PlayerHub;
			
			$scope.CoreVars = CoreVars;
			
			var pcNew = false;
			
			var initialize = function(){
				toggleListeners(true);
			};
			
			var toggleListeners = function(enable){
				if (!enable) return;
				$scope.$on('$destroy', onDestroy);
				$scope.$on('ability:onPress', PlayerHub.chooseAbility);
				$scope.$watch('CoreVars.EXP', PlayerHub.watchEXP);
				$scope.$watch('Bakery.resource.experience', PlayerHub.watchExperience);
				$scope.$watch('Bakery.resource.level', PlayerHub.watchLevel);
			};
			
			var onDestroy = function(){
				toggleListeners(false);
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
				CardsBread.delete(Bakery.resource, panel);
			};
            
			$scope.deleteDeck = function(deck){
				DecksBread.delete(Bakery.resource, deck);
			};
            
            $scope.deletePc = function(pc){
				PcsBread.delete(Bakery.resource, pc);
			};
			
            //Misc Handler Functions
			$scope.exitPc = function(pc){
				if(pcNew){
					PcsBread.delete(Bakery.resource, pc);
				}
				$scope.browsePcs();
			};
			
			$scope.shuffleDeck = function(cardList){
				shuffleDeck(cardList);
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

// General BREAD Factory-service.
angular.module('core').factory('Bakery', ['Decks', 'StackUtils', 'PanelUtils', 'demoDeck', 'Pcs', 'Aspects', 'Traits', 'Feats', 'Augments', 'Items', 'Origins', 'Notes', function(Decks, StackUtils, PanelUtils, demoDeck, Pcs, Aspects, Traits, Feats, Augments, Items, Origins, Notes){
	var service = {};
    
    service.Decks = Decks;
    
    service.Pcs = Pcs;
    
    service.Aspects = Aspects;
    
    service.Traits = Traits;
    
    service.Feats = Feats;
    
    service.Augments = Augments;
    
    service.Items = Items;
    
    service.Origins = Origins;
    
    service.Notes = Notes;
    
    service.resource = demoDeck;
    
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
            case 'Note':
                return service.Notes;
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
            case 'Note':
                return new service.Origins(panel.noteData);
            default:
                return false;
        }
    };
    
    return service;
}]);
'use strict';

// Factory-service for managing card-deck, card-slot and card-panel directives.
angular.module('core').factory('CoreVars', ['$rootScope',
    function($rootScope){
        
        var service = {};
        
        service.windowHeight = 0;
        
        service.experience = 0;
        service.x_dim_em = 15;
        service.y_dim_em = 21;
        service.x_tab_em = 3;
        service.y_tab_em = 3;
        service.x_cover_em = 12;
        service.y_cover_em = 18;
        
        service.x_dim_px = 240;
        service.y_dim_px = 336;
        service.x_tab_px = 48;
        service.y_tab_px = 48;
        service.x_cover_px = 144;
        service.y_cover_px = 192;
        
        service.nullPanel = {
            _id: null, x_coord: 0, y_coord: 0,
            above: { adjacent: null, overlap: null },
            below: { adjacent: null, overlap: null },
            left: { adjacent: null, overlap: null },
            right: { adjacent: null, overlap: null }
        };
        
        service.cardMoved = false;
        service.cardMoving = false;
        var moveTimer;
        
        service.modalShown = false;
        service.diceBoxShown = false;
        service.modalDeckShown = false;
        
        $rootScope.$on('screenSize:onHeightChange', function(event, object){
            service.windowHeight = object.newHeight;
        });
        
        service.setCardMoving = function(){
            clearTimeout(moveTimer);
            service.cardMoving = true;
            service.cardMoved = true;
            moveTimer = setTimeout(function(){
                service.cardMoving = false;
                $rootScope.$broadcast('CoreVars:getDeckWidth');
            }, 800);
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

angular.module('core').factory('demoDeck', ['StackUtils', 'PanelUtils', function(StackUtils, PanelUtils){
    return {
        dependencies: [],
        deckType: '',
        deckSize: 3,
        cardList: [
            {
                _id: 'DC1',
                panelType: 'deckDemo',
                x_coord: 0,
                y_coord: 0,
                above: {
                    adjacent: null,
                    overlap: null
                },
                below: {
                    adjacent: null,
                    overlap: null
                },
                left: {
                    adjacent: null,
                    overlap: null
                },
                right: {
                    adjacent: 'DC2',
                    overlap: null
                },
                content: 'Here is a basic demonstration of a card-deck layout. While additional features may be accessed via the menu bar, this simple demo serves to show how card-objects may be manipulated by the user, much the same as you might a physical deck of cards.'
            },
            {
                _id: 'DC2',
                panelType: 'deckDemo',
                x_coord: 15,
                y_coord: 0,
                above: {
                    adjacent: null,
                    overlap: null
                },
                below: {
                    adjacent: null,
                    overlap: null
                },
                left: {
                    adjacent: 'DC1',
                    overlap: null
                },
                right: {
                    adjacent: 'DC3',
                    overlap: null
                },
                content: 'For starters, cards can be moved around freely, automatically returning to their position unless moved to a new position.'
            },
            {
                _id: 'DC3',
                panelType: 'deckDemo',
                x_coord: 30,
                y_coord: 0,
                above: {
                    adjacent: null,
                    overlap: null
                },
                below: {
                    adjacent: null,
                    overlap: null
                },
                left: {
                    adjacent: 'DC2',
                    overlap: null
                },
                right: {
                    adjacent: 'DC4',
                    overlap: null
                },
                content: 'Note that the content of each card may vary, and has no relation whatsoever to its actual position. Click again to cover it back up.'
            },
            {
                _id: 'DC4',
                panelType: 'deckDemo',
                x_coord: 45,
                y_coord: 0,
                above: {
                    adjacent: null,
                    overlap: null
                },
                below: {
                    adjacent: null,
                    overlap: null
                },
                left: {
                    adjacent: 'DC3',
                    overlap: null
                },
                right: {
                    adjacent: 'DC5',
                    overlap: null
                },
                content: 'Cards may be stacked vertically. Click on an covered card to uncover it.'
            },
            {
                _id: 'DC5',
                panelType: 'deckDemo',
                x_coord: 60,
                y_coord: 0,
                above: {
                    adjacent: null,
                    overlap: null
                },
                below: {
                    adjacent: null,
                    overlap: null
                },
                left: {
                    adjacent: 'DC4',
                    overlap: null
                },
                right: {
                    adjacent: 'DC6',
                    overlap: null
                },
                content: 'Cards can also be stacked horizontally, but only if they are not already stacked vertically.'
            },
            {
                _id: 'DC6',
                panelType: 'deckDemo',
                x_coord: 75,
                y_coord: 0,
                above: {
                    adjacent: null,
                    overlap: null
                },
                below: {
                    adjacent: null,
                    overlap: null
                },
                left: {
                    adjacent: 'DC5',
                    overlap: null
                },
                right: {
                    adjacent: 'DC7',
                    overlap: null
                },
                content: 'Both vertical and horizontal stacks may be reordered as a single entity.'
            },
            {
                _id: 'DC7',
                panelType: 'deckDemo',
                x_coord: 90,
                y_coord: 0,
                above: {
                    adjacent: null,
                    overlap: null
                },
                below: {
                    adjacent: null,
                    overlap: null
                },
                left: {
                    adjacent: 'DC6',
                    overlap: null
                },
                right: {
                    adjacent: 'DC8',
                    overlap: null
                },
                content: 'The content of each card can also be modified by the user (TODO: add input field).'
            },
            {
                _id: 'DC8',
                panelType: 'deckDemo',
                x_coord: 105,
                y_coord: 0,
                above: {
                    adjacent: null,
                    overlap: null
                },
                below: {
                    adjacent: null,
                    overlap: null
                },
                left: {
                    adjacent: 'DC7',
                    overlap: null
                },
                right: {
                    adjacent: null,
                    overlap: null
                },
                content: 'More coming soon! Recently refactored panel "getter" and "setter" methods to return a specific panel based upon its unique objectId, instead of its x/y coordinates. This should allow for more reliable and flexible stacking, including the possibility of overlapping horizontal and vertical stacks.'
            }
        ]
    };
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
            _id: 'aspect_1_id',
            panelType: 'Aspect',
            aspectData: {
                name: 'Aspect the First',
                cardType: 'Aspect',
                cardNumber: 1
            }
        };
        
        mockData.aspect_2 = {
            _id: 'aspect_2_id',
            panelType: 'Aspect',
            aspectData: {
                name: 'Aspect the Second',
                cardType: 'Aspect',
                cardNumber: 2
            }
        };
        
        mockData.aspect_3 = {
            _id: 'aspect_3_id',
            panelType: 'Aspect',
            aspectData: {
                name: 'Aspect the Third',
                cardType: 'Aspect',
                cardNumber: 3
            }
        };
        
        mockData.aspect_4 = {
            _id: 'aspect_4_id',
            panelType: 'Aspect',
            aspectData: {
                name: 'Aspect the Fourth',
                cardType: 'Aspect',
                cardNumber: 4
            }
        };
        
        mockData.aspect_5 = {
            _id: 'aspect_5_id',
            panelType: 'Aspect',
            aspectData: {
                name: 'Aspect the Fifth',
                cardType: 'Aspect',
                cardNumber: 5
            }
        };
        
        mockData.aspect_6 = {
            _id: 'aspect_6_id',
            panelType: 'Aspect',
            aspectData: {
                name: 'Aspect the Sixth',
                cardType: 'Aspect',
                cardNumber: 6
            }
        };
        
        mockData.aspect_7 = {
            _id: 'aspect_7_id',
            panelType: 'Aspect',
            aspectData: {
                name: 'Aspect the Seventh',
                cardType: 'Aspect',
                cardNumber: 7
            }
        };
        
        mockData.aspect_8 = {
            _id: 'aspect_8_id',
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
            _id: 'trait_1_id',
            panelType: 'Trait',
            traitData: {
                name: 'Trait the First',
                cardType: 'Trait',
                cardNumber: 1
            }
        };
        
        mockData.trait_2 = {
            _id: 'trait_2_id',
            panelType: 'Trait',
            traitData: {
                name: 'Trait the Second',
                cardType: 'Trait',
                cardNumber: 2
            }
        };
        
        mockData.trait_3 = {
            _id: 'trait_3_id',
            panelType: 'Trait',
            traitData: {
                name: 'Trait the Third',
                cardType: 'Trait',
                cardNumber: 3
            }
        };
        
        mockData.trait_4 = {
            _id: 'trait_4_id',
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
            _id: 'feat_1_id',
            panelType: 'Feat',
            x_coord: 0,
            y_coord: 0,
            above: {
                adjacent: null,
                overlap: null
            },
            below: {
                adjacent: null,
                overlap: null
            },
            left: {
                adjacent: null,
                overlap: null
            },
            right: {
                adjacent: 'feat_2_id',
                overlap: null
            },
            featData: {
                name: 'Feat the First',
                cardType: 'Feat',
                cardNumber: 1
            }
        };
        
        mockData.feat_2 = {
            _id: 'feat_2_id',
            panelType: 'Feat',
            x_coord: 15,
            y_coord: 0,
            above: {
                adjacent: null,
                overlap: 'feat_3_id'
            },
            below: {
                adjacent: null,
                overlap: null
            },
            left: {
                adjacent: 'feat_1_id',
                overlap: null
            },
            right: {
                adjacent: null,
                overlap: null
            },
            featData: {
                name: 'Feat the Second',
                cardType: 'Feat',
                cardNumber: 2
            }
        };
        
        mockData.feat_3 = {
            _id: 'feat_3_id',
            panelType: 'Feat',
            x_coord: 15,
            y_coord: 3,
            above: {
                adjacent: null,
                overlap: null
            },
            below: {
                adjacent: null,
                overlap: 'feat_2_id'
            },
            left: {
                adjacent: null,
                overlap: null
            },
            right: {
                adjacent: 'feat_4_id',
                overlap: null
            },
            featData: {
                name: 'Feat the Third',
                cardType: 'Feat',
                cardNumber: 3
            }
        };
        
        mockData.feat_4 = {
            _id: 'feat_4_id',
            panelType: 'Feat',
            x_coord: 30,
            y_coord: 0,
            above: {
                adjacent: null,
                overlap: 'feat_5_id'
            },
            below: {
                adjacent: null,
                overlap: null
            },
            left: {
                adjacent: 'feat_3_id',
                overlap: null
            },
            right: {
                adjacent: null,
                overlap: null
            },
            featData: {
                name: 'Feat the Fourth',
                cardType: 'Feat',
                cardNumber: 4
            }
        };
        
        mockData.feat_5 = {
            _id: 'feat_5_id',
            panelType: 'Feat',
            x_coord: 30,
            y_coord: 3,
            above: {
                adjacent: null,
                overlap: 'feat_6_id'
            },
            below: {
                adjacent: null,
                overlap: 'feat_4_id'
            },
            left: {
                adjacent: null,
                overlap: null
            },
            right: {
                adjacent: null,
                overlap: null
            },
            featData: {
                name: 'Feat the Fifth',
                cardType: 'Feat',
                cardNumber: 5
            }
        };
        
        mockData.feat_6 = {
            _id: 'feat_6_id',
            panelType: 'Feat',
            x_coord: 30,
            y_coord: 6,
            above: {
                adjacent: null,
                overlap: null
            },
            below: {
                adjacent: null,
                overlap: 'feat_5_id'
            },
            left: {
                adjacent: null,
                overlap: null
            },
            right: {
                adjacent: 'feat_7_id',
                overlap: null
            },
            featData: {
                name: 'Feat the Sixth',
                cardType: 'Feat',
                cardNumber: 6
            }
        };
        
        mockData.feat_7 = {
            _id: 'feat_7_id',
            panelType: 'Feat',
            x_coord: 45,
            y_coord: 0,
            above: {
                adjacent: null,
                overlap: 'feat_8_id'
            },
            below: {
                adjacent: null,
                overlap: null
            },
            left: {
                adjacent: 'feat_6_id',
                overlap: null
            },
            right: {
                adjacent: null,
                overlap: null
            },
            featData: {
                name: 'Feat the Seventh',
                cardType: 'Feat',
                cardNumber: 7
            }
        };
        
        mockData.feat_8 = {
            _id: 'feat_8_id',
            panelType: 'Feat',
            x_coord: 45,
            y_coord: 3,
            above: {
                adjacent: null,
                overlap: 'feat_9_id'
            },
            below: {
                adjacent: null,
                overlap: 'feat_7_id'
            },
            left: {
                adjacent: null,
                overlap: null
            },
            right: {
                adjacent: null,
                overlap: null
            },
            featData: {
                name: 'Feat the Eighth',
                cardType: 'Feat',
                cardNumber: 8
            }
        };
        
        mockData.feat_9 = {
            _id: 'feat_9_id',
            panelType: 'Feat',
            x_coord: 45,
            y_coord: 6,
            above: {
                adjacent: null,
                overlap: 'feat_10_id'
            },
            below: {
                adjacent: null,
                overlap: 'feat_8_id'
            },
            left: {
                adjacent: null,
                overlap: null
            },
            right: {
                adjacent: null,
                overlap: null
            },
            featData: {
                name: 'Feat the Ninth',
                cardType: 'Feat',
                cardNumber: 9
            }
        };
        
        mockData.feat_10 = {
            _id: 'feat_10_id',
            panelType: 'Feat',
            x_coord: 45,
            y_coord: 9,
            above: {
                adjacent: null,
                overlap: null
            },
            below: {
                adjacent: null,
                overlap: 'feat_9_id'
            },
            left: {
                adjacent: null,
                overlap: null
            },
            right: {
                adjacent: null,
                overlap: null
            },
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

angular.module('core').factory('syncLoop', [function(){
    return function syncLoop(iterations, process, exit){
        var index = 0,
            done = false,
            shouldExit = false;
        var loop = {
            next:function(){
                if(done){
                    if(shouldExit && exit){
                        return exit(); // Exit if we're done
                    }
                }
                // If we're not finished
                if(index < iterations){
                    index++; // Increment our index
                    process(loop); // Run our process, pass in the loop
                // Otherwise we're done
                } else {
                    done = true; // Make sure we say we're done
                    if(exit) exit(); // Call the callback on exit
                }
            },
            iteration:function(){
                return index - 1; // Return the loop number we're on
            },
            break:function(end){
                done = true; // End the loop
                shouldExit = end; // Passing end as true means we still call the exit callback
            }
        };
        loop.next();
        return loop;
    };
}]);
'use strict';

angular.module('decks').factory('DecksBread', ['$rootScope', 'syncLoop', 'Bakery', 'PanelUtils', 'DeckUtils', 'CardsBread', 
    function($rootScope, syncLoop, Bakery, PanelUtils, DeckUtils, CardsBread){
        
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
                        _id: 'builderOptionsId',
                        panelType: 'builderOptions'
                    });
                    Bakery.resource.cardList = response;
                    DeckUtils.setCardList(Bakery.resource.cardList);
                });
            } else {
                Bakery.Decks.list(function(response){
                    response.unshift({
                        _id: 'builderOptionsId',
                        panelType: 'builderOptions'
                    });
                    Bakery.resource.cardList = response;
                    DeckUtils.setCardList(Bakery.resource.cardList);
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
                console.log(response);
            });
        };
        
        //EDIT
        service.edit = function(deck, editCards, loadDeck) {
            var _deck = new Bakery.Decks(deck);
            
            _deck.$update(function(response) {
                if(editCards){
                    for(var i = 0; i < deck.cardList.length; i++){
                        var panel = deck.cardList[i];
                        CardsBread.edit(panel);
                    }
                    $rootScope.$broadcast('Bakery: deckSaved');
                }
                if(loadDeck){
                    Bakery.resource = response;
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
                    y_coord: 0,
                    above: { adjacent: null, overlap: null },
                    below: { adjacent: null, overlap: null },
                    left: { adjacent: null, overlap: null },
                    right: { adjacent: null, overlap: null }
                }]
            });
            
            deck.$save(
                function(){
                    var cardNumber = 1;
                    syncLoop(size, function(loop){  
                        CardsBread.add(deck, null, cardNumber, function(response){
                            deck.$update(function(){
                                var previous = deck.cardList[cardNumber-1];
                                var current = deck.cardList[cardNumber];
                                previous.right.adjacent = current._id;
                                current.left.adjacent = previous._id;
                                cardNumber++;
                                loop.next();
                            });
                        });
                    }, function(){
                        service.edit(deck, false, true);
                        if(type !== 'Aspect'){
                            service.browseDependencies();
                        }
                    });
                });
        };
        
        //DELETE
        service.delete = function(resource, deck){
            
            if(resource) DeckUtils.collapseDeck(resource.cardList, deck);
            
            deck.$remove(function(response){
                if(resource) PanelUtils.removePanel(resource.cardList, deck);
            }).then(function(response){
                if(resource) DeckUtils.setDeckSize(resource);
            }).then(function(response){
                // if(resource) DeckUtils.collapseDeck(resource.cardList, deck);
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

// Directive for managing card decks.
angular.module('move')
	.directive('cardPanel', ['$document', '$parse', '$rootScope', '$window', 'MoveHub', 'Bakery', 'CoreVars', 'checkEdge', 'onCardMove', 'PanelUtils', 'StackUtils', 'DeckUtils', function($document, $parse, $rootScope, $window, MoveHub, Bakery, CoreVars, checkEdge, onCardMove, PanelUtils, StackUtils, DeckUtils){
		return {
			restrict: 'A',
			templateUrl: '../modules/core/views/card-panel.html',
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
					_moveTimer;
				
				var _dropdownOpen = false;
				
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
					scope.$on('cardPanel:onPressCard', onPressCard);
					scope.$on('cardPanel:onMoveCard', onMoveCard);
					scope.$on('cardPanel:onReleaseCard', onReleaseCard);
					scope.$on('deckStack:onMouseLeave', onMouseLeave);
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
					CoreVars.x_dim_px = convertEm(15);
					CoreVars.y_dim_px = convertEm(21);
					CoreVars.x_tab_px = convertEm(3);
					CoreVars.y_tab_px = convertEm(3);
					CoreVars.x_cover_px = convertEm(12);
					CoreVars.y_cover_px = convertEm(18);
					
					setPosition();
				};
				
				var resetPosition = function(newVal, oldVal){
					if(element.hasClass('card-moving')){
						setPosition();
					}
				};
				
				var setPosition = function(){
					element.css({
						top: _panel.y_coord + 'em',
						left: _panel.x_coord + 'em'
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
					
					StackUtils.setStack(Bakery.resource.cardList, _panel, function(stackArray){
						for(var i = 0; i < stackArray.length; i++){
                            stackArray[i].dragging = true;
                        }
					});
					
					$rootScope.$broadcast('cardPanel:onPressCard', {
						startX: _startX,
						startY: _startY,
						panel: _panel
					});
				};
				
				var onPressCard = function(event, object){
					
					_startCol = convertEm(_panel.x_coord);
					_startRow = convertEm(_panel.y_coord);
					
					if(!_panel.dragging){
						element.addClass('card-moving');
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
				
				// Function to move a single card or each card in a vertical stack
				var onMoveCard = function(event, object){
					object.slot = _panel;
					object.offset = element.offset();
					if(!element.hasClass('card-moving')){
						element.css({
							left: object.moveX + _startCol + 'px',
							top: object.moveY + _startRow + 'px'
						});
					} else {
						onCardMove(object);
					}
				};
				
				// RELEASE
				// Primary "release" function
				var onRelease = function(){
					$document.off(_moveEvents, onMove);
					$document.off(_releaseEvents, onRelease);
					$rootScope.$broadcast('cardPanel:onReleaseCard', {
						panel: _panel
					});
					
					var _offset = element.offset();
					
					var _releaseX = _mouseX ? _mouseX : _startX;
					var _releaseY = _mouseY ? _mouseY : _startY;
					
					var _nearest = checkEdge.crossing(_panel, _offset.left, _offset.top, _releaseX, _releaseY);
					
					if((_moveX) <= convertEm(1) && (_moveY) <= convertEm(1)){
						MoveHub.triggerOverlap(_panel, _nearest);
					}
					CoreVars.cardMoved = false;
					var _deck = Bakery.resource.cardList;
					for(var i = 0; i < _deck.length; i++){
						_deck[i].dragging = false;
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
					$rootScope.$broadcast('cardPanel:onReleaseCard', {
						panel: _panel
					});
				};
				
				initialize();
				
			}
		};
	}]);
'use strict';

// Directive for managing card decks.
angular.module('move')
	.directive('deckStack', ['$rootScope', '$window', 'Bakery', 'StackUtils', 'DeckUtils', 'MoveHub', function($rootScope, $window, Bakery, StackUtils, DeckUtils, MoveHub){
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
					scope.$on('DeckUtils:setDeckWidth', setDeckWidth);
					scope.$on('cardPanel:onPressCard', onPress);
					scope.$on('cardPanel:onReleaseCard', onRelease);
					scope.$on('cardPanel:onMoveCard', onMoveCard);
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
					var deckWidth = DeckUtils.getDeckWidth(Bakery.resource.cardList);
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
					var deckWidth = DeckUtils.getDeckWidth(Bakery.resource.cardList);
					var deckLeftEdge = deckOffset.left;
					var deckRightEdge = convertEm(deckWidth + 3);
					
					if(object.mouseX <= deckLeftEdge){
						MoveHub.unstackLeft(object.panel);
					} else if(object.mouseX >= deckRightEdge){
						MoveHub.unstackRight(object.panel);
					}
					
				};
				
				var onMouseLeave = function(event){
					if(pressed){
						$rootScope.$broadcast('deckStack:onMouseLeave');
					}
				};
				
				initialize();
			}
		};
	}]);
'use strict';

// Factory-service for managing card-deck, card-slot and card-panel directives.
angular.module('move').factory('checkEdge', ['CoreVars',
    function(CoreVars){
        
        var service = {};
        
        service.crossing = function(panel, slotX, slotY, mouseX, mouseY){
            var leftEdge = panel.left.overlap ? slotX + CoreVars.x_cover_px : slotX;
            var rightEdge = slotX + CoreVars.x_dim_px;
            var topEdge = slotY;
            var bottomEdge = panel.above.overlap ? slotY + CoreVars.y_tab_px : slotY + CoreVars.y_dim_px;
            
        //  console.log('testing '+panel.name+':  X '+panel.left.overlap+':'+leftEdge+'>'+mouseX+'>'+rightEdge+'  Y '+panel.above.overlap+':'+topEdge+'>'+mouseY+'>'+bottomEdge);
            
            if(mouseX >= leftEdge && mouseX <= rightEdge && mouseY >= topEdge && mouseY <= bottomEdge){
                var left = mouseX - leftEdge;
                var right = rightEdge - mouseX;
                var top = mouseY - topEdge;
                var bottom = bottomEdge - mouseY;
                
                var edges = [left, right, top, bottom],
                closestEdge = Math.min.apply(Math.min, edges),
                edgeNames = ['left', 'right', 'top', 'bottom'],
                edgeName = edgeNames[edges.indexOf(closestEdge)];
                
        //      console.log('crossing '+edgeName+' edge of '+panel.name+':  X '+panel.left.overlap+':'+leftEdge+'>'+mouseX+'>'+rightEdge+'  Y '+panel.above.overlap+':'+topEdge+'>'+mouseY+'>'+bottomEdge);
                
                return edgeName;
            } else {
                return false;
            }
        };
        
        return service;
        
    }]);
'use strict';

// Stack helper-functions
angular.module('move').factory('DeckUtils', ['$rootScope', 'CoreVars', 'PanelUtils', function($rootScope, CoreVars, PanelUtils) {
    
    var service = {};
    
    service.getRefArray = function(cardList){
        var _first = PanelUtils.getFirst(cardList);
        var _index = _first.index;
        var _panel = _first.panel;
        var _refArray = [_index];
        
        if(!_panel){
            console.log(_refArray);
        }
        
        while(_panel.below.adjacent || _panel.below.overlap || _panel.right.adjacent || _panel.right.overlap){
            if(_panel.below.adjacent){
                _index = PanelUtils.getPanelIndex(cardList, _panel.below.adjacent);
            } else if(_panel.below.overlap){
                _index = PanelUtils.getPanelIndex(cardList, _panel.below.overlap);
            } else if(_panel.right.adjacent){
                _index = PanelUtils.getPanelIndex(cardList, _panel.right.adjacent);
            } else if(_panel.right.overlap){
                _index = PanelUtils.getPanelIndex(cardList, _panel.right.overlap);
            }
            
            _refArray.push(_index);
            _panel = cardList[_index];
        }
        
        return _refArray;
    };
    
    service.setCardList = function(cardList){
        for(var i = 0; i < cardList.length; i++){
            var _previous = cardList[i-1] || null;
            var _current = cardList[i];
            var _next = cardList[i+1] || null;
            
            _current.x_coord = i * 15;
            _current.y_coord = 0;
            _current.dragging = false;
            _current.locked = false;
            _current.above = { adjacent: null, overlap: null };
            _current.below = { adjacent: null, overlap: null };
            _current.left = { adjacent: null, overlap: null };
            _current.right = { adjacent: null, overlap: null };
            if(_previous) _current.left.adjacent = _previous._id;
            if(_next) _current.right.adjacent = _next._id;
        }
        $rootScope.$broadcast('cardPanel:onReleaseCard');
    };
    
    service.expandDeck = function(cardList, panel){
        var panel_x_coord = panel.x_coord;
        var panel_y_coord = panel.y_coord;
        
        for(var i = 0; i < cardList.length; i++){
            var slot = cardList[i];
            
            var slotData = PanelUtils.getPanelData(slot);
            if (slot !== panel && slot.x_coord >= panel_x_coord){
                slot.x_coord += 15;
                slotData.cardNumber++;
            }
        }
        $rootScope.$broadcast('cardPanel:onReleaseCard');
    };
    
    service.collapseDeck = function(cardList, panel){
        
        var _refArray = service.getRefArray(cardList);
        var _prev = PanelUtils.getPrev(cardList, panel._id);
        var _next = PanelUtils.getNext(cardList, panel._id);
        var _prevPanel = _prev.panel;
        var _nextPanel = _next.panel;
        var _prevIndex = _prev.index;
        var _nextIndex = _next.index;
        
        if(panel.above.adjacent || panel.above.overlap){
            if(panel.below.adjacent || panel.below.overlap){
                _prevPanel.below = panel.below;
                _nextPanel.above = panel.above;
            } else if(panel.right.adjacent || panel.right.overlap){
                _prevPanel.below = panel.right;
                _nextPanel.left = panel.above;
                _nextPanel.above = { adjacent: null, overlap: null };
            }
        } else if(panel.below.adjacent || panel.below.overlap){
            
            
            
        } else if(panel.left.adjacent || panel.left.overlap){
            if(panel.below.adjacent || panel.below.overlap){
                _prevPanel.right = panel.below;
                _nextPanel.above = panel.left;
            } else if(panel.right.adjacent || panel.right.overlap){
                _prevPanel.right = panel.right;
                _nextPanel.left = panel.left;
                _nextPanel.above = { adjacent: null, overlap: null };
            }
        } else if(panel.right.adjacent || panel.right.overlap){
            
            
            
        }
        
        
        
        if(panel.below.adjacent || panel.below.overlap){
            var _belowPanel = panel;
            while(_belowPanel.below.adjacent || _belowPanel.below.overlap){
                if(_belowPanel.below.adjacent){
                    _belowPanel = PanelUtils.getPanel(cardList, _belowPanel.below.adjacent);
                    _belowPanel.y_coord -= 21;
                } else if(_belowPanel.below.overlap){
                    _belowPanel = PanelUtils.getPanel(cardList, _belowPanel.below.overlap);
                    _belowPanel.y_coord -= 3;
                }
            }
        } else if(panel.right.adjacent || panel.right.overlap){
            var _rightPanel = panel;
            while(_rightPanel.right.adjacent || _rightPanel.right.overlap){
                if(_rightPanel.right.adjacent){
                    _rightPanel = PanelUtils.getPanel(cardList, _rightPanel.right.adjacent);
                    _rightPanel.x_coord -= 15;
                } else if(_rightPanel.right.overlap){
                    _rightPanel = PanelUtils.getPanel(cardList, _rightPanel.right.overlap);
                    _rightPanel.x_coord -= 3;
                }
            }
        }
        
        for(var i = 0; i < _refArray.length; i++){
            var _panel = cardList[_refArray[i]];
            var _panelData = PanelUtils.getPanelData(_panel);
            
            if(_panelData) _panelData.deckSize--;
            
            if(i >= _nextIndex){
                if(_panelData) _panelData.cardNumber--;
            }
        }
        
        $rootScope.$broadcast('cardPanel:onReleaseCard');
    };
    
    service.setDeckSize = function(resource){
        var _length = resource.cardList.length - 1;
        resource.deckSize = _length;
        for(var i = 0; i < resource.cardList.length; i++){
            var panel = resource.cardList[i];
            var panelData = PanelUtils.getPanelData(panel);
            panelData.deckSize = _length;
        }
    };
    
    service.getDeckWidth = function(cardList){
        var lastPanel = PanelUtils.getLast(cardList);
        return lastPanel.panel.x_coord + 15;
    };
    
    service.setDeckWidth = function(cardList){
        var _deckWidth = service.getDeckWidth(cardList);
        $rootScope.$broadcast('DeckUtils:setDeckWidth', {
            deckWidth: _deckWidth
        });
    };
    
    return service;
}]);
'use strict';

// Factory-service for managing card-deck, card-slot and card-panel directives.
angular.module('move').factory('MoveHub', ['$rootScope', 'CoreVars', 'Bakery', 'PanelUtils', 'DeckUtils', 'StackUtils', 'switchHorizontal', 'switchVertical', 'stackOver', 'stackUnder', 'unstackCard', 'toggleOverlap',
	function($rootScope, CoreVars, Bakery, PanelUtils, DeckUtils, StackUtils, switchHorizontal, switchVertical, stackOver, stackUnder, unstackCard, toggleOverlap){
		
		var service = {};
		
		$rootScope.$on('CoreVars:getDeckWidth', DeckUtils.setDeckWidth(Bakery.resource.cardList));
		
		var getCardList = function(){
			return Bakery.resource.cardList;
		};
		
		service.triggerOverlap = function(panel, nearest){
			if(!CoreVars.cardMoved){
				var _cardList = getCardList();
				toggleOverlap(_cardList, panel._id, nearest);
			}
		};
		
		service.moveHorizontal = function(slot, panel){
			var _deck = getCardList();
			if(panel.above.adjacent){
				console.log('unstackCard');
				unstackCard(_deck, slot, panel);
			} else {
				switchHorizontal(_deck, slot, panel);
			}
		};
		
		service.moveDiagonalUp = function(slot, panel){
			var _deck = getCardList();
			console.log('moveDiagonalUp');
			if(panel.above.overlap){
				unstackCard(_deck, slot, panel);
			} else {
				stackUnder(_deck, slot, panel);
			}
		};
		
		service.moveDiagonalDown = function(slot, panel){
			var _deck = getCardList();
			console.log('moveDiagonalDown');
			if(panel.above.adjacent){
				unstackCard(_deck, slot, panel);
			} else {
				stackOver(_deck, slot, panel);
			}
		};
		
		service.moveVertical = function(slot, panel){
			var _deck = getCardList();
			switchVertical(_deck, slot, panel);
		};
		
		service.unstackLeft = function(panel){
			if(panel.y_coord > 0){
				var _deck = getCardList();
				var unstack_coord = -CoreVars.x_dim_em;
				unstackCard(_deck, {x_coord: unstack_coord}, panel);
			}
		};
		
		service.unstackRight = function(panel){
			if(panel.y_coord > 0){
				var _deck = getCardList();
				var _last = PanelUtils.getLast(_deck);
				var unstack_coord = _last.panel.x_coord + CoreVars.x_dim_em;
				unstackCard(_deck, {x_coord: unstack_coord}, panel);
			}
		};
		
		return service;
	}]);

'use strict';

angular.module('move').factory('onCardMove', ['CoreVars', 'MoveHub', 'checkEdge',
    function(CoreVars, MoveHub, checkEdge){
        
        return function(object){
            if(!CoreVars.cardMoving){
                var mouseX = object.mouseX;
                var mouseY = object.mouseY;
                
                var moveX = object.moveX;
                var moveY = object.moveY;
                
                var vectorX = Math.abs(object.moveX);
                var vectorY = Math.abs(object.moveY);
                
                var slot = object.slot;
                var slot_x = slot.x_coord;
                var slot_y = slot.y_coord;
                var slot_x_px = object.offset.left;
                var slot_y_px = object.offset.top;
                var slot_x_overlap = slot.left.overlap || slot.right.overlap;
                var slot_y_overlap = slot.above.overlap || slot.below.overlap;
                
                var panel = object.panel;
                var panel_x = panel.x_coord;
                var panel_y = panel.y_coord;
                var panel_x_overlap = panel.left.overlap || panel.right.overlap;
                var panel_y_overlap = panel.above.overlap || panel.below.overlap;
                
                var changeX = Math.abs(panel_x - slot_x);
                var changeY = Math.abs(panel_y - slot_y);
                
                var crossingResult = checkEdge.crossing(slot, slot_x_px, slot_y_px, mouseX, mouseY);
                    
                if(crossingResult && (changeX !== 0 || changeY !== 0)){
            //        var crossingResult = checkEdge.crossing(slot, slot_x_px, slot_y_px, mouseX, mouseY);
                    
                    if(crossingResult === 'top'){
                        // console.log('crossing top');
                        
                        if(vectorX > 0 && !slot_y_overlap && !slot_x_overlap && !panel_x_overlap){
                            console.log('cardPanel:moveDiagonalUp');
                            MoveHub.moveDiagonalUp(slot, panel);
                        } else if(changeX === 0 && !panel_y_overlap){
                            console.log('cardPanel:moveVertical');
                            MoveHub.moveVertical(slot, panel);
                        } else {
                            console.log('cardPanel:moveHorizontal');
                            MoveHub.moveHorizontal(slot, panel);
                        }
                    } else if(crossingResult === 'bottom'){
                        // console.log('crossing bottom');
                        if(changeX > 0 && changeX <= CoreVars.x_dim_px){
                            console.log('cardPanel:moveDiagonalDown');
                            MoveHub.moveDiagonalDown(slot, panel);
                        } else if(changeX === 0 && !panel_y_overlap){
                            console.log('cardPanel:moveVertical');
                            MoveHub.moveVertical(slot, panel);
                        } else {
                            console.log('cardPanel:moveHorizontal');
                            MoveHub.moveHorizontal(slot, panel);
                        }
                    } else if(crossingResult === 'left' || crossingResult === 'right'){
                        // console.log('crossing left or right');
                        if(vectorY * 2 > vectorX){
                            if(moveY < 0){
                                console.log('cardPanel:moveDiagonalUp');
                                MoveHub.moveDiagonalUp(slot, panel);
                            } else if(moveY > 0){
                                console.log('cardPanel:moveDiagonalDown');
                                MoveHub.moveDiagonalDown(slot, panel);
                            }
                        } else {
                            console.log('cardPanel:moveHorizontal');
                            MoveHub.moveHorizontal(slot, panel);
                        }
                    }
                }
            }
        };
    }]);
'use strict';

// Panel helper-functions
angular.module('move').factory('PanelUtils', ['$rootScope', '$resource', 'CoreVars', function($rootScope, $resource, CoreVars){
    
    var service = {};
    
    service.panelHasAbove = function(panel){
        if(panel.above.adjacent || panel.above.overlap){
            return true;
        } else {
            return false;
        }
    };
    
    service.panelHasBelow = function(panel){
        if(panel.below.adjacent || panel.below.overlap){
            return true;
        } else {
            return false;
        }
    };
    
    service.panelHasLeft = function(panel){
        if(panel.left.adjacent || panel.left.overlap){
            return true;
        } else {
            return false;
        }
    };
    
    service.panelHasRight = function(panel){
        if(panel.right.adjacent || panel.right.overlap){
            return true;
        } else {
            return false;
        }
    };
    
    service.panelHasPrev = function(panel){
        if(service.panelHasAbove(panel) || service.panelHasLeft(panel)){
            return true;
        } else {
            return false;
        }
    };
    
    service.panelHasNext = function(panel){
        if(service.panelHasBelow(panel) || service.panelHasRight(panel)){
            return true;
        } else {
            return false;
        }
    };
    
    service.getPanel = function(cardList, panelId){
        var _panel = CoreVars.nullPanel;
        for(var i = 0; i < cardList.length; i++){
            if(cardList[i]._id === panelId){
                _panel = cardList[i];
            }
        }
        return _panel;
    };
    
    service.setAdjacentVertical = function(abovePanel, belowPanel){
        abovePanel.below = { adjacent: belowPanel._id, overlap: null };
        abovePanel.right = { adjacent: null, overlap: null };
        belowPanel.above = { adjacent: abovePanel._id, overlap: null };
        belowPanel.left = { adjacent: null, overlap: null };
    };
    
    service.setAdjacentHorizontal = function(leftPanel, rightPanel){
        leftPanel.below = { adjacent: null, overlap: null };
        leftPanel.right = { adjacent: rightPanel._id, overlap: null };
        rightPanel.above = { adjacent: null, overlap: null };
        rightPanel.left = { adjacent: leftPanel._id, overlap: null };
    };
    
    service.setOverlapVertical = function(abovePanel, belowPanel){
        abovePanel.below = { adjacent: null, overlap: belowPanel._id };
        abovePanel.right = { adjacent: null, overlap: null };
        belowPanel.above = { adjacent: null, overlap: abovePanel._id };
        belowPanel.left = { adjacent: null, overlap: null };
    };
    
    service.setOverlapHorizontal = function(leftPanel, rightPanel){
        leftPanel.below = { adjacent: null, overlap: null };
        leftPanel.right = { adjacent: null, overlap: rightPanel._id };
        rightPanel.above = { adjacent: null, overlap: null };
        rightPanel.left = { adjacent: null, overlap: leftPanel._id };
    };
    
    
    service.getPanelIndex = function(cardList, panelId){
        var _index = -1;
        for(var i = 0; i < cardList.length; i++){
            if(cardList[i]._id === panelId){
                _index = i;
            }
        }
        return _index;
    };
    
    service.getPrev = function(cardList, panelId){
        var _panel = service.getPanel(cardList, panelId);
        var _prevPanel = CoreVars.nullPanel;
        var _prevIndex = -1;
        if(_panel.above.adjacent){
            _prevPanel = service.getPanel(cardList, _panel.above.adjacent);
            _prevIndex = service.getPanelIndex(cardList, _panel.above.adjacent);
        } else if(_panel.above.overlap){
            _prevPanel = service.getPanel(cardList, _panel.above.overlap);
            _prevIndex = service.getPanelIndex(cardList, _panel.above.overlap);
        } else if(_panel.left.adjacent){
            _prevPanel = service.getPanel(cardList, _panel.left.adjacent);
            _prevIndex = service.getPanelIndex(cardList, _panel.left.adjacent);
        } else if(_panel.left.overlap){
            _prevPanel = service.getPanel(cardList, _panel.left.overlap);
            _prevIndex = service.getPanelIndex(cardList, _panel.left.overlap);
        }
        return { panel: _prevPanel, index: _prevIndex };
    };
    
    service.getNext = function(cardList, panelId){
        var _panel = service.getPanel(cardList, panelId);
        var _nextPanel = CoreVars.nullPanel;
        var _nextIndex = -1;
        if(_panel.below.adjacent){
            _nextPanel = service.getPanel(cardList, _panel.below.adjacent);
            _nextIndex = service.getPanelIndex(cardList, _panel.below.adjacent);
        } else if(_panel.below.overlap){
            _nextPanel = service.getPanel(cardList, _panel.below.overlap);
            _nextIndex = service.getPanelIndex(cardList, _panel.below.overlap);
        } else if(_panel.right.adjacent){
            _nextPanel = service.getPanel(cardList, _panel.right.adjacent);
            _nextIndex = service.getPanelIndex(cardList, _panel.right.adjacent);
        } else if(_panel.right.overlap){
            _nextPanel = service.getPanel(cardList, _panel.right.overlap);
            _nextIndex = service.getPanelIndex(cardList, _panel.right.overlap);
        }
        return { panel: _nextPanel, index: _nextIndex };
    };
    
    service.getFirst = function(cardList){
        var _index = 0;
        var _panel = CoreVars.nullPanel;
        for(var i = 0; i < cardList.length; i++){
            var test = cardList[i];
            if(!service.panelHasPrev(test)){
                _panel = test;
            }
        }
        return { index: _index, panel: _panel };
    };
    
    service.getPanelOrder = function(cardList, panelId){
        var _order = 0;
        var _panel = service.getFirst(cardList).panel;
        
        while(service.panelHasNext(_panel) && _panel._id !== panelId){
            if(_panel.below.adjacent){
                _panel = service.getPanel(cardList, _panel.below.adjacent);
                _order++;
            } else if(_panel.below.overlap){
                _panel = service.getPanel(cardList, _panel.below.overlap);
                _order++;
            } else if(_panel.right.adjacent){
                _panel = service.getPanel(cardList, _panel.right.adjacent);
                _order++;
            } else if(_panel.right.overlap){
                _panel = service.getPanel(cardList, _panel.right.overlap);
                _order++;
            }
        }
        return _order;
    };
    
    service.getRootPanel = function(cardList, panelId){
        var _panel = service.getPanel(cardList, panelId);
        while(_panel.above.overlap || _panel.left.overlap){
            if(_panel.left.overlap){
                _panel = service.getPanel(cardList, _panel.left.overlap);
            } else if (_panel.above.overlap){
                _panel = service.getPanel(cardList, _panel.above.overlap);
            }
        }
        return _panel;
    };
    
    service.getStackStart = function(cardList, panelId){
        var _panel = service.getPanel(cardList, panelId);
        var _count = 0;
        while((_panel.above.overlap || _panel.left.overlap) && _count < cardList.length){
            if(_panel.left.overlap){
                _panel = service.getPanel(cardList, _panel.left.overlap);
            } else if (_panel.above.overlap){
                _panel = service.getPanel(cardList, _panel.above.overlap);
            }
            _count++;
        }
        return _panel;
    };
    
    service.getStackEnd = function(cardList, panelId){
        var _panel = service.getPanel(cardList, panelId);
        var _count = 0;
        while((_panel.below.overlap || _panel.right.overlap) && _count < cardList.length){
            if(_panel.right.overlap){
                _panel = service.getPanel(cardList, _panel.right.overlap);
            } else if (_panel.below.overlap){
                _panel = service.getPanel(cardList, _panel.below.overlap);
            }
            _count++;
        }
        return _panel;
    };
    
    service.getLast = function(cardList){
        var _index = 0;
        var _panel = CoreVars.nullPanel;
        for(var i = 0; i < cardList.length; i++){
            var test = cardList[i];
            if(!service.panelHasNext(test)){
                _panel = test;
            }
        }
        return { index: _index, panel: _panel };  
    };
    
    service.removePanel = function(cardList, panel){
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
    
    return service;
}]);
'use strict';

// Panel helper-functions
angular.module('move').factory('setPanelPosition', ['$rootScope', 'CoreVars', 'PanelUtils',
    function($rootScope, CoreVars, PanelUtils, DeckUtils){
        
        return function(cardList){
            var _panel = PanelUtils.getFirst(cardList).panel;
            var _last = PanelUtils.getLast(cardList).panel;
            var _x_current = 0;
            var _y_current = 0;
            var _continue = true;
            var _count = 0;
            
            while( _continue ){
                if( PanelUtils.panelHasNext(_panel) && _count < cardList.length ){
                    _panel.x_coord = _x_current;
                    _panel.y_coord = _y_current;
                    _count++;
                    
                    if(_panel.below.adjacent){
                        _y_current += 21;
                        _panel = PanelUtils.getPanel(cardList, _panel.below.adjacent);
                    } else if(_panel.below.overlap){
                        _y_current += 3;
                        _panel = PanelUtils.getPanel(cardList, _panel.below.overlap);
                    } else if(_panel.right.adjacent){
                        _x_current += 15;
                        _y_current = 0;
                        _panel = PanelUtils.getPanel(cardList, _panel.right.adjacent);
                    } else if(_panel.right.overlap){
                        _x_current += 3;
                        _y_current = 0;
                        _panel = PanelUtils.getPanel(cardList, _panel.right.overlap);
                    }
                } else if( !PanelUtils.panelHasNext(_panel) ){
                    _continue = false;
                    _last.x_coord = _x_current;
                    _last.y_coord = _y_current;
                } else if( _count >= cardList.length ){
                    _continue = false;
                    _last.x_coord = _x_current;
                    _last.y_coord = _y_current;
                    console.log('Sir, I believe we are experiencing an error.');
                }
            }
        };
    }]);
'use strict';

angular.module('move').factory('shuffleDeck', ['$rootScope', 'PanelUtils', 'DeckUtils', 'setPanelPosition',
    function($rootScope, PanelUtils, DeckUtils, setPanelPosition){
        
        return function(cardList){
            var _refArray = DeckUtils.getRefArray(cardList);
            
            _refArray.sort(function() { return 0.5 - Math.random(); });
            
            for(var i = 0; i < _refArray.length; i++){
                var _prev = cardList[_refArray[i - 1]] || null;
                var _curr = cardList[_refArray[i]];
                var _next = cardList[_refArray[i + 1]] || null;
                
                if(_prev){
                    var _1d4 = Math.floor(Math.random() * 4 + 1);
                    switch(_1d4){
                        case 1:
                            if(_prev.above.overLap){
                                PanelUtils.setAdjacentVertical(_prev, _curr);
                            } else {
                                PanelUtils.setAdjacentHorizontal(_prev, _curr);
                            }
                            break;
                        case 2:
                            if(_prev.above.overLap){
                                PanelUtils.setOverlapVertical(_prev, _curr);
                            } else {
                                PanelUtils.setOverlapHorizontal(_prev, _curr);
                            }
                            break;
                        case 3:
                            if(_prev.left.overLap){
                                PanelUtils.setAdjacentHorizontal(_prev, _curr);
                            } else {
                                PanelUtils.setAdjacentVertical(_prev, _curr);
                            }
                            break;
                        case 4:
                            if(_prev.left.overLap){
                                PanelUtils.setOverlapHorizontal(_prev, _curr);
                            } else {
                                PanelUtils.setOverlapVertical(_prev, _curr);
                            }
                            break;
                    }
                    if(!_next){
                        _curr.below = { adjacent: null, overlap: null };
                        _curr.right = { adjacent: null, overlap: null };
                    }
                } else {
                    _curr.above = { adjacent: null, overlap: null };
                    _curr.below = { adjacent: null, overlap: null };
                    _curr.left = { adjacent: null, overlap: null };
                    _curr.right = { adjacent: null, overlap: null };
                }
            }
            
            setPanelPosition(cardList);
            
        };
        
    }]);
'use strict';

// Factory-service for managing card-deck, card-slot and card-panel directives.
angular.module('move').factory('stackOver', ['$rootScope', 'CoreVars', 'Bakery', 'PanelUtils', 'StackUtils', 'setPanelPosition',
    function($rootScope, CoreVars, Bakery, PanelUtils, StackUtils, setPanelPosition){
        
        return function(cardList, slot, panel){
            
            if(CoreVars.cardMoving) return;
            
        //    if(slot.left.overlap || slot.right.overlap || panel.left.overlap || panel.right.overlap) return;
            
            console.log('stackOver');
            
            CoreVars.setCardMoving();
            
            var slotStart = PanelUtils.getStackStart(cardList, slot._id),
                slotEnd = PanelUtils.getStackEnd(cardList, slot._id),
                slotStartPrev = PanelUtils.getPrev(cardList, slotStart._id).panel,
                slotEndNext = PanelUtils.getNext(cardList, slotEnd._id).panel,
                panelStart = PanelUtils.getStackStart(cardList, panel._id),
                panelEnd = PanelUtils.getStackEnd(cardList, panel._id),
                panelStartPrev = PanelUtils.getPrev(cardList, panelStart._id).panel,
                panelEndNext = PanelUtils.getNext(cardList, panelEnd._id).panel;
            
            var slotOrder = PanelUtils.getPanelOrder(cardList, slot._id),
                panelOrder = PanelUtils.getPanelOrder(cardList, panel._id);
                
            var panelStartOrder = PanelUtils.getPanelOrder(cardList, panelStart._id),
                slotEndOrder = PanelUtils.getPanelOrder(cardList, slotEnd._id);
            
            if(panelOrder < slotOrder){
                // Panel moving right ---->
                PanelUtils.setAdjacentVertical(slotEnd, panelStart);
                PanelUtils.setAdjacentHorizontal(panelEnd, slotEndNext);
                PanelUtils.setAdjacentHorizontal(panelStartPrev, panelEndNext);
            } else if(slotOrder < panelOrder){
                // Panel moving left <----
                PanelUtils.setAdjacentVertical(slotEnd, panelStart);
                
                if(panelStartOrder - slotEndOrder > 1){
                    // Panel moving left more than one card
                    PanelUtils.setAdjacentHorizontal(panelEnd, slotEndNext);
                    PanelUtils.setAdjacentHorizontal(panelStartPrev, panelEndNext);
                }
            }
            
            console.log(panelStartPrev._id+' ['+panelStart._id+'-'+panelEnd._id+'] '+panelEndNext._id+' --> '+slotStartPrev._id+'['+slotStart._id+'-'+slotEnd._id+']'+slotEndNext._id);
            
            setPanelPosition(cardList);
            
            $rootScope.$digest();
        };
        
    }]);
'use strict';

// Factory-service for managing card-deck, card-slot and card-panel directives.
angular.module('move').factory('stackUnder', ['$rootScope', 'CoreVars', 'Bakery', 'PanelUtils', 'StackUtils', 'setPanelPosition',
    function($rootScope, CoreVars, Bakery, PanelUtils, StackUtils, setPanelPosition){
        
        return function(cardList, slot, panel){
            
            if(CoreVars.cardMoving) return;
            
            // if(!slot.left.overlap && !slot.right.overlap && !panel.left.overlap && !panel.right.overlap) return;
            
            console.log('stackUnder');
            
            CoreVars.setCardMoving();
            
            var slotOrder = PanelUtils.getPanelOrder(cardList, slot._id),
                panelOrder = PanelUtils.getPanelOrder(cardList, panel._id);
            
            var slotStart = PanelUtils.getStackStart(cardList, slot._id),
                slotEnd = PanelUtils.getStackEnd(cardList, slot._id),
                slotStartPrev = PanelUtils.getPrev(cardList, slotStart._id).panel,
                slotEndNext = PanelUtils.getNext(cardList, slotEnd._id).panel,
                panelStart = PanelUtils.getStackStart(cardList, panel._id),
                panelEnd = PanelUtils.getStackEnd(cardList, panel._id),
                panelStartPrev = PanelUtils.getPrev(cardList, panelStart._id).panel,
                panelEndNext = PanelUtils.getNext(cardList, panelEnd._id).panel;
            
            PanelUtils.setOverlapVertical(panelEnd, slotStart);
            
            if(slotOrder < panelOrder || slotOrder - panelOrder > 1){
                // Panel moving left or right more than one card
                
                PanelUtils.setAdjacentHorizontal(slotStartPrev, panelStart);
                PanelUtils.setAdjacentHorizontal(panelStartPrev, panelEndNext);
            }
            
            console.log(panelStartPrev._id+' ['+panelStart._id+'-'+panelEnd._id+'] '+panelEndNext._id+' --> '+slotStartPrev._id+'['+slotStart._id+'-'+slotEnd._id+']'+slotEndNext._id);
            
            setPanelPosition(cardList);
            
            $rootScope.$digest();
            
        };
        
    }]);
'use strict';

// Stack helper-functions
angular.module('move').factory('StackUtils', ['$rootScope', 'CoreVars', 'PanelUtils', 'DeckUtils', function($rootScope, CoreVars, PanelUtils, DeckUtils) {
    
    var service = {};
    
    service.getStack = function(cardList, panel){
        var _panel = service.getStackAbove(cardList, panel._id);
        var _panelArray = [ _panel ];
        
        while(_panel.below.overlap || _panel.right.overlap){
            if(_panel.below.overlap){
                console.log('getStack: panel.below.overlap',_panel.below.overlap);
                _panel = PanelUtils.getPanel(cardList, _panel.below.overlap);
                _panelArray.push(_panel);
            } else if(_panel.right.overlap){
                console.log('getStack: panel.right.overlap',_panel.right.overlap);
                _panel = PanelUtils.getPanel(cardList, _panel.right.overlap);
                _panelArray.push(_panel);
            }
        }
        
        return _panelArray;
    };
    
    service.setStack = function(cardList, panel, callBack){
        var _panel = service.getStackAbove(cardList, panel._id);
        var _panelArray = [ _panel ];
        
        while(_panel.below.overlap || _panel.right.overlap){
            if(_panel.below.overlap){
                console.log('setStack: panel.below.overlap', _panel.below.overlap);
                _panel = PanelUtils.getPanel(cardList, _panel.below.overlap);
                _panelArray.push(_panel);
            } else if(_panel.right.overlap){
                console.log('setStack: panel.right.overlap', _panel.right.overlap);
                _panel = PanelUtils.getPanel(cardList, _panel.right.overlap);
                _panelArray.push(_panel);
            }
        }
        
        if(callBack) callBack(_panelArray);
    };
    
    service.getStackAbove = function(cardList, panelId){
        var _panel = PanelUtils.getPanel(cardList, panelId);
        
        while(_panel.above.overlap || _panel.left.overlap){
            if(_panel.above.overlap){
                _panel = PanelUtils.getPanel(cardList, _panel.above.overlap);
            } else if(_panel.left.overlap){
                _panel = PanelUtils.getPanel(cardList, _panel.left.overlap);
            }
        }
        
        return _panel;
    };
    
    service.getStackBelow = function(cardList, panelId){
        var _panel = PanelUtils.getPanel(cardList, panelId);
        
        while(_panel.below.overlap || _panel.right.overlap){
            if(_panel.below.overlap){
                _panel = PanelUtils.getPanel(cardList, _panel.below.overlap);
            } else if(_panel.right.overlap){
                _panel = PanelUtils.getPanel(cardList, _panel.right.overlap);
            }
        }
        
        return _panel;
    };
    
    service.getRange = function(cardList, leftId, rightId){
        var _refArray = DeckUtils.getRefArray(cardList);
        var _leftOrder = PanelUtils.getPanelOrder(cardList, leftId);
        var _rightOrder = PanelUtils.getPanelOrder(cardList, rightId);
        
        var _rangeArray = [];
        
        // console.log('getRange: '+_leftOrder+'/'+_rightOrder);
        
        for(var i = 0; i < _refArray.length; i++){
            if(_leftOrder <= i && i <= _rightOrder){
                _rangeArray.push(cardList[_refArray[i]]);
            }
        }
        
        return _rangeArray;
    };
    
    service.setRange = function(cardList, leftId, rightId, callBack){
        var _refArray = DeckUtils.getRefArray(cardList);
        var _leftOrder = PanelUtils.getPanelOrder(cardList, leftId);
        var _rightOrder = PanelUtils.getPanelOrder(cardList, rightId);
        
        var _rangeArray = [];
        
        // console.log('setRange: '+_leftOrder+'/'+_rightOrder);
        
        for(var i = 0; i < _refArray.length; i++){
            if(_leftOrder <= i && i <= _rightOrder){
                _rangeArray.push(cardList[_refArray[i]]);
            }
        }
        
        if(callBack) callBack(_rangeArray);
    };
    
    service.getColumn = function(cardList, panelId){
        var _panel = PanelUtils.getRootPanel(cardList, panelId);
        var _columnArray = [_panel];
        
        while(_panel.below.adjacent || _panel.below.overlap){
            if(_panel.below.adjacent){
                _panel = PanelUtils.getPanel(cardList, _panel.below.adjacent);
                _columnArray.push(_panel);
            } else if(_panel.below.overlap){
                _panel = PanelUtils.getPanel(cardList, _panel.below.overlap);
                _columnArray.push(_panel);
            }
        }
        
        return _columnArray;
    };
    
    service.setColumn = function(cardList, panelId, callBack){
        var _panel = PanelUtils.getRootPanel(cardList, panelId);
        var _columnArray = [_panel];
        
        while(_panel.below.adjacent || _panel.below.overlap){
            if(_panel.below.adjacent){
                _panel = PanelUtils.getPanel(cardList, _panel.below.adjacent);
                _columnArray.push(_panel);
            } else if(_panel.below.overlap){
                _panel = PanelUtils.getPanel(cardList, _panel.below.overlap);
                _columnArray.push(_panel);
            }
        }
        
        if(callBack) callBack(_columnArray);
    };
    
    service.getRangeDimens = function(rangeArray){
        var _above = rangeArray[0].y_coord;
        var _below = rangeArray[rangeArray.length-1].y_coord + CoreVars.y_dim_em;
        var _left = rangeArray[0].x_coord;
        var _right = rangeArray[rangeArray.length-1].x_coord + CoreVars.x_dim_em;
        
        return {
            above: _above,
            below: _below,
            left: _left,
            right: _right
        };
    };
    
    return service;
    
}]);

'use strict';

// Factory-service for managing card-deck, card-slot and card-panel directives.
angular.module('move').factory('switchHorizontal', ['$rootScope', 'CoreVars', 'PanelUtils', 'DeckUtils', 'StackUtils', 'setPanelPosition',
    function($rootScope, CoreVars, PanelUtils, DeckUtils, StackUtils, setPanelPosition){
        
        return function(cardList, slot, panel){
            
            if(CoreVars.cardMoving) return;
            
            console.log('switchHorizontal');
            
            CoreVars.setCardMoving();
            
            var slotLeft, slotRight;
            
            var slotOrder = PanelUtils.getPanelOrder(cardList, slot._id);
            var panelOrder = PanelUtils.getPanelOrder(cardList, panel._id);
            
            var slotStart = PanelUtils.getStackStart(cardList, slot._id),
                slotEnd = PanelUtils.getStackEnd(cardList, slot._id),
                slotStartPrev = PanelUtils.getPrev(cardList, slotStart._id).panel,
                slotEndNext = PanelUtils.getNext(cardList, slotEnd._id).panel,
                panelStart = PanelUtils.getStackStart(cardList, panel._id),
                panelEnd = PanelUtils.getStackEnd(cardList, panel._id),
                panelStartPrev = PanelUtils.getPrev(cardList, panelStart._id).panel,
                panelEndNext = PanelUtils.getNext(cardList, panelEnd._id).panel;
                
            if(slotOrder < panelOrder){
                // Panel moving left <----
                PanelUtils.setAdjacentHorizontal(slotStartPrev, panelStart);
                PanelUtils.setAdjacentHorizontal(panelEnd, slotStart);
                PanelUtils.setAdjacentHorizontal(slotEnd, panelEndNext);
                
            } else if(panelOrder < slotOrder){
                // Panel moving right ---->
                
                PanelUtils.setAdjacentHorizontal(panelStartPrev, slotStart);
                PanelUtils.setAdjacentHorizontal(slotEnd, panelStart);
                PanelUtils.setAdjacentHorizontal(panelEnd, slotEndNext);
            }
            
            console.log(panelStartPrev._id+' ['+panelStart._id+'-'+panelEnd._id+'] '+panelEndNext._id+' --> '+slotStartPrev._id+'['+slotStart._id+'-'+slotEnd._id+']'+slotEndNext._id);
            
            setPanelPosition(cardList);
            
            $rootScope.$digest();
        };
        
    }]);
'use strict';

// Factory-service for managing card-deck, card-slot and card-panel directives.
angular.module('move').factory('switchVertical', ['$rootScope', 'CoreVars', 'Bakery', 'PanelUtils', 'StackUtils',
    function($rootScope, CoreVars, Bakery, PanelUtils, StackUtils){
        
        return function(cardList, slot, panel){
            console.log('switchVertical');
            if(!CoreVars.cardMoving){
                
                var slot_x = slot.x_coord;
                var slot_y = slot.y_coord;
                var slot_index = PanelUtils.getPanelIndex(cardList, slot._id);
                var slot_y_overlap = slot.above.overlap;
                
                var panel_x = panel.x_coord;
                var panel_y = panel.y_coord;
                
                var panel_index = PanelUtils.getPanelIndex(cardList, panel._id);
                var panel_y_overlap = panel.above.overlap;
                
                if(panel_y - slot_y > 0){
                // PANEL MOVING UP
                    CoreVars.setCardMoving();
                    
                    cardList[slot_index].y_coord = panel_y;
                    cardList[slot_index].above.overlap = panel_y_overlap;
                    $rootScope.$digest();
                    cardList[panel_index].y_coord = slot_y;
                    cardList[panel_index].above.overlap = slot_y_overlap;
                    
                } else if(panel_y - slot_y < 0){
                // PANEL MOVING DOWN
                    CoreVars.setCardMoving();
                    
                    cardList[slot_index].y_coord = panel_y;
                    cardList[slot_index].above.overlap = panel_y_overlap;
                    $rootScope.$digest();
                    cardList[panel_index].y_coord = slot_y;
                    cardList[panel_index].above.overlap = slot_y_overlap;
                }
                $rootScope.$digest();
            }
        };
        
    }]);
'use strict';

// Factory-service for managing card-deck, card-slot and card-panel directives.
angular.module('move').factory('toggleOverlap', ['$rootScope', 'CoreVars', 'PanelUtils', 'setPanelPosition',
    function($rootScope, CoreVars, PanelUtils, setPanelPosition){
        
        return function(cardList, panelId, nearest){
            if(!CoreVars.cardMoved && !CoreVars.cardMoving){
                
                console.log('toggleOverlap: '+nearest);
                
                var _curr = PanelUtils.getPanel(cardList, panelId);
                var _prev = PanelUtils.getPrev(cardList, panelId).panel;
                var _next = PanelUtils.getNext(cardList, panelId).panel;
                
                CoreVars.setCardMoving();
                
                if(nearest === 'top'){
                    if(_curr.below.overlap === _next._id && _next.above.overlap === _curr._id){
                        PanelUtils.setAdjacentVertical(_curr, _next);
                    }
                } else if(nearest === 'bottom'){
                    if(_curr.below.adjacent === _next._id && _next.above.adjacent === _curr._id){
                        PanelUtils.setOverlapVertical(_curr, _next);
                    }
                } else if(nearest === 'left'){
                    if(_curr.left.adjacent === _prev._id && _prev.right.adjacent === _curr._id){
                        PanelUtils.setOverlapHorizontal(_prev, _curr);
                    }
                } else if(nearest === 'right'){
                    if(_curr.left.overlap === _prev._id && _prev.right.overlap === _curr._id){
                        PanelUtils.setAdjacentHorizontal(_prev, _curr);
                    }
                }
                /*
                if(PanelUtils.panelHasLeft(_curr)){
                    if(_curr.left.overlap === _prev._id && _prev.right.overlap === _curr._id){
                        PanelUtils.setAdjacentHorizontal(_prev, _curr);
                    } else if(_curr.left.adjacent === _prev._id && _prev.right.adjacent === _curr._id){
                        PanelUtils.setOverlapHorizontal(_prev, _curr);
                    }
                }
                
                if(PanelUtils.panelHasBelow(_curr)){
                    if(_curr.below.overlap === _next._id && _next.above.overlap === _curr._id){
                        PanelUtils.setAdjacentVertical(_curr, _next);
                    } else if(_curr.below.adjacent === _next._id && _next.above.adjacent === _curr._id){
                        PanelUtils.setOverlapVertical(_curr, _next);
                    }
                }
                */
                setPanelPosition(cardList);
                $rootScope.$digest();
                CoreVars.cardMoved = false;
            }
        };
        
    }]);
'use strict';

// Factory-service for managing card-deck, card-slot and card-panel directives.
angular.module('move').factory('unstackCard', ['$rootScope', 'CoreVars', 'Bakery', 'PanelUtils', 'setPanelPosition',
    function($rootScope, CoreVars, Bakery, PanelUtils, setPanelPosition){
        
        return function(cardList, slot, panel){
            
            if(CoreVars.cardMoving) return;
            
            console.log('unstackCard');
            
            CoreVars.setCardMoving();
            
            var slotOrder = PanelUtils.getPanelOrder(cardList, slot._id),
                panelOrder = PanelUtils.getPanelOrder(cardList, panel._id);
            
            var slotStart = PanelUtils.getStackStart(cardList, slot._id),
                slotEnd = PanelUtils.getStackEnd(cardList, slot._id),
                slotStartPrev = PanelUtils.getPrev(cardList, slotStart._id).panel,
                slotEndNext = PanelUtils.getNext(cardList, slotEnd._id).panel,
                panelStart = PanelUtils.getStackStart(cardList, panel._id),
                panelEnd = PanelUtils.getStackEnd(cardList, panel._id),
                panelStartPrev = PanelUtils.getPrev(cardList, panelStart._id).panel,
                panelEndNext = PanelUtils.getNext(cardList, panelEnd._id).panel;
            
            if(slotOrder < panelOrder){
                PanelUtils.setAdjacentHorizontal(panelStartPrev, panelEndNext);
                PanelUtils.setAdjacentHorizontal(slotEnd, panelStart);
                PanelUtils.setAdjacentHorizontal(panelEnd, slotEndNext);
                
            } else if(panelOrder < slotOrder){
                
                PanelUtils.setAdjacentHorizontal(panelEnd, slotStart);
                
                if(slotOrder - panelOrder === 1){
                    PanelUtils.setAdjacentHorizontal(panelStartPrev, panelStart);
                }
                
                if(slotOrder - panelOrder > 1){
                    PanelUtils.setAdjacentHorizontal(panelStartPrev, panelEndNext);
                    PanelUtils.setAdjacentHorizontal(slotStartPrev, panelStart);
                }
            }
            
            
            
            
            console.log(panelStartPrev._id+' ['+panelStart._id+'-'+panelEnd._id+'] '+panelEndNext._id+' --> '+slotStartPrev._id+'['+slotStart._id+'-'+slotEnd._id+']'+slotEndNext._id);
            
            setPanelPosition(cardList);
            
            $rootScope.$digest();
            
            
            /*
            var slotOrder = PanelUtils.getPanelOrder(cardList, slot._id),
                panelOrder = PanelUtils.getPanelOrder(cardList, panel._id),
                panelLeft = StackUtils.getStackAbove(cardList, panel._id),
                panelRight = StackUtils.getStackBelow(cardList, panel._id),
                slotLeft = PanelUtils.getPanel(cardList, panelRight.right.adjacent),
                slotRight = PanelUtils.getLast(cardList).panel;
            
            var nextAbove = PanelUtils.getPanel(cardList, panelLeft.above.adjacent),
                nextLeft = PanelUtils.getPanel(cardList, nextAbove.left.adjacent),
                nextRight = PanelUtils.getPanel(cardList, panelLeft.right.adjacent),
                panelStack = StackUtils.getStack(cardList, panel),
                slotStack = StackUtils.getStack(cardList, slot);
            
            var panelDimens = StackUtils.getRangeDimens(panelStack),
                slotDimens = StackUtils.getRangeDimens(slotStack);
            
            var panelHeight = panelDimens.below - panelDimens.above,
                panelWidth =  panelDimens.right - panelDimens.left,
                slotPanelDiff = slotDimens.above - panelDimens.above,
                slotHeight = slotDimens.below - slotDimens.above,
                slotWidth = slotDimens.right - slotDimens.left,
                totalWidth = slotDimens.right - panelDimens.left,
                totalHeight = slotDimens.below - panelDimens.above;
            
            console.log('SL: '+slotLeft._id+' SR: '+slotRight._id);
            console.log('PL: '+panelLeft._id+' PR: '+panelRight._id);
            console.log('SL: '+slotLeft._id+' SR: '+slotRight._id);
            console.log('NL: '+nextLeft._id+' NR: '+nextRight._id+' NA: '+nextAbove._id);
            console.log('Slot: '+slot._id+' Panel: '+panel._id);
            console.log('slotPanelDiff: '+slotPanelDiff);
            
            StackUtils.setRange(cardList, panelLeft._id, panelRight._id, function(_panelRange){
                StackUtils.setRange(cardList, slotLeft._id, slotRight._id, function(_slotRange){
                    for(var ia = 0; ia < _slotRange.length; ia++){
                        _slotRange[ia].x_coord += panelWidth;
                    }
                    
                });
                
                var shiftPanelLeft;
                
                if(slotOrder < panelOrder){
                    // Panel unstacking from right to left <---- (kinda works)
                    shiftPanelLeft = 0;
                    
                    nextAbove.x_coord += panelWidth;
                    
                    slot.right.adjacent = panelLeft._id;
                    nextAbove.left.adjacent = panelLeft._id;
                    nextAbove.right.adjacent = slotLeft._id;
                    nextAbove.below.adjacent = null;
                    panelLeft.left.adjacent = slot._id;
                    panelLeft.above.adjacent = null;
                    panelRight.right.adjacent = nextAbove._id;
                } else if(panelOrder < slotOrder){
                    // Panel unstacking from left to right ----> (sorta works)
                    shiftPanelLeft = CoreVars.x_dim_em;
                    
                    nextAbove.right.adjacent = panelLeft._id;
                    nextAbove.below.adjacent = null;
                    panelLeft.left.adjacent = nextAbove._id;
                    panelLeft.above.adjacent = null;
                }
                
                for(var i = 0; i < _panelRange.length; i++){
                    _panelRange[i].y_coord += slotPanelDiff;
                    _panelRange[i].x_coord += shiftPanelLeft;
                }
                
            });
            
            */
            
            $rootScope.$digest();
        };
        
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
    .directive('ability', ['$parse', '$rootScope', '$window', 'abilityDice', function($parse, $rootScope, $window, abilityDice){
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
                
                var getAbility = function(){
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
                    if(_ability.order === abilityDice.chosenAbility.order){
                        $rootScope.$broadcast('ability:setPosition', getAbility());
                    }
                };
                
                var onPress = function(){
                    abilityDice.chooseAbility(_ability);
                    $rootScope.$broadcast('ability:onPress', getAbility());
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
angular.module('pcs').factory('PcsAugments', ['PanelUtils',
	function(PanelUtils){
		
		var service = {};
		
		// Factor Augment Limit
		service.factorAugmentLimit = function(pcResource){
			pcResource.augmentLimit = Math.round((pcResource.level || 0) / 4);
			service.validateAugments(pcResource);
		};
		
		service.validateAugments = function(pcResource){
			for(var ia = 0; ia < pcResource.augmentLimit; ia++){
				if(!service.augmentAtLevel(pcResource, ia * 4 + 2)){
					service.addAugment(pcResource, ia * 4 + 2);
				}
			}
			for(var ic = 0; ic < pcResource.cardList.length; ic++){
				if(pcResource.cardList[ic].level > pcResource.level){
					console.log('TODO: remove card');
				}
			}
		};
		
		service.augmentAtLevel = function(pcResource, level){
			var augmentAtLevel = false;
			for(var ib = 0; ib < pcResource.cardList.length; ib++){
				if(pcResource.cardList[ib].panelType === 'Augment'){
					if(pcResource.cardList[ib].level === level){
						augmentAtLevel = true;
					}
				}
			}
			return augmentAtLevel;
		};
		
		service.addAugment = function(pcResource, level){
			var _lastPanel = PanelUtils.getLast(pcResource.cardList).panel;
			
			var _newAugment = {
				_id: 'augment'+level+'Id',
				panelType: 'Augment',
				x_coord: _lastPanel.x_coord + 15,
				y_coord: 0,
				locked: true,
				level: level,
				augmentData: {
					_name: 'Level '+level+' Augment'
				},
				above: {
					adjacent: null, overlap: null
				},
				below: {
					adjacent: null, overlap: null
				},
				left: {
					adjacent: _lastPanel._id, overlap: null
				},
				right: {
					adjacent: null, overlap: null
				}
			};
			
			_lastPanel.right.adjacent = _newAugment._id;
			
			pcResource.cardList.push(_newAugment);
			
			pcResource.$update();
		};
		
		return service;
	}]);
'use strict';

angular.module('pcs').factory('PcsBread', ['Bakery', 'CoreVars', 'PanelUtils', 'DeckUtils', 'pcsDefaults',
    function(Bakery, CoreVars, PanelUtils, DeckUtils, pcsDefaults){
        var service = {};
        
        //BROWSE
        service.browse = function(){
            Bakery.resource = {};
            Bakery.resource.cardList = [];
            Bakery.Pcs.query(function(response){
                response.unshift({
                    _id: 'playerOptionsId',
                    panelType: 'playerOptions'
                });
                Bakery.resource.cardList = response;
                DeckUtils.setCardList(Bakery.resource.cardList);
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
                console.log(response);
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
                for(var i = 0; i < response.cardList.length; i++){
                    var current = response.cardList[i];
                    var previous = CoreVars.nullPanel;
                    if(i > 0){
                        previous = response.cardList[i-1];
                    }
                    previous.right.adjacent = current._id;
                    current.left.adjacent = previous._id;
                }
                pc.$update(function(response){
                    Bakery.resource = response;
                });
            });
        };
        
        //DELETE
        service.delete = function(resource, pc){
            var _pc_x = pc.x_coord;
            var _pc_y = pc.y_coord;
            pc.$remove(function(response){
                if(resource) PanelUtils.removePanel(resource.cardList, pc);
            }).then(function(response){
                if(resource) DeckUtils.setDeckSize(resource);
            }).then(function(response){
                if(resource) DeckUtils.collapseDeck(resource.cardList, { x_coord: _pc_x, y_coord: _pc_y });
            });
        };
        
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
					y_coord: 0
				},
				{
					panelType: 'pc2',
					x_coord: 15,
					y_coord: 0
				},
				{
					panelType: 'pc3',
					x_coord: 30,
					y_coord: 0
				}
			]
		};
		
		return defaultStats;
		
	}]);
'use strict';

// Factory-service for managing PC card deck.
angular.module('pcs').factory('PcsFeats', ['PanelUtils',
	function(PanelUtils){
		
		var service = {};
		
		// Factor Feat Limit
		service.factorFeatLimit = function(pcResource){
			pcResource.featLimit = Math.ceil((pcResource.level) / 4) || 0;
			pcResource.featDeck = pcResource.level;
			service.validateFeats(pcResource);
		};
		
		service.validateFeats = function(pcResource){
			for(var ia = 0; ia < pcResource.featDeck; ia++){
				if(!service.featAtLevel(pcResource, ia + 1)){
					service.addFeat(pcResource, ia + 1);
				}
			}
			for(var ic = 0; ic < pcResource.cardList.length; ic++){
				if(pcResource.cardList[ic].level > pcResource.level){
					console.log('TODO: remove card');
				}
			}
		};
		
		service.featAtLevel = function(pcResource, level){
			var featAtLevel = false;
			for(var ib = 0; ib < pcResource.cardList.length; ib++){
				if(pcResource.cardList[ib].panelType === 'Feat'){
					if(pcResource.cardList[ib].level === level){
						featAtLevel = true;
					}
				}
			}
			return featAtLevel;
		};
		
		service.addFeat = function(pcResource, level){
			var _lastPanel = PanelUtils.getLast(pcResource.cardList).panel;
			
			var _newFeat = {
				_id: 'feat'+level+'Id',
				panelType: 'Feat',
				x_coord: _lastPanel.x_coord + 15,
				y_coord: 0,
				locked: true,
				level: level,
				featData: {
					name: 'Level '+level+' Feat'
				},
				above: {
					adjacent: null, overlap: null
				},
				below: {
					adjacent: null, overlap: null
				},
				left: {
					adjacent: _lastPanel._id, overlap: null
				},
				right: {
					adjacent: null, overlap: null
				}
			};
			
			_lastPanel.right.adjacent = _newFeat._id;
			
			pcResource.cardList.push(_newFeat);
			
			pcResource.$update();
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
angular.module('pcs').factory('PcsTraits', ['PanelUtils',
	function(PanelUtils){
		
		var service = {};
		
		// Factor Trait Limit
		service.factorTraitLimit = function(pcResource){
			pcResource.traitLimit = Math.floor((pcResource.level || 0) / 4 + 1);
			service.validateTraits(pcResource);
		};
		
		service.validateTraits = function(pcResource){
			for(var ia = 0; ia < pcResource.traitLimit; ia++){
				if(!service.traitAtLevel(pcResource, ia * 4)){
					service.addTrait(pcResource, ia * 4);
				}
			}
			for(var ic = 0; ic < pcResource.cardList.length; ic++){
				if(pcResource.cardList[ic].level > pcResource.level){
					console.log('TODO: remove card');
				}
			}
		};
		
		service.traitAtLevel = function(pcResource, level){
			var traitAtLevel = false;
			for(var ib = 0; ib < pcResource.cardList.length; ib++){
				if(pcResource.cardList[ib].panelType === 'Trait'){
					if(pcResource.cardList[ib].level === level){
						traitAtLevel = true;
					}
				}
			}
			return traitAtLevel;
		};
		
		service.addTrait = function(pcResource, level){
			var _lastPanel = PanelUtils.getLast(pcResource.cardList).panel;
			
			var _newTrait = {
				_id: 'trait'+level+'Id',
				panelType: 'Trait',
				x_coord: _lastPanel.x_coord + 15,
				y_coord: 0,
				locked: true,
				level: level,
				traitData: {
					name: 'Level '+level+' Trait'
				},
				above: {
					adjacent: null, overlap: null
				},
				below: {
					adjacent: null, overlap: null
				},
				left: {
					adjacent: _lastPanel._id, overlap: null
				},
				right: {
					adjacent: null, overlap: null
				}
			};
			
			_lastPanel.right.adjacent = _newTrait._id;
			
			pcResource.cardList.push(_newTrait);
			
			pcResource.$update();
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

angular.module('player').factory('abilityDice', ['$rootScope', 'CoreVars', 'Bakery', function($rootScope, CoreVars, Bakery) {
    var service = {};
    
    service.chosenAbility = {};
    var chosenDie = {};
    var previousDie = {};
    
    
    service.chooseAbility = function(ability){
        console.log(ability);
        CoreVars.modalShown = true;
        CoreVars.diceBoxShown = true;
        service.chosenAbility = ability;
    };
    
    service.chooseDie = function(resource, order){
        CoreVars.modalShown = false;
        CoreVars.diceBoxShown = false;
        
        chosenDie = resource.dicepool[order];
        
        previousDie = service.chosenAbility.dice;
        
        resource.dicepool[order] = resource.dicepool[0];
        
        if(previousDie.order > 0){
            resource.dicepool[previousDie.order] = previousDie;
        }
        
        resource.abilities[service.chosenAbility.order].dice = chosenDie;
    };
    
    return service;
}]);
'use strict';

// Factory-service for managing pc1 data.
angular.module('player').factory('factorDefenses', [
    function(){
        
        var service = {};
        
        service.factorBlock = function(resource){
            var dice_a = resource.abilities[0].dice;
            var dice_b = resource.abilities[1].dice;
            if (Number(dice_a.sides) > Number(dice_b.sides)){
                resource.block = '2' + dice_a.name;
            } else {
                resource.block = '2' + dice_b.name;
            }
        };
        
        service.factorDodge = function(resource){
            var dice_a = resource.abilities[2].dice;
            var dice_b = resource.abilities[3].dice;
            if (Number(dice_a.sides) > Number(dice_b.sides)){
                resource.dodge = '2' + dice_a.name;
            } else {
                resource.dodge = '2' + dice_b.name;
            }
        };
        
        service.factorAlertness = function(resource){
            var dice_a = resource.abilities[4].dice;
            var dice_b = resource.abilities[5].dice;
            if (Number(dice_a.sides) > Number(dice_b.sides)){
                resource.alertness = '2' + dice_a.name;
            } else {
                resource.alertness = '2' + dice_b.name;
            }
        };
        
        service.factorTenacity = function(resource){
            var dice_a = resource.abilities[6].dice;
            var dice_b = resource.abilities[7].dice;
            if (Number(dice_a.sides) > Number(dice_b.sides)){
                resource.tenacity = '2' + dice_a.name;
            } else {
                resource.tenacity = '2' + dice_b.name;
            }
        };
        
        return service;
    }]);
'use strict';

// Factory-service for managing pc1 data.
angular.module('player').factory('factorStats', ['CoreVars',
    function(CoreVars){
        
        var service = {};
        
        service.factorExperience = function(resource){
            var mLevel = 0;
            var mExperience = Number(resource.experience);
            for (var increment = 8; increment <= mExperience; increment++){
                mLevel++;
                mExperience = mExperience - increment;
            }
            resource.level = mLevel;
        };
        
        service.factorHealth = function(resource){
            resource.healthLimit = 
                Math.round(
                    (Number(resource.abilities[0].dice.sides) +
                        Number(resource.abilities[1].dice.sides)
                    ) * ((resource.level || 0)/16 + 1));
            resource.healthCurrent =
                Number(resource.healthLimit - resource.injury);
        };
        
        service.factorStamina = function(resource){
            resource.staminaLimit = 
                Math.round(
                    (Number(resource.abilities[0].dice.sides) +
                        Number(resource.abilities[1].dice.sides)
                    ) * ((resource.level || 0)/16 + 1));
            resource.staminaCurrent =
                Number(resource.healthLimit - resource.injury);
        };
        
        service.factorCarryingCapacity = function(resource){
            resource.carryCurrent = 0;
            resource.carryLimit =
                Number(resource.abilities[0].dice.sides) +
                Number(resource.abilities[1].dice.sides);
        };
        
        return service;
    }]);
'use strict';

angular.module('player').factory('PlayerHub', ['$rootScope', 'CoreVars', 'Bakery', 'factorDefenses', 'factorStats', 'PcsTraits', 'PcsFeats', 'PcsAugments', 'abilityDice', function($rootScope, CoreVars, Bakery, factorDefenses, factorStats, PcsTraits, PcsFeats, PcsAugments, abilityDice) {
    
    var service = {};
    
    service.chooseDie = function(order){
        abilityDice.chooseDie(Bakery.resource, order);
        switch(abilityDice.chosenAbility.order){
            case 0:
            case 1:
                factorDefenses.factorBlock(Bakery.resource);
                factorStats.factorHealth(Bakery.resource);
                factorStats.factorStamina(Bakery.resource);
                factorStats.factorCarryingCapacity(Bakery.resource);
                break;
            case 2:
            case 3:
                factorDefenses.factorDodge(Bakery.resource);
                break;
            case 4:
            case 5:
                factorDefenses.factorAlertness(Bakery.resource);
                break;
            case 6:
            case 7:
                factorDefenses.factorTenacity(Bakery.resource);
                break;
        }
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
            factorStats.factorExperience(Bakery.resource);
            if (newValue !== CoreVars.EXP){
                CoreVars.EXP = newValue;
            }
        }
    };
    
    //Watch for changes in level
    service.watchLevel = function(newValue, oldValue){
        if (Bakery.resource.deckType === 'pc'){
            factorStats.factorHealth(Bakery.resource);
            factorStats.factorStamina(Bakery.resource);
            PcsTraits.factorTraitLimit(Bakery.resource);
            PcsFeats.factorFeatLimit(Bakery.resource);
            PcsAugments.factorAugmentLimit(Bakery.resource);
        }
    };
    
    return service;
    
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
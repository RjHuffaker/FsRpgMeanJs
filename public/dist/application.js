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
				scope.$on('BREAD: deckSaved', function(){
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
	.directive('featureCard', ['DataSRVC', 'BREAD', function(DataSRVC, BREAD){
		return {
			restrict: 'A',
			templateUrl: '../modules/cards/views/feature-card.html',
			scope: { card: '=', panel: '=' },
			link: function(scope, element, attrs){
				scope.BREAD = BREAD;
				scope.dataSRVC = DataSRVC;
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

angular.module('decks').factory('CardsBread', ['$stateParams', '$location', 'Authentication', '$resource', '$rootScope', 'Bakery', function($stateParams, $location, Authentication, $resource, $rootScope, Bakery){
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
    
    var getCardResource = function(cardType){
        switch(cardType){
            case 'Aspect':
                return Bakery.Aspects;
            case 'Trait':
                return Bakery.Traits;
            case 'Feat':
                return Bakery.Feats;
            case 'Augment':
                return Bakery.Augments;
            case 'Item':
                return Bakery.Items;
            case 'Origin':
                return Bakery.Origins;
        }
    };
    
    var getNewCardResource = function(panel){
        switch(panel.cardRole){
            case 'Aspect':
                return new Bakery.Aspects(panel.aspectData);
            case 'Trait':
                return new Bakery.Traits(panel.traitData);
            case 'Feat':
                return new Bakery.Feats(panel.featData);
            case 'Augment':
                return new Bakery.Augments(panel.augmentData);
            case 'Item':
                return new Bakery.Items(panel.itemData);
            case 'Origin':
                return new Bakery.Origins(panel.originData);
        }
    };
    
    var getCardParams = function(panel){
        var cardId;
        console.log(panel);
        switch(panel.cardRole){
            case 'Aspect':
                cardId = panel.aspectData._id;
                return { aspectId: cardId };
            case 'Trait':
                cardId = panel.traitData._id;
                return { traitId: cardId };
            case 'Feat':
                cardId = panel.featData._id;
                return { featId: cardId };
            case 'Augment':
                cardId = panel.augmentData._id;
                return { augmentId: cardId };
            case 'Item':
                cardId = panel.itemData._id;
                return { itemId: cardId };
            case 'Origin':
                cardId = panel.originData._id;
                return { originId: cardId };
        }
    };
    
    var getPanelData = function(panel){
        switch(panel.cardRole){
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
    
    var setPanelData = function(panel, cardData){
        switch(panel.cardRole){
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
        }
    };
    
    //BROWSE
    service.browse = function(cardType, params, destination){
        var cardParams = getCardParams(params);
        getCardResource(cardType).query(cardParams, function(response){
            return response;
        });
    };
    
    //READ
    service.read = function(panel){
        var params = getCardParams(panel);
        console.log(params);
        getCardResource(panel.cardRole).get(
            params,
        function(response){
            console.log(response);
            setPanelData(panel, response);
        });
    };
    
    //EDIT
    service.edit = function(panel){
        if(panel.cardRole === 'Aspect'){
            getNewCardResource(panel).$update();
        } else if(getPanelData(panel)){
            var panelData = getPanelData(panel);
            var cardResource = getNewCardResource(panel);
            if(panelData.aspect) cardResource.aspect = panelData.aspect._id;
            cardResource.$update();
        }
    };
    
    //ADD
    service.add = function(deck, cardType, cardNumber, deckShift, deckSave){
        var card = {
            deck: deck._id,
            cardSet: deck.deckSize,
            cardNumber: cardNumber,
            cardType: cardType
        };

        var panel = {
            cardRole: cardType,
            x_coord: cardNumber * 15,
            y_coord: 0
        };
        
        setPanelData(panel, card);
        
        var cardResource = getNewCardResource(panel);
        
        cardResource.$save(function(response){
            setPanelData(panel, response);
            deck.cardList.push(panel);
            Bakery.setDeckSize(Bakery.resource);
        }).then(function(response){
            if(deckShift) Bakery.expandDeck(panel, Bakery.resource.cardList);
        }).then(function(response){
            if(deckSave) editDeck(deck, true);
        });
    };
    
    //DELETE
    service.delete = function(panel, deck){
        if(panel.cardRole === 'architectOptions') return;
        
        var cardResource = getNewCardResource(panel);
        cardResource.$remove(function(response){
                if(deck) Bakery.removePanel(panel, deck.cardList);
            }).then(function(response){
                if(deck) Bakery.setDeckSize(deck);
            }).then(function(response){
                if(deck) Bakery.collapseDeck(panel, deck.cardList);
            }).then(function(response){
                if(deck) editDeck(deck, false);
        });
    };
    
    return service;
    
}]);
'use strict';

// Factory-service for managing Trait cards.
angular.module('cards').factory('traitService', ['Cards', 'CardDeck',
	function(Cards, CardDeck){
		var service = {};
		
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
	.controller('CoreController', ['$location', '$scope', '$rootScope', '$window', 'Authentication', 'CardDeck', 'Bakery', 'CardsBread', 'DecksBread', 'PcsBread', 'DataSRVC', 'PcsCard1', 'PcsCard2', 'PcsCard3', 'PcsTraits', 'PcsFeats', 'PcsAugments', 'PcsItems',
		function($location, $scope, $rootScope, $window, Authentication, CardDeck, Bakery, CardsBread, DecksBread, PcsBread, DataSRVC, PcsCard1, PcsCard2, PcsCard3, PcsTraits, PcsFeats, PcsAugments, PcsItems) {
			// This provides Authentication context.
			$scope.authentication = Authentication;
			
			$scope.cardDeck = CardDeck;
			
			$scope.Bakery = Bakery;
            
			$scope.dataSRVC = DataSRVC;
			
			$scope.pcsCard1 = PcsCard1;
			
			$scope.pcsCard2 = PcsCard2;
			
			$scope.pcsCard3 = PcsCard3;
			
			$scope.pcsTraits = PcsTraits;
			
			$scope.pcsFeats = PcsFeats;
			
			$scope.pcsAugments = PcsAugments;
			
			$scope.pcsItems = PcsItems;
			
			$scope.modalShown = false;
			
			$scope.diceBoxShown = false;
			
			$scope.modalDeckShown = false;
			
			var pcNew = false;
			
			var initialize = function(){
				toggleListeners(true);
			};
			
			var toggleListeners = function(enable){
				if(!enable) return;
				$scope.$on('$destroy', onDestroy);
				$scope.$on('screenSize:onHeightChange', onHeightChange);
				$scope.$on('ability:onPress', chooseAbility);
				$scope.$on('pcsCard1:updateAbility', updateAbility);
				$scope.$watch('pcsCard2.EXP', watchEXP);
				$scope.$watch('Bakery.resource.experience', watchExperience);
				$scope.$watch('Bakery.resource.level', watchLevel);
			};
			
			var onDestroy = function(){
				toggleListeners(false);
			};
			
			var onHeightChange = function(event, object){
				$scope.windowHeight = object.newHeight;
				$scope.windowScale = object.newScale;
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
				CardsBread.read(card);
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
			$scope.exitPc = function(){
				if(pcNew){
					Bakery.deletePc();
				}
				$scope.browsePcs();
			};
			
			$scope.hideModal = function(){
				$scope.modalShown = false;
				$scope.diceBoxShown = false;
				$scope.modalDeckShown = false;
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
			
			var chooseAbility = function(event, object){
				$scope.modalShown = true;
				$scope.diceBoxShown = true;
			};
			
			var updateAbility = function(event, object){
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
				$scope.modalShown = false;
				$scope.diceBoxShown = false;
			};
			
			//Watch for change in EXP input
			var watchEXP = function(newValue, oldValue){
				if(Bakery.resource && newValue !== oldValue){
					PcsCard2.EXP = parseInt(newValue);
					Bakery.resource.experience = parseInt(newValue);
				}
			};
			
			//Watch for change in experience
			var watchExperience = function(newValue, oldValue){
				if(Bakery.resource && newValue !== oldValue){
					PcsCard2.factorExperience();
					if(newValue !== PcsCard2.EXP){
						PcsCard2.EXP = newValue;
					}
				}
			};
			
			//Watch for changes in level
			var watchLevel = function(newValue, oldValue){
				if(Bakery.resource.abilities){
					PcsCard2.factorHealth();
					PcsCard2.factorStamina();
					PcsTraits.factorTraitLimit();
					PcsFeats.factorFeatLimit();
					PcsAugments.factorAugmentLimit();
				}
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

// General Bakery Factory-service.
angular.module('core').factory('Bakery', ['$stateParams', '$location', 'Authentication', '$resource', '$rootScope', 'Decks', 'Pcs', 'Aspects', 'Traits', 'Feats', 'Augments', 'Items', 'Origins', function($stateParams, $location, Authentication, $resource, $rootScope, Decks, Pcs, Aspects, Traits, Feats, Augments, Items, Origins){
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
    
    service.lastPanel = function(cardList){
        if(cardList.length > 0){
            var _index = 0;
            var _panel = { x_coord: 0 };
            for(var i = 0; i < cardList.length; i++){
                if(cardList[i].x_coord > (_panel.x_coord || 0)){
                    _index = i;
                    _panel = cardList[i];
                }
            }
            return {
                index: _index, panel: _panel
            };
        } else {
            return {
                index: 0, panel: { x_coord: 0 }
            };
        }
    };
    
    service.deckWidth = function(cardList){
        var lastPanel = service.lastPanel(cardList);
        return service.lastPanel(cardList).panel.x_coord + 15;
    };
    
    service.setCardList = function(cardList){
        for(var i = 0; i < cardList.length; i++){
            cardList[i].x_coord = i * 15;
            cardList[i].y_coord = 0;
            cardList[i].x_overlap = false;
            cardList[i].y_overlap = false;
            cardList[i].dragging = false;
            cardList[i].stacked = false;
        }
        $rootScope.$broadcast('DeckOrder:onDeckChange');
    };
    
    service.removePanel = function(panel, cardList){
        for(var i = 0; i < cardList.length; i++){
            if(cardList[i] === panel ) {
                cardList.splice(i, 1);
            }
        }
    };
	
    service.shiftDeck = function(panel, expand, cardList){
        var panel_x = panel.x_coord;
        var panel_y = panel.y_coord;
        var x_shift = expand ? 15 : -15;
        var _number = expand ? 1 : -1;
        
        for(var i = 0; i < cardList.length; i++){
            var slot = cardList[i];
            if(panel_x <= slot.x_coord){
                if(panel_y !== slot.y_coord){
                    slot.x_coord += x_shift;
                    if(slot.aspectData){
                        slot.aspectData.cardNumber += _number;
                    } else if(slot.traitData){
                        slot.traitData.cardNumber += _number;
                    } else if(slot.featData){
                        slot.featData.cardNumber += _number;
                    } else if(slot.augmentData){
                        slot.augmentData.cardNumber += _number;
                    } else if(slot.itemData){
                        slot.itemData.cardNumber += _number;
                    } else if(slot.originData){
                        slot.originData.cardNumber += _number;
                    }
                }
            }
        }

        $rootScope.$broadcast('Bakery:onDeckChange');
    };
    
    service.expandDeck = function(panel, cardList){
        var panel_x_coord = panel.x_coord;
        var panel_y_coord = panel.y_coord;
        
        for(var i = 0; i < cardList.length; i++){
            var slot = cardList[i];
            if(slot !== panel && slot.x_coord >= panel_x_coord){
                slot.x_coord += 15;
                if(slot.aspectData){
                    slot.aspectData.cardNumber++;
                } else if(slot.traitData){
                    slot.traitData.cardNumber++;
                } else if(slot.featData){
                    slot.featData.cardNumber++;
                } else if(slot.augmentData){
                    slot.augmentData.cardNumber++;
                } else if(slot.itemData){
                    slot.itemData.cardNumber++;
                } else if(slot.originData){
                    slot.originData.cardNumber++;
                }
            }
        }
        $rootScope.$broadcast('Bakery:onDeckChange');
    };
    
    service.collapseDeck = function(panel, cardList){
        var panel_x_coord = panel.x_coord;
        var panel_y_coord = panel.y_coord;
        
        for(var i = 0; i < cardList.length; i++){
            var slot = cardList[i];
            if(slot.x_coord > panel_x_coord){
                slot.x_coord -= 15;
                if(slot.aspectData){
                    slot.aspectData.cardNumber--;
                } else if(slot.traitData){
                    slot.traitData.cardNumber--;
                } else if(slot.featData){
                    slot.featData.cardNumber--;
                } else if(slot.augmentData){
                    slot.augmentData.cardNumber--;
                } else if(slot.itemData){
                    slot.itemData.cardNumber--;
                } else if(slot.originData){
                    slot.originData.cardNumber--;
                }
            }
        }
        $rootScope.$broadcast('Bakery:onDeckChange');
    };
    
    service.setDeckSize = function(resource){
        var _length = resource.cardList.length - 1;
        resource.deckSize = _length;
        for(var i = 0; i < resource.cardList.length; i++){
            var panel = resource.cardList[i];
            if(panel.aspectData){
                panel.aspectData.cardSet = _length;
            } else if(panel.traitData){
                panel.traitData.cardSet = _length;
            } else if(panel.featData){
                panel.featData.cardSet = _length;
            } else if(panel.augmentData){
                panel.augmentData.cardSet = _length;
            } else if(panel.itemData){
                panel.itemData.cardSet = _length;
            } else if(panel.originData){
                panel.originData.cardSet = _length;
            }
        }
    };
    
    service.toggleCardLock = function(panel){
        for(var i = 0; i < service.resource.cardList.length; i++){
            if(panel === service.resource.cardList[i]){
                service.resource.cardList[i].locked = !service.resource.cardList[i].locked;
            }
        }
    };
    
    service.findDependency = function(deck){
        var index = -1;
        for(var i = 0; i < service.resource.dependencies.length; i++){
            var dependency = service.resource.dependencies[i];
            if(dependency._id === deck._id){
                index = i;
            }
        }
        return index;
    };

    service.toggleDependency = function(deck){
        var deckIndex = service.findDependency(deck);

        if (deckIndex > -1) {
            service.resource.dependencies.splice(deckIndex, 1);
        } else {
            service.resource.dependencies.push(deck);
        }
    };
    
    service.changeAspect = function(card, aspect){
        if(card.aspect === aspect){
            console.log('same');
        } else {
            card.aspect = aspect;
        }
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
		
		service.aspectTypes = [
			'Archetype',
			'Allegiance',
			'Race'
		];
		
		service.archetypes = [
			'General',
			'Guardian',
			'Hunter',
			'Mastermind',
			'Champion'
		];
		
		service.allegiances = [
			'Unaligned',
			'Nymaria',
			'Vakhelos',
			'Heresy',
			'Inquisition'
		];
		
		service.races = [
			'Weolda',
			'Algharr',
			'Durhok',
			'Feyal',
			'Sylthaun'
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
var coreModule = angular.module('core');

// Factory-service for managing card-deck, card-slot and card-panel directives.
coreModule.factory('HomeDemo', ['$rootScope',
	function($rootScope){
	
	var service = {};
	
	service.cards = { 
		cardList: [
			{
				name: 'A Trait Card',
				cardType: 'trait',
				cardRole: 'home',
				x_coord: 0,
				y_coord: 0,
				x_overlap: false,
				y_overlap: false,
				dragging: false,
				stacked: false,
				locked: true
			},
			{
				name: 'A Feat Card',
				cardType: 'feat',
				cardRole: 'home',
				x_coord: 15,
				y_coord: 0,
				x_overlap: false,
				y_overlap: false,
				dragging: false,
				stacked: false,
				locked: true
			},
			{
				name: 'An Augment Card',
				cardType: 'augment',
				cardRole: 'home',
				x_coord: 30,
				y_coord: 0,
				x_overlap: false,
				y_overlap: false,
				dragging: false,
				stacked: false,
				locked: true,
				description: {
					show: true,
					content: 'Truly amazing...'
				}
			},
			{
				name: 'An Item Card',
				cardType: 'item',
				cardRole: 'home',
				x_coord: 45,
				y_coord: 0,
				x_overlap: false,
				y_overlap: false,
				dragging: false,
				stacked: false,
				locked: true
			},
			{
				name: 'Another Feat Card',
				cardType: 'feat',
				cardRole: 'home',
				x_coord: 60,
				y_coord: 0,
				x_overlap: false,
				y_overlap: false,
				dragging: false,
				stacked: false,
				locked: true
			},
			{
				name: 'Another Item Card',
				cardType: 'item',
				cardRole: 'home',
				x_coord: 75,
				y_coord: 0,
				x_overlap: false,
				y_overlap: true,
				dragging: false,
				stacked: true,
				locked: true,
				description: {
					show: true,
					content: 'This is the best one by far!!'
				}
			},
			{
				name: 'Yet Another Feat Card',
				cardType: 'feat',
				cardRole: 'home',
				x_coord: 75,
				y_coord: 3,
				x_overlap: false,
				y_overlap: false,
				dragging: false,
				stacked: true,
				locked: true
			}
		]
	};
	
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

// Directive for managing card decks.
angular.module('decks')
	.directive('cardDeck', ['$rootScope', '$window', 'CardDeck', 'Bakery', function($rootScope, $window, CardDeck, Bakery){
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
					scope.$on('CardDeck:setDeckWidth', setDeckWidth);
					scope.$on('cardPanel:onPressCard', onPress);
					scope.$on('cardPanel:onReleaseCard', onRelease);
					scope.$on('cardPanel:onMoveCard', onMoveCard);
				};
				
				var onDestroy = function(enable){
					toggleListeners(false);
				};
				
				var onHeightChange = function(event, object){
					var windowHeight = object.newHeight;
					element.css({
						'height': windowHeight+'px'
					});
				};
				
				var setDeckWidth = function(event, object){
					var deckWidth = object.deckWidth + 3;
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
					var deckWidth = Bakery.deckWidth(Bakery.resource.cardList);
					var deckLeftEdge = deckOffset.left;
					var deckRightEdge = convertEm(deckWidth + 3);
					
					if(object.mouseX <= deckLeftEdge){
						scope.$emit('cardDeck:unstackLeft', {
							panel: object.panel
						});
					} else if(object.mouseX >= deckRightEdge){
						scope.$emit('cardDeck:unstackRight', {
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
'use strict';

// Directive for managing card decks.
angular.module('decks')
	.directive('cardPanel', ['$document', '$parse', '$rootScope', '$window', 'Bakery', 'CardDeck', function($document, $parse, $rootScope, $window, Bakery, CardDeck){
		return {
			restrict: 'A',
			templateUrl: '../modules/decks/views/card-panel.html',
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
					scope.$on('cardPanel:onPressCard', onPressCard);
					scope.$on('cardPanel:onMoveCard', onMoveCard);
					scope.$on('cardPanel:onReleaseCard', onReleaseCard);
					scope.$on('cardDeck:onMouseLeave', onMouseLeave);
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
					
					$rootScope.$broadcast('cardPanel:onPressCard', {
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
								console.log('cardSlot:moveDiagonalUp');
								scope.$emit('cardSlot:moveDiagonalUp', {
									slot: slot,
									panel: panel
								});
							} else if(changeX === 0 && !panel_y_overlap){
								console.log('cardSlot:moveVertical');
								scope.$emit('cardSlot:moveVertical', {
									slot: slot,
									panel: panel
								});
							} else {
								console.log('cardSlot:moveHorizontal');
								scope.$emit('cardSlot:moveHorizontal', {
									slot: slot,
									panel: panel
								});
							}
						} else if(crossingEdge(mouseX, mouseY) === 'bottom'){
							if(changeX > 0 && changeX <= _x_dim){
								console.log('cardSlot:moveDiagonalDown');
								scope.$emit('cardSlot:moveDiagonalDown', {
									slot: slot,
									panel: panel
								});
							} else if(changeX === 0 && !panel_y_overlap){
								console.log('cardSlot:moveVertical');
								scope.$emit('cardSlot:moveVertical', {
									slot: slot,
									panel: panel
								});
							} else {
								console.log('cardSlot:moveHorizontal');
								scope.$emit('cardSlot:moveHorizontal', {
									slot: slot,
									panel: panel
								});
							}
						} else if(crossingEdge(mouseX, mouseY) === 'left' || crossingEdge(mouseX, mouseY) === 'right'){
							if(vectorY * 2 > vectorX){
								if(moveY < 0){
									console.log('cardSlot:moveDiagonalUp');
									scope.$emit('cardSlot:moveDiagonalUp', {
										slot: slot,
										panel: panel
									});
								} else if(moveY > 0){
									console.log('cardSlot:moveDiagonalDown');
									scope.$emit('cardSlot:moveDiagonalDown', {
										slot: slot,
										panel: panel
									});
								}
							} else {
								console.log('cardSlot:moveHorizontal');
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
						panel: _panel
					});
					if(_moveX <= convertEm(1) && _moveX >= -convertEm(1) && _moveY <= convertEm(1) && _moveY >= -convertEm(1)){
						$rootScope.$broadcast('cardPanel:toggleOverlap', {
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
					$rootScope.$broadcast('cardPanel:onReleaseCard', {
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

// General BREAD Factory-service.
angular.module('decks')
	.factory('BREAD', ['$stateParams', '$location', 'Authentication', '$resource', '$rootScope', 'pcsDefaults', 'Decks', 'Pcs', 'Aspects', 'Traits', 'Feats', 'Augments', 'Items', 'Origins',
			function($stateParams, $location, Authentication, $resource, $rootScope, pcsDefaults, Decks, Pcs, Aspects, Traits, Feats, Augments, Items, Origins){
		
		var service = {};
		
		service.resource = {
			cardList: []
		};
		
		service.dependencyList = [];
		
		service.findDependency = function(deck){
			var index = -1;
			for(var i = 0; i < service.resource.dependencies.length; i++){
				var dependency = service.resource.dependencies[i];
				if(dependency._id === deck._id){
					index = i;
				}
			}
			return index;
		};
		
		service.toggleDependency = function(deck){
			var deckIndex = service.findDependency(deck);
			
			if (deckIndex > -1) {
				service.resource.dependencies.splice(deckIndex, 1);
			} else {
				service.resource.dependencies.push(deck);
			}
		};
		
		service.lastCard = function(){
			var _last = 0;
			var _card = {};
			for(var i = 0; i < service.resource.cardList.length; i++){
				if(service.resource.cardList[i].x_coord > (_card.x_coord || 0)){
					_last = i;
					_card = service.resource.cardList[i];
				}
			}
			return _last;
		};
		
		service.deckWidth = function(){
			if(service.resource.cardList){
				return service.resource.cardList[service.lastCard()].x_coord + 15;
			} else {
				return 30;
			}
		};
		
		var setCardList = function(list, destination){
			destination.cardList = list;
			for(var i = 0; i < list.length; i++){
				destination.cardList[i].x_coord = i * 15;
				destination.cardList[i].y_coord = 0;
				destination.cardList[i].x_overlap = false;
				destination.cardList[i].y_overlap = false;
				destination.cardList[i].dragging = false;
				destination.cardList[i].stacked = false;
			}
			$rootScope.$broadcast('BREAD:onDeckChange');
		};
		
		var removePanel = function(panel){
			for(var i = 0; i < service.resource.cardList.length; i++){
				if(service.resource.cardList[i] === panel ) {
					service.resource.cardList.splice(i, 1);
				}
			}
		};
		
		var shiftDeck = function(expand, panel){
			console.log(panel);
			var panel_x = panel.x_coord;
			var panel_y = panel.y_coord;
			var x_shift = expand ? 15 : -15;
			var _number = expand ? 1 : -1;
			var _length = service.resource.cardList.length-1;
			
			service.resource.deckSize = _length;
			
			for(var i = 0; i < _length+1; i++){
				var slot = service.resource.cardList[i];
				
				if(slot.aspectData){
					slot.aspectData.cardSet = _length;
				} else if(slot.traitData){
					slot.traitData.cardSet = _length;
				} else if(slot.featData){
					slot.featData.cardSet = _length;
				} else if(slot.augmentData){
					slot.augmentData.cardSet = _length;
				} else if(slot.itemData){
					slot.itemData.cardSet = _length;
				} else if(slot.originData){
					slot.originData.cardSet = _length;
				}
				console.log(panel_x);
				console.log(slot.x_coord);
				
				if(panel_x <= slot.x_coord){
					if(panel !== slot){
						slot.x_coord += x_shift;
						if(slot.aspectData){
							slot.aspectData.cardNumber += _number;
						} else if(slot.traitData){
							slot.traitData.cardNumber += _number;
						} else if(slot.featData){
							slot.featData.cardNumber += _number;
						} else if(slot.augmentData){
							slot.augmentData.cardNumber += _number;
						} else if(slot.itemData){
							slot.itemData.cardNumber += _number;
						} else if(slot.originData){
							slot.originData.cardNumber += _number;
						}
					}
				}
			}
			
			$rootScope.$broadcast('BREAD:onDeckChange');
		};
		
		service.toggleCardLock = function(panel){
			for(var i = 0; i < service.resource.cardList.length; i++){
				if(panel === service.resource.cardList[i]){
					service.resource.cardList[i].locked = !service.resource.cardList[i].locked;
				}
			}
		};
		
		service.changeAspect = function(card, aspect){
			if(card.aspect === aspect){
				console.log('same');
			} else {
				card.aspect = aspect;
			}
		};
		
		// BROWSE
		service.browseAspects = function(deck){
			console.log(deck);
			service.resource.archetypeList = [];
			service.resource.allegianceList = [];
			service.resource.raceList = [];
			Aspects.query({deckId: deck._id}, function(response){
				for(var i = 0; i < response.length; i++){
					console.log(response[i]);
					if(response[i].aspectType === 'Archetype'){
						service.resource.archetypeList.push(response[i]);
					} else if(response[i].aspectType === 'Allegiance'){
						service.resource.allegianceList.push(response[i]);
					} else if(response[i].aspectType === 'Race'){
						service.resource.raceList.push(response[i]);
					}
				}
			});
		};
		
		
		service.browseCards = function(cardType, params, destination){
			if(cardType === 'Aspect'){
				Aspects.query(params, function(response){
					return response;
				});
			} else if(cardType === 'Trait'){
				Traits.query(params, function(response){
					return response;
				});
			} else if(cardType === 'Feat'){
				Feats.query(params, function(response){
					return response;
				});
			} else if(cardType === 'Augments'){
				Augments.query(params, function(response){
					return response;
				});
			} else if(cardType === 'Items'){
				Items.query(params, function(response){
					return response;
				});
			} else if(cardType === 'Origins'){
				Origins.query(params, function(response){
					return response;
				});
			}
		};
		
		service.browseDecks = function(param, destination){
			if(param){
				Decks.query(param, function(response){
					if(destination === service.dependencyList){
						service.dependencyList = response;
					} else {
						response.unshift({
							cardRole: 'architectOptions'
						});
						setCardList(response, service.resource);
					}
				});
			} else {
				Decks.list(function(response){
					response.unshift({
						cardRole: 'architectOptions'
					});
					setCardList(response, service.resource);
				});
			}
		};
		
		service.browsePcs = function(){
			service.resource = {};
			service.resource.cardList = [];
			Pcs.query(function(response){
				response.unshift({
					cardRole: 'playerOptions'
				});
				setCardList(response, service.resource);
			});
		};
		
		// READ
		
		service.readCard = function(panel){
			var _card;
			
			if(panel.cardRole === 'Aspect'){
				_card = Aspects.get({
					aspectId: panel.aspectData._id
				},
				function(response){
					panel.aspectData = response;
				});
			} else if(panel.cardRole === 'Trait'){
				_card = Traits.get({
					traitId: panel.traitData._id
				},
				function(response){
					panel.traitData = response;
				});
			} else if(panel.cardRole === 'Feat'){
				_card = Feats.get({
					featId: panel.featData._id
				},
				function(response){
					panel.featData = response;
				});
			} else if(panel.cardRole === 'Augment'){
				_card = Augments.get({
					augmentId: panel.augmentData._id
				},
				function(response){
					panel.augmentData = response;
				});
			} else if(panel.cardRole === 'Item'){
				_card = Items.get({
					itemId: panel.itemData._id
				},
				function(response){
					panel.itemData = response;
				});
			} else if(panel.cardRole === 'Origin'){
				_card = Origins.get({
					originId: panel.originData._id
				},
				function(response){
					panel.originData = response;
				});
			}
		};
		
		service.readDeck = function(deck){
			Decks.get({
				deckId: deck._id
			}, function(response){
				service.resource = response;
				console.log(response);
				if(response.deckType !== 'Aspect'){
					
					service.browseDecks({deckType: 'Aspect'}, service.dependencyList);
					
					for(var i = 0; i < response.dependencies.length; i++){
						service.browseAspects(response.dependencies[i]);
					}
				}
			});
		};
		
		service.readPc = function(pc) {
			service.resource = Pcs.get({
				pcId: pc._id
			});
		};
		
		//EDIT
		
		service.editCard = function(panel){
			if(panel.cardRole === 'Aspect'){
				new Aspects(panel.aspectData).$update();
			} else if(panel.cardRole === 'Trait' && panel.traitData){
				var trait = new Traits(panel.traitData);
				if(trait.aspect) trait.aspect = panel.traitData.aspect._id;
				trait.$update();
			} else if(panel.cardRole === 'Feat'){
				var feat = new Feats(panel.featData);
				if(feat.aspect) feat.aspect = panel.featData.aspect._id;
				feat.$update();
			} else if(panel.cardRole === 'Augment'){
				var augment = new Augments(panel.augmentData);
				if(augment.aspect) augment.aspect = panel.augmentData.aspect._id;
				augment.$update();
			} else if(panel.cardRole === 'Item'){
				var item = new Items(panel.itemData);
				if(item.aspect) item.aspect = panel.itemData.aspect._id;
				item.$update();
			} else if(panel.cardRole === 'Origin'){
				var origin = new Origins(panel.originData);
				if(origin.aspect) origin.aspect = panel.itemData.aspect._id;
				origin.$update();
			}
		};
		
		service.editDeck = function(deck, _editCards, _loadDeck) {
			var _deck = new Decks(deck);
			
			console.log(deck);
			
			_deck.$update(function(response) {
				if(_editCards){
					for(var i = 0; i < deck.cardList.length; i++){
						var panel = deck.cardList[i];
						service.editCard(panel);
					}
					$rootScope.$broadcast('BREAD: deckSaved');
				}
				if(_loadDeck){
					service.resource = response;
				}
			}, function(errorResponse) {
				console.log(errorResponse);
			});
		};
		
		service.editPc = function(pc) {
			pc.$update(function(response) {
				
			}, function(errorResponse) {
				this.error = errorResponse.data.message;
			});
		};
		
		// ADD
		
		service.addCard = function(deck, cardType, cardNumber, deckShift, deckSave){
			console.log(deck);
			var card = {
				deck: deck._id,
				cardSet: deck.deckSize,
				cardNumber: cardNumber,
				cardType: cardType
			};
			
			var panel = {
				cardRole: cardType,
				x_coord: cardNumber * 15,
				y_coord: 0
			};
			
			if(cardType === 'Aspect'){
				new Aspects( card ).$save(function(response){
					panel.aspectData = response;
					deck.cardList.push(panel);
				}).then(function(response){
					if(deckShift) shiftDeck(true, panel);
				}).then(function(response){
					if(deckSave) service.editDeck(deck, false, true);
				});
				
			} else if(cardType === 'Trait'){
				new Traits( card ).$save(function(response){
					panel.traitData = response;
					deck.cardList.push(panel);
				}).then(function(response){
					if(deckShift) shiftDeck(true, panel);
				}).then(function(response){
					if(deckSave) service.editDeck(deck, false, true);
				});
				
			} else if(cardType === 'Feat'){
				new Feats( card ).$save(function(response){
					panel.featData = response;
					deck.cardList.push(panel);
				}).then(function(response){
					if(deckShift) shiftDeck(true, panel);
				}).then(function(response){
					if(deckSave) service.editDeck(deck, false, true);
				});
			} else if(cardType === 'Augment'){
				new Augments( card ).$save(function(response){
					panel.augmentData = response;
					deck.cardList.push(panel);
				}).then(function(response){
					if(deckShift) shiftDeck(true, panel);
				}).then(function(response){
					if(deckSave) service.editDeck(deck, false, true);
				});
			} else if(cardType === 'Item'){
				new Items( card ).$save(function(response){
					panel.itemData = response;
					deck.cardList.push(panel);
				}).then(function(response){
					if(deckShift) shiftDeck(true, panel);
				}).then(function(response){
					if(deckSave) service.editDeck(deck, false, true);
				});
			} else if(cardType === 'Origin'){
				new Origins( card ).$save(function(response){
					panel.originData = response;
					deck.cardList.push(panel);
				}).then(function(response){
					if(deckShift) shiftDeck(true, panel);
				}).then(function(response){
					if(deckSave) service.editDeck(deck, false, true);
				});
			}
		};
		
		service.addDeck = function(type, size){
			console.log('addDeck');
			
			var deck = new Decks ({
				name: type+' Deck',
				deckType: type,
				deckSize: size,
				cardList: [{
					cardRole: 'deckOptions',
					x_coord: 0,
					y_coord: 0
				}]
			});
			
			deck.$save(
				function(response){
					for(var i = 0; i < size; i++){
						service.addCard(deck, type, i+1, false, (i+1 === size));
					}
					if(type !== 'Aspect'){
						service.browseDecks({deckType: 'Aspect'}, service.dependencyList);
					}
				});
		};
		
		service.addPc = function(){
			var pc = new Pcs (
				pcsDefaults
			);
			
			pc.$save(function(response){
				service.resource = response;
			});
		};
		
		// DELETE
		service.deleteCard = function(panel, _removePanel, _shiftDeck){
			var cardData = 0;
			var panel_x_coord = panel.x_coord;
			
			if(panel.cardRole === 'Aspect'){
				new Aspects(panel.aspectData).$remove(function(response){
					if(_removePanel) removePanel(panel);
				}).then(function(response){
					if(_shiftDeck) shiftDeck(false, panel);
				});
			} else if(panel.cardRole === 'Trait'){
				new Traits(panel.traitData).$remove(function(response){
					if(_removePanel) removePanel(panel);
				}).then(function(response){
					if(_shiftDeck) shiftDeck(false, panel);
				});
			} else if(panel.cardRole === 'Feat'){
				new Feats(panel.featData).$remove(function(response){
					if(_removePanel) removePanel(panel);
				}).then(function(response){
					if(_shiftDeck) shiftDeck(false, panel);
				});
			} else if(panel.cardRole === 'Augment'){
				new Augments(panel.augmentData).$remove(function(response){
					if(_removePanel) removePanel(panel);
				}).then(function(response){
					if(_shiftDeck) shiftDeck(false, panel);
				});
			} else if(panel.cardRole === 'Item'){
				new Items(panel.itemData).$remove(function(response){
					if(_removePanel) removePanel(panel);
				}).then(function(response){
					if(_shiftDeck) shiftDeck(false, panel);
				});
			} else if(panel.cardRole === 'Origin'){
				new Origins(panel.originData).$remove(function(response){
					if(_removePanel) removePanel(panel);
				}).then(function(response){
					if(_shiftDeck) shiftDeck(false, panel);
				});
			}
		};
		
		service.deleteDeck = function(deck){
			console.log(deck);
			
			for(var i = 0; i < service.resource.cardList.length; i++){
				if(service.resource.cardList[i] === deck ) {
					console.log(service.resource.cardList[i]);
				}
			}
			
			deck.$remove(
				function(response){
					removePanel(deck);
					setCardList(service.resource.cardList, service.resource);
					for(var ii = 0; ii < response.cardList.length; ii++){
						var panel = response.cardList[ii];
						service.deleteCard(panel, false, false);
						if(panel.cardRole === 'Aspect'){
							new Aspects(panel.aspectData).$remove();
						} else if(panel.cardRole === 'Trait'){
							new Traits(panel.traitData).$remove();
						} else if(panel.cardRole === 'Feat'){
							new Feats(panel.featData).$remove();
						} else if(panel.cardRole === 'Augment'){
							new Augments(panel.augmentData).$remove();
						} else if(panel.cardRole === 'Item'){
							new Items(panel.itemData).$remove();
						} else if(panel.cardRole === 'Origin'){
							new Origins(panel.originData).$remove();
						}
					}
				}
			);
		};
		
		service.deletePc = function(pc) {
			pc.$remove(function(response){
				for (var i in service.resource.cardList ) {
					if (service.resource.cardList[i] === pc ) {
						service.resource.cardList.splice(i, 1);
					}
				}
			});
		};
		
		return service;
		
	}]);

'use strict';

// Factory-service for managing card-deck, card-slot and card-panel directives.
angular.module('core').factory('CardDeck', ['Bakery', 'Campaigns', '$rootScope',
	function(Bakery, Campaigns, $rootScope){
		var service = {};
		
		service.windowHeight = 0;
		
		var x_dim = 15;
		var y_dim = 21;
		var x_tab = 3;
		var y_tab = 3;
		var x_cover = 12;
		var y_cover = 18;
		var _moveSpeed = 800;
		var cardMoved = false;
		var cardMoving = false;
		var dropdownOpen;
		var moveTimer;
		
		var getCardList = function(){
			return Bakery.resource.cardList;
		};
		
		var getCardIndex = function(x_coord, y_coord){
			var _deck = getCardList();
			var _card = {};
			for(var i = 0; i < _deck.length; i++){
				if(_deck[i].x_coord === x_coord && _deck[i].y_coord === y_coord){
					return i;
				}
			}
		};
		
		var getFirstIndex = function(){
			return getCardIndex(0, 0);
		};
		
		service.getLastIndex = function(){
			var _deck = getCardList();
			var _card = {};
			var _last = 0;
			for(var i = 0; i < _deck.length; i++){
				if(_deck[i].x_coord > (_card.x_coord || 0)){
					_last = i;
					_card = _deck[i];
				}
			}
			return _last;
		};
		
		service.getDeckWidth = function(){
			var _deck = getCardList();
			return _deck[service.getLastIndex()].x_coord + x_dim;
		};
		
		var setDeckWidth = function(){
			var _deck = getCardList();
			var _deckWidth = _deck[service.getLastIndex()].x_coord + x_dim;
			$rootScope.$broadcast('CardDeck:setDeckWidth', {
				deckWidth: _deckWidth
			});
		};
		
		var getLastIndex = function(){
			var _deck = getCardList();
			var _card = {};
			var _last = 0;
			for(var i = 0; i < _deck.length; i++){
				if(_deck[i].x_coord > (_card.x_coord || 0)){
					_last = i;
					_card = _deck[i];
				}
			}
			return _last;
		};
		
		var getLowestIndex = function(x_coord){
			var _deck = getCardList();
			var _card = {};
			var _lowest = 0;
			for(var i = 0; i < _deck.length; i++){
				if(_deck[i].x_coord === x_coord){
					if(_deck[i].y_coord > (_card.y_coord || -1)){
						_lowest = i;
						_card = _deck[i];
					}
				}
			}
			return _lowest;
		};
		
		var setColumn = function(x_coord){
			var _deck = getCardList();
			var lowest_index = getLowestIndex(x_coord);
			var lowest_y_coord = _deck[lowest_index].y_coord;
			if(lowest_y_coord > 0){
				for(var i = 0; i < _deck.length; i++){
					if(_deck[i].x_coord === x_coord){
						_deck[i].stacked = true;
						if(_deck[i].y_coord < lowest_y_coord){
							_deck[i].y_overlap = true;
						} else {
							_deck[i].y_overlap = false;
						}
					}
				}
			} else {
				_deck[lowest_index].stacked = false;
				_deck[lowest_index].y_overlap = false;
			}
		};
		
		var initialize = function(){
			toggleListeners(true);
		};
		
		var toggleListeners = function(enable){
			if(!enable) return;
			$rootScope.$on('screenSize:onHeightChange', onHeightChange);
			
			$rootScope.$on('cardPanel:onPressCard', onPressCard);
			$rootScope.$on('cardPanel:onReleaseCard', onReleaseCard);
			$rootScope.$on('cardPanel:toggleOverlap', toggleOverlap);
			
			$rootScope.$on('cardSlot:moveHorizontal', moveHorizontal);
			$rootScope.$on('cardSlot:moveDiagonalUp', moveDiagonalUp);
			$rootScope.$on('cardSlot:moveDiagonalDown', moveDiagonalDown);
			$rootScope.$on('cardSlot:moveVertical', moveVertical);
			
			$rootScope.$on('cardDeck:unstackLeft', unstackLeft);
			$rootScope.$on('cardDeck:unstackRight', unstackRight);
		};
		
		var onHeightChange = function(event, object){
			service.windowHeight = object.newHeight;
		};
		
		// Set move booleans
		var setCardMoving = function(interval){
			clearTimeout(moveTimer);
			cardMoving = true;
			cardMoved = true;
			moveTimer = setTimeout(function(){
				cardMoving = false;
				setDeckWidth();
			}, interval);
		};
		
		// Reset move variables
		var onPressCard = function(event, object){
			var panel = object.panel;
			var _deck = getCardList();
			var panel_x = panel.x_coord;
			var panel_y = panel.y_coord;
			var panel_index = getCardIndex(panel_x, panel_y);
			
			cardMoved = false;
			if(_deck[panel_index].y_overlap){
				for(var ia = 0; ia < _deck.length; ia++){
					if(_deck[ia].x_coord === panel_x && _deck[ia].y_coord >= panel_y){
						_deck[ia].dragging = true;
					}
				}
			} else {
				_deck[panel_index].dragging = true;
			}
			
			$rootScope.$digest();
		};
		
		// Reset move variables
		var onReleaseCard = function(event, object){
			var panel = object.panel;
			var _deck = getCardList();
			var panel_index = getCardIndex(panel.x_coord, panel.y_coord);
			
			cardMoved = false;
			
			for(var ia = 0; ia < _deck.length; ia++){
				_deck[ia].dragging = false;
			}
			
			$rootScope.$digest();
		};
		
		var moveHorizontal = function(event, object){
			var _slot = object.slot;
			var _panel = object.panel;
			var _deck = getCardList();
			var _lowest_index = getLowestIndex(_panel.x_coord);
			if(_panel.y_coord > 0 || (_panel.y_coord === 0 && _panel.stacked && !_panel.y_overlap)){
				console.log('unstackCard');
				unstackCard(_slot, _panel);
			} else if (_panel.y_coord === 0){
				console.log('switchHorizontal');
				switchHorizontal(_slot, _panel);
			}
		};

		var moveDiagonalUp = function(event, object){
			console.log('moveDiagonalUp');
			var _slot = object.slot;
			var _panel = object.panel;
			var _deck = getCardList();
			var _lowest_index = getLowestIndex(_panel.x_coord);
			if(_panel.y_coord === 0){
				stackUnder(_slot, _panel);
			} else {
				unstackCard(_slot, _panel);
			}
		};

		var moveDiagonalDown = function(event, object){
			var _slot = object.slot;
			var _panel = object.panel;
			var _deck = getCardList();
			var _lowest_index = getLowestIndex(_panel.x_coord);
			if(_panel.y_coord === 0){
				stackOver(_slot, _panel);
			} else {
				unstackCard(_slot, _panel);
			}
		};
		
		var moveVertical = function(event, object){
			switchVertical(object.slot, object.panel);
		};
		
		var unstackLeft = function(event, object){
			if(object.panel.y_coord > 0){
				var _panel = object.panel;
				var _deck = getCardList();
				var unstack_coord = _deck[getFirstIndex()].x_coord - x_dim;
				unstackCard({x_coord: unstack_coord}, _panel);
			}
		};
		
		var unstackRight = function(event, object){
			if(object.panel.y_coord > 0){
				var _panel = object.panel;
				var _deck = getCardList();
				var unstack_coord = _deck[getLastIndex()].x_coord + x_dim;
				unstackCard({x_coord: unstack_coord}, _panel);
			}
		};
		
		// Swap card order along horizontal axis
		var switchHorizontal = function(slot, panel){
			if(!cardMoving){
				var _deck = getCardList();
				
				var slot_x = slot.x_coord;
				var slot_y = slot.y_coord;
				var slot_index = getCardIndex(slot_x, slot_y);
				var slot_x_overlap = slot.x_overlap;
				var slot_position = slot_x;
				
				var panel_x = panel.x_coord;
				var panel_y = panel.y_coord;
				var panel_index = getCardIndex(panel_x, panel_y);
				var panel_x_overlap = panel.x_overlap;
				var panel_width = x_dim;
				
				if(panel_x - slot_x > 0){
				// PANEL MOVING LEFT
					setCardMoving(_moveSpeed);
					
					if(slot_x === 0 && panel_x_overlap){
						slot_position = 0;
						panel_width -= x_cover;
						_deck[slot_index].x_overlap = true;
						_deck[panel_index].x_overlap = false;
					} else {
						if(panel_x_overlap){
							panel_width -= x_cover;
							slot_position -= x_cover;
						}
						if(slot_x_overlap){
							slot_position += x_cover;
						}
					}
					for(var ia = 0; ia < _deck.length; ia++){
						if(_deck[ia].x_coord >= slot_x && _deck[ia].x_coord < panel_x){
						// Modify position of each card in "SLOT" column and to the left of "PANEL" column
							_deck[ia].x_coord += panel_width;
						} else if(_deck[ia].x_coord === panel_x){
						// Modify position of each card in "PANEL" column
							_deck[ia].x_coord = slot_position;
						}
					}
				} else if(panel_x - slot_x < 0){
				// PANEL MOVING RIGHT
					setCardMoving(_moveSpeed);
					if(panel_x === 0 && slot_x_overlap){
						var first_index = getFirstIndex();
				//		_deck[first_index].x_coord = 0;
						_deck[first_index].x_overlap = false;
						_deck[panel_index].x_overlap = true;
						panel_width -= x_cover;
					} else if(panel_x > 0){
						if(panel_x_overlap){
							panel_width -= x_cover;
						}
					}
					
					for(var ib = 0; ib < _deck.length; ib++){
						if(_deck[ib].x_coord <= slot_x && _deck[ib].x_coord > panel_x){
						// Modify position of each card in "SLOT" column
							_deck[ib].x_coord -= panel_width;
						} else if(_deck[ib].x_coord === panel_x){
						// Modify position of each card in "PANEL" column
							_deck[ib].x_coord = slot_position;
						}
					}
				}
				$rootScope.$digest();
			}
		};
		
		// Swap card order along vertical axis
		var switchVertical = function(slot, panel){
			if(!cardMoving){
				var _deck = getCardList();
				
				var slot_x = slot.x_coord;
				var slot_y = slot.y_coord;
				var slot_index = getCardIndex(slot_x, slot_y);
				var slot_y_overlap = slot.y_overlap;
				
				var panel_x = panel.x_coord;
				var panel_y = panel.y_coord;
				var panel_index = getCardIndex(panel_x, panel_y);
				var panel_y_overlap = panel.y_overlap;
				
				var lowest_index = getLowestIndex(slot_x);
				var lowest_y = _deck[lowest_index].y_coord;
				
				if(panel_y - slot_y > 0){
				// PANEL MOVING UP
					setCardMoving(_moveSpeed);
					
					_deck[slot_index].y_coord = panel_y;
					_deck[slot_index].y_overlap = panel_y_overlap;
					$rootScope.$digest();
					_deck[panel_index].y_coord = slot_y;
					_deck[panel_index].y_overlap = slot_y_overlap;
					
				} else if(panel_y - slot_y < 0){
				// PANEL MOVING DOWN
					setCardMoving(_moveSpeed);
					
					_deck[slot_index].y_coord = panel_y;
					_deck[slot_index].y_overlap = panel_y_overlap;
					$rootScope.$digest();
					_deck[panel_index].y_coord = slot_y;
					_deck[panel_index].y_overlap = slot_y_overlap;
				}
				$rootScope.$digest();
			}
		};
		
		var stackOver = function(slot, panel){
			if(!cardMoving && !slot.x_overlap && !panel.x_overlap){
				
				var _deck = getCardList();
				
				var slot_x = slot.x_coord;
				var slot_y = slot.y_coord;
				var slot_index = getCardIndex(slot_x, slot_y);
				var slot_x_overlap = slot.x_overlap;
				var slot_y_overlap = slot.y_overlap;
				
				var panel_x = panel.x_coord;
				var panel_y = panel.y_coord;
				var panel_index = getCardIndex(panel_x, panel_y);
				var panel_x_overlap = panel.x_overlap;
				var panel_y_overlap = panel.y_overlap;
				var panel_lowest_index = getLowestIndex(panel_x);
				var panel_lowest_coord = _deck[panel_lowest_index].y_coord;
				
				var newColumn = panel_x > slot_x ? slot_x : slot_x - x_dim;
				
				if(!slot_x_overlap && !panel_x_overlap){
					setCardMoving(_moveSpeed);
					for(var ia = 0; ia < _deck.length; ia++){
						if(!_deck[ia].dragging && _deck[ia].x_coord === newColumn && _deck[ia].y_coord > slot_y){
							_deck[ia].y_coord += panel_lowest_coord + y_tab;
						}
						if(_deck[ia].dragging){
							_deck[ia].x_coord = slot_x;
							_deck[ia].y_coord += slot_y + y_tab - panel_y;
						}
						if(_deck[ia].x_coord > panel_x && panel_y === 0){
							_deck[ia].x_coord -= x_dim;
						}
					}
					setColumn(newColumn);
					setColumn(slot_x);
					setColumn(panel_x);
				}
				$rootScope.$digest();
			}
		};
		
		
		// Stack one card behind another and reposition deck to fill the gap
		var stackUnder = function(slot, panel){
			if(!cardMoving && !slot.x_overlap && !panel.x_overlap){
				
				var _deck = getCardList();
				
				var panel_x = panel.x_coord;
				var panel_y = panel.y_coord;
				var panel_index = getCardIndex(panel_x, panel_y);
				var panel_x_overlap = panel.x_overlap;
				var panel_y_overlap = panel.y_overlap;
				var panel_lowest_coord = _deck[getLowestIndex(panel_x)].y_coord;
				
				var slot_x = slot.x_coord;
				var slot_y = slot.y_coord;
				var slot_index = getCardIndex(slot_x, slot_y);
				var slot_lowest_coord = _deck[getLowestIndex(slot_x)].y_coord;
				var newColumn = panel_x > slot_x ? slot_x : slot_x - x_dim;
				
				setCardMoving(_moveSpeed);
				for(var ia = 0; ia < _deck.length; ia++){
					if(!_deck[ia].dragging && _deck[ia].x_coord === slot_x){
						_deck[ia].y_coord += panel_lowest_coord + y_tab;
					}
					if(_deck[ia].x_coord > panel_x){
						_deck[ia].x_coord -= x_dim;
					}
					if(_deck[ia].dragging){
						_deck[ia].x_coord = newColumn;
					}
				}
				setColumn(newColumn);
				setColumn(slot_x);
				setColumn(panel_x);
				$rootScope.$digest();
			}
		};
		
		// Withdraw card from stack and reposition deck to make room
		var unstackCard = function(slot, panel){
			if(!cardMoving){
				
				var _deck = getCardList();
				
				if(_deck[getLowestIndex(panel.x_coord)].y_coord > 0){
					var panel_x = panel.x_coord;
					var panel_y = panel.y_coord;
					var panel_index = getCardIndex(panel_x, panel_y);
					var panel_x_overlap = panel.x_overlap;
					var panel_y_overlap = panel.y_overlap;
					var slot_x = slot.x_coord;
					
					var new_slot_index, new_panel_index;
					
					if(panel_x - slot_x > 0){
					// Card is unstacking to the left
						setCardMoving(_moveSpeed);
						if(panel_y_overlap){
						// Unstack multiple cards to the left
							for(var ia = 0; ia < _deck.length; ia++){
								if(_deck[ia].x_coord > panel_x){
									_deck[ia].x_coord += x_dim;
								}
								if(_deck[ia].x_coord === panel_x){
									if(panel_y_overlap){
										if(_deck[ia].y_coord < panel_y){
											_deck[ia].x_coord += x_dim;
										} else if(_deck[ia].y_coord >= panel_y){
											_deck[ia].y_coord -= panel_y;
										}
									}
								}
							}
						} else if(!panel_y_overlap){
						// Unstack single card to the left
							for(var ib = 0; ib < _deck.length; ib++){
								if(_deck[ib].x_coord >= panel_x){
									if(_deck[ib].x_coord === panel_x && _deck[ib].y_coord > panel_y){
										_deck[ib].y_coord -= y_dim;
									}
									if(ib !== panel_index){
										_deck[ib].x_coord += x_dim;
									}
								}
							}
							_deck[panel_index].y_coord = 0;
							_deck[panel_index].stacked = false;
						}
						new_slot_index = getLowestIndex(panel_x);
						new_panel_index = getLowestIndex(panel_x + x_dim);
						
						_deck[new_slot_index].y_overlap = false;
						if(_deck[new_slot_index].y_coord === 0){
							_deck[new_slot_index].stacked = false;
						}
						
						_deck[new_panel_index].y_overlap = false;
						if(_deck[new_panel_index].y_coord === 0){
							_deck[new_panel_index].stacked = false;
						}
					} else if(panel_x - slot_x < 0 && !cardMoving){
					//Card is unstacking to the right
						setCardMoving(_moveSpeed);
						if(panel_y_overlap){
						// Unstack multiple cards to the right
							for(var ic = 0; ic < _deck.length; ic++){
								if(_deck[ic].x_coord > panel_x){
									_deck[ic].x_coord += x_dim;
								}
								if(_deck[ic].x_coord === panel_x){
									if(_deck[ic].y_coord >= panel_y){
										_deck[ic].x_coord += x_dim;
										_deck[ic].y_coord -= panel_y;
									}
								}
							}
						} else if(!panel_y_overlap){
						// Unstack single card to the right
							for(var id = 0; id < _deck.length; id++){
								if(_deck[id].x_coord > panel_x){
									_deck[id].x_coord += x_dim;
								}
								if(_deck[id].x_coord === panel_x && _deck[id].y_coord > panel_y){
									_deck[id].y_coord -= y_dim;
								}
							}
							_deck[panel_index].x_coord += x_dim;
							_deck[panel_index].y_coord = 0;
						}
						
						new_slot_index = getLowestIndex(panel_x);
						new_panel_index = getLowestIndex(slot_x);
						
						_deck[new_slot_index].y_overlap = false;
						if(_deck[new_slot_index].y_coord === 0){
							_deck[new_slot_index].stacked = false;
						}
						
						_deck[new_panel_index].y_overlap = false;
						if(_deck[new_panel_index].y_coord === 0){
							_deck[new_panel_index].stacked = false;
						}
					}
				}
				$rootScope.$digest();
			}
		};
		
		// Function for x_overlap and y_overlap
		var toggleOverlap = function(event, object){
			if(!cardMoved){
				var panel = object.panel;
				
				var _deck = getCardList();
				var panel_x = panel.x_coord;
				var panel_y = panel.y_coord;
				var panel_x_overlap = panel.x_overlap;
				var panel_y_overlap = panel.y_overlap;
				var panel_index = getCardIndex(panel_x, panel_y);
				var lowest_index = getLowestIndex(panel_x);
				var lowest_y = _deck[lowest_index].y_coord;
				
				if(panel_x > 0 && lowest_y === 0){
				// x_overlap
					if(panel_x_overlap && !cardMoving){
					// Card overlapped
						setCardMoving(_moveSpeed);
						_deck[panel_index].x_overlap = false;
						for(var ia = 0; ia < _deck.length; ia++){
							if(panel_x <= _deck[ia].x_coord){
								_deck[ia].x_coord += x_cover;
							}
						}
					} else if(!panel_x_overlap && !cardMoving){
					// Card not overlapped
						setCardMoving(_moveSpeed);
						_deck[panel_index].x_overlap = true;
						for(var ib = 0; ib < _deck.length; ib++){
							if(panel_x <= _deck[ib].x_coord){
								_deck[ib].x_coord -= x_cover;
							}
						}
					}
				} else if(panel_y !== lowest_y){
				// y_overlap
					if(panel_y_overlap && !cardMoving){
					// Card overlapped
						setCardMoving(_moveSpeed);
						_deck[panel_index].y_overlap = false;
						for(var ic = 0; ic < _deck.length; ic++){
							if(panel_x === _deck[ic].x_coord && panel_y < _deck[ic].y_coord){
								_deck[ic].y_coord += y_cover;
							}
						}
					} else if(!panel_y_overlap && !cardMoving){
					// Card not overlapped
						setCardMoving(_moveSpeed);
						_deck[panel_index].y_overlap = true;
						for(var id = 0; id < _deck.length; id++){
							if(panel_x === _deck[id].x_coord && panel_y < _deck[id].y_coord){
								_deck[id].y_coord -= y_cover;
							}
						}
					}
				}
				$rootScope.$digest();
				cardMoved = false;
			}
		};
		
		var removeCard = function(panel){
			// FUNCTIONAL ?
			
			var _deck = getCardList();
			var panel_x = panel.x_coord;
			var panel_y = panel.y_coord;
			var panel_index = getCardIndex(panel_x, panel_y);
			var panel_width = panel.x_overlap ? x_tab : x_dim;
			var panel_height = panel.y_overlap ? y_tab : y_dim;
			var lowest_y_coord = _deck[getLowestIndex(panel_x)].y_coord;
			
			_deck.splice(panel_index, 1);
			for(var id = 0; id < _deck.length; id++){
				if(lowest_y_coord > 0){
					if(_deck[id].x_coord === panel_x && _deck[id].y_coord > panel_y){
						_deck[id].y_coord -= panel_height;
					}
					_deck[getLowestIndex(panel_x)].y_overlap = false;
				} else if(lowest_y_coord === 0){
					if(_deck[id].x_coord > panel_x){
						_deck[id].x_coord -= panel_width;
					}
				}
			}
		};
		
		initialize();
		
		return service;
	}]);

'use strict';

angular.module('decks').factory('DecksBread', ['$stateParams', '$location', 'Authentication', '$resource', '$rootScope', 'Bakery', 'CardsBread', function($stateParams, $location, Authentication, $resource, $rootScope, Bakery, CardsBread){
    var service = {};
    
    var browseAspects = function(deck){
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
    
    var browseDependencies = function(){
        Bakery.Decks.query({deckType: 'Aspect'}, function(response){
            Bakery.dependencyList = response;
        });
    };
    
    //BROWSE
    service.browse = function(param){
        Bakery.resource = {};
        if(param){
            Bakery.Decks.query(param, function(response){
                response.unshift({
                    cardRole: 'architectOptions'
                });
                Bakery.resource.cardList = response;
                Bakery.setCardList(Bakery.resource.cardList);
            });
        } else {
            Bakery.Decks.list(function(response){
                response.unshift({
                    cardRole: 'architectOptions'
                });
                Bakery.resource.cardList = response;
                Bakery.setCardList(Bakery.resource.cardList);
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
                
                browseDependencies();

                for(var i = 0; i < response.dependencies.length; i++){
                    browseAspects(response.dependencies[i]);
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
                $rootScope.$broadcast('BREAD: deckSaved');
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
                cardRole: 'deckOptions',
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
                    browseDependencies();
                }
            });
    };
    
    //DELETE
    service.delete = function(deck, resource){
        deck.$remove(function(response){
            Bakery.removePanel(deck, resource.cardList);
            Bakery.setDeckSize(resource);
            Bakery.collapseDeck(deck, resource.cardList);
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
	.directive('diceBox', ['$window', 'CardDeck', function($window, CardDeck) {
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
	}])
	.directive('ability', ['$parse', '$rootScope', '$window', 'CardDeck', 'PcsCard1', function($parse, $rootScope, $window, CardDeck, PcsCard1){
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

// Directive for managing modal deck
angular.module('pcs')
	.directive('modalDeck', ['$window', 'CardDeck', function($window, CardDeck) {
		return {
			restrict: 'A',
			templateUrl: '../modules/pcs/views/modal-deck.html',
			link: function(scope, element, attrs) {
				
			}
		};
	}]);
'use strict';

// Factory-service for managing PC card deck.
angular.module('pcs').factory('PcsAugments', ['Bakery', 'CardDeck', 
	function(Bakery, CardDeck){
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
					CardDeck.removeCard(ic);
				}
			}
		};
		
		service.augmentAtLevel = function(level){
			var augmentAtLevel = false;
			for(var ib = 0; ib < Bakery.resource.cardList.length; ib++){
				if(Bakery.resource.cardList[ib].cardType === 'augment'){
					if(Bakery.resource.cardList[ib].level === level){
						augmentAtLevel = true;
					}
				}
			}
			return augmentAtLevel;
		};
		
		service.addAugment = function(level){
			var newAugment = {
				name: 'Level '+level+' Augment',
				cardType: 'augment',
				x_coord: Bakery.resource.cardList[Bakery.lastCard()].x_coord + 15,
				y_coord: 0,
				x_overlap: false,
				y_overlap: false,
				dragging: false,
				stacked: false,
				locked: true,
				level: level
			};
			Bakery.resource.cardList.push(newAugment);
		};
		
		return service;
	}]);
'use strict';

angular.module('pcs').factory('PcsBread', ['$stateParams', '$location', 'Authentication', '$resource', '$rootScope', 'Bakery', 'pcsDefaults', function($stateParams, $location, Authentication, $resource, $rootScope, Bakery, pcsDefaults){
    var service = {};
    
    //BROWSE
    service.browse = function(){
        Bakery.resource = {};
        Bakery.resource.cardList = [];
        Bakery.Pcs.query(function(response){
            response.unshift({
                cardRole: 'playerOptions'
            });
            Bakery.resource.cardList = response;
            Bakery.setCardList(Bakery.resource.cardList);
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
            Bakery.removePanel(pc, resource.cardList);
            Bakery.setDeckSize(resource);
            Bakery.collapseDeck(pc, resource.cardList);
        });
    };
    
    return service;
    
}]);
'use strict';

// Factory-service for managing pc1 data.
angular.module('pcs').factory('PcsCard1', ['$rootScope', 'Bakery',
	function($rootScope, Bakery){
		var service = {};
		
		service.chosenDie = {};
		service.previousDie = {};
		service.chosenAbility = {};
		
		service.chooseAbility = function(ability){
			service.chosenAbility = Bakery.resource.abilities[ability];
		};
		
		$rootScope.$on('ability:onPress', function(event, object){
			service.chosenAbility = Bakery.resource.abilities[object.ability.order];
		});
		
		
		service.chooseDie = function(dice){
			service.modalShown = false;
			
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
		
		service.EXP = 0;
		
		if(Bakery.resource){
			service.EXP = Bakery.resource.experience;
		}
		
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
					cardRole: 'pc1',
					x_coord: 0,
					y_coord: 0,
					x_overlap: false,
					y_overlap: false,
					dragging: false,
					stacked: false,
					locked: true
				},
				{
					cardRole: 'pc2',
					x_coord: 15,
					y_coord: 0,
					x_overlap: false,
					y_overlap: false,
					dragging: false,
					stacked: false,
					locked: true
				},
				{
					cardRole: 'pc3',
					x_coord: 30,
					y_coord: 0,
					x_overlap: false,
					y_overlap: false,
					dragging: false,
					stacked: false,
					locked: true,
				},
				{
					name: 'Level 0 Trait',
					cardRole: 'featureCard',
					x_coord: 45,
					y_coord: 0,
					x_overlap: false,
					y_overlap: false,
					dragging: false,
					stacked: false,
					locked: true,
					level: 0
				}
			]
		};
		
		return defaultStats;
		
	}]);
'use strict';

// Factory-service for managing PC card deck.
angular.module('pcs').factory('PcsFeats', ['Bakery', 'CardDeck', 
	function(Bakery, CardDeck){
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
					CardDeck.removeCard( Bakery.resource.cardList[ic] );
				}
			}
		};
		
		service.featAtLevel = function(level){
			var featAtLevel = false;
			for(var ib = 0; ib < Bakery.resource.cardList.length; ib++){
				if(Bakery.resource.cardList[ib].cardType === 'feat'){
					if(Bakery.resource.cardList[ib].level === level){
						featAtLevel = true;
					}
				}
			}
			return featAtLevel;
		};
		
		service.addFeat = function(level){
			var newFeat = {
				name: 'Level '+level+' Feat',
				cardType: 'feat',
				x_coord: Bakery.resource.cardList[Bakery.lastCard()].x_coord + 15,
				y_coord: 0,
				x_overlap: false,
				y_overlap: false,
				dragging: false,
				stacked: false,
				locked: true,
				level: level
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
angular.module('pcs').factory('PcsTraits', ['$resource', 'Bakery', 'CardDeck', 
	function($resource, Bakery, CardDeck){
		
		var service = {};
		
		var Traits = $resource(
			'traits/:traitId',
			{ traitId: '@_id' },
			{ update: { method: 'PUT' } }
		);
		
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
					CardDeck.removeCard(ic);
				}
			}
		};
		
		service.traitAtLevel = function(level){
			var traitAtLevel = false;
			for(var ib = 0; ib < Bakery.resource.cardList.length; ib++){
				if(Bakery.resource.cardList[ib].cardType === 'trait'){
					if(Bakery.resource.cardList[ib].level === level){
						traitAtLevel = true;
					}
				}
			}
			return traitAtLevel;
		};
		
		service.addTrait = function(level){
			var newTrait = {
				name: 'Level '+level+' Trait',
				cardType: 'trait',
				x_coord: Bakery.lastPanel(Bakery.resource.cardList).panel.x_coord + 15,
				y_coord: 0,
				x_overlap: false,
				y_overlap: false,
				dragging: false,
				stacked: false,
				locked: true,
				level: level
			};
			Bakery.resource.cardList.push(newTrait);
		};
		
		service.lockCard = function(card){
			card.cardRole = 'player';
			card.locked = true;
			card.x_coord = (card.cardNumber - 1) * 15;
			card.y_coord = 0;
			card.dragging = false;
			card.stacked = false;
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
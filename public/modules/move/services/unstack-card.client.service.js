'use strict';

// Factory-service for managing card-deck, card-slot and card-panel directives.
angular.module('move').factory('unstackCard', ['$rootScope', 'CoreVars', 'Bakery', 'PanelUtils', 'StackUtils',
    function($rootScope, CoreVars, Bakery, PanelUtils, StackUtils){
        
        return function(cardList, slot, panel){
            if(!CoreVars.cardMoving){
                
                if(PanelUtils.getLowestPanel(cardList, panel.x_coord).panel.y_coord > 0){
                    var panel_x = panel.x_coord;
                    var panel_y = panel.y_coord;
                    var panel_index = PanelUtils.getPanel(cardList, panel_x, panel_y).index;
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
                                    cardList[ia].x_coord += CoreVars.x_dim_em;
                                }
                                if(cardList[ia].x_coord === panel_x){
                                    if(panel_y_overlap){
                                        if(cardList[ia].y_coord < panel_y){
                                            cardList[ia].x_coord += CoreVars.x_dim_em;
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
                                        cardList[ib].y_coord -= CoreVars.y_dim_em;
                                    }
                                    if(ib !== panel_index){
                                        cardList[ib].x_coord += CoreVars.x_dim_em;
                                    }
                                }
                            }
                            cardList[panel_index].y_coord = 0;
                            cardList[panel_index].stacked = false;
                        }
                        new_slot_index = PanelUtils.getLowestPanel(cardList, panel_x).index;
                        new_panel_index = PanelUtils.getLowestPanel(cardList, panel_x + CoreVars.x_dim_em).index;
                        
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
                                    cardList[ic].x_coord += CoreVars.x_dim_em;
                                }
                                if(cardList[ic].x_coord === panel_x){
                                    if(cardList[ic].y_coord >= panel_y){
                                        cardList[ic].x_coord += CoreVars.x_dim_em;
                                        cardList[ic].y_coord -= panel_y;
                                    }
                                }
                            }
                        } else if(!panel_y_overlap){
                        // Unstack single card to the right
                            for(var id = 0; id < cardList.length; id++){
                                if(cardList[id].x_coord > panel_x){
                                    cardList[id].x_coord += CoreVars.x_dim_em;
                                }
                                if(cardList[id].x_coord === panel_x && cardList[id].y_coord > panel_y){
                                    cardList[id].y_coord -= CoreVars.y_dim_em;
                                }
                            }
                            cardList[panel_index].x_coord += CoreVars.x_dim_em;
                            cardList[panel_index].y_coord = 0;
                        }
                        
                        new_slot_index = PanelUtils.getLowestPanel(cardList, panel_x).index;
                        new_panel_index = PanelUtils.getLowestPanel(cardList, slot_x).index;
                        
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
/*******************************************************************************
 * The MIT License (MIT)
 *
 * Copyright (c) 2011, 2013 OpenWorm.
 * http://openworm.org
 *
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the MIT License
 * which accompanies this distribution, and is available at
 * http://opensource.org/licenses/MIT
 *
 * Contributors:
 *      OpenWorm - http://openworm.org/people.html
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
 * USE OR OTHER DEALINGS IN THE SOFTWARE.
 *******************************************************************************/
/**
 * Factory class that figures out what kind of nodes to create with the updates
 * received from the server. Creates the client nodes for entities, aspects, etc
 * and updates them.
 * 
 * @author Jesus R. Martinez (jesus@metacell.us)
 */
define(function(require) {
	return function(GEPPETTO) {
		var simulationTreeCreated=false;
		var PhysicalQuantity = require('nodes/PhysicalQuantity');

		/**
		 * @class GEPPETTO.RuntimeTreeController
		 */
		GEPPETTO.RuntimeTreeController = {
				/**Creates the backbone nodes for the first time depending.
				 */
				createRuntimeTree : function(jsonRuntimeTree){
					this.simulationTreeCreated=false;
					GEPPETTO.NodeFactory.populateTags();
					var entityNode = null;
					for (var id in jsonRuntimeTree) {
						var node = jsonRuntimeTree[id];
						if(node._metaType == GEPPETTO.Resources.ENTITY_NODE){
							entityNode = 
								GEPPETTO.NodeFactory.createEntityNode(node);
							
							// keep track of client entity nodes created
							window["Project"].runTimeTree[id] = entityNode;

							this.traverseEntities(node, entityNode,
									window["Project"].runTimeTree[id]);							
						}
					}
					
					if(entityNode!=null){
						//add commands to console autocomplete and help option
						GEPPETTO.Console.updateHelpCommand("assets/js/nodes/EntityNode.js",entityNode, entityNode.getId());
					}
				},

				/**
				 * Traverse through entities to create children
				 * 
				 * * @name RuntimeTreeController#traverseEntities
				 */
				traverseEntities : function(entities, parentNode, runTimeRef) {
					for ( var id in entities) {
						var node = entities[id];
						if (node._metaType == GEPPETTO.Resources.ENTITY_NODE) {
							var entityNode = GEPPETTO.NodeFactory
													 .createEntityNode(node);

							runTimeRef[id] = entityNode;
							entityNode.setParent(parentNode);
							parentNode.getEntities().push(entityNode);

							this.traverseEntities(node,entityNode);
						}
					}
				},
				/**Traverse the tree, when an aspect is found */
				updateNode :function(node)
				{
					for(var c in node)
					{
						var child=node[c];
						var aspectNode=eval(child.aspectInstancePath);
						if(child.SimulationTree != undefined)
						{
							if(jQuery.isEmptyObject(aspectNode.SimulationTree) || aspectNode.SimulationTree==undefined)
							{
								this.populateAspectSimulationTree(aspectNode.instancePath,child.SimulationTree);	
							}
						}
					}
				},

				/**Update all visual trees for a given entity*/
				updateEntityVisualTrees : function(entity, jsonRuntimeTree){
					for (var id in entity) 
					{
						if(entity[id]._metaType ==GEPPETTO.Resources.ASPECT_NODE )
						{
							var receivedAspect = entity[id];
							//match received aspect to client one
							var aspect =  GEPPETTO.Utility.deepFind(window["Project"].runTimeTree, receivedAspect.instancePath);
							if(receivedAspect.VisualizationTree != undefined)
							{
								aspect.VisualizationTree.content = receivedAspect.VisualizationTree;
							}
						}
						//traverse inside entity looking for more updates in visualization tree
						else if(entity[id]._metaType ==GEPPETTO.Resources.ENTITY_NODE){
							this.updateEntityVisualTrees(entity[id],jsonRuntimeTree);
						}
					}
				},

				/**Update entities of scene with new server updates*/
				updateVisualTrees : function(jsonRuntimeTree){
					for(var c in jsonRuntimeTree)
					{
						var node = jsonRuntimeTree[c];
						if(node._metaType==GEPPETTO.Resources.ENTITY_NODE)
						{
							this.updateEntityVisualTrees(node,jsonRuntimeTree);
						}
					}
				},

				/**Update entities of scene with new server updates*/
				updateRuntimeTree : function(jsonRuntimeTree){
					this.updateNode(jsonRuntimeTree);
					this.updateVisualTrees(jsonRuntimeTree);
					this.updateWidgets();
					
					var experiments = window.Project.getExperiments();
					for(var e in experiments){
						var variables = experiments[e].getVariables();
						for(var v in variables){
							try {
								var state = variables[v];
								var received=eval("jsonRuntimeTree."+state);
								var clientNode=eval(state);
								clientNode.getTimeSeries().unshift();
								
								for (var index in received.timeSeries){
									clientNode.getTimeSeries().unshift(new PhysicalQuantity(received.timeSeries[index].value, received.timeSeries[index].unit, received.timeSeries[index].scale));
								}
								
							} catch (e) {
							}
						}
					}
				},
				
				updateWidgets : function(){
					//send command to widgets that new data is available
					GEPPETTO.WidgetsListener.update(GEPPETTO.WidgetsListener.WIDGET_EVENT_TYPE.UPDATE);

					//update scene brightness
					for(var key in GEPPETTO.Simulation.listeners) {
						//retrieve the simulate state from watch tree
						var simState = GEPPETTO.Utility.deepFind(GEPPETTO.Simulation.runTimeTree, key);

						//update simulation state
						GEPPETTO.Simulation.listeners[key](simState);
					}
				},

				/**Create Model Tree for aspect
				 * 
				 * @param aspectInstancePath - Path of aspect to populate
				 * @param modelTree - Server JSON update
				 */
				populateAspectModelTree : function(aspectInstancePath, modelTree){
					var aspect= GEPPETTO.Utility.deepFind(GEPPETTO.Simulation.runTimeTree, aspectInstancePath);

					//populate model tree with server nodes
					this.createAspectModelTree(aspect.ModelTree, modelTree);

					//notify user received tree was empty
					if(aspect.ModelTree.getChildren().length==0){
						var indent = "    ";
						GEPPETTO.Console.log(indent + GEPPETTO.Resources.EMPTY_MODEL_TREE);
					}else{
						GEPPETTO.Console.executeCommand(aspect.ModelTree.instancePath + ".print()");
						aspect.ModelTree.print();
					}
				},

				/**Create Model Tree using JSON server update
				 * 
				 * @param parent - Used to store the created client nodes
				 * @param node - JSON server update nodes
				 */
				createAspectModelTree : function(parent, node){				    
					//traverse through nodes to create model tree
					for(var i in node) {
						if(typeof node[i] === "object") {
							var metatype = node[i]._metaType;

							//if object is array, do recursion to find more objects
							if(node[i] instanceof Array){
								var array = node[i];
								parent[i] = [];
								var arrayNode = new CompositeNode(
										{id: i, name : i,_metaType : GEPPETTO.Resources.COMPOSITE_NODE});
								arrayNode.setParent(parent);
								parent.getChildren().push(arrayNode);
								for(var index in array){
									parent[i][index] = {};
									var arrayObject = this.modelJSONNodes(arrayNode, array[index]);
									parent[i][index] = arrayObject;
								}
							}

							/*Match type of node and created*/
							if(metatype == GEPPETTO.Resources.COMPOSITE_NODE){
								var compositeNode =GEPPETTO.NodeFactory.createCompositeNode(node[i],true);
								compositeNode.setParent(parent);
								if(parent._metaType == GEPPETTO.Resources.COMPOSITE_NODE || parent._metaType == GEPPETTO.Resources.ASPECT_SUBTREE_NODE){
									parent.getChildren().push(compositeNode);
								}
								parent[i] = compositeNode;
								//traverse through children of composite node
								this.createAspectModelTree(parent[i], node[i]);
							}
							else if(metatype == GEPPETTO.Resources.FUNCTION_NODE){
								var functionNode =  GEPPETTO.NodeFactory.createFunctionNode(node[i]);
								functionNode.setParent(parent);
								if(parent._metaType == GEPPETTO.Resources.COMPOSITE_NODE || parent._metaType == GEPPETTO.Resources.ASPECT_SUBTREE_NODE){
									parent.getChildren().push(functionNode);
								}
								parent[i] = functionNode;
							}
							else if(metatype == GEPPETTO.Resources.DYNAMICS_NODE){
								var dynamicsSpecificationNode =  GEPPETTO.NodeFactory.createDynamicsSpecificationNode(node[i]);
								dynamicsSpecificationNode.setParent(parent);
								if(parent._metaType == GEPPETTO.Resources.COMPOSITE_NODE || parent._metaType == GEPPETTO.Resources.ASPECT_SUBTREE_NODE){
									parent.getChildren().push(dynamicsSpecificationNode);
								}
								parent[i] = dynamicsSpecificationNode;
							}
							else if(metatype == GEPPETTO.Resources.PARAMETER_SPEC_NODE){
								var parameterSpecificationNode =  GEPPETTO.NodeFactory.createParameterSpecificationNode(node[i]);
								parameterSpecificationNode.setParent(parent);
								if(parent._metaType == GEPPETTO.Resources.COMPOSITE_NODE || parent._metaType == GEPPETTO.Resources.ASPECT_SUBTREE_NODE){
									parent.getChildren().push(parameterSpecificationNode);
								}
								parent[i] = parameterSpecificationNode;
							}
							else if(metatype == GEPPETTO.Resources.TEXT_METADATA_NODE){
								var textMetadataNode =  GEPPETTO.NodeFactory.createTextMetadataNode(node[i]);
								textMetadataNode.setParent(parent);
								if(parent._metaType == GEPPETTO.Resources.COMPOSITE_NODE || parent._metaType == GEPPETTO.Resources.ASPECT_SUBTREE_NODE){
									parent.getChildren().push(textMetadataNode);
								}
								parent[i] = textMetadataNode;
							}
							else if(metatype == GEPPETTO.Resources.VARIABLE_NODE){
								var variableNode =  GEPPETTO.NodeFactory.createVariableNode(node[i]);
								variableNode.setParent(parent);
								if(parent._metaType == GEPPETTO.Resources.COMPOSITE_NODE || parent._metaType == GEPPETTO.Resources.ASPECT_SUBTREE_NODE){
									parent.getChildren().push(variableNode);
								}
								parent[i] = variableNode;
							}
						}
					}

					return parent;
				},
				
				/**Update and create simulation Tree for aspect
				 * 
				 * @param aspectInstancePath - Path of aspect to update
				 * @param simulationTree - Server JSON update
				 */
				populateAspectSimulationTree : function(aspectInstancePath, simulationTree){
					var aspect= GEPPETTO.Utility.deepFind(window["Project"].runTimeTree, aspectInstancePath);

					//populate model tree with server nodes
					GEPPETTO.NodeFactory.createAspectSimulationTree(aspect.SimulationTree, simulationTree);

					//notify user received tree was empty
					//NOTE: Don't print to console.log in here, this function is recursive,
					//and for entities with subentities it repeats printing same
					//statement over and over again
					if(aspect.SimulationTree.getChildren().length==0){
						var indent = "    ";
						GEPPETTO.Console.debugLog(indent + GEPPETTO.Resources.EMPTY_SIMULATION_TREE);
					}else{
						GEPPETTO.Console.debugLog(indent + GEPPETTO.Resources.SIMULATION_TREE_POPULATED);
						//GEPPETTO.Console.executeCommand(aspect.SimulationTree.instancePath + ".print()");
						//aspect.SimulationTree.print();
					}


					this.simulationTreeCreated = true;
				},
		};
	};
});

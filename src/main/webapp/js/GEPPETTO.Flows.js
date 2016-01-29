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
 * UI flows controller
 *
 *  @author Giovanni Idili
 */
define(function (require) {

    return function (GEPPETTO) {

        $ = require('jquery');

        /**
         * Create the container for holding the canvas
         *
         * @class GEPPETTO.Flows
         */
        GEPPETTO.Flows =
        {
            // any variables here
            whatever: null,

            /*
             * Handles flow on run experiment
             */
            onRun: function (callbackCommand) {
                var anythingRecorded = false;

                // TODO: check if anything is being recorded

                if(!anythingRecorded){
                    // TODO: if not, bring up spotlight configured for the RUN flow

                    // TODO: listen to spotlight exit event and handle it running the callbackCommand passed in
                } else {
                    // nothing to do - run callbackCommand directly
                    GEPPETTO.Console.executeCommand(callbackCommand);
                }
            },

            /*
             * Handles flow on play recording
             */
            onPlay: function (callbackCommand) {
                var anyPlotUp = false;

                // check if any plots are up
                if(GEPPETTO.WidgetFactory.getController(GEPPETTO.Widgets.PLOT) != null && GEPPETTO.WidgetFactory.getController(GEPPETTO.Widgets.PLOT) != undefined &&
                    GEPPETTO.WidgetFactory.getController(GEPPETTO.Widgets.PLOT).getWidgets() != null && GEPPETTO.WidgetFactory.getController(GEPPETTO.Widgets.PLOT).getWidgets() != undefined &&
                    GEPPETTO.WidgetFactory.getController(GEPPETTO.Widgets.PLOT).getWidgets().length > 0){
                    anyPlotUp = true;
                }

                if(!anyPlotUp){
                    // TODO: if not, bring up spotlight configured for the PLAY flow

                    // TODO: listen to spotlight exit event and handle it running the callbackCommand passed in
                } else {
                    // nothing to do - run callbackCommand directly
                    GEPPETTO.Console.executeCommand(callbackCommand);
                }
            },
        };

    };
});

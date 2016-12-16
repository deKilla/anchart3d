/**
 * @author Amar Bajric (https://github.com/amarbajric)
 * @author Michael Fuchs (https://github.com/deKilla)
 * @author Timo Hasenbichler (https://github.com/timoooo)
 */
//PieChart import needed because if not imported here, error occurs!
import {SceneInit} from './SceneInit';

import {PieChart} from '../pieChart';
import {Chart} from '../Chart';

export const createChart = function (domTarget) {
    let scene;
    let sceneConfig;
    let chart;
    let chartType;
    let chartData;

    let options = {
        domTarget: domTarget
    };

    return {
        setScene: function (sceneConfigJson) {
            options.sceneConfig = sceneConfigJson;
            return this;
        },
        setChart: function (chartType) {
            options.chartType = chartType;
            return this;
        },
        chartData: function (json) {
            options.chartData = json;
            return this;
        },
        draw: function () {
            //if no config file passed, pass empty object..needed cause if no object passed, undefined error occurs
            sceneConfig = options.sceneConfig || {};
            chartType = options.chartType;
            chartData = options.chartData;

            if (chartType && chartData) {

                chart = new Chart(chartType, chartData, sceneConfig)
                    .createChart();

                if (sceneConfig) { //if config for the sceneInit is available
                    scene = new SceneInit(domTarget, sceneConfig);
                }
                else { //else use default sceneInit settings
                    scene = new SceneInit(domTarget);
                }
                scene.initScene();
                scene.animate();
                scene.scene.add(chart.object);

            }
            else {
                throw "API Error: ChartType OR ChartData undefined!\nCheck if values were passed to 'setChart()' and 'chartData()'!";
            }
        }
    };
};
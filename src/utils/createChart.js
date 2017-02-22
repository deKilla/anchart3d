/**
 * @author Amar Bajric (https://github.com/amarbajric)
 * @author Michael Fuchs (https://github.com/deKilla)
 * @author Timo Hasenbichler (https://github.com/timoooo)
 */

import SceneInit from './SceneInit';
import Chart from './../Chart';
import JsonData from "./JsonData";
import {resetCameraPosition, dataSwapAnimation, resetChartPosition} from "./animation";
import Legend from "./Legend";


export default function createChart(domTarget) {
    let scene;
    let configJson;
    let chart;
    let chartType;
    let chartName;
    let data;
    let swapActive;//boolean for preventing chain call of swapData()

    let options = {
        domTarget: domTarget
    };

    return {
        setConfig: function (configJson) {
            if (!options.configJson) {
                options.configJson = configJson;
            }
            else console.warn("Configuration already set!\nIgnoring additional configuration passed to the API");
            return this;
        },
        pieChart: function () {
            options.chartType = "pieChart";
            return this;
        },
        barChart: function () {
            options.chartType = "barChart";
            return this;
        },
        lineChart: function () {
            options.chartType = "lineChart";
            return this;
        },
        data: function (jsonData, sortBy) {
            if (sortBy) {
                options.data = new JsonData(jsonData).sortData(sortBy);
            }
            else {
                options.data = new JsonData(jsonData);
            }
            return this;
        },
        draw: function () {
            //check config to either filter incorrect config parameters, or pass default config
            configJson = checkConfig(options.configJson);
            chartType = options.chartType;
            chartName = domTarget + "_" + chartType;
            data = options.data;

            if (document.getElementById(domTarget)) {
                if (chartType && data) {

                    chart = new Chart(chartName, chartType, data, configJson)
                        .createChart();

                    if (configJson) { //if config for the sceneInit is available
                        scene = new SceneInit(domTarget, configJson, chartName, chart.legendMap);
                    }
                    else { //else use default sceneInit settings
                        scene = new SceneInit(chartName, domTarget, chartName, chart.legendMap);
                    }
                    scene.initScene();
                    scene.animate();
                    scene.scene.add(chart.object);

                    return this;

                }
                else throw "API Error: ChartType OR ChartData undefined!\nCheck if chart type is set or 'chartData()' was called!";

            }
            else throw "API Error: Element with id \"" + domTarget + "\" not found!";
        },
        swapData: function () {
            if (!swapActive) {
                swapActive = true;
                if (scene) {
                    chartType = options.chartType;
                    data = options.data;
                    let camera = scene.camera;
                    let controls = scene.controls;
                    let oldChart = scene.scene.getObjectByName(chartName, true);
                    controls.enableZoom = false;
                    resetChartPosition(scene.scene,{x:0,y:0,z:0},1000);
                    resetCameraPosition(camera, scene.cameraDefaultPos, 1000).onComplete(function () {
                        let newChart = new Chart(chartName, chartType, data, configJson).createChart();
                        let legend = new Legend(newChart.legendMap,configJson, document.getElementById(domTarget));
                        legend.removeLegend();
                        legend.generateLegend();
                        scene.scene.add(newChart.object);
                        newChart.object.position.set(50, 0, -1.5);
                        dataSwapAnimation(oldChart, {x: -50, y: 0, z: 0}, newChart.object, 2500, 10)
                            .onComplete(function () {
                                scene.scene.remove(scene.scene.getObjectById(oldChart.id));
                                controls.enableZoom = true;
                                swapActive = false;
                            });
                    });
                }
                else throw "API Error: The method \"swapData()\" cannot be called before the \"draw()\" method!";
            }
            else console.warn("The method \"swapData()\" was already called and cannot be chained!\nIgnoring chain call of method!");
        }
    }
};


function checkConfig(configJson) {
    let validConfig = {};
    if (configJson) {
        Object.keys(configJson).forEach(function (propKey) {
            if (propKey === "fov") {
                if (isNaN(configJson[propKey]))
                    console.warn("Invalid type for property \"" + propKey + "\" : Type has to be 'integer'!\nProperty was set to default value!");
                else validConfig[propKey] = configJson[propKey];
            }
            else if (propKey === "name") {
                if (typeof configJson[propKey] != "string")
                    console.warn("Invalid type for property \"" + propKey + "\" : Type has to be 'string'!\nProperty was set to default value!");
                else validConfig[propKey] = configJson[propKey];
            }
            else if (["fov", "bgcolor"].indexOf(propKey) < 0 && typeof configJson[propKey] !== "boolean") {//if other config params are not boolean, they are set to false automatically
                console.warn("Invalid type for property \"" + propKey + "\": Type has to be \"boolean\"!\nProperty was set to \"false\"!");
                validConfig[propKey] = false;
            }
            else {
                validConfig[propKey] = configJson[propKey];
            }
        });
        return validConfig;
    }
    else {//check if valid types are used for config properties
        console.warn("No configuration passed for Scene.\nUsing default configuration!");
        return validConfig; //return empty object to use default config in SceneInit
    }
}
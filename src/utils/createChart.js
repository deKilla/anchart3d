/**
 * @author Amar Bajric (https://github.com/amarbajric)
 * @author Michael Fuchs (https://github.com/deKilla)
 * @author Timo Hasenbichler (https://github.com/timoooo)
 */

import SceneInit from './SceneInit';
import Chart from './../Chart';
import JsonData from "./JsonData";
import {resetCameraPosition, dataSwapAnimation} from "./animation";


export default function createChart (domTarget) {
    let scene;
    let configJson;
    let chart;
    let chartType;
    let chartData;
    let swapActive;//boolean for preventing chain call of swapData()

    let options = {
        domTarget: domTarget,
    };

    return {
        setConfig: function (configJson) {
            if(!options.configJson) {
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
        chartData: function (jsonData, sortBy) {
            if(sortBy){
                options.chartData = new JsonData(jsonData).sortData(sortBy);
            }
            else {
                options.chartData = new JsonData(jsonData);
            }
            return this;
        },
        draw: function () {
            //check config to either filter incorrect config parameters, or pass default config
            configJson = checkConfig(options.configJson);
            chartType = options.chartType;
            chartData = options.chartData;

            if(document.getElementById(domTarget)) {
                if (chartType && chartData) {

                    chart = new Chart(chartType, chartData, configJson)
                        .createChart();

                    if (configJson) { //if config for the sceneInit is available
                        scene = new SceneInit(domTarget, chartData , configJson);
                    }
                    else { //else use default sceneInit settings
                        scene = new SceneInit(domTarget, chartData);
                    }
                    scene.initScene();
                    scene.animate();
                    scene.scene.add(chart.object);
                    return this;

                }
                else throw "API Error: ChartType OR ChartData undefined!\nCheck if values were passed to 'setChart()' and 'chartData()'!";

            }
            else throw "API Error: Element with id \"" + domTarget + "\" not found!";
        },
        swapData : function(){
            if(!swapActive) {
                swapActive = true;
                if(scene) {
                    chartType = options.chartType;
                    chartData = options.chartData;
                    let camera = scene.camera;
                    let controls = scene.controls;
                    let newChart = new Chart(chartType, chartData, configJson).createChart().object;
                    let oldChart = scene.scene.getObjectByName("groupedChart", true);
                    controls.enableZoom = false;
                    resetCameraPosition(camera, {x: 0, y: -10, z: 7}, 1000).onComplete(function () {
                        scene.scene.add(newChart);
                        newChart.position.set(50, 0, 0);
                        dataSwapAnimation(oldChart, {x: -50, y: 0, z: 0}, newChart, 2500, 10)
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
    if(configJson){
        Object.keys(configJson).forEach(function (propKey) {
            if(propKey === "fov"){
                if(isNaN(configJson[propKey]))
                    console.warn("Invalid type for property \"" + propKey + "\" : Type has to be 'integer'!\nProperty was set to default value!");
                else validConfig[propKey] = configJson[propKey];
            }
            else if(["fov","bgcolor"].indexOf(propKey) < 0 && typeof configJson[propKey] !== "boolean"){//if other config params are not boolean, they are set to false automatically
                console.warn("Invalid type for property \"" + propKey + "\": Type has to be \"boolean\"!\nProperty was set to \"false\"!");
                validConfig[propKey] = false;
            }
            else{
                validConfig[propKey] = configJson[propKey];
            }
        });
        return validConfig;
    }
    else{//check if valid types are used for config properties
        console.warn("No configuration passed for Scene.\nUsing default configuration!");
        return validConfig; //return empty object to use default config in SceneInit
    }
}
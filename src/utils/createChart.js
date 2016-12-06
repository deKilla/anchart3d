
 import {SceneInit} from './SceneInit';
 import {JsonData} from './jsonData';
 import {PieChart} from '../pieChart';
 

window.createChart = function(domTarget) {
    let scene;
    let sceneOptions;
    let chart;
    let chartType;
    let chartData;

    let options = {
        domTarget: domTarget
    };

    return {
        setScene: function (json) {
            options.scene = json;
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
            sceneOptions = (options.scene !== undefined) ? options.scene : undefined;
            chartType = (options.chartType !== undefined) ? options.chartType : undefined;
            chartData = (options.chartData !== undefined) ? options.chartData : undefined;

            if (chartType !== undefined && chartData !== undefined) {

                if (sceneOptions !== undefined) {
                    scene = new SceneInit(domTarget); //hier mit scene config übergeben
                }
                else {
                    scene = new SceneInit(domTarget);
                }
                scene.initScene();
                scene.animate();

                switch (chartType) {//cases für diverse chart anlegen
                    case "pieChart":
                        chart = new PieChart(new JsonData(chartData));
                        break;
                }

                scene.scene.add(chart.object);
            }
            else {
                console.error("ChartType OR ChartData undefined!\nCheck if values were passed to 'setChart()' and 'chartData()'!");
            }
        }
    };
}
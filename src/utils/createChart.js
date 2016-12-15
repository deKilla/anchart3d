
 import {SceneInit} from './SceneInit';
 import {JsonData} from './jsonData';
 import {PieChart} from '../pieChart';
 import {Chart} from '../Chart';
 

export const createChart = function(domTarget) {
    let scene;
    let sceneOptions;
    let chart;
    let chartType;
    let chartData;
    let chartConfig;

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
        chartConfig: function (configuration) {
            options.chartConfig = configuration;
            return this;
        },
        draw: function () {
            sceneOptions = options.scene;
            chartType = options.chartType;
            chartData = options.chartData;
            chartConfig = options.chartConfig;



            if (chartType && chartData) {

                chart = new Chart(chartType, chartData, chartConfig)
                    .createChart();

                if (sceneOptions) {
                    scene = new SceneInit(domTarget); //hier mit scene config übergeben
                }
                else {
                    scene = new SceneInit(domTarget);
                }
                scene.initScene();
                scene.animate();

                scene.scene.add(chart.object);
            }
            else {
                console.error("ChartType OR ChartData undefined!\nCheck if values were passed to 'setChart()' and 'chartData()'!");
            }
        }
    };
};
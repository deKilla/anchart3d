/**
 * @author Amar Bajric (https://github.com/amarbajric)
 * @author Michael Fuchs (https://github.com/deKilla)
 * @author Timo Hasenbichler (https://github.com/timoooo)
 */

import {PieChart} from './pieChart';
import {JsonData} from './utils/jsonData';

class Chart {

    constructor(chartType, chartData, sceneConfig) {
        this.chartType = chartType;
        this.chartData = chartData;
        this.sceneConfig = sceneConfig;
    }


    createChart() {
        let chart;
        switch (this.chartType) {
            case "pieChart":
                chart = new PieChart(new JsonData(this.chartData),this.sceneConfig);
                break;
            default:
                throw "chartTypeError: The chart type '" + this.chartType + "' is not valid!";
                break;
        }

        return chart;
    }
}

export {Chart}
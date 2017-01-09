/**
 * @author Amar Bajric (https://github.com/amarbajric)
 * @author Michael Fuchs (https://github.com/deKilla)
 * @author Timo Hasenbichler (https://github.com/timoooo)
 */

import {PieChart} from './PieChart';
import {JsonData} from './utils/jsonData';

class Chart {

    constructor(chartType, chartData, configuration) {
        this.chartType = chartType;
        this.chartData = chartData;
        this.configuration = configuration;
    }


    createChart() {
        let chart;
        let data = new JsonData(this.chartData);
        (this.configuration.sortDataBy) ? data.sortData(this.configuration.sortDataBy) : data;

        switch (this.chartType) {
            case "pieChart":
                chart = new PieChart(data,this.configuration);
                break;
            default:
                throw "ChartTypeError: The chart type '" + this.chartType + "' is not valid!";
                break;
        }

        return chart;
    }
}

export {Chart}
/**
 * @author Amar Bajric (https://github.com/amarbajric)
 * @author Michael Fuchs (https://github.com/deKilla)
 * @author Timo Hasenbichler (https://github.com/timoooo)
 */

import PieChart from './PieChart';
import JsonData from './utils/JsonData';
import BarChart from './BarChart'

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

        // https://sourcemaking.com/refactoring/smells/switch-statements => TODO
        switch (this.chartType) {
            case "pieChart":
                chart = new PieChart(data,this.configuration);
                break;
            case "barChart":
                chart = new BarChart(data,this.configuration);
                break;
            default:
                throw "ChartTypeError: The chart type '" + this.chartType + "' is not valid!";
                break;
        }

        return chart;
    }
}

export default Chart;
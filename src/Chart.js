/**
 * @author Amar Bajric (https://github.com/amarbajric)
 * @author Michael Fuchs (https://github.com/deKilla)
 * @author Timo Hasenbichler (https://github.com/timoooo)
 */

import PieChart from './PieChart';

class Chart {

    constructor(chartType, chartData, configuration) {
        this.chartType = chartType;
        this.chartData = chartData;
        this.configuration = configuration;
    }


    createChart() {
        let chart;
        let data = this.chartData;

        // https://sourcemaking.com/refactoring/smells/switch-statements => TODO
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

export default Chart;
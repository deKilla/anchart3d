/**
 * @author Amar Bajric (https://github.com/amarbajric)
 * @author Michael Fuchs (https://github.com/deKilla)
 * @author Timo Hasenbichler (https://github.com/timoooo)
 */

import PieChart from './PieChart';
import BarChart from './BarChart'

class Chart {

    constructor(name, type, data, configuration) {
        this.name = name;
        this.type = type;
        this.data = data;
        this.configuration = configuration;
        this.legendMap = null;
    }


    createChart(chartType = this.type) {
        let chart;
        let data = this.data;

        // https://sourcemaking.com/refactoring/smells/switch-statements => TODO
        switch (chartType) {
            case "pieChart":
                chart = new PieChart(this.name, chartType, data, this.configuration);
                this.legendMap = chart.legendMap;
                break;
            case "barChart":
                chart = new BarChart(this.name, chartType, data, this.configuration);
                this.legendMap = chart.legendMap;
                break;
            default:
                throw "ChartTypeError: The chart type '" + chartType + "' is not valid!";
                break;
        }

        return chart;
    }
}

export default Chart;
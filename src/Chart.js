/**
 * @author Amar Bajric (https://github.com/amarbajric)
 * @author Michael Fuchs (https://github.com/deKilla)
 * @author Timo Hasenbichler (https://github.com/timoooo)
 */

import PieChart from './PieChart';
import BarChart from './BarChart'

class Chart {

    constructor(type, data, configuration) {
        this.type = type;
        this.data = data;
        this.configuration = configuration;
        this.legendMap = null;
    }


    createChart() {
        let chart;
        let data = this.data;

        // https://sourcemaking.com/refactoring/smells/switch-statements => TODO
        switch (this.type) {
            case "pieChart":
                chart = new PieChart(this.type, data, this.configuration);
                this.legendMap = chart.legendMap;
                break;
            case "barChart":
                chart = new BarChart(this.type, data, this.configuration);
                this.legendMap = chart.legendMap;
                break;
            default:
                throw "ChartTypeError: The chart type '" + this.type + "' is not valid!";
                break;
        }

        return chart;
    }
}

export default Chart;
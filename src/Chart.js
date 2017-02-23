/**
 * @author Amar Bajric (https://github.com/amarbajric)
 * @author Michael Fuchs (https://github.com/deKilla)
 * @author Timo Hasenbichler (https://github.com/timoooo)
 */

import PieChart from './PieChart';
import BarChart from './BarChart'
import ScatterChart from "./ScatterChart";
import LineChart from "./LineChart";


class Chart {

    constructor(name, type, data, configuration) {
        this.name = name;
        this.type = type;
        this.data = data;
        this.configuration = configuration;
        this.legendMap = null;
    }


    createChart() {
        let chart;
        let data = this.data;
        let chartType = this.type;
        let name = this.name;
        let config = this.configuration;

        // https://sourcemaking.com/refactoring/smells/switch-statements => TODO
        switch (chartType) {
            case "pieChart":
                chart = new PieChart(name, chartType, data, config);
                this.legendMap = chart.legendMap;
                break;
            case "barChart":
                chart = new BarChart(name, chartType, data, config);
                this.legendMap = chart.legendMap;
                break;
            case "scatterChart":
                chart = new ScatterChart(name, chartType, data, config);
                this.legendMap = chart.legendMap;
                break;
            case "lineChart":
                chart = new LineChart(name, chartType, data, config);
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
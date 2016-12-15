/**
 * Created by Timo on 09.12.2016.
 */


import {PieChart} from './pieChart'
import {JsonData} from './utils/jsonData'

class Chart {

    constructor(chartType, chartData, chartConfig) {
        this.charType = chartType;
        this.chartData = chartData;
        this.chartConfig = chartConfig;
    }


    createChart() {
        let chart;

        switch (this.charType) {
            case "pieChart":
                chart = new PieChart(new JsonData(this.chartData));
                break;
        }

        return chart;
    }


}

export {Chart}
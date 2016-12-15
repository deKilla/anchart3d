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

    //createPieChart() {
      //  return new PieChart(jsonData);
    //}

    createChart() {
        let chart;
        //let jsonData = new JsonData(this.chartData);
        console.log("works");
        let jsonData = new JsonData(this.chartData);
        switch (this.charType) {
            case "pieChart":
                chart = new PieChart(jsonData);
                break;
        }

        return chart;
    }


}

export {Chart}
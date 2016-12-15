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
        //Hinzufügen der Config zum document
        //var configuration = document.createElement("configuration");
        //configuration.appendChild(this.chartData);
        //document.appendChild()

        switch (this.charType) {
            case "pieChart":
                chart = new PieChart(new JsonData(this.chartData));
                console.log(chart);
                break;
        }

        return chart;
    }


}

export {Chart}
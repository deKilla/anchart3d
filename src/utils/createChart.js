import {SceneInit} from './SceneInit';
import {JsonData} from './jsonData';
import {PieChart} from '../pieChart';


class CreateChart {

    constructor(domTarget = "anchart3d", jsonData, chartType) {
        this.scene = new SceneInit(domTarget);
        this.jsonData = new JsonData(jsonData);
        this.chartType = chartType;
        this.chart = this.chartSelect(this.chartType);

        this.scene.initScene();
        this.scene.animate();
        this.scene.scene.add(this.chart.object);

    }

    chartSelect(chartType) {
        if (chartType == "pieChart") {
            this.chartType = new PieChart(this.jsonData);
        }
        return this.chartType;
    }
}

export {CreateChart}
import {SceneInit} from './SceneInit';
import {JsonData} from './JsonData';
import {PieChart} from '../PieChart';


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

let jsonData = [
        {
            "name":"Österreich",
            "values": [
                {"name":"Einwohner", "value":8747000},
                {"name":"DSGehalt", "value":2670}
            ]
        },
        {
            "name":"Deutschland",
            "values": [
                {"name":"Einwohner", "value":80062000},
                {"name":"DSGehalt", "value":2790}
            ]
        },
        {
            "name":"Italien",
            "values": [
                {"name":"Einwohner", "value":59083000},
                {"name":"DSGehalt", "value":2390}
            ]
        },
        {
            "name":"Russland",
            "values": [
                {"name":"Einwohner", "value":143500000},
                {"name":"DSGehalt", "value":1780}
            ]
        },{
            "name":"Schweiz",
            "values": [
                {"name":"Einwohner", "value":8081000},
                {"name":"DSGehalt", "value":2880}
            ]
        },{
            "name":"Belgien",
            "values": [
                {"name":"Einwohner", "value":11200000},
                {"name":"DSGehalt", "value":2470}
            ]
        },{
            "name":"Frankreich",
            "values": [
                {"name":"Einwohner", "value":66030000},
                {"name":"DSGehalt", "value":2500}
            ]
        }
    ]

new CreateChart("anchart3d",jsonData,"pieChart");

export {CreateChart}
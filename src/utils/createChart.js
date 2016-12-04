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

function createChart(domTarget, json, chartType) {
    return new CreateChart(domTarget, json, chartType);
}
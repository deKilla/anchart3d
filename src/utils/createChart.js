	
	
	class CreateChart {

		constructor(domTarget = "anchart3d" , json = "../src/data.json" , chartType){
			this.scene = new SceneInit(domTarget);
			this.jsonData = new JsonData(json);
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

	function createChart(domTarget,json,chartType) {
		let chart = new CreateChart(domTarget,json,chartType);
		return chart;
	}
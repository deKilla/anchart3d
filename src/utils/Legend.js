/**
 * @author Amar Bajric (https://github.com/amarbajric)
 * @author Michael Fuchs (https://github.com/deKilla)
 * @author Timo Hasenbichler (https://github.com/timoooo)
 */

class Legend {

    constructor(map, sceneConfig, chartName) {
        this.map = map;
        this.sceneConfig = sceneConfig;
        this.chartName = chartName;
        this.legendNode = document.getElementById(chartName).getElementsByClassName('legend')[0];

    }

    generateLegend() {

        //checks if the the legend should be enabled
        if (this.sceneConfig.legend) {

            let chartName = this.chartName;
            this.map.forEach(function createHTML(value, key, map) {

                let containerElem = document.createElement("li");

                let colorElem = document.createElement("span");
                colorElem.setAttribute("class", "color-box");
                colorElem.setAttribute("style", "background-color:#" + value);

                let nameElem = document.createElement("i");
                nameElem.textContent = key;

                document.getElementById(chartName).getElementsByClassName('legend')[0].appendChild(containerElem).appendChild(colorElem);
                document.getElementById(chartName).getElementsByClassName('legend')[0].appendChild(containerElem).appendChild(nameElem);
            })
        }

    }


    removeLegend() {

        try {  //resets the elem
            this.legend.innerHTML = "";
        }
        catch (err) {
            console.log("Childs do not exist. Error:" + err);
        }
    }
}




export default Legend
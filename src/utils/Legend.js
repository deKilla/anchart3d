/**
 * @author Amar Bajric (https://github.com/amarbajric)
 * @author Michael Fuchs (https://github.com/deKilla)
 * @author Timo Hasenbichler (https://github.com/timoooo)
 */

class Legend {

    constructor(map, sceneConfig, domNode) {
        this.map = map;
        this.sceneConfig = sceneConfig;
        this.domNode = domNode;
        this.legendNode = this.domNode.getElementsByClassName('legend')[0];

    }

    generateLegend() {

        //checks if the the legend should be enabled
        if (this.sceneConfig.legend) {

            let legendNode = this.legendNode;
            this.map.forEach(function createHTML(value, key, map) {

                let containerElem = document.createElement("li");

                let colorElem = document.createElement("span");
                colorElem.setAttribute("class", "color-box");
                colorElem.setAttribute("style", "background-color:#" + value);

                let nameElem = document.createElement("i");
                nameElem.textContent = key;

                legendNode.appendChild(containerElem).appendChild(colorElem);
                legendNode.appendChild(containerElem).appendChild(nameElem);
            })
        }

    }


    removeLegend() {
        try {  //resets the elem
            this.legendNode.innerHTML = "";
        }
        catch (err) {
            console.warn("Childs do not exist in Legend\n" + err);
        }
    }
}




export default Legend
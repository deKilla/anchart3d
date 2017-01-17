/**
 * @author Amar Bajric (https://github.com/amarbajric)
 * @author Michael Fuchs (https://github.com/deKilla)
 * @author Timo Hasenbichler (https://github.com/timoooo)
 */

class Legend {

    constructor(map, sceneConfig) {
        this.map = map;
        this.sceneConfig = sceneConfig;
    }

    generateLegend(map = this.map) {

        //checks if the the legend should be enabled
        if (this.sceneConfig.legend) {

            map.forEach(function createHTML(value, key, map) {

                let containerElem = document.createElement("li");

                let colorElem = document.createElement("span");
                colorElem.setAttribute("class", "color-box");
                colorElem.setAttribute("style", "background-color:#" + value);

                let nameElem = document.createElement("i");
                nameElem.textContent = key;
                console.log("adding Name: "+key);

                document.getElementById('legend').appendChild(containerElem).appendChild(colorElem);
                document.getElementById('legend').appendChild(containerElem).appendChild(nameElem);
            })
        }

    }





    removeLegend() {

        try {  //resets the elem
            var myNode = document.getElementById("legend");
            console.log("removing the legend");
            while (myNode.firstChild) {
                myNode.removeChild(myNode.firstChild);
                }



        }
        catch (err) {
            console.log("Childs do not exist. Error:" + err);
        }
    }
}




export default Legend
/**
 * Created by timo on 22.11.16.
 */


import {Chart} from '../Chart';

class Legend extends Chart{

    constructor(map) {
        super(jsonData,configuration);

        this.map = map;
    }

    generateLegend(map = this.map) {

       let txt = JSON.stringify(configuration);
       let configJSON =JSON.parse(txt);

        console.log("sets up the legend");
       //checks if the the legend should be enabled
       if(configJSON.legend == true) {
        console.log("ITS TRUE BOIZ");

        map.forEach(function createHTML(value, key, map) {

            let containerElem = document.createElement("li");

            let colorElem = document.createElement("span");
            colorElem.setAttribute("class", "color-box");
            colorElem.setAttribute("style", "background-color:#" + value);

            let nameElem = document.createElement("i");
            nameElem.textContent = key;

            document.getElementById('legend').appendChild(containerElem).appendChild(colorElem);
            document.getElementById('legend').appendChild(containerElem).appendChild(nameElem);

        })


    }}

}


export {Legend}
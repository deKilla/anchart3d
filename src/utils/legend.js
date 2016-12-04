/**
 * Created by timo on 22.11.16.
 */


class Legend {

    constructor(map) {
        //this.description = description;
        //this color = color;
        this.map = map;
    }

    generateLegend(map = this.map) {
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


    }
}
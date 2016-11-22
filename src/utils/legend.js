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
            let colorElem = document.createElement('span');
            console.log(value);
            colorElem.setAttribute("class", "color-box legend-block");
            colorElem.setAttribute("style", "background-color:#" + value + "");

            let nameElem = document.createElement('li');
            nameElem.setAttribute("class", "legend-block");
            nameElem.textContent = key;


            document.getElementById('legend')
                .appendChild(colorElem)
                .appendChild(nameElem);


        })


    }
}
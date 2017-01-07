/**
 * @author Amar Bajric (https://github.com/amarbajric)
 * @author Michael Fuchs (https://github.com/deKilla)
 * @author Timo Hasenbichler (https://github.com/timoooo)
 */

class JsonData {

    constructor(file) {
        this.file = file;
        this.init = this.initFile();
    }

    initFile() {
        /*
        TODO: Check if json structure valid
        TODO: Implement sorting function to call optionally in Chart.js
         */
        this.getSums();
        this.getPercent();

        return this.init;
    }


    getSums() {
        let sums = [];
        for (let i = 0; i < this.file[0].values.length; i++) {
            this.file.reduce(function (t, cv) {
                if (sums[cv.values[i].name]) {
                    sums[cv.values[i].name] += cv.values[i].value;
                } else {
                    sums[cv.values[i].name] = cv.values[i].value;
                }
            }, {});
        }
        return sums;
    }

    /**
     * Does not need to return object as JavaScript does pass objects by reference IF it is saved under a variable!!
     * This means that "this.file" will also get changed if "tempJson" does so....
     * See link for more info: http://stackoverflow.com/a/6605700/4809932
     */
    getPercent() {
        let tempJson = this.file;
        let sums = this.getSums();
        for (let elements in tempJson) {
            let values = tempJson[elements].values;
            for (let value in values) {

                let total = sums[values[value].name];
                //set calculated percent and total to the corresponding dataset
                tempJson[elements].values[value]["percent"] = values[value].value / (total / 100);
                tempJson[elements].values[value]["total"] = total;
            }
        }
    }
}


export {JsonData}
class JsonData {

    constructor(file) {
        this.file = file;
        this.sums = this.getSums();
        this.percent = this.getPercent();
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
        this.sums = sums;
        return this.sums;
    }

    getPercent() {
        let percentjson = this.file;
        let sums = this.sums;
        for (let elements in percentjson) {
            let values = percentjson[elements].values;
            for (let value in values) {

                let total = sums[values[value].name];
                let percent = values[value].value / (total / 100);

                //set calculated percent and total to the corresponding dataset
                percentjson[elements].values[value]["percent"] = percent;
                percentjson[elements].values[value]["total"] = total;
            }
        }
        this.percentjson = percentjson;
        return this.percentjson;
    }

}


//export {JsonData}
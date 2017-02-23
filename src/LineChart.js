/**
 * Created by Timo on 23.02.2017.
 */
/**
 * @author Amar Bajric (https://github.com/amarbajric)
 * @author Michael Fuchs (https://github.com/deKilla)
 * @author Timo Hasenbichler (https://github.com/timoooo)
 */
import Axis from "./utils/Axis";
var THREE = require('three');
THREE.orbitControls = require('three-orbit-controls')(THREE);


class LineChart {

    //TODO: maybe use object ...
    constructor(name, type, jsonData, sceneConfig) {
        this.name = name;
        this.type = type;
        this.jsonData = jsonData;
        this.sceneConfig = sceneConfig;
        this.legendMap = new Map();
        this.object = this.create3DLineChart();
    }


    getHighestNumber() {
        let jsonData = this.jsonData.file;
        let max = 0;


        for (let dataset = 0; dataset < jsonData.length; dataset++) {
            let values = jsonData[dataset].values;
            for (let value = 0; value < values.length; value++) {
                if (values[value].value > max) max = values[value].value;

            }
        }

        console.log("The highest number is: " + max);
        return max;
    }


    createLine(pointArray, max) {

        let material = new THREE.LineBasicMaterial({
            color: 0x696969 //black
        });

        let lineGeometry = new THREE.Geometry();

        let vectorArray = [];

        //so it doesnt divide by zero
        if (max == 0) max = 1;

        //create a set of Vectors and push it in an array
        for (let x = 0; x < pointArray.length; x++) {
            let z = (4.0 * pointArray[x]) / max;
            let vector3 = new THREE.Vector3(0, 0, z);
            vectorArray.push(vector3);
        }

        for (let i = 0; i < vectorArray.length; i++) {
            lineGeometry.vertices.push(vectorArray[i]);
        }

        return new THREE.Line(lineGeometry, material);
    }


    darkenCol(color, percent) {//darkens the color for every row of datasets
        color.b = (color.b - (color.b * (percent / 100))) <= 1 ? color.b - (color.b * (percent / 100)) : 1;
        color.g = (color.g - (color.g * (percent / 100))) <= 1 ? color.g - (color.g * (percent / 100)) : 1;
        color.r = (color.r - (color.r * (percent / 100))) <= 1 ? color.r - (color.r * (percent / 100)) : 1;

        return color;
    }


    create3DLineChart(jsonData = this.jsonData) {
        const calculatedData = jsonData.file;

        //to scale evrything correctly the values have to be analyzed
        //it will be scaled around the highest number in the dataset
        let max = this.getHighestNumber();


        //Group together all pieces
        let lineChart = new THREE.Group();
        let axisLines = new THREE.Group();
        //let labels = new THREE.Group();
        let axisHelper = new Axis();
        lineChart.chartType = this.type;
        lineChart.name = this.name;


        //iterate over the jsonData and create for every data a new Line
        //data = one object in the json which holds the props "amount","percent" in this case.
        for (let dataset = 0; dataset < calculatedData.length; dataset++) {
            let values = calculatedData[dataset].values;
            let line;
            //let lastRowColor;

            //sets the Label for the Row
            //let labelRow = axisHelper.makeTextSprite2D(" " + calculatedData[dataset].name + " ");
            //labelRow.position.set(lastBarStartX+2,-2,-1);
            //labels.add(labelRow);

            //Initialize an array which will hold the points of the line
            let pointArray = [];


            for (let value = 0; value < values.length; value++) {
                //get first data set of the first object

                let dataValue = values[value].value;

                //pushes the value to the array
                pointArray.push(dataValue);
            }

            line = this.createLine(pointArray, max);

            console.log(pointArray);

               // this.legendMap.set(calculatedData[dataset].name, line.material.color.getHexString());

            lineChart.add(line);
        }

        let axis = axisHelper.initAxis(0,0);
        axisLines.add(axis);
        //half the position and align the segments to the center
        /*
         lineChart.position.x = -(lastBarStartX / 2);
         lineChart.position.z = -1.5;
         lineChart.position.y = -2;
         lineChart.rotation.x = -1.5;
         */
        return lineChart;
    }


}


export default LineChart
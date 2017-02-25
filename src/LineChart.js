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

    createVector(x, y, z) {
        return new THREE.Vector3(x, y, z);
    }

    createLine(pointArray, max) {

        let material = new THREE.MeshPhongMaterial({
            color: 0x696969, //black
            shading: THREE.SmoothShading,
            shininess: 0.8,
        });

        let lineGeometry = new THREE.Geometry();

        //so it doesnt divide by zero if the maximum number is zero or numbers are negative
        if (max == 0) max = 1;



        let cntr = pointArray.length;
        console.log(cntr);
        //10 is the span
        //to get the correct distance between the points it has to be calculated
        let span = 10;

        let steps = 4;
        let distance = 0;
        for (let i = 0; i < pointArray.length; i++) {
            console.log(-((10.0 * pointArray[i]) / max) +"  "+ distance);
            lineGeometry.vertices.push(
                this.createVector( distance,((10.0 * pointArray[i]) / max), -9)
            );
            distance+=steps;
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
        let axisLines = new THREE.Object3D();

        //let labels = new THREE.Group();
        let axisHelper = new Axis();
        lineChart.chartType = this.type;
        lineChart.name = this.name;


        //iterate over the jsonData and create for every data a new Line
        //data = one object in the json which holds the props "amount","percent" in this case.
        for (let dataset = 0; dataset < calculatedData.length; dataset++) {
            let values = calculatedData[dataset].values;
            let line;

            //Initialize an array which will hold the points of the line
            let pointArray = [];


            for (let value = 0; value < values.length; value++) {
                //get first data set of the first object

                let dataValue = values[value].value;

                //pushes the value to the array
                pointArray.push(dataValue);
            }

            line = this.createLine(pointArray, max);
            //pls
            console.log(pointArray);
            line.position.x = -10;
            line.position.y = -10;
            line.position.z = 0;

            lineChart.add(line);
        }

        axisHelper.lineAxisDrawer(axisLines);

        lineChart.add(axisLines);

        return lineChart;
    }


}


export default LineChart
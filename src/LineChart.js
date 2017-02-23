/**
 * Created by Timo on 21.02.2017.
 */
import Axis from "./utils/Axis";
import {animateZ} from "./utils/animation";
let THREE = require('three');
let MeshLine = require('three.meshline');
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

    //returns the highest value in the json data to scale the points nicely
    getHighestValue(jsonData = this.jsonData) {
        const calculatedData = jsonData.file;
        let highestNumber = 0;
        for (let dataset = 0; dataset < calculatedData.length; dataset++) {
            let values = calculatedData[dataset].values;
            //create the lines
            for (let value = 0; value < values.length; value++) {
                if (highestNumber > values[value].value) {
                    highestNumber = values[value].value;
                }
            }

        }

        return highestNumber;
    }


    getMax(propertyEnding) {
        return Math.max.apply(Math, this.jsonData.file.map(function (dataSet) {
            for (let i = 0; i < dataSet.values.length; i++) {
                if (dataSet.values[i].name.toLowerCase().endsWith(propertyEnding)) {
                    return dataSet.values[i].value;
                }
            }
        }));
    }

    createLine(data,maxValue) {
        //standard max x,y,z 4.0 => 100%
        let lineMat = new MeshLine();
        //data = array mit zahlenwerten

        let x = 0;
        let y = 0;
        let z = 0;

        let lineGeometry = new THREE.Geometry();

        for(let i = 0; i < data.length; i++){
            //Umberechnen/Scaling
            z = (4.0*data[i])/maxValue;
            console.log(z);
            let vector = new THREE.Vector3(x,y,z);
            lineGeometry.vertices.push(vector);

        }
        lineMat.setGeometry(lineGeometry);
        let line = new THREE.Mesh(lineGeometry,lineMat);
        //checks if lastPoint is set  if not  its the first point of the line
        return line;

    }




    darkenCol(color, percent) {//darkens the color for every row of datasets
        color.b = (color.b - (color.b * (percent / 100))) <= 1 ? color.b - (color.b * (percent / 100)) : 1;
        color.g = (color.g - (color.g * (percent / 100))) <= 1 ? color.g - (color.g * (percent / 100)) : 1;
        color.r = (color.r - (color.r * (percent / 100))) <= 1 ? color.r - (color.r * (percent / 100)) : 1;

        return color;
    }


    create3DLineChart(jsonData = this.jsonData) {
        const calculatedData = jsonData.file;
        //Group together all pieces
        let lineChart = new THREE.Group();
        let axisLines = new THREE.Group();

        let maxValue = this.getHighestValue();
        console.log(maxValue);

        lineChart.chartType = this.type;
        lineChart.name = this.name;


        //data = one object in the json which holds the props "amount","percent" in this case.
        for (let dataset = 0; dataset < calculatedData.length; dataset++) {
            let values = calculatedData[dataset].values;
            let line;
            let pointArray = [];

            //create the lines
            for (let value = 0; value < values.length; value++) {

                pointArray.push(values[value].value);


            }

            line = this.createLine(pointArray,maxValue);
            lineChart.add(line);
        }

        let axis = new Axis().initAxis(0,0);
        axisLines.add(axis);
        lineChart.add(axisLines);


        return lineChart;
    }


}


export default LineChart
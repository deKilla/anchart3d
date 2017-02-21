/**
 * @author Amar Bajric (https://github.com/amarbajric)
 * @author Michael Fuchs (https://github.com/deKilla)
 * @author Timo Hasenbichler (https://github.com/timoooo)
 */

import Chart from './Chart';
import Axis from './utils/Axis';
import {animateZ} from "./utils/animation";
var THREE = require('three');
THREE.orbitControls = require('three-orbit-controls')(THREE);


class BarChart {

    //TODO: maybe use object ...
    constructor(name, type, jsonData, sceneConfig) {
        this.name = name;
        this.type = type;
        this.jsonData = jsonData;
        this.sceneConfig = sceneConfig;
        this.legendMap = new Map();
        this.object = this.create3DBarChart();
    }

    createBar(lastBarStartX, lastRowColor) {
        let color;
        if (lastRowColor) {
                color =  this.darkenCol(lastRowColor, 10).getHex();
            }
        else {
            color = Math.random() * 0xffffff;
        }
        let barGeometry = new THREE.BoxGeometry(0.7, 0.7, 0.8, 10, 10, 10);
        //set the bottom of the bar as origin coordinates (bar will only scale up, not in both dirs)
        barGeometry.translate(0, 0, barGeometry.parameters.depth / 2);

        let segmentMat = new THREE.MeshPhongMaterial({
            color: color,
            shading: THREE.SmoothShading,
            shininess: 0.8,
        });

        let bar = new THREE.Mesh(barGeometry, segmentMat);
        bar.position.x = lastBarStartX;

        return bar;
    }


    darkenCol(color, percent){//darkens the color for every row of datasets
        color.b = (color.b - (color.b * (percent/100))) <= 1 ? color.b - (color.b * (percent/100)) : 1;
        color.g = (color.g - (color.g * (percent/100))) <= 1 ? color.g - (color.g * (percent/100)) : 1;
        color.r = (color.r - (color.r * (percent/100))) <= 1 ? color.r - (color.r * (percent/100)) : 1;

        return color;
    }


    create3DBarChart(jsonData = this.jsonData) {
        const calculatedData = jsonData.file;
        //Group together all pieces
        let barChart = new THREE.Group();
        let axisLines = new THREE.Group();
        let labels = new THREE.Group();
        let axisHelper = new Axis();
        barChart.chartType = this.type;
        barChart.name = this.name;
        //variable holds last position of the inserted segment of the barchart
        let lastBarStartX = 0.0;
        let yPostition = 0;

        //iterate over the jsonData and create for every data a new Bar
        //data = one object in the json which holds the props "amount","percent" in this case.
        for (let dataset = 0; dataset < calculatedData.length; dataset++) {
            let values = calculatedData[dataset].values;
            let segment;
            let lastRowColor;
            let yPos = 0;
            //sets the Label for the Row
            let labelRow = axisHelper.makeTextSprite2D(" " + calculatedData[dataset].name + " ");
            labelRow.position.set(lastBarStartX+2,-2,-1);
            labels.add(labelRow);



            for (let value = 0; value < values.length; value++) {
                //get first data set of the first object
                let dataName = values[value].name;
                let dataValue = values[value].value;
                let dataPercent = values[value].percent;
                //call function which creates one segment at a time
                segment = this.createBar(lastBarStartX, lastRowColor);
                segment.position.y = yPos++; //set second dataset behind first one
                lastRowColor = segment.material.color;

                let labelLine = axisHelper.makeTextSprite2D(" " + values[value].name + " ");
                labelLine.position.set(0,segment.position.y,-1);
                labels.add(labelLine);


                if (this.sceneConfig.chartAnimation) {
                    let finalPos = (dataPercent / 10);
                    let startPos = segment.scale;

                    animateZ(segment, startPos, finalPos, 3000, 3000);
                }
                else {
                    segment.scale.z = (dataPercent / 10);
                }

                if(value == 0) {
                    //adding elements to the legendMap
                    this.legendMap.set(calculatedData[dataset].name, segment.material.color.getHexString());
                }

                segment.name = calculatedData[dataset].name;
                segment.data1 = {};
                segment.data1.name = dataName;
                segment.data1.value = dataValue;
                segment.data1.percent = dataPercent;

                if(yPostition <= segment.position.y) yPostition = segment.position.y;

                barChart.add(segment);
            }
            lastBarStartX = lastBarStartX + 0.7 + 0.2; //if only one dataset available, update barStart here
        }
        let axis = axisHelper.initAxis(yPostition,lastBarStartX);
        axisLines.add(axis);
        barChart.add(labels);
        barChart.add(axisLines);

        //half the position and align the segments to the center
        barChart.position.x = -(lastBarStartX / 2);
        barChart.position.z = -1.5;

        return barChart;
    }


}


export default BarChart
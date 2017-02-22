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


class ScatterChart {

    constructor(name, type, jsonData, sceneConfig) {
        this.name = name;
        this.type = type;
        this.jsonData = jsonData;
        this.sceneConfig = sceneConfig;
        this.legendMap = new Map();
        this.object = this.create3DScatterChart();

    }

    //get max value for scaling later on...
    getMax(propertyEnding) {
        return Math.max.apply(Math, this.jsonData.file.map(function (dataSet) {
            for (let i = 0; i < dataSet.values.length; i++) {
                if (dataSet.values[i].name.toLowerCase().endsWith(propertyEnding)) {
                    return dataSet.values[i].value;
                }
            }
        }));
    }


    scaleNum(value) {
        let decimalScale = value.toString().substr(1).length;
        if (decimalScale < 1) {
            return 1;
        }
        else return Number("1" + "0".repeat(decimalScale));
    }


    createEntity(x, y, z, size, xMax, yMax, zMax, sizeMax, shape) {
        let geometry;
        if(shape === "sphere" || typeof shape === "undefined"){
            geometry= new THREE.SphereGeometry(size / this.scaleNum(sizeMax), 32, 32, 3.3);
        }
        else if(shape == "cone"){
            geometry = new THREE.ConeGeometry( size / this.scaleNum(sizeMax), (size / this.scaleNum(sizeMax))*2, 32, 32, false, 0, 6.3);
        }
        else if(shape == "diamond"){
            geometry= new THREE.SphereGeometry(size / this.scaleNum(sizeMax), 7, 2, 0, 6.3, 0, 3.1);
        }
        let material = new THREE.MeshPhongMaterial({
            color: Math.random() * 0xffffff,
            shading: THREE.SmoothShading,
            shininess: 0.8,
        });

        let sphere = new THREE.Mesh(geometry, material);
        //calculating where to position the entities, given on scaling of axis and maximum values
        //dynamically resizing and scaling of whole grid and values
        sphere.position.x = -10 + (20 * (x / (Math.ceil(xMax / 10) * 10)));
        sphere.position.y = -10 + (20 * (y / (Math.ceil(yMax / 10) * 10)));
        sphere.position.z = -10 + (20 * (z / (Math.ceil(zMax / 10) * 10)));

        return sphere;
    }


    create3DScatterChart(jsonData = this.jsonData) {
        const calculatedData = jsonData.file;
        //calculate max values
        const xMax = this.getMax("x");
        const yMax = this.getMax("y");
        const zMax = this.getMax("z");
        const sizeMax = this.getMax("size");

        //Group together all pieces
        let scatterChart = new THREE.Group();
        let axisLines = new THREE.Object3D();
        let labels = new THREE.Group();
        let axisHelper = new Axis();
        scatterChart.chartType = this.type;
        scatterChart.name = this.name;

        //iterate over the jsonData and create for every data a new entity
        //data = one object in the json which holds the props "amount","percent" in this case.
        for (let dataset = 0; dataset < calculatedData.length; dataset++) {
            let values = calculatedData[dataset].values;
            let entity;
            let posX, posY, posZ, size, shape;

            for (let value = 0; value < values.length; value++) {
                if (values[value].name.toLowerCase().endsWith("x")) posX = values[value].value;
                if (values[value].name.toLowerCase().endsWith("y")) posY = values[value].value;
                if (values[value].name.toLowerCase().endsWith("z")) posZ = values[value].value;
                if (values[value].name.toLowerCase().endsWith("size")) size = values[value].value;
                if (values[value].name.toLowerCase().endsWith("shape")) shape = values[value].value;
            }

            entity = this.createEntity(posX, posY, posZ, size, xMax, yMax, zMax, sizeMax, shape);
            entity.name = calculatedData[dataset].name;
            this.legendMap.set(calculatedData[dataset].name, entity.material.color.getHexString());

            for (let value = 0; value < values.length; value++) {
                entity["data" + value] = {};
                entity["data" + value].name = values[value].name;
                entity["data" + value].value = values[value].value;
                entity["data" + value].percent = values[value].percent;
            }

            scatterChart.add(entity);
        }
        //create new grid for scatter chart
        axisHelper.scatterAxisDrawer(axisLines);
        let xAxis = axisHelper.makeTextSprite2D(" X (" + (Math.ceil(xMax/10)*10) + ") ",{fontsize:42});
        xAxis.position.set(12,-10,12);
        let yAxis = axisHelper.makeTextSprite2D(" Y (" + (Math.ceil(yMax/10)*10) + ") ",{fontsize:42});
        yAxis.position.set(-10,9,10);
        let zAxis = axisHelper.makeTextSprite2D(" Z (" + (Math.ceil(zMax/10)*10) + ") ",{fontsize:42});
        zAxis.position.set(13,9,-10);
        labels.add(xAxis,yAxis,zAxis);

        scatterChart.add(axisLines);
        scatterChart.add(labels);
        return scatterChart;
    }
}


export default ScatterChart

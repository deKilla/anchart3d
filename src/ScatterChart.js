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


    createEntity(x,y,z,size,shape){
        let geometry = new THREE.SphereGeometry( size/100, 32, 32, 3.3);
        let material = new THREE.MeshPhongMaterial({
            color: Math.random() * 0xffffff,
            shading: THREE.SmoothShading,
            shininess: 0.8,
        });
        let sphere = new THREE.Mesh( geometry, material);
        sphere.position.x = x/10;
        sphere.position.y = y/10;
        sphere.position.z = z/10;
        return sphere;
    }







    create3DScatterChart(jsonData = this.jsonData){
        const calculatedData = jsonData.file;
        //Group together all pieces
        let scatterChart = new THREE.Group();
        let axisLines = new THREE.Object3D();
        let labels = new THREE.Group();
        scatterChart.chartType = this.type;
        scatterChart.name = this.name;

        //iterate over the jsonData and create for every data a new Bar
        //data = one object in the json which holds the props "amount","percent" in this case.
        for (let dataset = 0; dataset < calculatedData.length; dataset++) {
            let values = calculatedData[dataset].values;
            let entity;
            let posX = values[0].value[0];
            let posY = values[0].value[1];
            let posZ = values[0].value[2];
            let size = values[1].value;
            console.log(values[1].value);
            console.log(posX);

            entity = this.createEntity(posX,posY,posZ, size,"circle");
            entity.name = calculatedData[dataset].name;
            entity.data1 = {};
            entity.data1.name = values[0].name;
            entity.data1.value = "x: " + values[0].value[0] + "; y: " + values[0].value[1] + "; z: " + values[0].value[2];
            entity.data1.percent = 0;

            /*for (let value = 0; value < values.length; value++) {
                //get first data set of the first object
                let dataName = values[value].name;
                let dataValue = values[value].value;
                let dataPercent = values[value].percent;
                //call function which creates one segment at a time


                entity.name = calculatedData[dataset].name;
                entity.data1 = {};
                entity.data1.name = dataName;
                entity.data1.value = dataValue;
                entity.data1.percent = dataPercent;



            }*/
            scatterChart.add(entity);
        }

        axisLines = new Axis().scatterAxisDrawer(axisLines);
        scatterChart.add(axisLines);
        scatterChart.add(labels);
        return scatterChart;
    }

}


export default ScatterChart

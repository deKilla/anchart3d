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
        let geometry = new THREE.SphereGeometry( size/10, 32, 32, 3.3);
        let material = new THREE.MeshPhongMaterial({
            color: Math.random() * 0xffffff,
            shading: THREE.SmoothShading,
            shininess: 0.8,
        });
        let sphere = new THREE.Mesh(geometry, material);
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

        //iterate over the jsonData and create for every data a new entity
        //data = one object in the json which holds the props "amount","percent" in this case.
        for (let dataset = 0; dataset < calculatedData.length; dataset++) {
            let values = calculatedData[dataset].values;
            let entity;
            let posX, posY, posZ, size;

            for(let value = 0; value < values.length; value++){
                if(values[value].name.toUpperCase().endsWith("X")) posX = values[value].value;
                else if(values[value].name.toUpperCase().endsWith("Y")) posY = values[value].value;
                else if(values[value].name.toUpperCase().endsWith("Z")) posZ = values[value].value;
                else if(values[value].name.toUpperCase().endsWith("SIZE")) size = values[value].value;
            }

            entity = this.createEntity(posX,posY,posZ, size);
            entity.name = calculatedData[dataset].name;

            this.legendMap.set(calculatedData[dataset].name, entity.material.color.getHexString());

            for(let value = 0; value < values.length; value++){
                if(values[value].name.toUpperCase().endsWith("X")){
                    entity["data"+value] = {};
                    entity["data"+value].name = values[value].name;
                    entity["data"+value].value = values[value].value;
                    entity["data"+value].percent = values[value].percent;
                }
                else if(values[value].name.toUpperCase().endsWith("Y")){
                    entity["data"+value] = {};
                    entity["data"+value].name = values[value].name;
                    entity["data"+value].value = values[value].value;
                    entity["data"+value].percent = values[value].percent;
                }
                else if(values[value].name.toUpperCase().endsWith("Z")){
                    entity["data"+value] = {};
                    entity["data"+value].name = values[value].name;
                    entity["data"+value].value = values[value].value;
                    entity["data"+value].percent = values[value].percent;
                }
                else if(values[value].name.toUpperCase().endsWith("SIZE")){
                    entity["data"+value] = {};
                    entity["data"+value].name = values[value].name;
                    entity["data"+value].value = values[value].value;
                    entity["data"+value].percent = values[value].percent;
                }
            }

            scatterChart.add(entity);
        }

        //create new grid for scatter chart
        new Axis().scatterAxisDrawer(axisLines);
        scatterChart.add(axisLines);
        scatterChart.add(labels);
        return scatterChart;
    }
}


export default ScatterChart

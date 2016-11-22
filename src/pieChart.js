/**
 * Created by Amar on 07.11.2016.
 */

/*
 import '../src/utils/TrackballControls';
 import * as THREE from "three/build/three";
 import * as data from './data.json';
 */

"use strict";



class JsonData {

    constructor(file = "../src/data.json") {
        this.file = file;
        this.jsonText = this.getJsonText();
        this.parsedJson = this.getParsedJson();
        this.sums = this.getSums();
        this.percent = this.getPercent();
    }

        getJsonText(file = this.file)
        {
            var rawFile = new XMLHttpRequest();
            var rawText;
            rawFile.open("GET", file, false);
            rawFile.onreadystatechange = function ()
            {
                if(rawFile.readyState === 4)
                {
                    if(rawFile.status === 200 || rawFile.status == 0)
                    {
                        rawText = rawFile.responseText;
                    }
                }
            }
            rawFile.send(null);
            this.rawText = rawText;
            return this.rawText;
        }

        getParsedJson(file = this.file){
            this.parsedJson = JSON.parse(this.jsonText);
            return this.parsedJson;
        }

        getSums() {
            var sums = [];
            for (var i = 0; i < this.parsedJson[0].values.length; i++) {
                this.parsedJson.reduce(function(t,cv) {
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
            let percentjson = this.parsedJson;
            let sums = this.sums;
            for (var elements in percentjson) {
                var values = percentjson[elements].values;
                for (var value in values) {

                    var total = sums[values[value].name];
                    var percent = values[value].value/(total/100);

                    //set calculated percent and total to the corresponding dataset
                    percentjson[elements].values[value]["percent"] = percent;
                    percentjson[elements].values[value]["total"] = total;
                }
            }
            this.percentjson = percentjson;
            return this.percentjson;
        }

}





class SceneInit {

    constructor(fov = 45,camera,scene,controls,renderer)
    {
        this.camera = camera;
        this.scene = scene;
        this.controls = controls;
        this.renderer = renderer;
        this.fov = fov;

    }



    initScene() {
        this.camera = new THREE.PerspectiveCamera(this.fov, window.innerWidth / window.innerHeight, 1, 1000);
        this.camera.position.z = 15;

        this.controls = new THREE.TrackballControls( this.camera );
        this.controls.addEventListener('change', this.render.bind(this));

        this.scene = new THREE.Scene();

        //specify a canvas which is already created in the HTML file and tagged by an id        //aliasing enabled
        this.renderer = new THREE.WebGLRenderer({canvas: document.getElementById('myThreeJsCanvas') , antialias: true});
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);


        //ambient light which is for the whole scene
        let ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        ambientLight.castShadow = false;
        this.scene.add(ambientLight);

        //spot light which is illuminating the chart directly
        let spotLight = new THREE.SpotLight(0xffffff, 0.55);
        spotLight.castShadow = true;
        spotLight.position.set(0,40,10);
        this.scene.add(spotLight);

        /*
         document.addEventListener('mousedown', onDocumentMouseAction, false);
         document.addEventListener('mousemove', onDocumentMouseAction, false);
         document.ondblclick = onDocumentDblClick();
         */

        //if window resizes
        window.addEventListener('resize', this.onWindowResize.bind(this) , false);
    }


    animate(){
        requestAnimationFrame( this.animate.bind(this) );
        this.render();
        this.controls.update();
    }


    render(){
        this.renderer.render( this.scene, this.camera );
    }


    onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize( window.innerWidth, window.innerHeight );
}

}





class PieChart {

    constructor(jsonData = jsonData, radius, angleStart, angleEnd){
        this.jsonData = jsonData;
        this.radius = radius;
        this.angleStart = angleStart;
        this.angleEnd = angleEnd;
    }

        createSegment(radius, angleStart, angleEnd) {
        let extrudeOptions = {
            curveSegments: 50,
            steps: 1,
            amount: 1.1,
            bevelEnabled: false,
        };

        let shape = new THREE.Shape();
        shape.moveTo(0, 0);
        shape.absarc(0, 0, radius, angleStart, angleEnd, false); //false: to not go clockwise (otherwise it will fail)
        shape.lineTo(0, 0);
        let segmentGeom = new THREE.ExtrudeGeometry(shape,extrudeOptions);
        let segmentMat = new THREE.MeshPhongMaterial({
            color: Math.random() * 0xffffff,
            shading: THREE.SmoothShading,
            specular: 0xffffff,
            shininess: 1.5,
        });

        return new THREE.Mesh(segmentGeom, segmentMat);
    }

        create3DPieChart(jsonData = this.jsonData) {
        //calculate percent of every data set in json first
        const calculatedData = jsonData.percent;

        //Group together all pieces
        let pieChart = new THREE.Group();

        //variable holds last position of the inserted segment of the pie
        let lastThetaStart = 0.0;

        //iterate over the jsonData and create for every data a new pie segment
        //data = one object in the json which holds the props "amount","percent" in this case.
        for (let data in calculatedData) {
            let values = calculatedData[data].values;
            for (let val in values){
                //get first data set of the first object
                if(val == 0){
                    let data1Name = values[val].name;
                    let data1Value = values[val].value;
                    let data1Percent = values[val].percent;
                }
                else if (val == 1){
                    let data2Name = values[val].name;
                    let data2Value = values[val].value;
                    let data2Percent = values[val].percent;
                }
            }
            //call function which creates one segment at a time
            let segment = createSegment(3,lastThetaStart, lastThetaStart + THREE.Math.degToRad(data1Percent*3.6));

            //scale in z (show second data set)
            segment.scale.z = (data2Percent/10);

            //set the lastThetaStart to the length of the last segment, in order to not overlap segments
            lastThetaStart = lastThetaStart + THREE.Math.degToRad(data1Percent*3.6);

            //assign the object the name from the description of the JSON
            //TODO save data somewhere else
            segment.name = calculatedData[data].name + "\n" +
                           "Fläche: " + data1Name +"= " + data1Percent.toFixed(2) +"% " + "(" + data1Value + ")" + "\n" +
                           "Höhe: " + data2Name +"(€)= " + data2Percent.toFixed(2) +"% " + "(" + data2Value + ")";

            //define a new property for the segment to store the percent associated with it.
            //source: https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty
            Object.defineProperty(segment, 'percent', {
                value: data1Percent.toFixed(2)
            });

            //add new piece to the grouped pieChart
            pieChart.add(segment);
        }
        return pieChart;
    }
}






let test = new SceneInit(45);
test.initScene();
test.animate();


let geometry = new THREE.BoxGeometry( 3, 3, 3);
let material = new THREE.MeshPhongMaterial({
    color: Math.random() * 0xffffff,
    shading: THREE.SmoothShading,
    specular: 0xffffff,
    shininess: 1.5,
});
let mesh = new THREE.Mesh( geometry, material );

test.scene.add(mesh);


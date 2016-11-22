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

    constructor(fov = 45,camera,scene,controls,renderer,INTERSECTED)
    {
        this.camera = camera;
        this.scene = scene;
        this.controls = controls;
        this.renderer = renderer;
        this.fov = fov;
        this.mouse = new THREE.Vector2();
        this.INTERSECTED = INTERSECTED;
        this.raycaster = new THREE.Raycaster();

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


        document.addEventListener('mousedown', this.onDocumentMouseAction.bind(this), false);
        document.addEventListener('mousemove', this.onDocumentMouseAction.bind(this), false);
        document.ondblclick = this.onDocumentDblClick.bind(this);


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
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }


    findIntersections(event) {

        event.preventDefault();

        this.mouse.x = ( event.clientX / this.renderer.domElement.clientWidth ) * 2 - 1;
        this.mouse.y = - ( event.clientY / this.renderer.domElement.clientHeight ) * 2 + 1;
        this.raycaster.setFromCamera( this.mouse, this.camera );
        //search for our object by name which we declared before and return it
        return this.raycaster.intersectObjects(this.scene.getObjectByName("groupedPieChart", true).children);
    }



    onDocumentMouseAction(event){
        //call function which finds intersected objects
        let intersects = this.findIntersections(event);

        if (intersects[0] !== undefined && event.type === "mousedown") {//if the event type is a mouse click (one click)
            //print percentage of the clicked section + the name of the object assigned in the 'create3DPieChart' function
            //intersects[0] because we want the first intersected object and every other object which may lies in the background is unnecessary
            console.log(intersects[0].object.name);
        }
        else if (intersects[0] !== undefined && event.type == "mousemove") {//if the event type is a mouse move (hover)

            if ( this.INTERSECTED != intersects[ 0 ].object ) {
                if ( this.INTERSECTED ) this.INTERSECTED.material.emissive.setHex( this.INTERSECTED.currentHex );
                this.INTERSECTED = intersects[ 0 ].object;
                this.currentHex = this.INTERSECTED.material.emissive.getHex();
                this.INTERSECTED.material.emissive.setHex(0xa9a8a8);
            }
        }
        else {
            if ( this.INTERSECTED ) this.INTERSECTED.material.emissive.setHex( this.INTERSECTED.currentHex );
            this.INTERSECTED = null;
        }

    }


    onDocumentDblClick() {
        //IMPLEMENT DOUBLE CLICK FUNCTION HERE
    }



}





class PieChart {

    constructor(jsonData, radius, angleStart, angleEnd){
        this.jsonData = jsonData;
        this.radius = radius;
        this.angleStart = angleStart;
        this.angleEnd = angleEnd;
        this.threeObject = this.create3DPieChart();
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
        pieChart.name = "groupedPieChart";

        //variable holds last position of the inserted segment of the pie
        let lastThetaStart = 0.0;

        //iterate over the jsonData and create for every data a new pie segment
        //data = one object in the json which holds the props "amount","percent" in this case.
        for (let data in calculatedData) {
            let values = calculatedData[data].values;
            for (let val in values){
                //get first data set of the first object
                if(val == 0){
                    var data1Name = values[val].name;
                    var data1Value = values[val].value;
                    var data1Percent = values[val].percent;
                }
                else if (val == 1){
                    var data2Name = values[val].name;
                    var data2Value = values[val].value;
                    var data2Percent = values[val].percent;
                }
            }
            //call function which creates one segment at a time
            let segment = this.createSegment(3,lastThetaStart, lastThetaStart + THREE.Math.degToRad(data1Percent*3.6));

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






let scene = new SceneInit(45);
scene.initScene();
scene.animate();

const jsonData = new JsonData();
const pieChart = new PieChart(jsonData);
scene.scene.add(pieChart.threeObject);


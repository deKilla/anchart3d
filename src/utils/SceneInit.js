/**
 * @author Amar Bajric (https://github.com/amarbajric)
 * @author Michael Fuchs (https://github.com/deKilla)
 * @author Timo Hasenbichler (https://github.com/timoooo)
 */

import TWEEN from "tween.js";
var THREE = require("three");
THREE.OrbitControls = require("three-orbit-controls")(THREE);
import {entryAnimation, resetCameraPosition, resetChartPosition} from "./animation";


class SceneInit {

    //TODO: ebenfalls object ...
    constructor(domtarget, sceneConfig, camera, scene, controls, renderer, mouse, INTERSECTED) {
        this.domtarget = domtarget;
        this.sceneConfig = sceneConfig; //custom user options held here
        this.camera = camera;
        this.scene = scene;
        this.controls = controls;
        this.renderer = renderer;
        this.mouse = new THREE.Vector2();
        this.INTERSECTED = INTERSECTED;
    }


    initScene() {
        this.camera = new THREE.PerspectiveCamera(this.sceneConfig.fov || 45, window.innerWidth / window.innerHeight, 1, 1000);

        if (this.sceneConfig.startAnimation) {
            this.camera.position.set(0, -10, 1100);
            let endPos = {x: 0, y: -10, z: 7}; //let defaultCamPos = {x: 0, y: -10, z: 7}; => should be for all charts later
            entryAnimation(this.camera,endPos,2500,800);
        } else {
            this.camera.position.set(0, -10, 7);
        }

        this.controls = new THREE.OrbitControls(this.camera);
        this.controls.addEventListener('change', this.render.bind(this));

        //OrbitControls custom settings
        this.controls.enableKeys = false; //disable keys (arrow keys on keyboard) because we have a D-Pad
        this.controls.enablePan = false;  // disable panning (right mouse button moving chart)



        this.scene = new THREE.Scene();

        //specify a canvas which is already created in the HTML file and tagged by an id
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById(this.domtarget),
            antialias: this.sceneConfig.antialias || false, alpha: this.sceneConfig.transparency || false
        });

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        if (this.sceneConfig.bgcolor) {
            this.scene.background = new THREE.Color(this.sceneConfig.bgcolor);
        }

        //ambient light which is for the whole scene
        let ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        ambientLight.castShadow = false;
        this.scene.add(ambientLight);

        //spot light which is illuminating the chart directly
        let spotLight = new THREE.SpotLight(0xffffff, 0.65);
        spotLight.castShadow = true;
        spotLight.position.set(0, 40, 10);
        this.scene.add(spotLight);

        document.addEventListener('mousedown', this.onDocumentMouseAction.bind(this), false);
        document.addEventListener('mousemove', this.onDocumentMouseAction.bind(this), false);
        document.addEventListener('keydown', this.onDocumentKeyAction.bind(this), false);
        document.ondblclick = this.onDocumentDblClick.bind(this);

        //if window resizes
        window.addEventListener('resize', this.onWindowResize.bind(this), false);
    }


    animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.render();
        this.controls.update();
    }


    render() {
        this.renderer.render(this.scene, this.camera);
        TWEEN.update();
    }


    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }


    findIntersections(event) {
        let raycaster = new THREE.Raycaster();
        this.mouse.x = ( event.clientX / this.renderer.domElement.clientWidth ) * 2 - 1;
        this.mouse.y = -( event.clientY / this.renderer.domElement.clientHeight ) * 2 + 1;
        raycaster.setFromCamera(this.mouse, this.camera);


        //search for our object by name which we declared before and return it
        return raycaster.intersectObjects(this.scene.getObjectByName("groupedChart", true).children);
    }


    onDocumentKeyAction(event) {
       // https://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
        switch (event.keyCode) {
            case 82: //R key
                break;
            case 67: //C key
                let currentChart = this.scene.getObjectByName("groupedChart", true);
                let camera = this.camera;
                this.showOnScreenControls("mouseover", currentChart, camera); //click, mouseover
        }
    }


    showOnScreenControls(method = "click", currentChart, camera) {
        let repeater;
        let interval;

        if (method == "hover") {
            method = "mouseover"
        }
        if (method == "mouseover") {
            interval = 100
        }

        document.getElementById("controls").innerHTML = `<a id="btnup">&uarr;</a>`;
        document.getElementById("controls").innerHTML += `<a id="btnleft">&larr;</a>`;
        document.getElementById("controls").innerHTML += `<a id="btnreset">R</a>`;
        document.getElementById("controls").innerHTML += `<a id="btnright">&rarr;</a>`;
        document.getElementById("controls").innerHTML += `<a id="btndown">&darr;</a>`;

        document.querySelector("#btnreset").addEventListener("click", function () {
            resetChartPosition(currentChart,{x: 0, y: 0, z: 0},4000);
            resetCameraPosition(camera,{x:0,y:-10,z:7},4000);
        });
        document.querySelector("#btnleft").addEventListener(method, function () {
            repeater = setInterval(function () {
                currentChart.rotation.z += 0.1
            }, interval)
        });
        document.querySelector("#btnup").addEventListener(method, function () {
            repeater = setInterval(function () {
                currentChart.rotation.x -= 0.1
            }, interval)
        });
        document.querySelector("#btnright").addEventListener(method, function () {
            repeater = setInterval(function () {
                currentChart.rotation.z -= 0.1
            }, interval)
        });
        document.querySelector("#btndown").addEventListener(method, function () {
            repeater = setInterval(function () {
                currentChart.rotation.x += 0.1
            }, interval)
        });

        if (method == "mouseover") {
            document.querySelector("#btnleft").addEventListener("mouseout", function () {
                clearInterval(repeater)
            });
            document.querySelector("#btnup").addEventListener("mouseout", function () {
                clearInterval(repeater)
            });
            document.querySelector("#btnright").addEventListener("mouseout", function () {
                clearInterval(repeater)
            });
            document.querySelector("#btndown").addEventListener("mouseout", function () {
                clearInterval(repeater)
            });
        }
    }

    onDocumentMouseAction(event) {
        //call function which finds intersected objects
        let intersects = this.findIntersections(event);

        if (intersects[0] !== undefined && event.type === "mousedown") {//if the event type is a mouse click (one click)
            //print percentage of the clicked section + the name of the object assigned in the 'create3DPieChart' function
            //intersects[0] because we want the first intersected object and every other object which may lies in the background is unnecessary
            document.getElementById("details").innerHTML = "<h2>" + intersects[0].object.name + "</h2><b>" + intersects[0].object.data1.name + ":</b> " + intersects[0].object.data1.percent.toFixed(2) +
                "% (" + intersects[0].object.data1.value + ")";
            if(intersects[0].object.hasOwnProperty("data2")) document.getElementById("details").innerHTML += "<br><b>" + intersects[0].object.data2.name + ":</b> " + intersects[0].object.data2.percent.toFixed(2) + "% (" + intersects[0].object.data2.value + ")";
        }
        else if (intersects[0] !== undefined && event.type == "mousemove") {//if the event type is a mouse move (hover)

            //call the html tooltip whenever there is an intersected object. if it is the same call again to update position
            if (this.INTERSECTED) {
                this.htmlTooltip("show");
            }

            if (this.INTERSECTED != intersects[0].object) {
                if (this.INTERSECTED) this.INTERSECTED.material.emissive.setHex();
                this.INTERSECTED = intersects[0].object;
                this.INTERSECTED.material.emissive.setHex(this.colorLuminance(this.INTERSECTED.material.color.getHexString(), 0.007));
            }
        }
        else {
            if (this.INTERSECTED) this.INTERSECTED.material.emissive.setHex();
            this.INTERSECTED = null;

            this.htmlTooltip("hide");
        }

    }


    colorLuminance(hex, lum) {//function for mouse hover "glow effect" to illuminate the color of selected segment

    // validate hex string
    hex = String(hex).replace(/[^0-9a-f]/gi, '');
    if (hex.length < 6) {
        hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
    }
    lum = lum || 0;

    // convert to decimal and change luminosity
    let threeHex = "0x", c, i;
    for (i = 0; i < 3; i++) {
        c = parseInt(hex.substr(i*2,2), 16);
        c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
        threeHex += ("00"+c).substr(c.length);
    }
    return threeHex;
}


    onDocumentDblClick() {
        //IMPLEMENT DOUBLE CLICK FUNCTION HERE
    }


    htmlTooltip(status) {

        let tooltip = null;
        status = (!status) ? "show" : status;

        if (status === "show" && this.sceneConfig.tooltip) {

            if (!document.getElementById("tooltip")) {
                tooltip = document.createElement("div");
            } else {
                tooltip = document.getElementById("tooltip");
            }

            tooltip.setAttribute("id", "tooltip");
            tooltip.innerHTML =
                `<h4>${this.INTERSECTED.name}</h4>
                     <b>${this.INTERSECTED.data1.name}</b>: ${this.INTERSECTED.data1.value} (${this.INTERSECTED.data1.percent.toFixed(2)}%)<br />`;
            if(this.INTERSECTED.hasOwnProperty("data2")) tooltip.innerHTML += `<b>${this.INTERSECTED.data2.name}</b>: ${this.INTERSECTED.data2.value} (${this.INTERSECTED.data2.percent.toFixed(2)}%)`;

            let vector = new THREE.Vector3(this.mouse.x, this.mouse.y);
            tooltip.style.position = "absolute";

            let posX = 0;
            let posY = 0;
            let q = "";

            if (vector.x >= 0 && vector.y >= 0) {
                q = "q1"
            }
            if (vector.x <= 0 && vector.y >= 0) {
                q = "q2"
            }
            if (vector.x <= 0 && vector.y <= 0) {
                q = "q3"
            }
            if (vector.x >= 0 && vector.y <= 0) {
                q = "q4"
            }

            if (q == "q1") {
                posX = ((Math.abs(vector.x)) * 50) + 50;
                posY = ((1 - Math.abs(vector.y)) * 50);
            }

            if (q == "q2") {
                posX = ((1 - Math.abs(vector.x)) * 50);
                posY = ((1 - Math.abs(vector.y)) * 50);
            }

            if (q == "q3") {
                posX = ((1 - Math.abs(vector.x)) * 50);
                posY = ((Math.abs(vector.y)) * 50) + 50;
            }

            if (q == "q4") {
                posX = ((Math.abs(vector.x)) * 50) + 50;
                posY = ((Math.abs(vector.y)) * 50) + 50;
            }

            tooltip.style.left = posX + '%';
            tooltip.style.top = posY + '%';

            document.body.appendChild(tooltip);
        }
        //remove tooltip if mouse does not hover over the pie or a pie segment
        else if (status === "hide" && document.getElementById("tooltip")) {
            document.body.removeChild(document.getElementById("tooltip"));
        }
    }


    resetPosition() {//resets camera and object position
        //Camera Rotation and Position
        let cam = this.camera;
        let actualCamPos = {x: cam.position.x, y: cam.position.y, z: Math.ceil(cam.position.z)}; //ceiling upwards cause of minimal variety
        let defaultCamPos = {x: 0, y: -10, z: 7};
        let initCam = (actualCamPos.x == defaultCamPos.x && actualCamPos.y == defaultCamPos.y && actualCamPos.z == defaultCamPos.z);

        if (!initCam) {
            new TWEEN.Tween(actualCamPos)
                .to({x: defaultCamPos.x, y: defaultCamPos.y, z: defaultCamPos.z}, 4000)
                .easing(TWEEN.Easing.Cubic.Out)
                .onUpdate(function () {
                    cam.position.set(actualCamPos.x, actualCamPos.y, actualCamPos.z);
                }).start();
        }

        //Object Rotation and Position
        let object = this.scene.getObjectByName("groupedChart", true);
        let actualObjPos = {x: object.rotation.x, y: object.rotation.y, z: object.rotation.z};
        let defaultObjPos = {x: 0, y: 0, z: 0};
        let initObj = (actualObjPos.x == defaultObjPos.x && actualObjPos.y == defaultObjPos.y && actualObjPos.z == defaultObjPos.z);

        if (!initObj) {
            new TWEEN.Tween(actualObjPos)
                .to({x: defaultObjPos.x, y: defaultObjPos.y, z: defaultObjPos.z}, 4000)
                .easing(TWEEN.Easing.Cubic.Out)
                .onUpdate(function () {
                    object.rotation.set(actualObjPos.x, actualObjPos.y, actualObjPos.z);
                }).start();
            }
    }
}


export default SceneInit

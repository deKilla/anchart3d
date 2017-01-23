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
    constructor(domtarget, dataArray, sceneConfig, camera, scene, controls, renderer, mouse, INTERSECTED) {
        
        this.domNode = document.getElementById(domtarget);
        this.parentWidth = window.getComputedStyle(this.domNode.parentElement).getPropertyValue("width").slice(0,-2);
        this.parentHeight = window.getComputedStyle(this.domNode.parentElement).getPropertyValue("height").slice(0,-2);
        this.dataArray = dataArray;     //array with all datasets from user => needed for live data swapping
        this.sceneConfig = sceneConfig; //custom user options held here
        this.camera = camera;
        this.scene = scene;
        this.controls = controls;
        this.renderer = renderer;
        this.mouse = new THREE.Vector2();
        this.INTERSECTED = INTERSECTED;
    }


    initScene() {
        this.camera = new THREE.PerspectiveCamera(this.sceneConfig.fov || 45, this.parentWidth / this.parentHeight, 1, 1000);
        if(document.getElementById("details")) document.getElementById("details").style.visibility = "hidden";

        this.controls = new THREE.OrbitControls(this.camera);
        this.controls.addEventListener('change', this.render.bind(this));

        //OrbitControls custom settings
        this.controls.enableKeys = false; //disable keys (arrow keys on keyboard) because we have a D-Pad
        this.controls.enablePan = false;  // disable panning (right mouse button moving chart)

        this.scene = new THREE.Scene();

        //specify a canvas which is already created in the HTML file and tagged by an id
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.domNode,
            antialias: this.sceneConfig.antialias,
            alpha: this.sceneConfig.transparency
        });

        this.renderer.setSize(this.parentWidth, this.parentHeight);
        this.domNode.parentElement.appendChild(this.renderer.domElement);

        //transparent background won't work when a background-color is defined
        if(this.sceneConfig.transparency == true) {
            this.renderer.setClearColor( 0xffffff, 0 );
        } else {
            this.scene.background = new THREE.Color(
                this.sceneConfig.bgcolor ||
                window.getComputedStyle(this.domNode.parentElement).getPropertyValue("background-color")// ||
                //window.getComputedStyle(document.body).getPropertyValue("background-color") // pseudo transparency
            );
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

        if (this.sceneConfig.startAnimation) {
            this.camera.position.set(0, -10, 1100);
            let endPos = {x: 0, y: -10, z: 7}; //let defaultCamPos = {x: 0, y: -10, z: 7}; => should be for all charts later
            entryAnimation(this.camera, endPos, 2500, 800);
        }
         else {
            this.camera.position.set(0, -10, 7);
        }


        document.addEventListener('mousedown', this.onDocumentMouseAction.bind(this), false);
        document.addEventListener('mousemove', this.onDocumentMouseAction.bind(this), false);
        document.addEventListener('keydown', this.onDocumentKeyAction.bind(this), false);
        document.ondblclick = this.onDocumentDblClick.bind(this);

        //if window resizes
        window.addEventListener('resize', this.onWindowResize.bind(this), false);

        if (this.sceneConfig.showOnScreenControls) {
            this.showOnScreenControls(this.sceneConfig.controlMethod || "mouseover", this.scene, this.camera);
            // was this.scene.getObjectByName("groupedChart", true) but is broken ?!!
        }
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
        this.camera.aspect = this.parentWidth / this.parentHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.parentWidth, this.parentHeight);
    }


    findIntersections(event) {
        let raycaster = new THREE.Raycaster();
        this.mouse.x = (( event.pageX - this.domNode.parentElement.offsetLeft ) / this.domNode.width ) * 2 - 1;
        this.mouse.y = - (( event.pageY - this.domNode.parentElement.offsetTop ) / this.domNode.height ) * 2 + 1;
        //console.log(this.mouse)

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
                break;
                //let currentChart = this.scene.getObjectByName("groupedChart", true);
                //let camera = this.camera;
                ///this.showOnScreenControls("mouseover", currentChart, camera); //click, mouseover
        }
    }


    showOnScreenControls(method = "click", currentChart, camera) {
        //console.log(this.scene)
        //console.log(currentChart);
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

        let intersectedObjects = this.findIntersections(event);
        //let scaled = false;

        if(intersectedObjects[0]) {
            // remove luminance if different segment is hovered
            if (this.INTERSECTED && this.INTERSECTED != intersectedObjects[0].object) {
                this.INTERSECTED.material.emissive.setHex();
            }
            this.INTERSECTED = intersectedObjects[0].object;
        } else if (this.INTERSECTED) {
            //remove luminance if no segment is hovered
            this.INTERSECTED.material.emissive.setHex();
            this.INTERSECTED = null;
        }
        
        //click event
        if (this.INTERSECTED && event.type == "mousedown") {
            this.showDetails(true);
        } else if (!this.INTERSECTED && event.type == "mousedown") { //click elsewhere
            this.showDetails(false);
        }

        //hover event
        if (this.INTERSECTED && event.type == "mousemove") {
            this.showTooltip(true);
            this.INTERSECTED.material.emissive.setHex(this.colorLuminance(this.INTERSECTED.material.color.getHexString(), 0.01));
            //console.log(intersectedObjects[0]);           

        } else if (!this.INTERSECTED && event.type == "mousemove") { //mouse leave
            this.showTooltip(false);
        }
    }

    showDetails(status) {
        
        let details = document.getElementById("details");
        if (!details) {
            throw "The tooltip requires a <div id=\"detailpane\"></div> in order to work!";
        }

        if (status & this.sceneConfig.details) {
            details.innerHTML = 
            `<h2>${this.INTERSECTED.name}</h2>
            <b>${this.INTERSECTED.data1.name}:</b> ${this.INTERSECTED.data1.percent.toFixed(2)}% (${this.INTERSECTED.data1.value})`;
            if(this.INTERSECTED.hasOwnProperty("data2")) {
                details.innerHTML += 
                `<br><b>${this.INTERSECTED.data2.name}:</b> ${this.INTERSECTED.data2.percent.toFixed(2)}% (${this.INTERSECTED.data2.value})`;
            }
            details.style.visibility = "visible";
        } else if (!status && details) {
            details.style.visibility = "hidden";
        }
    }

    showTooltip(status) {

        let tooltip = document.getElementById("tooltip") || null;
        
        if (status && this.sceneConfig.tooltip) {

            if (!document.getElementById("tooltip")) {
                tooltip = document.createElement("div");
            } else {
                tooltip = document.getElementById("tooltip");
            }

            tooltip.setAttribute("id", "tooltip");
            tooltip.innerHTML =
                `<h4>${this.INTERSECTED.name}</h4>
                 <b>${this.INTERSECTED.data1.name}</b>: ${this.INTERSECTED.data1.value} (${this.INTERSECTED.data1.percent.toFixed(2)}%)<br />`;
            if(this.INTERSECTED.hasOwnProperty("data2")) {
                tooltip.innerHTML += 
                `<b>${this.INTERSECTED.data2.name}</b>: ${this.INTERSECTED.data2.value} (${this.INTERSECTED.data2.percent.toFixed(2)}%)`;
            }
            tooltip.style.position = "absolute";
            tooltip.style.left = event.pageX + 'px';
            tooltip.style.top = event.pageY + 'px';

            document.body.appendChild(tooltip);
        } else if (!status && tooltip) {
            document.body.removeChild(tooltip);
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
    }

}

export default SceneInit


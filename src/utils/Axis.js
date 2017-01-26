/**
 * Created by Timo on 24.01.2017.
 */
import * as THREE from "three";

class Axis {

    constructor(sceneConfig) {
        this.sceneConfig = sceneConfig;

    }




    setLabelX(text) {
        var text2 = document.createElement('div');
        text2.style.position = 'absolute';
//text2.style.zIndex = 1;    // if you still don't see the label, try uncommenting this
        text2.style.width = 100;
        text2.style.height = 100;
        text2.style.backgroundColor = "blue";
        text2.innerHTML = text;
        text2.style.top = 200 + 'px';
        text2.style.left = 200 + 'px';
        document.body.appendChild(text2);

    }


    setLabelY(string) {


    }

    setLabelZ(string) {


    }

    initAxis() {

        var material = new THREE.LineBasicMaterial({
            color: 0x0000ff
        });


        var geometry = new THREE.Geometry();

        geometry.vertices.push(
            new THREE.Vector3(-3.7, -2, 0),
            new THREE.Vector3(-3.7, 1.9, 0),
            new THREE.Vector3(3, 1.9, 0),
            new THREE.Vector3(-3.7, 1.9, 0),
            new THREE.Vector3(-3.7, 1.9, 3)
        );


        var line = new THREE.Line(geometry, material);
        return line;
    }
}

export default Axis

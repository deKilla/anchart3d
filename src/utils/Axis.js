/**
 * Created by Timo on 24.01.2017.
 */
    import * as THREE from "three";

class Axis {

    constructor(sceneConfig) {
        this.sceneConfig = sceneConfig;

    }



    setLabelX(text) {

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

/**
 * Created by Timo on 29.01.2017.
 */

import * as THREE from "three";


class Axis {

    constructor(sceneConfig) {
        this.sceneConfig = sceneConfig;

    }

    roundRect(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    makeTextSprite(message, parameters) {
        if (parameters === undefined) parameters = {};

        let fontface = parameters.hasOwnProperty("fontface") ?
            parameters["fontface"] : "Arial";

        let fontsize = parameters.hasOwnProperty("fontsize") ?
            parameters["fontsize"] : 11;

        let borderThickness = parameters.hasOwnProperty("borderThickness") ?
            parameters["borderThickness"] : 1;

        let borderColor = parameters.hasOwnProperty("borderColor") ?
            parameters["borderColor"] : {r: 0, g: 0, b: 0, a: 1.0};

        let backgroundColor = parameters.hasOwnProperty("backgroundColor") ?
            parameters["backgroundColor"] : {r: 255, g: 255, b: 255, a: 1.0};

        let canvas = document.createElement('canvas');
        let context = canvas.getContext('2d');
        context.font = "Bold " + fontsize + "px " + fontface;

        // get size data (height depends only on font size)
        let metrics = context.measureText(message);
        let textWidth = metrics.width;

        // background color
        context.fillStyle = "rgba(" + backgroundColor.r + "," + backgroundColor.g + ","
            + backgroundColor.b + "," + backgroundColor.a + ")";
        // border color
        context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + ","
            + borderColor.b + "," + borderColor.a + ")";

        context.lineWidth = borderThickness;
        this.roundRect(context, borderThickness / 2, borderThickness / 2, textWidth + borderThickness, fontsize * 1.4 + borderThickness, 6);
        // 1.4 is extra height factor for text below baseline: g,j,p,q.

        // text color
        context.fillStyle = "rgba(0, 0, 0, 1.0)";

        context.fillText(message, borderThickness, fontsize + borderThickness);

        // canvas contents will be used for a texture
        let texture = new THREE.Texture(canvas);

        texture.minFilter = THREE.LinearFilter;
        texture.needsUpdate = true;


        let spriteMaterial = new THREE.SpriteMaterial(
            {map: texture, fog: true}); //,alignment: spriteAlignment

        let sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(5, 2.5, 1);

        sprite.position.normalize();
        return sprite;
    }


    initAxis(y,x) {
        let material = new THREE.LineBasicMaterial({
            color: 0x000000 //black
        });


        let geometry = new THREE.Geometry();
        geometry.vertices.push(
            //ebene 1
            new THREE.Vector3(-0.7, -2, 0),
            new THREE.Vector3(-0.7, y + 0.7, 0),
            new THREE.Vector3(x, y + 0.7, 0),
            new THREE.Vector3(-0.7, y + 0.7, 0),
            new THREE.Vector3(-0.7, y + 0.7, 1),
            //ebene 2
            new THREE.Vector3(-0.7, -2, 1),
            new THREE.Vector3(-0.7, y+0.7, 1),
            new THREE.Vector3(x, y+0.7, 1),
            new THREE.Vector3(-0.7, y+0.7, 1),
            new THREE.Vector3(-0.7, y+0.7, 2),
            //ebene 3
            new THREE.Vector3(-0.7, -2, 2),
            new THREE.Vector3(-0.7, y+0.7, 2),
            new THREE.Vector3(x, y+0.7, 2),
            new THREE.Vector3(-0.7, y+0.7, 2),
            new THREE.Vector3(-0.7, y+0.7, 3),
            //ebene 4
            new THREE.Vector3(-0.7, -2, 3),
            new THREE.Vector3(-0.7, y+0.7, 3),
            new THREE.Vector3(x, y+0.7, 3),
            new THREE.Vector3(-0.7, y+0.7, 3),
            new THREE.Vector3(-0.7, y+0.7, 4),
        );

        return new THREE.Line(geometry, material);
    }



    scatterAxisDrawer(scatterObject){
        if(typeof scatterObject === "undefined"){
            console.error("The argument of the function has to be an instance of THREE.Object3D.")
        }

        function v(x,y,z){ return new THREE.Vector3(x,y,z); }

        let lineGeo = new THREE.Geometry();
        lineGeo.vertices.push(

            v(-50, 50, -50), v(50, 50, -50),
            v(-50, -50, -50), v(50, -50, -50),
            v(-50, -50, 50), v(50, -50, 50),

            v(-50, 0, -50), v(50, 0, -50),
            v(-50, -50, 0), v(50, -50, 0),

            v(50, -50, -50), v(50, 50, -50),
            v(-50, -50, -50), v(-50, 50, -50),
            v(-50, -50, 50), v(-50, 50, 50),

            v(0, -50, -50), v(0, 50, -50),
            v(-50, -50, 0), v(-50, 50, 0),

            v(-50, 50, -50), v(-50, 50, 50),
            v(-50, -50, -50), v(-50, -50, 50),

            v(50,-50,50), v(50,-50,-50),
            v(-50, 0, -50), v(-50, 0, 50),
            v(0, -50, -50), v(0, -50, 50)
        );
        let lineMat = new THREE.LineBasicMaterial({color: 0x808080, lineWidth: 1});
        let line = new THREE.Line(lineGeo, lineMat);
        line.type = THREE.Lines;
        scatterObject.add(line);
        return scatterObject;
    }


}

export default Axis

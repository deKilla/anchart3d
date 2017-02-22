/**
 * @author Amar Bajric (https://github.com/amarbajric)
 * @author Timo Hasenbichler (https://github.com/timoooo)
 */

import * as THREE from "three";

class Axis {

    constructor(sceneConfig) {
        this.sceneConfig = sceneConfig;

    }


    createVector(x,y,z){
        return new THREE.Vector3(x,y,z);
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

    makeTextSprite2D(message, parameters) {
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

        return sprite;
    }



    initAxis(y,x) {
        let material = new THREE.LineBasicMaterial({
            color: 0x696969 //black
        });

        let geometry = new THREE.Geometry();
        geometry.vertices.push(
            //ebene 1
            this.createVector(-0.7, -2, 0),
            this.createVector(-0.7, y + 0.7, 0),
            this.createVector(x, y + 0.7, 0),
            this.createVector(-0.7, y + 0.7, 0),
            this.createVector(-0.7, y + 0.7, 1),
            //ebene 2
            this.createVector(-0.7, -2, 1),
            this.createVector(-0.7, y+0.7, 1),
            this.createVector(x, y+0.7, 1),
            this.createVector(-0.7, y+0.7, 1),
            this.createVector(-0.7, y+0.7, 2),
            //ebene 3
            this.createVector(-0.7, -2, 2),
            this.createVector(-0.7, y+0.7, 2),
            this.createVector(x, y+0.7, 2),
            this.createVector(-0.7, y+0.7, 2),
            this.createVector(-0.7, y+0.7, 3),
            //ebene 4
            this.createVector(-0.7, -2, 3),
            this.createVector(-0.7, y+0.7, 3),
            this.createVector(x, y+0.7, 3),
            this.createVector(-0.7, y+0.7, 3),
            this.createVector(-0.7, y+0.7, 4),
        );

        return new THREE.Line(geometry, material);
    }


    //mesh text is static and does not move at all or follow the camera
    createMeshText2D(text, fontsize, fontBold, height, width) {
        let canvas = document.createElement('canvas');
        let context1 = canvas.getContext('2d');
        context1.font = (fontBold ? "Bold " : "") + (String(fontsize).trim() || "12") + "px Arial";
        context1.fillStyle = "rgba(0, 0, 0, 1.0)";
        context1.fillText(text, 1, fontsize+10);

        // canvas contents will be used for a texture
        let texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;

        let material = new THREE.MeshBasicMaterial( {map: texture, side:THREE.DoubleSide});
        material.transparent = true;

        return new THREE.Mesh(
            new THREE.PlaneGeometry(canvas.width, canvas.height),
            material
        );
    }


    scatterAxisDrawer(scatterObject){

        let lineGeo = new THREE.Geometry();
        lineGeo.vertices.push(

            //bottom grid
            this.createVector(-10, -10, 10), this.createVector(10, -10, 10),
            this.createVector(10, -10, -10), this.createVector(-10, -10, -10),
            this.createVector(10, -10, -10), this.createVector(-10, -10, -10),
            this.createVector(-10, -10, 10),
            //now starting middle cross bottom
            this.createVector(0, -10, 10), this.createVector(0, -10, -10),
            this.createVector(-10, -10, -10), this.createVector(-10, -10, 0),
            this.createVector(10, -10, 0),

            //back grid
            this.createVector(10, -10, -10), this.createVector(10, 10, -10),
            this.createVector(-10, 10, -10), this.createVector(-10, -10, -10),
            //now starting middle cross back
            this.createVector(0, -10, -10), this.createVector(0, 10, -10),
            this.createVector(-10, 10, -10),this.createVector(-10, 0, -10),
            this.createVector(10, 0, -10), this.createVector(-10, 0, -10),

            //left grid
            this.createVector(-10, 10, -10), this.createVector(-10, 10, 10),
            this.createVector(-10, -10, 10),
            //now starting middle cross left
            this.createVector(-10, -10, 0), this.createVector(-10, 10, 0),
            this.createVector(-10, 10, 10), this.createVector(-10, 0, 10),
            this.createVector(-10, 0, -10)

        );
        let lineMat = new THREE.LineBasicMaterial({color: 0x696969});
        let line = new THREE.Line(lineGeo, lineMat);

        //lines for indicating where the 0,0,0 point is and all starts
        let startLines = new THREE.Geometry();
        startLines.vertices.push(
            //directed line for x-axis
          this.createVector(-10,-10,-10), this.createVector(-5,-10,-10),
            this.createVector(-5.5,-9.5,-10), this.createVector(-5,-10,-10),
            this.createVector(-5.5,-10.5,-10), this.createVector(-5,-10,-10),
            this.createVector(-10,-10,-10),
            //directed line for y-axis
            this.createVector(-10,-5,-10), this.createVector(-10.5,-5.5,-10),
            this.createVector(-10,-5,-10), this.createVector(-9.5,-5.5,-10),
            this.createVector(-10,-5,-10), this.createVector(-10,-10,-10),
            //directed line for z-axis
            this.createVector(-10,-10,-5), this.createVector(-9.5,-10,-5.5),
            this.createVector(-10,-10,-5), this.createVector(-10.5,-10,-5.5),
            this.createVector(-10,-10,-5), this.createVector(-10,-10,-10),
        );
        let lineMat2 = new THREE.LineBasicMaterial({color: 0x000000});
        let line2 = new THREE.Line(startLines, lineMat2);

        line.type = THREE.LineStrip;
        scatterObject.add(line,line2);

        return scatterObject;
    }
}

export default Axis

/**
 * @author Amar Bajric (https://github.com/amarbajric)
 */

import TWEEN from "tween.js";

export function resetChartPosition(object,defaultPos,animTime){
    let actualObjPos = {x: object.rotation.x, y: object.rotation.y, z: object.rotation.z};
    let initObj = (actualObjPos.x == defaultPos.x && actualObjPos.y == defaultPos.y && actualObjPos.z == defaultPos.z);

    if (!initObj) {
       return new TWEEN.Tween(actualObjPos)
            .to({x: defaultPos.x, y: defaultPos.y, z: defaultPos.z}, animTime)
            .easing(TWEEN.Easing.Cubic.Out)
            .onUpdate(function () {
                object.rotation.set(actualObjPos.x, actualObjPos.y, actualObjPos.z);
            }).start();
    }
    else return new TWEEN.Tween().to(0,0).start();
}


export function resetCameraPosition(cameraObj,defaultPos,animTime){
    //Camera Rotation and Position
    let actualCamPos = {x: cameraObj.position.x, y: Math.round(cameraObj.position.y), z: Math.round(cameraObj.position.z)}; //ceiling upwards cause of minimal variety
    let initCam = (actualCamPos.x == defaultPos.x && actualCamPos.y == defaultPos.y && actualCamPos.z == defaultPos.z);

    if (!initCam) {
        return new TWEEN.Tween(actualCamPos)
            .to({x: defaultPos.x, y: defaultPos.y, z: defaultPos.z}, animTime)
            .easing(TWEEN.Easing.Cubic.Out)
            .onUpdate(function () {
                cameraObj.position.set(actualCamPos.x, actualCamPos.y, actualCamPos.z);
            }).start();
    }
    else return new TWEEN.Tween().to(0,0).start(); //return dummy tween
}



export function entryAnimation(camera,endPos,animTime,delayTime){
    let startPos = {x: camera.position.x, y: camera.position.y, z: camera.position.z};
    let endPosition = {x: endPos.x, y: endPos.y, z: endPos.z};

    return new TWEEN.Tween(startPos)
        .to({x: endPosition.x, y: endPosition.y, z: endPosition.z}, animTime)
        .easing(TWEEN.Easing.Cubic.Out)
        .onUpdate(function () {
            camera.position.setY(startPos.y);
            camera.position.setZ(startPos.z);
        })
        .delay(delayTime) //was 800
        .start();
}



export function animateZ(obj,startpos,endPosition,animTime,delayTime) {
    return new TWEEN.Tween(startpos)
        .to({z: endPosition}, animTime)
        .easing(TWEEN.Easing.Cubic.Out)
        .onUpdate(function () {
            obj.scale.z = startpos.z;
        })
        .delay(delayTime)
        .start();
}




export function dataSwapAnimation(oldChart, oldChartEndPos, newChart, animTime, delayTime) {
    let oldChartInitPos = oldChart.position;

    return new TWEEN.Tween(oldChartInitPos)
                .to({x: oldChartEndPos.x}, animTime)
                .easing(TWEEN.Easing.Cubic.Out)
                .onStart(function () {
                    new TWEEN.Tween(newChart.position)
                        .to({x: oldChartInitPos.x}, animTime)
                        .easing(TWEEN.Easing.Cubic.Out)
                        .delay(delayTime)
                        .start()
                })
                .delay(delayTime)
                .start();
}
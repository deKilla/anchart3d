/**
 * @author Amar Bajric (https://github.com/amarbajric)
 */

import TWEEN from "tween.js";

export function resetChartPosition(object,defaultPos,animTime){
    let actualObjPos = {x: object.rotation.x, y: object.rotation.y, z: object.rotation.z};
    let initObj = (actualObjPos.x == defaultPos.x && actualObjPos.y == defaultPos.y && actualObjPos.z == defaultPos.z);

    if (!initObj) {
        new TWEEN.Tween(actualObjPos)
            .to({x: defaultPos.x, y: defaultPos.y, z: defaultPos.z}, animTime)
            .easing(TWEEN.Easing.Cubic.Out)
            .onUpdate(function () {
                object.rotation.set(actualObjPos.x, actualObjPos.y, actualObjPos.z);
            }).start();
    }
}


export function resetCameraPosition(cameraObj,defaultPos,animTime){
    //Camera Rotation and Position
    let actualCamPos = {x: cameraObj.position.x, y: cameraObj.position.y, z: Math.ceil(cameraObj.position.z)}; //ceiling upwards cause of minimal variety
    let initCam = (actualCamPos.x == defaultPos.x && actualCamPos.y == defaultPos.y && actualCamPos.z == defaultPos.z);

    if (!initCam) {
        new TWEEN.Tween(actualCamPos)
            .to({x: defaultPos.x, y: defaultPos.y, z: defaultPos.z}, animTime)
            .easing(TWEEN.Easing.Cubic.Out)
            .onUpdate(function () {
                cameraObj.position.set(actualCamPos.x, actualCamPos.y, actualCamPos.z);
            }).start();
    }
}



export function entryAnimation(camera,endPos,animTime,delayTime){
    let startPos = {x: camera.position.x, y: camera.position.y, z: camera.position.z};
    let endPosition = {x: endPos.x, y: endPos.y, z: endPos.z};

    new TWEEN.Tween(startPos)
        .to({x: endPosition.x, y: endPosition.y, z: endPosition.z}, animTime)
        .easing(TWEEN.Easing.Cubic.Out)
        .onUpdate(function () {
            camera.position.setY(startPos.y);
            camera.position.setZ(startPos.z);
        })
        .delay(delayTime) //was 800
        .start();
}



export function animateZ(obj,startpos,finpos,animTime,delayTime) {
    return new TWEEN.Tween(startpos)
        .to({z: finpos}, animTime)
        .easing(TWEEN.Easing.Cubic.Out)
        .onUpdate(function () {
            obj.scale.z = startpos.z;
        })
        .delay(delayTime)
        .start();
}

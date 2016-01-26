/**
 * paint.js
 *
 * Created by jrootham on 04/01/16.
 *
 * Copyright © 2016 Jim Rootham
 */

import {Constants} from "./data.js";
import {SIZE_RECT, PICTURE_RECT, getSizePoints} from "./edit.js";

const DASH = 10;

const onlyPaint = store => {
    paint(store);
};

let displayOverlay = onlyPaint;

export const setOverlay = store => {
    switch (store.display.which) {
        case Constants.NONE:
            displayOverlay = onlyPaint;
            paint(store);
            break;

        case Constants.SIZE:
            displayOverlay = sizeOverlay;
            paintAll(store);
            break;

        default:
            displayOverlay = pictureOverlay;
            paintAll(store);
            break;
    }
};

const dashedBox = (context, width, height) => {
    context.strokeStyle = "black";
    context.setLineDash([DASH, DASH]);
    context.lineDashOffset = 0;
    context.strokeRect(0, 0, width, height);

    context.lineDashOffset = DASH;
    context.strokeStyle = "white";
    context.strokeRect(0, 0, width, height);
};

const dashedLine = (context, startX, startY, endX, endY) => {
    context.strokeStyle = "black";
    context.setLineDash([DASH, DASH]);
    context.lineDashOffset = 0;

    context.beginPath();
    context.moveTo(startX, startY);
    context.lineTo(endX, endY);
    context.stroke();

    context.lineDashOffset = DASH;
    context.strokeStyle = "white";
    context.stroke();
};

const pictureOverlay = store => {
    let canvas = document.getElementById("canvas");
    let context = canvas.getContext("2d");
    context.save();
    let element = store.data.pictures[store.display.which];

    let pictureRect = PICTURE_RECT / (element.ratio * element.scale);

    let width = element.image.width;
    let height = element.image.height;

    transform(context, element);
    dashedBox(context, width, height);
    dashedLine(context, 0, element.centroidY, width, element.centroidY);
    dashedLine(context, element.centroidX, 0, element.centroidX, height);

    drawBox(context, width - pictureRect, 0, pictureRect);
    drawBox(context, width - pictureRect, height - pictureRect, pictureRect);
    drawBox(context, 0, element.centroidY - pictureRect / 2, pictureRect);

    context.restore();
};

const sizeOverlay = store => {
    let canvas = document.getElementById("canvas");
    let context = canvas.getContext("2d");
    context.save();

    let [left, top, midBottom, midSide] = getSizePoints(store.data.size);

    drawBox(context, left, top, SIZE_RECT);
    drawBox(context, left, midSide, SIZE_RECT);
    drawBox(context, midBottom, top, SIZE_RECT);

    context.restore();
};

const drawBox = (context, left, top, size) => {
    context.strokeStyle = "black";
    context.strokeRect(left, top, size, size);

    context.fillStyle = "white";
    context.fillRect(left, top, size, size);
};

const transform = (context, picture) => {
    let ratio = picture.ratio;
    context.translate(picture.translateX * ratio, picture.translateY * ratio);
    context.scale(ratio, ratio);
    context.translate(picture.centroidX, picture.centroidY);
    context.rotate(picture.rotate);
    context.scale(picture.scale, picture.scale);
    context.translate(-picture.centroidX, -picture.centroidY);
};

const paint = store => {
    let canvas = document.getElementById("canvas");
    let width = store.data.size.width;
    let height = store.data.size.height;

    canvas.width = width;
    canvas.height = height;

    let context = canvas.getContext("2d");
    context.save();

    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);

    for (let zOrder = 0 ; zOrder < store.data.pictures.length ; zOrder++) {
        store.data.pictures.forEach((element, index) =>{
            if (element.zIndex === zOrder) {
                context.save();
                transform(context, element);
                context.drawImage(element.image, 0, 0);
                context.restore();
            }
        });
    }
    context.restore();
};

export const paintAll = store => {
    paint(store);
    displayOverlay(store);
};

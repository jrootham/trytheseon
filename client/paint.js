/**
 * paint.js
 *
 * Created by jrootham on 04/01/16.
 *
 * Copyright © 2016 Jim Rootham
 */

import {nothing} from "./edit.js";
import {Constants} from "./data.js";
import {SIZE_RECT, PICTURE_RECT, getSizePoints} from "./edit.js";

let displayOverlay = nothing;

export const setOverlay = store => {
    switch (store.display.which) {
        case Constants.NONE:
            displayOverlay = nothing;
            paint(store);
            break;

        case Constants.SIZE:
            displayOverlay = sizeOverlay;
            paintAll(store);
            break;
    }
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

const paint = store => {
    let canvas = document.getElementById("canvas");
    let context = canvas.getContext("2d");
    context.save();

    context.fillStyle = "white";
    context.fillRect(0, 0, store.data.size.width, store.data.size.height);

    store.data.pictures.forEach((element, index) =>{
        context.drawImage(element.image, 0, 0);
    });
    context.restore();
};

export const paintAll = store => {
    paint(store);
    displayOverlay(store);
};

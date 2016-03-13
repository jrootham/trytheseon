/**
 * paint.js
 *
 * Created by jrootham on 04/01/16.
 *
 * Copyright © 2016 Jim Rootham
 */

import {Constants} from "./data.js";
import {SIZE_RECT, PICTURE_RECT, getSizePoints} from "./edit.js";
import {dashedLine, dashedBox, drawBox} from "./common";

const pictureOverlay = store => {
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");
    context.save();
    const element = store.data.pictures[store.display.which];

    const pictureRect = PICTURE_RECT / element.scale;

    const width = element.clipWidth * element.factor;
    const height = element.clipHeight * element.factor;
    const centroidX = (element.centroidX - element.clipX) * element.factor;
    const centroidY = (element.centroidY - element.clipY) * element.factor;

    transform(context, element);
    dashedBox(context, width, height);
    dashedLine(context, 0, centroidY, width, centroidY);
    dashedLine(context, centroidX, 0, centroidX, height);

    drawBox(context, width - pictureRect, 0, pictureRect);
    drawBox(context, width - pictureRect, height - pictureRect, pictureRect);
    drawBox(context, 0, centroidY - pictureRect / 2, pictureRect);

    context.restore();
};

const sizeOverlay = store => {
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");
    context.save();

    const [left, top, midBottom, midSide] = getSizePoints(store.data.size);

    drawBox(context, left, top, SIZE_RECT);
    drawBox(context, left, midSide, SIZE_RECT);
    drawBox(context, midBottom, top, SIZE_RECT);

    context.restore();
};

const transform = (context, picture) => {
    const centroidX = picture.centroidX - picture.clipX;
    const centroidY = picture.centroidY - picture.clipY;
    context.translate(picture.translateX, picture.translateY);
    context.translate(centroidX, centroidY);
    context.rotate(picture.rotate);
    context.scale(picture.scale, picture.scale);
    context.translate(-centroidX, -centroidY);
};

const paint = store => {
    const canvas = document.getElementById("canvas");
    const width = store.data.size.width;
    const height = store.data.size.height;

    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");
    context.save();

    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);

    for (let zOrder = 0 ; zOrder < store.data.pictures.length ; zOrder++) {
        store.data.pictures.forEach((element, index) =>{
            if (element.zIndex === zOrder) {
                context.save();
                transform(context, element);
                const sizeWidth = element.factor * element.clipWidth;
                const sizeHeight = element.factor * element.clipHeight;

                context.drawImage(element.image, element.clipX, element.clipY,
                    element.clipWidth, element.clipHeight, 0, 0, sizeWidth, sizeHeight);
                context.restore();
            }
        });
    }
    context.restore();
};

export const paintAll = store => {
    paint(store);

    switch (store.display.which) {
        case Constants.layout.NOTHING:
            break;

        case Constants.layout.SIZE:
            sizeOverlay(store);
            break;

        default:
            pictureOverlay(store);
            break;
    }
};

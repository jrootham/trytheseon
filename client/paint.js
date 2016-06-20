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
    const element = store.scene.scenePictures[store.display.which];
    const picture = element.picture;

    const pictureRect = PICTURE_RECT / element.scale;

    const width = picture.clipWidth * element.factor;
    const height = picture.clipHeight * element.factor;
    const centroidX = (picture.centroidX - picture.clipX) * element.factor;
    const centroidY = (picture.centroidY - picture.clipY) * element.factor;

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

    const [left, top, midBottom, midSide] = getSizePoints(store.scene.width, store.scene.height);

    drawBox(context, left, top, SIZE_RECT);
    drawBox(context, left, midSide, SIZE_RECT);
    drawBox(context, midBottom, top, SIZE_RECT);

    context.restore();
};

const transform = (context, scenePicture) => {
    const picture = scenePicture.picture;

    const centroidX = (picture.centroidX - picture.clipX) * scenePicture.factor;
    const centroidY = (picture.centroidY - picture.clipY) * scenePicture.factor;
    context.translate(scenePicture.translateX, scenePicture.translateY);
    context.translate(centroidX, centroidY);
    context.rotate(scenePicture.rotate);
    context.scale(scenePicture.scale, scenePicture.scale);
    context.translate(-centroidX, -centroidY);
};

const paint = store => {
    const canvas = document.getElementById("canvas");
    const width = store.scene.width;
    const height = store.scene.height;

    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");
    context.save();

    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);

    for (let zOrder = 0 ; zOrder < store.scene.scenePictures.length ; zOrder++) {
        store.scene.scenePictures.forEach((element, index) =>{
            if (element.zIndex === zOrder) {
                context.save();
                const picture = element.picture;
                transform(context, element);
                const sizeWidth = element.factor * picture.clipWidth;
                const sizeHeight = element.factor * picture.clipHeight;

                context.drawImage(picture.image, picture.clipX, picture.clipY,
                    picture.clipWidth, picture.clipHeight, 0, 0, sizeWidth, sizeHeight);
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

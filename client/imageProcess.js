/**
 * imageProcess.js
 *
 * Created by jrootham on 20/02/16.
 *
 * Copyright © 2016 Jim Rootham
 */

const DEPTH = 4;

export const expand = (invisible, image, zoom) => {
    console.log("expand");
    invisible.width = image.width;
    invisible.height = image.height;

    const newWidth = image.width * zoom;
    const newHeight = image.height * zoom;

    let context = invisible.getContext("2d");
    context.drawImage(image, 0, 0);

    const inputData = context.getImageData(0, 0, image.width, image.height);
    const size = DEPTH * newWidth * newHeight;
    const newArray = new Uint8ClampedArray(size);

    let y, dy, x, dx, d, fromMap, toMap;

    for (y = 0 ; y < image.height ; y++) {
        for (dy = 0 ; dy < zoom ; dy++) {
            for (x = 0 ; x < image.width ; x++) {
                for (dx = 0 ; dx < zoom ; dx++) {
                    for (d = 0 ; d < DEPTH ; d++) {
                        fromMap = map(image.width, x, y, d);
                        toMap = map(newWidth, x * zoom + dx, y * zoom + dy, d);
                        newArray[toMap] = inputData.data[fromMap];
                    }
                }
            }
        }
    }

    const outputData = new ImageData(newArray, newWidth, newHeight);

    invisible.width = newWidth;
    invisible.height = newHeight;

    context = invisible.getContext("2d");
    context.putImageData(outputData, 0, 0);

    return invisible;
}

const map = (width, x, y, d) => {
    return d + DEPTH * (x + width * y);
}
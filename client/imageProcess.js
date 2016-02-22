/**
 * imageProcess.js
 *
 * Created by jrootham on 20/02/16.
 *
 * Copyright © 2016 Jim Rootham
 */

const DEPTH = 4;

export const expand = (invisible, image, zoom) => {
    invisible.width = image.width;
    invisible.height = image.height;

    let context = invisible.getContext("2d");
    context.drawImage(image, 0, 0);

    const inputData = context.getImageData(0, 0, image.width, image.height);

    const newWidth = image.width * zoom;
    const newHeight = image.height * zoom;

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

    let result;
    createImageBitmap(invisible).then(function(image) {
        result = image;
    });

    return result;
}

const getInputData = image => {
    const invisible = document.getElementById("invisible");

    invisible.width = image.width;
    invisible.height = image.height;

    let context = invisible.getContext("2d");
    context.drawImage(image, 0, 0);

    return context.getImageData(0, 0, image.width, image.height);
}

const makePromise = (newArray, newWidth, newHeight, picture) => {
    const invisible = document.getElementById("invisible");

    const outputData = new ImageData(newArray, newWidth, newHeight);

    invisible.width = newWidth;
    invisible.height = newHeight;

    const context = invisible.getContext("2d");
    context.putImageData(outputData, 0, 0);

    return createImageBitmap(invisible);
}

const rotate = (inputData, makeSize, newXFn, newYFn) => {
    const oldWidth = inputData.width;
    const oldHeight = inputData.height;

    let newWidth, newHeight;
    [newWidth, newHeight] = makeSize(inputData);

    const size = DEPTH * newWidth * newHeight;
    const newArray = new Uint8ClampedArray(size);

    let y, x, d, newX, newY, fromMap, toMap;

    for (y = 0 ; y < oldHeight ; y++) {
        for (x = 0 ; x < oldWidth ; x++) {
            for (d = 0 ; d < DEPTH ; d++) {
                fromMap = map(oldWidth, x, y, d);
                newX = newXFn(x, y, oldWidth - 1, oldHeight - 1);
                newY = newYFn(x, y, oldWidth - 1, oldHeight - 1);
                toMap = map(newWidth, newX, newY, d);
                newArray[toMap] = inputData.data[fromMap];
            }
        }
    }

    return makePromise(newArray, newWidth, newHeight);
};

const swap = inputData => {
    return [inputData.height, inputData.width];
}

const plain = inputData => {
    return [inputData.width, inputData.height];
}

export const left = image => {
    const newX = (x, y, width, height) => {
        return y;
    };

    const newY = (x, y, width, height) => {
        return width - x;
    };

    return rotate(getInputData(image), swap, newX, newY);
};

export const right = image => {
    const newX = (x, y, width, height) => {
        return height - y;
    };

    const newY = (x, y, width, height) => {
        return x;
    };

    return rotate(getInputData(image), swap, newX, newY);
};

export const flip = image => {
    const newX = (x, y, width, height) => {
        return x;
    };

    const newY = (x, y, width, height) => {
        return height - y;
    };

    return rotate(getInputData(image), plain, newX, newY);
};

const map = (width, x, y, d) => {
    return d + DEPTH * (x + width * y);
}
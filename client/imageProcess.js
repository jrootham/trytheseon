/**
 * imageProcess.js
 *
 * Created by jrootham on 20/02/16.
 *
 * Copyright © 2016 Jim Rootham
 */

const DEPTH = 4;
const COLOURS = 3;
const OPACITY = 3;
const TRANSPARENT = 0;
const OPAQUE = 255;
const DISTANCE = 32;
const SPECKLE = 10000;

const map = (width, x, y, d) => {
    return d + DEPTH * (x + width * y);
}

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

let result, index;
const isToBeCleared = (data, base, point) => {
    result = data.data[map(data.width, point.x, point.y, OPACITY)] === OPAQUE;
    index = map(data.width, point.x, point.y, 0);
    result = result && Math.abs(data.data[index] - base[0]) < DISTANCE;
    index = map(data.width, point.x, point.y, 1);
    result = result && Math.abs(data.data[index] - base[1]) < DISTANCE;
    index = map(data.width, point.x, point.y, 2);
    result = result && Math.abs(data.data[index] - base[2]) < DISTANCE;

    return result;
};

const setPicture = (picture, data) => {
    const invisible = document.getElementById("invisible");
    const context = invisible.getContext("2d");
    context.putImageData(data, 0, 0);

    createImageBitmap(invisible).then(image =>{
        picture.image = image;
    });
};

export const transparentColour = (picture, x, y) => {
    let data = getInputData(picture.image);
    let base = [];

    for (let d = 0 ; d < COLOURS ; d++) {
        base.push(data.data[map(data.width, x, y, d)])
    }

    let stack = [];
    stack.push({x:x, y:y});

    let point;
    while (stack.length > 0) {
        point = stack.pop();
        if (isToBeCleared(data, base, point)) {
            data.data[map(data.width, point.x, point.y, OPACITY)] = TRANSPARENT;
            stack.push({x:point.x, y:point.y + 1});
            stack.push({x:point.x, y:point.y - 1});
            stack.push({x:point.x + 1, y:point.y});
            stack.push({x:point.x - 1, y:point.y});
        }
    }

    setPicture(picture, data);
};

export const transparentEdges = picture => {
    let data = getInputData(picture.image);
    let x, y, index;

    for (y = 0 ; y < data.height ; y++) {
        for (x = 0 ; x < data.width ; x ++) {
            index = map(data.width, x, y, OPACITY);
            if (data.data[index] === OPAQUE) {
                data.data[index] = TRANSPARENT;
            }
            else {
                break;
            }
        }

        for (x = data.width -1 ; x >= 0 ; x--) {
            index = map(data.width, x, y, OPACITY);
            if (data.data[index] === OPAQUE) {
                data.data[index] = TRANSPARENT;
            }
            else {
                break;
            }
        }
    }

    setPicture(picture, data);
};

export const transparentSpeckles = picture => {
    let data = getInputData(picture.image);
    let stack = [];
    let count = [];
    let keep = [];
    let point, index;

    let x, y;
    for (y = 0 ; y < data.height ; y++) {
        for (x = 0; x < data.width; x++) {
            stack.push({x: x, y: y});

            while (stack.length > 0) {
                point = stack.pop();
                index = map(data.width, point.x, point.y, OPACITY);
                if (data.data[index] != TRANSPARENT) {
                    count.push(index);
                    data.data[index] = TRANSPARENT;
                    stack.push({x: point.x, y: point.y + 1});
                    stack.push({x: point.x, y: point.y - 1});
                    stack.push({x: point.x + 1, y: point.y});
                    stack.push({x: point.x - 1, y: point.y});
                }
            }

            if (count.length > SPECKLE) {
                count.forEach(index => {
                    keep.push(index);
                });
            }

            count = [];
        }
    }

    keep.forEach(index => {
        data.data[index] = OPAQUE;
    })

    setPicture(picture, data);

};

export const reset = picture => {
    let data = getInputData(picture.image);
    let x, y;

    for (x = 0 ; x < data.width ; x ++) {
        for (y = 0 ; y < data.height ; y++) {
            data.data[map(data.width, x, y, OPACITY)] = OPAQUE;
        }
    }

    setPicture(picture, data);
}

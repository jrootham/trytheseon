/**
 * common.js
 *
 * Created by jrootham on 15/02/16.
 *
 * Copyright © 2016 Jim Rootham
 */

const DASH = 10;

export const makeGoBack = store => {
    return () => {
        store.display.error = undefined;
        store.display.page = store.display.previous;
    }
}

export const show = name => {
    let popup = document.getElementById(name);
    popup.setAttribute("style", "display:block");
};

export const hide = name => {
    let popup = document.getElementById(name);
    popup.setAttribute("style", "display:none");
};

export const dashedBox = (context, width, height) => {
    context.save();

    context.strokeStyle = "black";
    context.setLineDash([DASH, DASH]);
    context.lineDashOffset = 0;
    context.strokeRect(0, 0, width, height);

    context.lineDashOffset = DASH;
    context.strokeStyle = "white";
    context.strokeRect(0, 0, width, height);

    context.restore();
};

export const dashedLine = (context, startX, startY, endX, endY) => {
    context.save();

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

    context.restore();
};

export const drawBox = (context, left, top, size) => {
    context.save();

    context.strokeStyle = "black";
    context.strokeRect(left, top, size, size);

    context.fillStyle = "white";
    context.fillRect(left, top, size, size);

    context.restore();
};

export const drawBoxList = (context, boxList) => {
    boxList.forEach(element => {
        drawBox(context, element.left, element.top, element.scene);
    });
}

export const inBox = (point, left, top, size) => {
    return inRect(point, left, top, size, size);
}

export const inRect = (point, left, top, width, height) => {
    let x = point.x;
    let y = point.y;
    let result = x > left && y > top && x < left + width && y < top + height;

    return result;
};

export const inBoxList = (point, boxList) => {
    return boxList.reduce((previous, element) => {
        return previous ||
            inBox(point, element.left, element.top, element.scene);
    }, false);
}

export const intParse = (string, defaultValue) => {
    const result = parseInt(string);
    return (!isNaN(result) ? result : defaultValue);
}

export const floatParse = (string, defaultValue) => {
    const result = parseFloat(string);
    return (!isNaN(result) ? result : defaultValue);
}


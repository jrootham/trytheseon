/**
 * common.js
 *
 * Created by jrootham on 15/02/16.
 *
 * Copyright © 2016 Jim Rootham
 */

import {redraw} from "./index"

const DASH = 10;

export const makeGoBack = store => {
    return () => {
        store.display.page = store.display.previous;
        redraw();
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


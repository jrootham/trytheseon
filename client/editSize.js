/**
 * editSize.js
 *
 * Created by jrootham on 18/01/16.
 *
 * Copyright © 2016 Jim Rootham
 */

import {Constants} from "./data"
import {paintAll} from "./paint";
import {redraw} from "./contents";
import {getSizePoints, inBox, SIZE_RECT} from "./edit";

export const EditSize = {
    start: function (parent) {
        this.parent = parent;
        this.size = this.parent.props.store.data.size;

        let [left, top, midBottom, midSide] = getSizePoints(this.size);

        if (inBox(this.parent.start, left, top, SIZE_RECT)) {
            this.parent.continue = true;
            this.startWidth = this.size.width;
            this.startHeight = this.size.height;
            window.requestAnimationFrame(setSize.bind(this));
        }
        else if (inBox(this.parent.start, left, midSide, SIZE_RECT)) {
            this.parent.continue = true;
            this.startWidth = this.size.width;
            window.requestAnimationFrame(setWidth.bind(this));
        }
        else if (inBox(this.parent.start, midBottom, top, SIZE_RECT)) {
            this.parent.continue = true;
            this.startHeight = this.size.height;
            window.requestAnimationFrame(setHeight.bind(this));
        }
    }
};

function setSize (timestamp) {
    let [x, y] = this.parent.fixXY(this.parent.point);
    let dx = x - this.parent.start.x;
    let dy = y - this.parent.start.y;

    let scale = 1.0;

    if (dx < dy ) {
        scale = x / this.parent.start.x;
    }
    else {
        scale = y / this.parent.start.y;
    }

    scale = Math.min(Constants.MAX_WIDTH / this.startWidth, scale);
    scale = Math.max(Constants.MIN_WIDTH / this.startWidth, scale);
    scale = Math.min(Constants.MAX_HEIGHT / this.startHeight, scale);
    scale = Math.max(Constants.MIN_HEIGHT / this.startHeight, scale);

    this.parent.props.store.data.size.width = Math.round(this.startWidth * scale);
    this.parent.props.store.data.size.height = Math.round(this.startHeight * scale);

    if (this.parent.continue) {
        paintAll(this.parent.props.store);
        window.requestAnimationFrame(setSize.bind(this));
    }
    else {
        redraw();
    }
};

function setWidth(timestamp) {
    let [x, y] = this.parent.fixXY(this.parent.point);
    let width = this.startWidth + (x - this.parent.start.x);

    width = Math.min(Constants.MAX_WIDTH, width);
    width = Math.max(Constants.MIN_WIDTH, width);
    this.parent.props.store.data.size.width = width;
    if (this.parent.continue) {
        paintAll(this.parent.props.store);
        window.requestAnimationFrame(setWidth.bind(this));
    }
    else {
        redraw();
    }
};

function setHeight(timestamp) {
    let [x, y] = this.parent.fixXY(this.parent.point);
    let height = this.startHeight + (y - this.parent.start.y);
    height = Math.min(Constants.MAX_HEIGHT, height);
    height = Math.max(Constants.MIN_HEIGHT, height);
    this.parent.props.store.data.size.height = height;
    if (this.parent.continue) {
        paintAll(this.parent.props.store);
        window.requestAnimationFrame(setHeight.bind(this));
    }
    else {
        redraw();
    }
};

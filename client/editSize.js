/**
 * editSize.js
 *
 * Created by jrootham on 18/01/16.
 *
 * Copyright © 2016 Jim Rootham
 */

import {Constants} from "./data"
import {paintAll} from "./paint";
import {getSizePoints, SIZE_RECT} from "./edit";
import {inBox} from "./common";

export const EditSize = {
    start: function (parent) {
        this.parent = parent;
        this.scene = this.parent.props.store.scene;

        let [left, top, midBottom, midSide] = getSizePoints(this.scene.width, this.scene.height);

        if (inBox(this.parent.start, left, top, SIZE_RECT)) {
            this.parent.continue = true;
            this.startWidth = this.scene.width;
            this.startHeight = this.scene.height;
            window.requestAnimationFrame(setSize.bind(this));
        }
        else if (inBox(this.parent.start, left, midSide, SIZE_RECT)) {
            this.parent.continue = true;
            this.startWidth = this.scene.width;
            window.requestAnimationFrame(setWidth.bind(this));
        }
        else if (inBox(this.parent.start, midBottom, top, SIZE_RECT)) {
            this.parent.continue = true;
            this.startHeight = this.scene.height;
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

    this.parent.props.store.scene.width = Math.round(this.startWidth * scale);
    this.parent.props.store.scene.height = Math.round(this.startHeight * scale);

    if (this.parent.continue) {
        paintAll(this.parent.props.store);
        window.requestAnimationFrame(setSize.bind(this));
    }
    else {
    }
};

function setWidth(timestamp) {
    let [x, y] = this.parent.fixXY(this.parent.point);
    let width = this.startWidth + (x - this.parent.start.x);

    width = Math.min(Constants.MAX_WIDTH, width);
    width = Math.max(Constants.MIN_WIDTH, width);
    this.parent.props.store.scene.width = width;
    if (this.parent.continue) {
        paintAll(this.parent.props.store);
        window.requestAnimationFrame(setWidth.bind(this));
    }
    else {
    }
};

function setHeight(timestamp) {
    let [x, y] = this.parent.fixXY(this.parent.point);
    let height = this.startHeight + (y - this.parent.start.y);
    height = Math.min(Constants.MAX_HEIGHT, height);
    height = Math.max(Constants.MIN_HEIGHT, height);
    this.parent.props.store.scene.height = height;
    if (this.parent.continue) {
        paintAll(this.parent.props.store);
        window.requestAnimationFrame(setHeight.bind(this));
    }
    else {
    }
};

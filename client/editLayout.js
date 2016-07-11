/**
 * editLayout.js
 *
 * Created by jrootham on 17/02/16.
 *
 * Copyright © 2016 Jim Rootham
 */

import {PICTURE_RECT, getPicturePoints} from "./edit";
import {inBox, inRect} from "./common";
import {paintAll} from "./paint";
import {redraw} from "./index";

export const EditLayout = {
    start(parent) {
        this.parent = parent;
        let index = this.parent.props.store.display.which;
        this.scenePicture = this.parent.props.store.scene.scenePictures[index];

        let pictureWidth = this.scenePicture.clipWidth;
        let pictureHeight = this.scenePicture.clipHeight;

        let [left, top, midSide] = getPicturePoints(this.scenePicture);

        this.constant = this.scenePicture.copy();

        this.startPoint = map(this.constant, this.parent.start);

        const centroidX = this.scenePicture.centroidX - this.scenePicture.clipX;
        const centroidY = this.scenePicture.centroidY - this.scenePicture.clipY;

        let boxSize = PICTURE_RECT / (this.scenePicture.scale * this.scenePicture.factor);

        if (inBox(this.startPoint, left, top, boxSize)
            || inBox(this.startPoint, left, 0, boxSize)) {

            this.parent.continue = true;
            let dx = (this.startPoint.x - centroidX);
            let dy = (this.startPoint.y - centroidY);

            this.startLength = dist(dx, dy);
            this.startScale = this.scenePicture.scale;
            window.requestAnimationFrame(setScale.bind(this));
        }
        else if (inBox(this.startPoint, 0, midSide, boxSize)) {
            this.parent.continue = true;
            let dx = this.startPoint.x - centroidX;
            let dy = this.startPoint.y - centroidY;
            this.startRotate = Math.atan2(dy, dx);
            window.requestAnimationFrame(setRotate.bind(this));
        }
        else if (inRect(this.startPoint, 0, 0, pictureWidth, pictureHeight)){
            this.parent.continue = true;
            this.startX = this.scenePicture.translateX;
            this.startY = this.scenePicture.translateY;
            window.requestAnimationFrame(setTranslate.bind(this));
        }
    }
}

const map = (scenePicture, point) => {
    let x = point.x / scenePicture.factor;
    let y = point.y / scenePicture.factor;

    const centroidX = scenePicture.centroidX - scenePicture.clipX;
    const centroidY = scenePicture.centroidY - scenePicture.clipY;

    x -= scenePicture.translateX / scenePicture.factor;
    y -= scenePicture.translateY / scenePicture.factor;

    x -= centroidX;
    y -= centroidY;

    const minusRotate = - scenePicture.rotate;

    let xPrime = x * Math.cos(minusRotate) - y * Math.sin(minusRotate);
    let yPrime = x * Math.sin(minusRotate) + y * Math.cos(minusRotate);

    x = xPrime;
    y = yPrime;

    x /= scenePicture.scale;
    y /= scenePicture.scale;

    x += centroidX;
    y += centroidY;

    return {x:x, y:y};
};

const dist = (dx, dy) => {return Math.sqrt(dx * dx + dy * dy)};

function setScale(timestamp) {
    const [x, y] = this.parent.fixXY(this.parent.point);
    const point = map(this.constant, {x:x, y:y});

    const dx = point.x - (this.scenePicture.centroidX - this.scenePicture.clipX);
    const dy = point.y - (this.scenePicture.centroidY - this.scenePicture.clipY);

    const currentLength = dist(dx, dy);

    const newScale = this.constant.scale * (currentLength / this.startLength);

    this.scenePicture.scale = Math.max(0.1, Math.min(1.0, newScale));

    if (this.parent.continue) {
        paintAll(this.parent.props.store);
        window.requestAnimationFrame(setScale.bind(this));
    }
    else {
        redraw();
    }
}

function setRotate(timestamp) {
    let [x, y] = this.parent.fixXY(this.parent.point);
    let point = map(this.constant, {x:x, y:y});
    const dx = point.x - (this.scenePicture.centroidX - this.scenePicture.clipX);
    const dy = point.y - (this.scenePicture.centroidY - this.scenePicture.clipY);

    let deltaRotate = Math.atan2(dy, dx) - this.startRotate;

    let newRotate = this.constant.rotate + deltaRotate;
    const MAX_ROTATE = 2 * Math.PI;
    this.scenePicture.rotate = (newRotate + MAX_ROTATE) % MAX_ROTATE;

    if (this.parent.continue) {
        paintAll(this.parent.props.store);
        window.requestAnimationFrame(setRotate.bind(this));
    }
    else {
        redraw();
    }

}

function setTranslate(timestamp) {
    let [x, y] = this.parent.fixXY(this.parent.point);

    let dx = x - this.parent.start.x;
    let dy = y - this.parent.start.y;

    this.scenePicture.translateX = this.constant.translateX + dx;
    this.scenePicture.translateY = this.constant.translateY + dy;

    if (this.parent.continue) {
        paintAll(this.parent.props.store);
        window.requestAnimationFrame(setTranslate.bind(this));
    }
    else {
        redraw();
    }
}

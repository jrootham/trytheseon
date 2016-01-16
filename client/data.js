/**
 * data.js
 *
 * Created by jrootham on 24/12/15.
 *
 * Copyright © 2015 Jim Rootham
 */

export const Constants = {
    MAX_WIDTH:      800,
    MAX_HEIGHT :    800,
    MIN_WIDTH:      80,
    MIN_HEIGHT :    80,

    NONE:           -2,
    SIZE:           -1
};

export let store = {
    data: {
        size: {
            width : Constants.MAX_WIDTH,
            height: Constants.MAX_HEIGHT
        },
        pictures:   []
    },
    display : {
        which:          Constants.NONE
    }
};

export class Picture {
    constructor(image) {
        this.image = image;
        this.rotate = 0;
        this.translateX = 0;
        this.translateY = 0;
        this.ratio = 1.0;
        this.scale = 1.0;
        this.zIndex = 0;
        this.centroidX = Math.min(image.width, Constants.MAX_WIDTH) / 2;
        this.centroidY = Math.min(image.height, Constants.MAX_HEIGHT) / 2;
        this.name = "";
    }

    copy() {
        let other = new Picture(this.image);

        other.rotate = this.rotate;
        other.translateX = this.translateX;
        other.translateY = this.translateY;
        other.ratio = this.ratio;
        other.scale = this.scale;
        other.zIndex = this.zIndex;
        other.centroidX = this.centroidX;
        other.centroidY = this.centroidY;
        other.name = this.name;

        return other;
    }
}

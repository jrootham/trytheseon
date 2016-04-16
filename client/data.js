/**
 * data.js
 *
 * Created by jrootham on 24/12/15.
 *
 * Copyright © 2015 Jim Rootham
 */

export const Constants = {
    MAX_WIDTH:          800,
    MAX_HEIGHT :        800,
    MIN_WIDTH:          80,
    MIN_HEIGHT :        80,

    layout: {
        NOTHING:        -2,
        SIZE:           -1,
    },

    picture: {
        NOTHING:        0,
        CLIP:           1,
        CENTROID:       2
    },

    page: {
        START:          0,
        SIGNON:         1,
        LOCAL_LOAD:     2,
        SERVER_LOAD:    3,
        CATALOGUE:      4,
        EDIT_PICTURE:   5,
        LAYOUT:         6
    }
};

export let store = {
    signon: {
        on:     false,
        name:   "",
        id:     0
    },

    data: {
        size: {
            width :             Constants.MAX_WIDTH,
            height:             Constants.MAX_HEIGHT
        },
        pictures:               []
    },

    display : {
        previous:               Constants.page.START,
        page:                   Constants.page.START,

        which:                  Constants.layout.NOTHING,

        picture: {
            zoom:               1,
            colourTransparent:  false,
            layout:             Constants.picture.NOTHING
        }
    }
};

export class Picture {
    constructor(image) {
        this.image = image;
        this.rotate = 0;
        this.translateX = 0;
        this.translateY = 0;
        this.scale = 1;
        this.zIndex = 0;
        this.clipX = 0;
        this.clipY = 0;
        this.setPoints();
        this.name = "";
        this.setFactor();
    }

    setPoints() {
        this.clipWidth = this.image.width;
        this.clipHeight = this.image.height;
        this.centroidX = this.image.width / 2;
        this.centroidY = this.image.height / 2;
    }

    setImage(image) {
        this.image = image;
        this.setPoints();
    }

    setFactor() {
        const width = Constants.MAX_WIDTH / this.clipWidth;
        const height = Constants.MAX_HEIGHT / this.clipHeight;
        this.factor = Math.min(1.0, Math.min(width, height));
    }

    copy() {
        let other = new Picture(this.image);

        other.rotate = this.rotate;
        other.translateX = this.translateX;
        other.translateY = this.translateY;
        other.scale = this.scale;
        other.zIndex = this.zIndex;
        other.clipX = this.clipX;
        other.clipY = this.clipY;
        other.clipWidth = this.clipWidth;
        other.clipHeight = this.clipHeight;
        other.centroidX = this.centroidX;
        other.centroidY = this.centroidY;
        other.name = this.name;
        other.factor = this.factor;

        return other;
    }
};

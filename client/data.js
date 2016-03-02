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
        SAVE_AS:        4,
        CATALOGUE:      5,
        EDIT_PICTURE:   6,
        LAYOUT:         7
    }
};

export let store = {
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
        this.zIndex = 0;
        this.clipX = 0;
        this.clipY = 0;
        this.clipWidth = image.width;
        this.clipHeight = image.height;
        this.centroidX = image.width / 2;
        this.centroidY = image.height / 2;
        this.name = "";
        setFactor(this);
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
}

export const setFactor = picture => {
    const width = Math.min(1.0, Constants.MAX_WIDTH / picture.image.width);
    const height = Math.min(1.0, Constants.MAX_HEIGHT / picture.image.height);
    picture.factor = Math.min(width, height);
}
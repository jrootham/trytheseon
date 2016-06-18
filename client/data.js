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
        REGISTER:       2,
        LOCAL_LOAD:     3,
        SERVER_LOAD:    4,
        CATALOGUE:      5,
        EDIT_PICTURE:   6,
        LAYOUT:         7
    }
};

export let store = {
    signon: {
        on:     false,
        name:   ""
    },

    scene: undefined,
    picture: undefined,

    display : {
        previous:               Constants.page.START,
        page:                   Constants.page.START,

        error:                  undefined,

        which:                  Constants.layout.NOTHING,

        picture: {
            zoom:               1,
            colourTransparent:  false,
            layout:             Constants.picture.NOTHING
        },
        
        pictureList: []
    }
};

export class Scene {
    constructor(width, height, placements) {
        this.id = 0;
        this.width = width;
        this.height = height;
        this.placements = placements;
    }

    add(placement) {
        placement.zIndex = this.placements.length
        this.placements.push(placement);
    }
}

export class Placement {
    constructor(picture) {
        this.id = 0;
        this.name = picture.name;
        this.picture = picture;
        this.rotate = 0;
        this.translateX = 0;
        this.translateY = 0;
        this.scale = 1;
        this.zIndex = 0;
        this.setFactor();
    }

    setFactor() {
        const width = Constants.MAX_WIDTH / this.picture.clipWidth;
        const height = Constants.MAX_HEIGHT / this.picture.clipHeight;
        this.factor = Math.min(1.0, Math.min(width, height));
    }

    // copy is used to create a temporary anchor for direct manipulation

    copy() {
        const other = new Placement(this.picture);
        other.name = this.name;  // Only for completeness
        other.rotate = this.rotate;
        other.translateX = this.translateX;
        other.translateY = this.translateY;
        other.scale = this.scale;
        other.zIndex = this.zIndex;

        return other;
    }
}

export class PictureLabel {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }    
}

export class Picture {
    constructor(image) {
        this.id = 0;
        this.name = "Picture";
        this.owned = true;
        this.image = image;
        this.clipX = 0;
        this.clipY = 0;
        this.setPoints();
        this.name = "";
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

    // Copy a picture into a scene (attached to a placement
    // and with a new id and owner

    copy() {
        let other = new Picture(this.image);

        other.id = 0;
        other.owner = 0;
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

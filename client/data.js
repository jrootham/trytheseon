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
        LOCAL_LAYOUT:   4,
        SERVER_LOAD:    5,
        SERVER_LAYOUT:  6,
        CATALOGUE:      7,
        EDIT_PICTURE:   8,
        LAYOUT:         9
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
        next:                   Constants.page.START,

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
    constructor(width, height, scenePictures) {
        this.id = 0;
        this.savedAt = "";
        this.width = width;
        this.height = height;
        this.scenePictures = scenePictures;
    }

    add(scenePicture) {
        scenePicture.zIndex = this.scenePictures.length
        this.scenePictures.push(scenePicture);
    }
}

export class ScenePicture {
    constructor(picture) {
        this.id = 0;
        this.name = picture.name;
        this.image = picture.image;
        this.clipX = picture.clipX;
        this.clipY = picture.clipY;
        this.clipWidth = picture.clipWidth;
        this.clipHeight = picture.clipHeight;
        this.centroidX = picture.centroidX;
        this.centroidY = picture.centroidY;
        this.rotate = 0;
        this.translateX = 0;
        this.translateY = 0;
        this.scale = 1;
        this.zIndex = 0;
        this.setFactor();
    }

    setFactor() {
        const width = Constants.MAX_WIDTH / this.clipWidth;
        const height = Constants.MAX_HEIGHT / this.clipHeight;
        this.factor = Math.min(1.0, Math.min(width, height));
    }

    // Partial copy is used to create a temporary anchor for direct manipulation

    copy() {
        const other = {};

        other.clipX = this.clipX;
        other.clipY = this.clipY;
        other.clipWidth = this.clipWidth;
        other.clipHeight = this.clipHeight;
        other.centroidX = this.centroidX;
        other.centroidY = this.centroidY;

        other.factor = this.factor;

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

};

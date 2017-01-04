/**
 * serverBase.js
 *
 * Created by jrootham on 15/02/16.
 *
 * Copyright © 2016 Jim Rootham
 */
import React from "react";
import ReactDOM from "react-dom";
import {Picture, Constants} from "./data";
import persistence from "./persistence";

export default class ServerBase extends React.Component {
    constructor() {
        super();
        this.load = this.load.bind(this);
    }

    load() {
        const pictureId = parseInt(document.getElementById("pickPicture").value);
        const store = this.props.store;

        persistence.getPicture(pictureId).then(result => {
            const values = result.data.getPicture;

            const image = new Image();
            
            image.onload = () => {
                const picture = new Picture(image);
                picture.id = values.id;
                picture.image = image;
                picture.name = values.name;
                picture.owned = values.owned;
                picture.clipX = values.clipX;
                picture.clipY = values.clipY;
                picture.clipWidth = values.clipWidth;
                picture.clipHeight = values.clipHeight;
                picture.centroidX = values.centroidX;
                picture.centroidY = values.centroidY;
                picture.thumbnail = values.thumbnail;

                this.setPicture(store, picture);
            }
            
            image.src = values.image;

        });
    }
    
    render() {
        const store = this.props.store;
        let result = undefined;

        if (store.signon.on) {
            const pictureList = store.pictureList;

            if (pictureList.length > 0) {
                const pick = <div>
                    <div>
                        <select id="pickPicture">
                            {pictureList.map(picture => {
                                const id = picture.id;

                                return <option key={`${id}`} value={`${id}`}>
                                    {`${picture.id}  ${picture.name}`}
                                </option>
                            })}
                        </select>
                    </div>
                    <button onClick={this.load}>Load</button>
                </div>

                result = pick;
            }
            else {
                result = <div>No picture to choose</div>
            }
        }
        else {
            result =<div>Not signed on</div>
        }

        return result;
    }
}

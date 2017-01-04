/**
 * linkPicture.js
 *
 * Created by jrootham on 01/08/16.
 *
 * Copyright © 2016 Jim Rootham
 */

import React from "react";
import PickTag from "./pickTag";
import {Constants} from "./data";
import persistence from "./persistence";

export default class LinkPicture extends React.Component {
    constructor() {
        super();
        this.link = this.link.bind(this);
    }

    link() {
        const store = this.props.store;
        const pictureId = store.picture.id;
        const tagLinks = store.tagLinks;

        persistence.newPictureTags(pictureId, tagLinks);
    }

    render() {
        const style = {
            display:    "inline-block"
        };

        const picture = this.props.store.picture;
        return <div>
                <div style={style}>
                    <image src={picture.thumbnail}></image>
                </div>
                <PickTag store={this.props.store}/>
                <div><button onClick={this.link}>Save</button></div>
            </div>
    }
}

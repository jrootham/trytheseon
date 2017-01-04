/**
 * pickTag.js
 *
 * Created by jrootham on 25/09/16.
 *
 * Copyright © 2016 Jim Rootham
 */

import React from "react";
import persistence from "./persistence";

export const getTagList = store => {
    const list = persistence.getTagList();
    return list.then(result => {
        store.tagList = result.data.getTagList;
        return 1;
    });
}

export const getTagLinks = (store, id) => {
    persistence.getPictureTagList(id).then(result => {
        console.log(result);
        store.tagLinks = result;
        return 1;
    });
}

const filterTags = (store, which) => {
    return store.tagList.filter(tag => {
        const result = store.tagLinks.includes(tag.id) == which;
        return result;
    })
}

const displayTags = (fn, tagLinks, tagList) => {
    return tagList.map(tag => {
        return <div key={tag.id}>
            <button onClick={fn(tagLinks, tag.id)}>
                {tag.name}
            </button>
        </div>
    })
}

const addTag = (tagLinks, tagId) => {
    return() => {
        tagLinks.push(tagId);
    }
}

const removeTag = (tagLinks, tagId) => {
    return() => {
        tagLinks.splice(tagLinks.indexOf(tagId), 1);
    }
}

export default class PickTag extends React.Component {
    render(){
        const store = this.props.store;

        const outerStyle = {
            display:    "inline-block",
        };

        const innerStyle = {
            display:    "inline-block",
            margin:     "10px"
        };

        return <div style={outerStyle}>
            <div style={innerStyle}>
                <div>Unselected</div>
                <div>&nbsp;</div>
                {displayTags(addTag, store.tagLinks, filterTags(store, false))}

            </div>
                <div style={innerStyle}>
                    <div>Selected</div>
                    <div>&nbsp;</div>
                    {displayTags(removeTag, store.tagLinks, filterTags(store, true))}
            </div>
        </div>
    }
}

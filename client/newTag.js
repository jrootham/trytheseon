/**
 * newCatalogue.js
 *
 * Created by jrootham on 01/08/16.
 *
 * Copyright © 2016 Jim Rootham
 */

import React from "react";
import persistence from "./persistence";

export default class NewTag extends React.Component {
    constructor() {
        super();
        this.newTag = this.newTag.bind(this);
    }

    newTag() {
        const name = document.getElementById("tag_name").value;
        const message = document.getElementById("message");

        if (name.length === 0) {
            message.innerHTML = "Entry may not be empty";

            return;
        }

        const promise = persistence.newTag(name);
        promise.then(result => {
            if ("errors" in result) {
                message.innerHTML = `Error: ${result.errors[0].message}`;
            }
            else {
                message.innerHTML = ``;
                const newTag = result.data.newTag;
                const store = this.props.store;
                store.tagList = (store.tagList.concat(newTag)).sort((a,b) => {
                    if (a.name < b.name) return -1;
                    if (a.name > b.name) return 1;
                    return 0;
                });
            }
        })
    }

    makeList() {
        let result = "";
        const tagList = this.props.store.tagList;
        if (tagList) {
            result = tagList.map(function(result) {
                return<li key={result.id}>{result.name}</li>;
            })
        }

        return result;
    }

    render() {
        return <div>
            <div>
                Tag name:
                <input id="tag_name" type="text" />
            </div>
            <div>
                <button onClick={this.newTag}>Add Tag</button>
            </div>
            <div id="message"></div>

            <ul>
                {this.makeList()}
            </ul>
        </div>
    }
}
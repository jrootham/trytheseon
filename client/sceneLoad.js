/**
 * sceneLoad.js
 *
 * Created by jrootham on 22/07/16.
 *
 * Copyright © 2016 Jim Rootham
 */

import React from "react";
import ReactDOM from "react-dom";
import {Constants, Scene, ScenePicture} from "./data";
import persistence from "./persistence";
import {redraw} from "./index";

export default class SceneLoad extends React.Component {
    constructor() {
        super();
        this.load = this.load.bind(this);
    }

    picturePromise(values) {
        const result = new Promise(resolve => {

            const image = new Image();

            image.onload = () => {
                const scenePicture = new ScenePicture();
                scenePicture.id = values.id;
                scenePicture.image = image;
                scenePicture.name = values.name;
                scenePicture.clipX = values.clipX;
                scenePicture.clipY = values.clipY;
                scenePicture.clipWidth = values.clipWidth;
                scenePicture.clipHeight = values.clipHeight;
                scenePicture.centroidX = values.centroidX;
                scenePicture.centroidY = values.centroidY;
                scenePicture.x = values.x;
                scenePicture.y = values.y;
                scenePicture.z = values.z;
                scenePicture.scale = values.scale;
                scenePicture.rotate = values.rotate;

                scenePicture.setFactor();

                resolve(scenePicture);
            };

            image.src = values.image;
        });

        return result;
    }

    load() {
        const sceneId = parseInt(document.getElementById("pickScene").value);
        const store = this.props.store;

        persistence.getScene(sceneId).then(result => {
            const values = result.data.getScene;
            const promiseList = [];

            values.pictureList.forEach(scenePicture =>{
                promiseList.push(this.picturePromise(scenePicture));
            })

            const promiseAll = Promise.all(promiseList);
            promiseAll.then(scenePictureList =>{
                store.scene = new Scene(values.name, values.width, values.height, scenePictureList);
                store.scene.id = values.id;
                store.scene.savedAt = values.savedAt;

                store.display.page = Constants.page.LAYOUT;

                redraw();
            })
        });
    }

    render(){
        const store = this.props.store;
        let result = undefined;

        if (store.signon.on) {
            const sceneList = store.display.sceneList.data.getSceneList;

            if (sceneList.length === 0) {
                result = <div>No scenes to select</div>
            }
            else {
                const pick = <div>
                    <div>
                        <select id="pickScene">
                            {sceneList.map(scene => {
                                const id = scene.id;

                                return <option key={`${id}`} value={`${id}`}>
                                    {`${scene.id}  ${scene.name}`}
                                </option>
                            })}
                        </select>
                    </div>
                    <button onClick={this.load}>Load</button>
                </div>

                result = pick;
            }
        }
        else {
            result =<div>Not signed on</div>
        }

        return result;
    }
}
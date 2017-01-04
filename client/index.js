import React from "react";
import ReactDOM from "react-dom";

import "./../trytheseon.css"

import AppBar from 'react-toolbox/lib/app_bar';
import {store, Constants, Scene} from "./data";
import Start from "./start";
import Signon from "./signon";
import persistence from "./persistence";
import LocalLoad from "./localLoad";
import ServerLoad from "./serverLoad";
import SceneLoad from "./sceneLoad";
import Catalogue from "./catalogue";
import SaveAs from "./saveAs";
import EditPicture from "./editPicture";
import Layout from "./layout";
import ServerLayout from "./serverLayout";
import NewTag from "./newTag";
import LinkPicture from "./linkPicture";
import PickLink from "./pickLink";
import {getTagList} from "./pickTag";

class Before extends React.Component{
    constructor() {
        super();
        this.signOnOff = this.signOnOff.bind(this);
        this.loadLocal = this.loadLocal.bind(this);
        this.loadServer = this.loadServer.bind(this);
        this.newScene = this.newScene.bind(this);
        this.loadScene = this.loadScene.bind(this);
        this.newTag = this.newTag.bind(this);
        this.pickLink = this.pickLink.bind(this);
    }

    signOnOff() {
        let store = this.props.store;
        if (store.signon.on) {
            const promise = persistence.signOff(store.signon.name);
            promise.then(result => {
                const store = this.props.store;

                store.display.error = undefined;
                store.signon.name = result.data.signoffUser.name;
                store.signon.on = result.data.signoffUser.signedOn;
                store.display.page = store.display.previous;
            });
        }
        else {
            store.display.page = Constants.page.SIGNON;
        }
    }

    loadLocal() {
        let store = this.props.store;
        store.display.page = Constants.page.LOCAL_LOAD;
    }
    
    loadServer() {
        const list = persistence.getPictureList();
        list.then(result => {
            let store = this.props.store;

            store.pictureList = result;
            store.display.page = Constants.page.SERVER_LOAD;
        });
    }

    loadScene() {
        const list = persistence.getSceneList();
        list.then(result => {
            let store = this.props.store;

            store.sceneList = result.data.getSceneList;
            store.display.page = Constants.page.SCENE_LOAD;
        });
    }

    newScene() {
        const store = this.props.store;
        store.scene = new Scene("", Constants.MAX_WIDTH, Constants.MAX_HEIGHT, []);
        store.display.which = Constants.layout.NOTHING;
        store.display.page = Constants.page.LAYOUT;
        store.display.previous = Constants.page.LAYOUT;
    }

    newTag() {
        const store = this.props.store;
        getTagList(store).then(() => {
            store.display.page = Constants.page.NEW_TAG;
        });
    }

    getPictureList() {
        const list = persistence.getPictureList();
        return list.then(result => {
            let store = this.props.store;
            store.pictureList = result;
            return 1;
        });
    }

    pickLink() {
        this.getPictureList().then(() => {
            let store = this.props.store;
            store.display.page = Constants.page.PICK_LINK;
        });
    }
    render() {
        const style = {
            display:    "inline-block",
            width:      "14vw",
            border:     "solid 1px black"
        }

        const signOnOffMsg = this.props.store.signon.on ? "Sign Off" : "Sign On/Register";
        
        return <div style={style}>
            <div><button onClick={this.signOnOff}>{signOnOffMsg}</button></div>
            <div><button onClick={this.loadLocal}>Load Local Picture</button></div>
            <div><button onClick={this.loadServer}>Load Server Picture</button></div>
            <div><button onClick={this.newScene}>New Scene</button></div>
            <div><button onClick={this.loadScene}>Load Scene</button></div>
            <div><button onClick={this.newTag}>New Tag</button></div>
            <div><button onClick={this.pickLink}>Link Picture</button></div>
        </div>
    }
};

class Container extends React.Component {
    render() {
        const style = {
            display:            "inline-block",
            verticalAlign:      "top",
            height:             "90.5vh"
        }


        let contents;
        const page = this.props.store.display.page;

        switch (page) {
            case Constants.page.START:
                this.props.store.display.previous = Constants.page.START;
                contents = <Start store={this.props.store}/>;
                break;

            case Constants.page.SIGNON:
            case Constants.page.REGISTER:
                contents = <Signon store={this.props.store}/>
                break;

            case Constants.page.LOCAL_LOAD:
                contents = <LocalLoad store={this.props.store}/>
                break;

            case Constants.page.SCENE_LOAD:
                contents = <SceneLoad store={this.props.store}/>
                break;

            case Constants.page.SERVER_LOAD:
                this.props.store.display.previous = Constants.page.SERVER_LOAD;
                contents = <ServerLoad store={this.props.store}/>
                break;
            
            case Constants.page.SERVER_LAYOUT:
                this.props.store.display.previous = Constants.page.SERVER_LAYOUT;
                contents = <ServerLayout store={this.props.store}/>
                break;

            case Constants.page.CATALOGUE:
                contents = <Catalogue store={this.props.store}/>
                break;

            case Constants.page.EDIT_PICTURE:
                this.props.store.display.previous = Constants.page.EDIT_PICTURE;
                contents = <EditPicture store={this.props.store}/>
                break;

            case Constants.page.LAYOUT:
                this.props.store.display.previous = Constants.page.LAYOUT;
                contents = <Layout store={this.props.store}/>
                break;

            case Constants.page.NEW_TAG:
                contents = <NewTag store={this.props.store}/>
                break;

            case Constants.page.PICK_LINK:
                contents = <PickLink store={this.props.store}/>
                break;

            case Constants.page.LINK_PICTURE:
                contents = <LinkPicture store={this.props.store}/>
                break;

            default: {
                contents = `Internal error, bad page id ${page}`;
            }

        }
        return <div style={style}>
            {contents}
        </div>
    }
}

class Invisible extends React.Component {
    render(){
        const invisible = {
            display:    "none"
        };

        return <div style={invisible}>
            <canvas id="invisible">Not supported</canvas>
        </div>
    }
}

class App extends React.Component {
    render(){
        const signon = this.props.store.signon;
        return <AppBar title='Try These Things' leftIcon='menu'>
            <h2>{signon.on ? signon.name : ""}</h2>
        </AppBar>
    }
};

class Parent extends React.Component {
    render() {

        return <div id ="parent">
            <App store = {this.props.store}/>
            <Container store={this.props.store}/>
            <Invisible />
        </div>
    }
}

ReactDOM.render(<Parent store={store}/>, document.getElementById('bigbox'));

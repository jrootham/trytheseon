import React from "react";
import ReactDOM from "react-dom";

import "./../trytheseon.css"

import {store, Constants, Scene} from "./data";
import Start from "./start";
import Signon from "./signon";
import persistence from "./persistence";
import LocalLoad from "./localLoad";
import ServerlLoad from "./serverBase";
import Catalogue from "./catalogue";
import SaveAs from "./saveAs";
import EditPicture from "./editPicture";
import Layout from "./layout";

class Title extends React.Component{
    render()  {
        const style = {
            textAlign: "center"
        }

        const signon = this.props.store.signon;

        return <div style={style}>
            <h1>Try These</h1>
            <h2>{signon.on ? signon.name : ""}</h2>
        </div>
    }
};

class Before extends React.Component{
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
                redraw();
            });
        }
        else {
            store.display.page = Constants.page.SIGNON;
        }
        redraw();
    }

    loadLocal() {
        let store = this.props.store;
        store.display.page = Constants.page.LOCAL_LOAD;
        redraw();
    }
    
    loadServer() {
        const list = persistence.getPictureList();
        list.then(result => {
            let store = this.props.store;

            store.display.pictureList = result;
            store.display.page = Constants.page.SERVER_LOAD;
            redraw();
        });
        
    }

    newScene() {
        const store = this.props.store;
        store.display.scene = new Scene(Constants.MAX_WIDTH, Constants.MAX_HEIGHT, []);
        store.display.page = Constants.page.LAYOUT;
        store.display.previous = Constants.page.LAYOUT;
        redraw();
    }

    loadScene() {

    }

    render() {
        const style = {
            display:    "inline-block",
            width:      "14vw",
            border:     "solid 1px black"
        }

        const signOnOffMsg = this.props.store.signon.on ? "Sign Off" : "Sign On/Register";
        
        return <div style={style}>
            <div><button onClick={()=> this.signOnOff()}>{signOnOffMsg}</button></div>
            <div><button onClick={()=> this.loadLocal()}>Load Local Picture</button></div>
            <div><button onClick={()=> this.loadServer()}>Load Server Picture</button></div>
            <div><button onClick={()=> this.newScene()}>New Scene</button></div>
            <div><button onClick={()=> this.loadScene()}>Load Scene</button></div>
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

            case Constants.page.SERVER_LAYOUT:
                contents = <ServerLayout store={this.props.store}/>
                break;

            case Constants.page.SERVER_LOAD:
                this.props.store.display.previous = Constants.page.SERVER_LOAD;
                this.props.store.display.next = Constants.page.EDIT_PICTURE;
                contents = <ServerlLoad store={this.props.store}/>
                break;
            
            case Constants.page.SERVER_LAYOUT:
                this.props.store.display.previous = Constants.page.SERVER_LAYOUT;
                this.props.store.display.next = Constants.page.LAYOUT;
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

class Parent extends React.Component {
    render() {

        return <div id ="parent">
            <Title store = {this.props.store}/>
            <Before store = {this.props.store} />
            <Container store={this.props.store}/>
            <Invisible />
        </div>
    }
}

export const redraw = function() {
    ReactDOM.render(<Parent store={store}/>, document.getElementById('bigbox'));
}

redraw();

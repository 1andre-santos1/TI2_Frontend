import React, {Component} from 'react'
import axios from 'axios'

class Image extends Component{
    constructor(props){
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick(){
        this.props.showImagePopup(this.props.id);
    }
    render(){
        return(
            <div className="Image">
                <img src={"https://ipt-ti2-iptgram.azurewebsites.net/api/posts/"+this.props.id+"/image"} onClick={this.handleClick}/>
            </div>
        );
    }
}

export default Image;
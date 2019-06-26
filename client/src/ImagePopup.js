import React,{Component} from 'react'

class ImagePopup extends Component{
    render(){
        return(
            <div className="ImagePopup">
                <img src={this.props.image} />
                <h1>{this.props.user}</h1>
                <h2>{this.props.date}</h2>
                <h3>{this.props.label}</h3>
                <h3>{this.props.likes}</h3>
            </div>
        );
    }
}

export default ImagePopup;
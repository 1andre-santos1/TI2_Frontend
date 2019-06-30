import React,{Component} from 'react'
import './ImagePopup.css'

class ImagePopup extends Component{
    constructor(props){
        super(props);
        this.closePopup = this.closePopup.bind(this);
    }
    closePopup(){
        this.props.closePopup();
    }
    render(){
        return(
            <div className="ImagePopup">
                <img src={this.props.image} />
                <h1>{this.props.user}</h1>
                <h2>{this.props.date}</h2>
                <h3>{this.props.label}</h3>
                <h3>{this.props.likes}</h3>
                {
                    this.props.comments.map(function(c){
                            return([
                                <h4>{c.text}</h4>,
                                <h4>{c.user.name}</h4>,
                                <h4>{c.postedAt}</h4>
                            ]);
                        }.bind(this)
                    )
                }
                <button onClick={this.closePopup}>❌</button>
            </div>
        );
    }
}

export default ImagePopup;
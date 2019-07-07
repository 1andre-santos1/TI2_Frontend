import React, { Component } from 'react'
import './Post.css'

class Post extends Component {
    constructor(props) {
        super(props);
        this.handleLike = this.handleLike.bind(this);
        this.showImagePopup = this.showImagePopup.bind(this);
    }
    handleLike(id) {
        this.props.handleLike(id);
    }
    showImagePopup() {
        this.props.showImagePopup(this.props.id);
    }
    render() {
        return (
            <div className="Post">
                <div className="Post-Body">
                    <img className="Post-Image" src={"https://ipt-ti2-iptgram.azurewebsites.net/api/posts/"+this.props.id+"/image"} onClick={this.showImagePopup}/>
                </div>
                <div className="Post-Footer">
                    <span className="Post-Caption">{this.props.caption}</span>
                    <span className="Post-Like-Btn" onClick={() => this.handleLike(this.props.id)}>🔥 {this.props.likes}</span>
                    <span className="Post-Comments-Number">💬 {this.props.comments}</span>
                    <span className="Post-Username">by {this.props.username}</span>
                    <span className="Post-Date">{this.props.date}</span>
                </div>
            </div>
        );
    }
}

export default Post;
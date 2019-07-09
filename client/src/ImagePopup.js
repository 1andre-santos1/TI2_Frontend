import React, { Component } from 'react'
import './ImagePopup.css'

class ImagePopup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            commentText: ''
        }
        this.closePopup = this.closePopup.bind(this);
        this.handleCommentSubmission = this.handleCommentSubmission.bind(this);
        this.handleCommentChange = this.handleCommentChange.bind(this);
    }
    closePopup() {
        this.props.closePopup();
    }
    handleCommentChange(evt) {
        this.setState({
            commentText: evt.target.value
        });
    }
    handleCommentSubmission(evt) {

        evt.preventDefault();
        this.props.handleCommentSubmission(this.state.commentText, this.props.idPost);
        this.setState({
            commentText: ''
        });
    }
    render() {
        return (
            <div className="ImagePopup">
                <div className="ImagePopup-Container-Left">
                    <img className="ImagePopup-Image" src={this.props.image} />
                </div>
                <div className="ImagePopup-Container-Right">
                    <span className="ImagePopup-Date">{this.props.date.substring(0, this.props.date.indexOf('T'))}</span>
                    <span className="ImagePopup-UserName">{this.props.user}</span>
                    <span>{this.props.label}</span>
                    <hr />
                    <div className="ImagePopup-Container-Comments">
                        {
                            (this.props.comments.length > 0) ?
                            this.props.comments.map(function (c) {
                                return ([
                                    <h4 className="ImagePopup-Comment-User">{c.user.name}</h4>,
                                    <h4 className="ImagePopup-Comment-Text">{c.text}</h4>,
                                    <h4 className="ImagePopup-Comment-Date">{c.postedAt.substring(0, c.postedAt.indexOf('T'))}</h4>
                                ]);
                            }.bind(this)
                            )
                            :
                            <h4 className="ImagePopup-Comment-NoComments">No comments</h4>
                        }
                    </div>
                    <hr/>
                    <span className="ImagePopup-Likes">🔥 {this.props.likes} liked this</span>
                    <hr />
                    <form onSubmit={this.handleCommentSubmission}>
                        <input className="ImagePopup-Comment-Input" type="text" value={this.state.commentText} onChange={this.handleCommentChange} placeholder="New Comment..." />
                    </form>
                </div>
                <div className="ImagePopup-BtnClose" onClick={this.closePopup}>❌</div>
            </div>
        );
    }
}

export default ImagePopup;
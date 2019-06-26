import React, {Component} from 'react'
import axios from 'axios'
import Image from './Image'
import ImagePopup from './ImagePopup';

class PaginaInicial extends Component{
    constructor(props){
        super(props);

        this.state = {
            posts: [],
            isShowingImagePopup: false,
            showcaseImage: {}
        }
        this.showImagePopup = this.showImagePopup.bind(this);
    }
    async componentDidMount(){
        let response = await axios.get('https://ipt-ti2-iptgram.azurewebsites.net/api/posts');
        
        let postsArray = response.data;

        this.setState({
            posts: postsArray
        });
    }
    async showImagePopup(id){

        let response = await axios.get('https://ipt-ti2-iptgram.azurewebsites.net/api/posts/'+id);

        let obj = {
            image: "https://ipt-ti2-iptgram.azurewebsites.net/api/posts/"+id+"/image",
            user: response.data.user.name,
            date: response.data.postedAt,
            label: response.data.caption,
            likes: response.data.likes
        };

        this.setState({
            showcaseImage: obj,
            isShowingImagePopup: true
        })
    }
    render(){
        return(
            <div className="PaginaInicial">
                {
                    this.state.posts.map(function(p){
                        return([
                            <h1>{p.caption}</h1>,
                            <Image id={p.id} showImagePopup={this.showImagePopup}/>,
                            <h2>{p.user.name}</h2>,
                            <h3>{p.postedAt.substring(0,p.postedAt.indexOf("T"))}</h3>,
                            <h4>{p.likes}</h4>,
                            <h4>{p.comments}</h4>
                        ]);
                    }.bind(this))
                }
                {
                    this.state.isShowingImagePopup && 
                    <ImagePopup 
                        image={this.state.showcaseImage.image} 
                        user={this.state.showcaseImage.user}
                        date={this.state.showcaseImage.date}
                        label={this.state.showcaseImage.label}
                        likes={this.state.showcaseImage.likes}
                    />
                }
            </div>
        );
    }
}

export default PaginaInicial;
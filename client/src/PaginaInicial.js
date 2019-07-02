import React, { Component } from 'react'
import axios from 'axios'
import Image from './Image'
import ImagePopup from './ImagePopup';
import './PaginaInicial.css'
import logo from './images/icon.png'
import { Navbar, NavDropdown, Nav, Form, FormControl, Button } from 'react-bootstrap'

class PaginaInicial extends Component {
    constructor(props) {
        super(props);

        this.state = {
            posts: [],
            isShowingImagePopup: false,
            showcaseImage: {},
            searchText: '',
            usernameText: '',
            passwordText: '',
            isAuthenticated: false,
            isShowingCreatePostPopup: false,
            newPostImage: null,
            newPostCaption: ''
        }
        this.showImagePopup = this.showImagePopup.bind(this);
        this.closePopup = this.closePopup.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.searchPost = this.searchPost.bind(this);
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
        this.handleCommentSubmission = this.handleCommentSubmission.bind(this);
        this.handleLike = this.handleLike.bind(this);
        this.handleCreatePost = this.handleCreatePost.bind(this);
        this.handlePostSubmission = this.handlePostSubmission.bind(this);
    }
    async componentDidMount() {
        this.fetchPosts();
    }

    async fetchPosts() {
        let response = await axios.get('https://ipt-ti2-iptgram.azurewebsites.net/api/posts');

        let postsArray = response.data;

        this.setState({
            posts: postsArray
        });
    }

    async showImagePopup(id) {

        let response = await axios.get('https://ipt-ti2-iptgram.azurewebsites.net/api/posts/' + id);

        let obj = {
            idPost: id,
            image: "https://ipt-ti2-iptgram.azurewebsites.net/api/posts/" + id + "/image",
            user: response.data.user.name,
            date: response.data.postedAt,
            label: response.data.caption,
            likes: response.data.likes
        };

        let commentsResponse = await axios.get('https://ipt-ti2-iptgram.azurewebsites.net/api/posts/' + id + '/comments');

        obj.comments = commentsResponse.data;

        this.setState({
            showcaseImage: obj,
            isShowingImagePopup: true
        })
    }
    closePopup() {
        this.setState({
            isShowingImagePopup: false
        });
    }
    async searchPost(e) {
        e.preventDefault();
        let response = await axios.get('https://ipt-ti2-iptgram.azurewebsites.net/api/posts?query=' + this.state.searchText);

        let postsArray = response.data;

        this.setState({
            posts: postsArray,
            searchText: ''
        })
    }
    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    async login(e) {
        e.preventDefault();
        let obj = {
            "userName": this.state.usernameText,
            "password": this.state.passwordText
        };

        let response = await axios.post('https://ipt-ti2-iptgram.azurewebsites.net/api/account/login', obj, {
            withCredentials: true,
            crossdomain: true,
            headers: {
                "Content-Type": "application/json"
            }
        });

        //se nos conseguirmos autenticar
        if (response.status === 200) {
            this.setState({
                usernameText: '',
                passwordText: '',
                isAuthenticated: true
            });
        }
    }
    async logout(e) {
        e.preventDefault()

        let response = await axios.post('https://ipt-ti2-iptgram.azurewebsites.net/api/account/logout', null, {
            withCredentials: true,
            crossdomain: true,
            headers: {
                "Content-Type": "application/json"
            }
        });

        this.setState({
            isAuthenticated: false
        })
    }
    async handleCommentSubmission(comment, idPost) {
        let obj = {
            // ID do post onde publicar o comentário (long, obrigatório)
            "postId": idPost,
            // Texto do comentário (string, obrigatório, máx: 500 chars)
            "text": comment
        };

        let response = await axios.post('https://ipt-ti2-iptgram.azurewebsites.net/api/comments', obj, {
            withCredentials: true,
            crossdomain: true,
            headers: {
                "Content-Type": "application/json"
            }
        });

        //faz um novo pedido pelos comentários do post
        this.showImagePopup(idPost);
    }
    async handleLike(idPost) {
        let response = await axios.post('https://ipt-ti2-iptgram.azurewebsites.net/api/posts/' + idPost + '/like', null, {
            withCredentials: true,
            crossdomain: true,
            headers: {
                "Content-Type": "application/json"
            }
        })
        this.fetchPosts();
    }
    handleCreatePost() {
        this.setState({
            isShowingCreatePostPopup: true
        })
    }
    async handlePostSubmission(evt) {
        evt.preventDefault();
        let obj = {
            "Image": this.state.newPostImage,
            "Metadata": { "caption": this.state.newPostCaption },
        }

        console.log(obj)

        let response = await axios.post('https://ipt-ti2-iptgram.azurewebsites.net/api/posts/', obj, {
            withCredentials: true,
            crossdomain: true,
            headers: {
                "Access-Control-Allow-Origin": "*",
                'Content-Type': 'multipart/form-data'
            }
        });

        console.log(response)
    }
    render() {
        return (
            <div className="PaginaInicial">
                <div className="PaginaInicial-Content" >
                    <Navbar bg="light" expand="lg" className="PaginaInicial-Navbar" sticky="top">
                        <Navbar.Brand>
                            <img src={logo} className="PaginaInicial-Icon"/>
                        </Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        {
                            this.state.isAuthenticated
                                ?
                                <Navbar.Collapse id="basic-navbar-nav" className="PaginaInicial-NavbarCollapse">
                                    <Nav className="mr-auto">
                                        <Nav.Link onClick={this.handleCreatePost}>
                                        Create Post
                                    </Nav.Link>
                                    </Nav>
                                    <Form inline className="PaginaInicial-SearchForm" onSubmit={this.searchPost}>
                                        <FormControl type="text" className="mr-sm-2" placeholder="Search post..." name="searchText" onChange={this.handleChange} value={this.state.searchText} />
                                        <Button variant="outline-success" type="submit">🔍</Button>
                                    </Form>
                                    <Button variant="outline-danger" type="submit" onClick={this.logout}>Logout</Button>
                                </Navbar.Collapse>
                                :
                                <Navbar.Collapse id="basic-navbar-nav" className="PaginaInicial-NavbarCollapse">
                                    <Form inline className="PaginaInicial-LoginForm" onSubmit={this.login}>
                                        <FormControl type="text" placeholder="Search" className="mr-sm-2" type="text" onChange={this.handleChange} name="usernameText" value={this.state.usernameText} />
                                        <FormControl type="password" placeholder="Password" onChange={this.handleChange} name="passwordText" value={this.state.passwordText} />
                                        <Button variant="outline-success" type="submit">Login</Button>
                                    </Form>
                                </Navbar.Collapse>
                        }
                    </Navbar>
                    {
                        this.state.isShowingCreatePostPopup &&
                        <div className="PaginaInicial-CreatePostPopup">
                            <form onSubmit={this.handlePostSubmission}>
                                <label>Your Image</label><input type="file" value={this.state.newPostImage} onChange={this.handleChange} name="newPostImage" />
                                <label>Your description</label><input type="text" value={this.state.newPostCaption} onChange={this.handleChange} name="newPostCaption" />
                                <button type="submit">Add Post</button>
                            </form>
                        </div>
                    }
                    {
                        this.state.posts.map(function (p) {
                            return ([
                                <h1>{p.caption}</h1>,
                                <Image id={p.id} showImagePopup={this.showImagePopup} />,
                                <h2>{p.user.name}</h2>,
                                <h3>{p.postedAt.substring(0, p.postedAt.indexOf("T"))}</h3>,
                                <button onClick={() => this.handleLike(p.id)} >{"👍 " + p.likes}</button>,
                                <h4>{p.comments}</h4>
                            ]);
                        }.bind(this))
                    }

                </div>
                {
                    this.state.isShowingImagePopup &&
                    <ImagePopup
                        idPost={this.state.showcaseImage.idPost}
                        image={this.state.showcaseImage.image}
                        user={this.state.showcaseImage.user}
                        date={this.state.showcaseImage.date}
                        label={this.state.showcaseImage.label}
                        likes={this.state.showcaseImage.likes}
                        comments={this.state.showcaseImage.comments}
                        closePopup={this.closePopup}
                        handleCommentSubmission={this.handleCommentSubmission}
                    />
                }
            </div>
        );
    }
}

export default PaginaInicial;
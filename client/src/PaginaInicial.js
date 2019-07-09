import React, { Component } from 'react'
import axios from 'axios'
import ImagePopup from './ImagePopup'
import Post from './Post'
import './PaginaInicial.css'
import logo from './images/icon.png'
import logoWithoutText from './images/logo.png'
import CarouselImage1 from './images/carousel01.jpg'
import CarouselImage2 from './images/carousel02.jpg'
import GreetingImage1 from './images/greeting1.jpg'

import { Navbar, NavDropdown, Nav, Form, FormControl, Button,Carousel,CarouselItem } from 'react-bootstrap'

class PaginaInicial extends Component {
    constructor(props) {
        super(props);

        this.state = {
            posts: [], //lista de posts a mostrar na página
            isShowingImagePopup: false, //está a mostrar o popup?
            showcaseImage: {}, //objeto que contém info da imagem que aparece no popup
            searchText: '', //texto do input de pesquisa
            usernameText: '', //texto do input username
            passwordText: '', //texto do input password
            isAuthenticated: false, //o utilizador está autenticado?
            isShowingCreatePostPopup: false, //o popup de criar um post está a ser mostrado?
            newPostImage: null, //imagem do novo post
            newPostCaption: '' //descrição do novo post
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
    //ao iniciar este component
    async componentDidMount() {
        //inicia o evento de "animação" da navbar
        window.addEventListener("scroll", this.resizeNavbarOnScroll);

        //faz fetch de todos os posts a mostrar
        this.fetchPosts();
    }
    //função de resize da navbar
    resizeNavbarOnScroll() {
        const distanceY = window.pageYOffset || document.documentElement.scrollTop,
          shrinkOn = 200,
          navbarEl = document.getElementsByClassName("PaginaInicial-Navbar")[0],
          navbarImage = document.getElementsByClassName("PaginaInicial-Icon")[0];
    
        if (distanceY > shrinkOn) {
          navbarEl.classList.add("smallerNavbar");
          navbarEl.classList.remove("biggerNavbar");
          navbarImage.src=logoWithoutText;
          navbarImage.classList.add("smallerIcon");
        } else {
          navbarEl.classList.remove("smallerNavbar");
          navbarEl.classList.add("biggerNavbar");
          navbarImage.src=logo;
          navbarImage.classList.remove("smallerIcon");
        }
      }
    //função de fetch de todos os posts
    async fetchPosts() {
        //faz um get à API por todos os posts
        let response = await axios.get('http://localhost:5000/api/posts/');

        //cria um array que conterá a lista de posts
        let postsArray = response.data;

        //muda o estado posts para este array
        this.setState({
            posts: postsArray
        });
    }

    //função que mostra o popup tendo o id do post
    async showImagePopup(id) {

        //faz um get à API pelo post
        let response = await axios.get('http://localhost:5000/api/posts/' + id);

        //cria um novo objeto a mostrar no popup, com a informação do GET
        let obj = {
            idPost: id,
            image: "http://localhost:5000/api/posts/" + id + "/image",
            user: response.data.user.name,
            date: response.data.postedAt,
            label: response.data.caption,
            likes: response.data.likes
        };

        //vai buscar todos os comentários do post à API
        let commentsResponse = await axios.get('http://localhost:5000/api/posts/' + id + '/comments');

        //atribui ao objeto do popup um atributo comments que contém a lista de comentários
        obj.comments = commentsResponse.data;

        //muda o estado do objeto imagem a mostrar (showcaseImage) para obj e mostra o popup
        this.setState({
            showcaseImage: obj,
            isShowingImagePopup: true
        })
    }
    //função que fecha o popup mudando o estado da variável respetiva
    closePopup() {
        this.setState({
            isShowingImagePopup: false
        });
    }
    //função que pesquisa por um post especifica (tendo em conta uma query)
    async searchPost(e) {
        //evita o evento de refresh na página
        e.preventDefault();

        //faz query por um post tendo em conta o texto do estado de pesquisa
        let response = await axios.get('http://localhost:5000/api/posts?query=' + this.state.searchText);
        
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

        let response = await axios.post('https://ipt-ti2-iptgram.azurewebsites.net/api/posts/', obj, {
            withCredentials: true,
            crossdomain: true,
            headers: {
                "Access-Control-Allow-Origin": "*",
                'Content-Type': 'multipart/form-data'
            }
        });
    }
    render() {
        return (
            <div className="PaginaInicial">
                <div className="PaginaInicial-Content" >
                    <Navbar bg="light" expand="lg" className="PaginaInicial-Navbar" sticky="top">
                        <Navbar.Brand>
                            <img src={logo} className="PaginaInicial-Icon" />
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
                                        <FormControl type="text" placeholder="Username" className="mr-sm-2" type="text" onChange={this.handleChange} name="usernameText" value={this.state.usernameText} />
                                        <FormControl type="password" placeholder="Password" onChange={this.handleChange} name="passwordText" value={this.state.passwordText} />
                                        <Button variant="outline-success" type="submit">Login</Button>
                                    </Form>
                                </Navbar.Collapse>
                        }
                    </Navbar>
                    {
                        this.state.isAuthenticated
                            ?
                            (
                                this.state.isShowingCreatePostPopup &&
                                <div className="PaginaInicial-CreatePostPopup">
                                    <form onSubmit={this.handlePostSubmission}>
                                        <label>Your Image</label><input type="file" value={this.state.newPostImage} onChange={this.handleChange} name="newPostImage" />
                                        <label>Your description</label><input type="text" value={this.state.newPostCaption} onChange={this.handleChange} name="newPostCaption" />
                                        <button type="submit">Add Post</button>
                                    </form>
                                </div> ,
                                this.state.posts.map(p =>
                                     <Post 
                                        caption={p.caption}
                                        id={p.id}
                                        showImagePopup={this.showImagePopup}
                                        username={p.user.name}
                                        date={p.postedAt.substring(0, p.postedAt.indexOf("T"))}
                                        handleLike={this.handleLike}
                                        likes={p.likes}
                                        comments={p.comments}
                                     />
                                )
                            )
                            :
                                <div>
                            <Carousel className="PaginaInicial-Carousel">
                                <Carousel.Item>
                                    <img className="d-block w-100 PaginaInicial-CarouselImage" src={CarouselImage1} alt="First slide"/>
                                    <Carousel.Caption>
                                        <h3>Welcome to glimpser</h3>
                                        <p>Live a life full of images with glimpser</p>
                                    </Carousel.Caption>
                                </Carousel.Item>
                                <Carousel.Item>
                                    <img
                                        className="d-block w-100 PaginaInicial-CarouselImage"
                                        src={CarouselImage2}
                                        alt="Third slide"
                                    />
                                    <Carousel.Caption>
                                        <h3>Quote of the day</h3>
                                        <p>Photography is a love affair with life</p>
                                    </Carousel.Caption>
                                </Carousel.Item>
                            </Carousel>
                            <div className="PaginaInicial-Greeting">
                                <img className="PaginaInicial-GreetingImage" src={GreetingImage1} />
                                <span className="PaginaInicial-GreetingText">
                                    "With glimpser I can upload my favorite photos anywhere at anytime..."
                                </span>
                            </div>
                            </div>
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
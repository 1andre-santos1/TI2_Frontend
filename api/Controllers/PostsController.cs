using System.Collections.Generic;
using System.Threading.Tasks;
using IPTGram.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace IPTGram.Controllers
{
    [Route("api/[controller]")]
    public class PostsController : Controller
    {
        private readonly IPTGramDb _context;
        public PostsController(IPTGramDb context)
        {
            _context = context;
        }

        // GET: api/posts
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PostSimple>>> GetPosts()
        {
            //vai buscar todos os posts à base de dados
            var posts = await _context.Posts.ToListAsync();
            //cria uma nova lista de posts a mostrar
            var postsToShow = new List<PostSimple>();
            //para cada post na base de dados
            foreach (var post in posts)
            {
                //vai buscar o user referente a este post, tendo em conta o seu id
                var user = await _context.Users.FindAsync(post.UserId);
                //cria um novo userSimple, que conterá apenas as informações relevantes do utilizador
                var userSimple = new UserSimple() { 
                    Id = user.Id, Name = user.Name, UserName = user.UserName, IsCurrentUser = User.Identity.IsAuthenticated 
                };
                //cria um novo postSimple que conterá apenas as informações relevantes do post
                var postToShow = new PostSimple() { 
                    Caption = post.Caption, Id = post.Id, Comments = post.Comments.Count, IsLiking = false, Likes = post.Likes.Count, PostedAt = post.PostedAt, User = userSimple
                };
                //adiciona à lista de posts a mostrar este post (postSimple)
                postsToShow.Add(postToShow);
            }
            //retorna todos os posts a mostrar (neste caso só com as informações relevantes)
            return postsToShow;
        }

        // GET: api/posts/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PostSimple>> GetPost(long id)
        {
            var post = await _context.Posts.FindAsync(id);

            if (post == null)
            {
                return NotFound();
            }

            var user = await _context.Users.FindAsync(post.UserId);
            var userPost = new UserSimple() { Id = user.Id, Name = user.Name, UserName = user.UserName, IsCurrentUser = User.Identity.IsAuthenticated };
            var postToShow = new PostSimple() { Caption = post.Caption, Id = post.Id, Comments = post.Comments.Count, IsLiking = false, Likes = post.Likes.Count, PostedAt = post.PostedAt, User = userPost };

            return postToShow;
        }
    }
}
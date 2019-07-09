using System.Collections.Generic;
using System.Threading.Tasks;
using IPTGram.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.IO;

namespace IPTGram.Controllers
{
    [Route("api/[controller]")]
    public class PostsController : ControllerBase
    {
        private readonly IPTGramDb _context;
        public PostsController(IPTGramDb context)
        {
            _context = context;
        }

        //Obtém todos posts que contenham um certo tipo de caption ou todos se não existir query
        // GET: api/posts
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PostSimple>>> GetPosts(string query)
        {
            //se a query existir
            if(!string.IsNullOrEmpty(query))
            {
                //vamos buscar à db todos os posts que contenham na caption a query, criando novos PostSimple com as respetivas informações
                var postsToShow = await _context.Posts
                    .Where(post => post.Caption.ToLowerInvariant().Contains(query.ToLowerInvariant()))
                    .Select(post => new PostSimple()
                {
                    Caption = post.Caption, 
                    Id = post.Id, 
                    Comments = post.Comments.Count, 
                    IsLiking = false, 
                    Likes = post.Likes.Count, 
                    PostedAt = post.PostedAt, 
                    User = new UserSimple()
                    {
                        Id = post.User.Id, 
                        Name = post.User.Name,
                        UserName = post.User.UserName, 
                        IsCurrentUser = User.Identity.IsAuthenticated 
                    }
                }).ToListAsync();

                //se não forem encontrados posts retornamos NotFound
                if(postsToShow == null)
                    return NotFound();

                //se tudo correr bem retornamos os posts
                return Ok(postsToShow);
            }
            //se não existir query
            else
            {
                //vamos buscar todos os posts criando novos PostSimple com as respetivas informações
                var postsToShow = await _context.Posts
                .Select(post => new PostSimple()
                {
                    Caption = post.Caption, 
                    Id = post.Id, 
                    Comments = post.Comments.Count, 
                    IsLiking = false, 
                    Likes = post.Likes.Count, 
                    PostedAt = post.PostedAt, 
                    User = new UserSimple()
                    {
                        Id = post.User.Id, 
                        Name = post.User.Name,
                        UserName = post.User.UserName, 
                        IsCurrentUser = User.Identity.IsAuthenticated 
                    }
                }).ToListAsync();

                //se não existirem post retornamos NotFound
                if(postsToShow == null)
                    return NotFound();

                //se tudo correr bem retornamos os posts
                return Ok(postsToShow);
            }
        }

        //Obtém um post especifico tendo em conta o seu id
        // GET: api/posts/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<PostSimple>> GetPost(long id)
        {
            //vai buscar à db o primeiro post que tiver este id, criando um PostSimple com as respetivas informações
            var postToShow = await _context.Posts
                .Select(post => new PostSimple()
             {
                    Caption = post.Caption, 
                    Id = post.Id, 
                    Comments = post.Comments.Count, 
                    IsLiking = false, 
                    Likes = post.Likes.Count, 
                    PostedAt = post.PostedAt, 
                    User = new UserSimple()
                    {
                        Id = post.User.Id, 
                        Name = post.User.Name,
                        UserName = post.User.UserName, 
                        IsCurrentUser = User.Identity.IsAuthenticated 
                    }
            }).FirstOrDefaultAsync(p => p.Id == id);

            //se o post for nulo retornamos NotFound
            if(postToShow == null)
                return NotFound();

            //se tudo correr bem retornamos o post
            return Ok(postToShow);
        }
        //Obtém uma imagem tendo em conta o id do post
        //GET: api/posts/{id}/image
        [HttpGet("{id}/image")]
        public async Task<ActionResult> GetPostImage(long id)
        {
            //vai buscar o post correspondente ao id
            var post = await _context.Posts.FirstOrDefaultAsync(p => p.Id == id);

            //se o post não existir retorna NotFound
            if(post == null)
                return NotFound();
            
            //retorna a imagem
            return PhysicalFile(Path.GetFullPath(Path.Combine("images", post.ImageFileName)), post.ImageContentType);
        }
        //Obtém os comentários de um determinado post
        //GET: api/posts/{id}/comments
        [HttpGet("{id}/comments")]
        public async Task<ActionResult<IEnumerable<CommentSimple>>> GetPostComments(long id)
        {
            //vai buscar todos os comentários de um determinado post e cria para cada um deles um CommentSimple
            var comments = await _context.Comments
                .Where(comment => comment.PostId == id)
                .Select(comment => new CommentSimple(){
                    Id = comment.Id,
                    Text = comment.Text,
                    PostedAt = comment.PostedAt,
                    User = new UserSimple()
                    {
                        Id = comment.UserId,
                        Name = comment.User.Name,
                        UserName = comment.User.UserName,
                        IsCurrentUser = User.Identity.IsAuthenticated
                    },
                    PostId = id
            }).ToListAsync();

            //se comments for nulo retorna NotFound
            if(comments == null)
                return NotFound();

            //se tudo correr bem retorna os comentários
            return comments;
        }
    }
}
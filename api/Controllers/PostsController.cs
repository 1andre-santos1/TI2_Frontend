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

            return Ok(postsToShow);
        }

        // GET: api/posts/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<PostSimple>> GetPost(long id)
        {
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

            if(postToShow == null)
                return NotFound();

            return Ok(postToShow);
        }
        //GET: api/posts/{id}/image
        [HttpGet("{id}/image")]
        public async Task<ActionResult> GetPostImage(long id)
        {
            var post = await _context.Posts.FirstOrDefaultAsync(p => p.Id == id);

            if(post == null)
                return NotFound();
                
            return PhysicalFile(Path.GetFullPath(Path.Combine("images", post.ImageFileName)), post.ImageContentType);
        }
    }
}
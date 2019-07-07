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

        // GET: api/posts
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PostSimple>>> GetPosts(string query)
        {
            if(!string.IsNullOrEmpty(query))
            {
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

                if(postsToShow == null)
                    return NotFound();

                return Ok(postsToShow);
            }
            else
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

                if(postsToShow == null)
                    return NotFound();

                return Ok(postsToShow);
            }
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
        //GET: api/posts/{id}/comments
        [HttpGet("{id}/comments")]
        public async Task<ActionResult<IEnumerable<CommentSimple>>> GetPostComments(long id)
        {
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

            if(comments == null)
                return NotFound();

            return comments;
        }
    }
}
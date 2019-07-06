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
        public async Task<ActionResult<IEnumerable<Post>>> GetPosts()
        {
            return await _context.Posts.ToListAsync();
        }

        // GET: api/posts/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Post>> GetPost(long id)
        {
            var post = await _context.Posts.FindAsync(id);

            if (post == null)
            {
                return NotFound();
            }

            return post;
        }
    }
}
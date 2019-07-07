using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace IPTGram.Data
{
    public class UserSimple
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string UserName { get; set; }
        public bool IsCurrentUser { get; set; }
    }
}
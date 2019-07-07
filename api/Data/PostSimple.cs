using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IPTGram.Data
{
    public class PostSimple
    {
        public long Id { get; set; }

        public string Caption { get; set; }

        public DateTimeOffset PostedAt { get; set; }

        public UserSimple User {get;set;}
        public int Likes {get;set;}
        public Boolean IsLiking {get;set;}
        public int Comments {get;set;}
    }
}
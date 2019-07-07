using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IPTGram.Data
{
    public class CommentSimple
    {
        public long Id { get; set; }

        public string Text { get; set; }

        public DateTimeOffset PostedAt { get; set; }

        public UserSimple User {get;set;}

        public long PostId {get; set; }
    }
}
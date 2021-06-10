using Microsoft.AspNetCore.Http;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Data.Entities
{
    public class Employee
    {
        [Key]
        public Guid Id { get; set; }
        [MaxLength(50)]
        public string Fullname { get; set; }
        [MaxLength(50)]
        public string Occupation { get; set; }
        [MaxLength(100)]
        public string ImageName { get; set; }
        [NotMapped] // does not create column in database
        public IFormFile ImageFile { get; set; }
        [NotMapped]
        public string ImageSrc { get; set; }
    }
}

﻿using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace ChessClubBurgas64.Web.Models.AccountModels
{
    public class RegisterInputModel
    {
        [EmailAddress]
        public required string Email { get; set; }

        [PasswordPropertyText]
        [RegularExpression("(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{4,8}$", ErrorMessage = "Паролата трябва да бъде сигурна!")]
        public required string Password { get; set; }

        [PasswordPropertyText]
        public required string RepeatPassword { get; set; }
    }
}

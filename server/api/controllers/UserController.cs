using infra.Entities;
using Microsoft.AspNetCore.Mvc;
using service;

namespace api.controllers;

public class UserController(UserService service) : ControllerBase
{
    [HttpGet(nameof(GetUsers))]
    public List<User> GetUsers()
    {
        return service.GetUsers();
    }

}
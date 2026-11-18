using infra.data;
using infra.Entities;

namespace api.controllers;

public class UserService(AppDataConnection db)
{
    public List<User> GetUsers()
    {
        return db.Users.ToList();
    }
}
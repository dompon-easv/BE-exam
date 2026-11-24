using infra.data;
using infra.Entities;

namespace service;

public class UserService(AppDataConnection db)
{
    public List<User> GetUsers()
    {
        return db.Users.ToList();
    }
}
using System.Security.Cryptography;
using System.Text;
using Konscious.Security.Cryptography;

namespace service.Security;

public class Argon2PasswordHasher : IPasswordHasher
{
    
    public string HashPassword(string password,string salt)
    {
        // Convert password string into raw bytes for cryptographic processing  
        byte[] passwordBytes = Encoding.UTF8.GetBytes(password);
        
        using var argon2 = new Argon2id(passwordBytes);
        
        // Decode and assign the Base64 salt      
        argon2.Salt = Convert.FromBase64String(salt);
        // Configure OWASP parameters: 64 MB memory cost, 3 iterations, 4 threads             
        argon2.MemorySize = 64 * 1024;
        argon2.Iterations = 3;
        argon2.DegreeOfParallelism = 4;
        
        // Derive 32 bytes (256 bits) of key material and encode to Base64    
        string hash = Convert.ToBase64String(argon2.GetBytes(32));

        // Return combined hash and salt for single-column database storage  
        return $"{hash}.{salt}";
    }

    public string HashAndSaltPassword(string password)
    {
        // Generate 16 cryptographically random salt bytes using OS kernel entropy   
        byte[] salt = RandomNumberGenerator.GetBytes(16);
        return HashPassword(password, Convert.ToBase64String(salt));
    }

    public bool VerifyHashedPassword(string password, string hashedPassword)
    {
        // Split the stored string into hash and salt segments   
        string[] parts = hashedPassword.Split('.');
        if (parts.Length != 2) return false;

        string storedHash = parts[0];
        string salt = parts[1];

        // Recompute the hash of the candidate password with the stored salt     
        string computed = HashPassword(password, salt);
        string computedHash = computed.Split('.')[0];

        // Compare bytes in constant time to prevent side-channel timing attacks  
        byte[] expectedBytes = Convert.FromBase64String(storedHash);
        byte[] actualBytes = Convert.FromBase64String(computedHash);

        return CryptographicOperations.FixedTimeEquals(expectedBytes, actualBytes);
    }
}
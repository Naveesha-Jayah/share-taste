package backend.Service;

import backend.Model.User;
import backend.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User getOrCreateUser(String email, String name, String imageUrl) {
        return userRepository.findByEmail(email).orElseGet(() -> {
            User u = new User();
            u.setEmail(email);
            u.setName(name);
            u.setImageUrl(imageUrl);
            return userRepository.save(u);
        });
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public void followUser(String email, Long idToFollow) {
        User user = userRepository.findByEmail(email).orElseThrow();
        User toFollow = userRepository.findById(idToFollow).orElseThrow();
        user.getFollowing().add(toFollow);
        userRepository.save(user);
    }

    public void unfollowUser(String email, Long idToUnfollow) {
        User user = userRepository.findByEmail(email).orElseThrow();
        User toUnfollow = userRepository.findById(idToUnfollow).orElseThrow();
        user.getFollowing().remove(toUnfollow);
        userRepository.save(user);
    }
}

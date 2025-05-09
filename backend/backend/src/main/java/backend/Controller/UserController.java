package backend.Controller;

import backend.Model.User;
import backend.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/me")
    public User getProfile(@AuthenticationPrincipal OAuth2User oauthUser) {
        return userService.getOrCreateUser(
            oauthUser.getAttribute("email"),
            oauthUser.getAttribute("name"),
            oauthUser.getAttribute("picture")
        );
    }

    @GetMapping("/")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @PostMapping("/{id}/follow")
    public void follow(@AuthenticationPrincipal OAuth2User user, @PathVariable Long id) {
        userService.followUser(user.getAttribute("email"), id);
    }

    @PostMapping("/{id}/unfollow")
    public void unfollow(@AuthenticationPrincipal OAuth2User user, @PathVariable Long id) {
        userService.unfollowUser(user.getAttribute("email"), id);
    }
}

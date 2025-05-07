import { useEffect, useState } from "react";
import axios from "axios";

function UserList() {
  const [users, setUsers] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get current user info (to determine follow state)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userRes = await axios.get("http://localhost:8080/api/users/me", {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setCurrentUserId(userRes.data.id);

        const res = await axios.get("http://localhost:8080/api/users", {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUsers(res.data);
      } catch (err) {
        setError("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const follow = async (id) => {
    try {
      await axios.post(
        `http://localhost:8080/api/users/${id}/follow`,
        {},
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      updateFollowState(id, true);
    } catch (err) {
      console.error("Follow error", err);
    }
  };

  const unfollow = async (id) => {
    try {
      await axios.post(
        `http://localhost:8080/api/users/${id}/unfollow`,
        {},
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      updateFollowState(id, false);
    } catch (err) {
      console.error("Unfollow error", err);
    }
  };

  const updateFollowState = (id, isFollowing) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id ? { ...user, isFollowed: isFollowing } : user
      )
    );
  };

  if (loading) return <p>Loading users...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={styles.container}>
      <h2>Explore Users</h2>
      <div style={styles.grid}>
        {users
          .filter((u) => u.id !== currentUserId)
          .map((u) => (
            <div key={u.id} style={styles.card}>
              <img
                src={u.imageUrl || "https://via.placeholder.com/100"}
                alt={u.name}
                style={styles.avatar}
              />
              <h3>{u.name}</h3>
              <p style={{ color: "#555" }}>{u.email}</p>
              {u.isFollowed ? (
                <button style={styles.unfollowBtn} onClick={() => unfollow(u.id)}>
                  Unfollow
                </button>
              ) : (
                <button style={styles.followBtn} onClick={() => follow(u.id)}>
                  Follow
                </button>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "900px",
    margin: "auto",
    padding: "30px 20px",
    fontFamily: "Arial, sans-serif",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "20px",
  },
  card: {
    padding: "20px",
    borderRadius: "10px",
    backgroundColor: "#f9f9f9",
    textAlign: "center",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  },
  avatar: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    objectFit: "cover",
    marginBottom: "15px",
  },
  followBtn: {
    backgroundColor: "#007bff",
    color: "#fff",
    padding: "8px 16px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  unfollowBtn: {
    backgroundColor: "#dc3545",
    color: "#fff",
    padding: "8px 16px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default UserList;

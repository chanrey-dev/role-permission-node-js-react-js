import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editUser, setEditUser] = useState({ name: "", role_id: "" });

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Delete this user?")) {
      await api.delete(`/users/${id}`);
      fetchUsers();
    }
  };

  const startEdit = (user) => {
    setEditId(user.id);
    setEditUser({ name: user.name, role_id: user.role_id || "" });
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditUser({ name: "", role_id: "" });
  };

  const handleUpdate = async () => {
    await api.put(`/users/${editId}`, editUser);
    fetchUsers();
    cancelEdit();
  };

  const handleChange = (e) => {
    setEditUser({ ...editUser, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <h2>All Users</h2>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>name</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>
                {editId === u.id ? (
                  <input
                    name="name"
                    value={editUser.name}
                    onChange={handleChange}
                  />
                ) : (
                  u.name
                )}
              </td>
              <td>
                {editId === u.id ? (
                  <input
                    name="role_id"
                    value={editUser.role_id}
                    onChange={handleChange}
                  />
                ) : (
                  u.role
                )}
              </td>
              <td>
                {editId === u.id ? (
                  <>
                    <button onClick={handleUpdate}>Save</button>
                    <button onClick={cancelEdit}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEdit(u)}>Edit</button>
                    <button onClick={() => handleDelete(u.id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;

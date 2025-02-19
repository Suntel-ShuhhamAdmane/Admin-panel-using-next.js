"use client";
import { useState, useEffect } from "react";

interface User {
  id: number;
  name: string;
  email: string;
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({ name: "", email: "" });

  useEffect(() => {
    fetch("/user.json")
      .then((res) => res.json())
      .then((data: User[]) => setUsers(data))
      .catch((err) => console.error("Error loading users:", err));
  }, []);

  const handleEdit = (user: User) => {
    setEditingUser(user);
  };

  const handleDelete = (id: number) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  const handleSave = () => {
    if (editingUser) {
      setUsers(users.map((user) => (user.id === editingUser.id ? editingUser : user)));
      setEditingUser(null);
    }
  };

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) return;
    const newUserEntry: User = { id: users.length + 1, ...newUser };
    setUsers([...users, newUserEntry]);
    setNewUser({ name: "", email: "" });
  };

  return (
    <div className="w-3/4 p-5">
      <h2 className="text-2xl mb-4">User Management</h2>

      <div className="mb-5 flex gap-2">
        <input
          type="text"
          placeholder="Name"
          className="border p-2 rounded"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          className="border p-2 rounded"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
        />
        <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleAddUser}>
          Add User
        </button>
      </div>

      <table className="w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="text-center">
              <td className="p-2 border">{user.id}</td>
              <td className="p-2 border">
                {editingUser?.id === user.id ? (
                  <input
                    type="text"
                    value={editingUser.name}
                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                    className="border p-1 rounded"
                  />
                ) : (
                  user.name
                )}
              </td>
              <td className="p-2 border">
                {editingUser?.id === user.id ? (
                  <input
                    type="email"
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    className="border p-1 rounded"
                  />
                ) : (
                  user.email
                )}
              </td>
              <td className="p-2 border flex justify-center gap-2">
                {editingUser?.id === user.id ? (
                  <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={handleSave}>
                    Save
                  </button>
                ) : (
                  <>
                    <button className="bg-yellow-500 text-white px-3 py-1 rounded" onClick={() => handleEdit(user)}>
                      Edit
                    </button>
                    <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => handleDelete(user.id)}>
                      Delete
                    </button>
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

export default UserManagement;

import React, { useState, useEffect } from 'react';

const UserPages = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingUser , setEditingUser ] = useState(null); // Stores the user being edited
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    userType: 'staff'
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found, redirecting to login.");
        window.location.href = "/login";
        return;
      }

      const response = await fetch("http://localhost:4000/api/admin/user-list", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 401 || response.status === 403) {
        console.error("Unauthorized access, redirecting to login.");
        localStorage.removeItem("token");
        window.location.href = "/login";
        return;
      }

      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error("Error fetching user list:", error);
      setMessage({ type: "error", text: error.message });
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const url = editingUser  
        ? `http://localhost:4000/api/admin/update-user/${editingUser ._id}`
        : "http://localhost:4000/api/admin/create-user";

      const method = editingUser  ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Operation failed');

      setMessage({ type: 'success', text: editingUser  ? 'User  updated successfully!' : 'User  created successfully!' });
      setFormData({ username: '', password: '', userType: 'staff' });
      setShowForm(false);
      setEditingUser (null);
      fetchUsers(); // Refresh user list
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  const handleDeleteUser  = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`http://localhost:4000/api/admin/delete-user/${userId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to delete user");

      setMessage({ type: "success", text: "User  deleted successfully!" });
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    }
  };

  const handleEditUser  = (user) => {
    setEditingUser (user);
    setFormData({
      username: user.username,
      password: '', // Leave blank for security reasons
      userType: user.userType,
    });
    setShowForm(true);
  };

  return (
    <div className="p-6 ml-64">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-700">User  Management</h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingUser (null);
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          {showForm ? 'Close Form' : 'Add User'}
        </button>
      </div>

      {message.text && (
        <div className={`p-4 rounded-md mb-4 ${message.type === 'success'
            ? 'bg-green-100 text-green-700'
            : 'bg-red-100 text-red-700'
          }`}>
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Password</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User  Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Array.isArray(users) && users.map((user, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">{user.username}</td>
                <td className="px-6 py-4 whitespace-nowrap">••••••••</td> {/* Masked password */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.userType === 'staff' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'}`}>
                    {user.userType}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button onClick={() => handleEditUser (user)} className="text-blue-600 hover:text-blue-900 mr-4">
                    Edit
                  </button>
                  <button onClick={() => handleDeleteUser (user._id)} className="text-red-600 hover:text-red-900">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-96">
            <h2 className="text-xl font-bold mb-4 text-gray-700">{editingUser  ? 'Edit User' : 'Create New User'}</h2>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
              <input
                type="password" // Keep it as password type for security
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required={!editingUser } // Password is required only when creating a new user
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">User  Type</label>
              <select
                name="userType"
                value={formData.userType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="staff">Staff</option>
                <option value="account">Account</option>
              </select>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                {editingUser  ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default UserPages;
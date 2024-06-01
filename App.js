import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', password: '', dob: '' });
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3000/users')
      .then(response => setUsers(response.data))
      .catch(error => console.error(error));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingUser) {
      axios.put(`http://localhost:3000/users/${editingUser.id}`, form)
        .then(() => {
          setUsers(users.map(user => user.id === editingUser.id ? { ...user, ...form } : user));
          setEditingUser(null);
          setForm({ name: '', email: '', password: '', dob: '' });
        })
        .catch(error => console.error(error));
    } else {
      axios.post('http://localhost:3000/users', form)
        .then(response => {
          setUsers([...users, response.data]);
          setForm({ name: '', email: '', password: '', dob: '' });
        })
        .catch(error => console.error(error));
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setForm(user);
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:3000/users/${id}`)
      .then(() => setUsers(users.filter(user => user.id !== id)))
      .catch(error => console.error(error));
  };

  return (
    <div className="App">
      <h1>User Management</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" value={form.name} onChange={handleInputChange} required />
        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleInputChange} required />
        <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleInputChange} required />
        <input type="date" name="dob" placeholder="Date of Birth" value={form.dob} onChange={handleInputChange} required />
        <button type="submit">{editingUser ? 'Update' : 'Add'} User</button>
      </form>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.name} - {user.email} - {user.dob}
            <button onClick={() => handleEdit(user)}>Edit</button>
            <button onClick={() => handleDelete(user.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

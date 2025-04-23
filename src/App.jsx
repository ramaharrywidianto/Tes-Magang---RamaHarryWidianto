import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const GroupList = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newGroup, setNewGroup] = useState({
    group_id: -1,
    group_name: '',
    active: false
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        'http://192.168.1.201:5003/api/group/list',
        {
          id: '',
          name: '',
          active: ''
        },
        {
          params: { p: 1 },
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      const data = response.data.response?.data || [];
      setGroups(data);
    } catch  {
      setError('Failed to fetch data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewGroup((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://192.168.1.201:5003/api/group/add',
        {
          group_id: -1,
          group_name: newGroup.group_name,
          active: newGroup.active ? 'yes' : 'no'
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      setNewGroup({ group_id: -1, group_name: '', active: false });
      fetchData();
    } catch (err) {
      console.error('Error creating group:', err);
      alert('Gagal menambah data.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Group List</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <h2>Tambah Group</h2>
        <div>
          <label>Nama: </label>
          <input
            type="text"
            name="group_name"
            value={newGroup.group_name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Aktif: </label>
          <input
            type="checkbox"
            name="active"
            checked={newGroup.active}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit">Tambah</button>
      </form>

      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nama</th>
            <th>Aktif</th>
          </tr>
        </thead>
        <tbody>
          {groups.map((group, i) => (
            <tr key={group.group_id || i}>
              <td>{group.group_id}</td>
              <td>{group.group_name}</td>
              <td>{group.active === 'yes' ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GroupList;

'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [users, setUsers] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const showMessage = (text: string) => {
    setMessage(text);
    setTimeout(() => setMessage(''), 3000);
  }

  const fetchUsers = async () => {
    const res = await fetch(`${API_URL}/users`);
    setUsers(await res.json());
  };

  const createUser = async () => {
    if (!name) return;

    setLoading(true);
    await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });

    showMessage('Usuário criado com sucesso!');
    setName('');
    fetchUsers();
    setLoading(false);
  };

  const deleteUser = async (id: number) => {
    if (!confirm('Deseja realmente excluir este usuário?')) return;

    setLoading(true);
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    showMessage('Usuário excluído com sucesso!');
    fetchUsers();
    setLoading(false);
  };

  const startEdit = (user: any) => {
    setEditingId(user.id);
    setName(user.name);
  };

  const updateUser = async () => {
    setLoading(true);
    await fetch(`${API_URL}/${editingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });

    showMessage('Usuário atualizado com sucesso!');
    setEditingId(null);
    setName('');
    fetchUsers();
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="container mt-5">
      <h1 className="mb-4">CRUD Users</h1>
      {loading && <p>Carregando...</p>}
      <div className="input-group mb-3">
        <input
          className="form-control"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome"
        />
        <button
          className="btn btn-primary"
          disabled={!name}
          onClick={editingId ? updateUser : createUser}
        >
          {editingId ? 'Atualizar' : 'Criar'}
        </button>
      </div>
      {message && <div className="alert alert-success">{message}</div>}
      <ul className="list-group">
        {users.map((user) => (
          <li
            key={user.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            {user.name}

            <div>
              <button
                className="btn btn-sm btn-warning me-2"
                onClick={() => startEdit(user)}
              >
                Editar
              </button>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => deleteUser(user.id)}
              >
                Excluir
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
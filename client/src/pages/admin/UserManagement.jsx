import React, { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../../components/common/Modal';
import {
  Users,
  Shield,
  User,
  Trash2,
  Power,
  CheckCircle,
  Plus,
  Search,
  AlertTriangle,
  UserCheck,
  UserX,
  Mail,
  Building
} from 'lucide-react';

export const UserManagement = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  // Add User Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('USER');
  const [newTitle, setNewTitle] = useState('Acoustic Signal Analyst');
  const [newStation, setNewStation] = useState('Station A · Bengaluru');

  // Confirmation Dialog State
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    action: null
  });

  const fetchUsers = async () => {
    try {
      const res = await userService.getAll();
      if (res.data) setUsers(res.data);
    } catch (err) {
      console.error('[UserManagement] Fetch error:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const res = await userService.create({
        name: newName,
        email: newEmail,
        role: newRole,
        title: newTitle,
        assignedStation: newStation
      });
      if (res.success) {
        setNotice(`User account for ${newName} created successfully!`);
        setShowAddModal(false);
        setNewName('');
        setNewEmail('');
        setNewRole('USER');
        fetchUsers();
        setTimeout(() => setNotice(''), 4000);
      }
    } catch (err) {
      setError(err.message || 'Failed to create user');
      setTimeout(() => setError(''), 4000);
    }
  };

  const handleRoleChange = async (targetUser) => {
    const isSelf = targetUser.email === currentUser?.email || targetUser.isSuperAdmin;
    const newRole = targetUser.role === 'ADMIN' ? 'USER' : 'ADMIN';

    if (isSelf && newRole === 'USER') {
      setError('Safety Guard: You cannot demote your own active administrator account.');
      setTimeout(() => setError(''), 4500);
      return;
    }

    setConfirmModal({
      isOpen: true,
      title: `Confirm Role Modification: ${targetUser.name}`,
      message: `Are you sure you want to change ${targetUser.name}'s privileges to ${newRole}?`,
      action: async () => {
        const uId = targetUser.userId || targetUser._id;
        const res = await userService.update(uId, { role: newRole });
        if (res.success) {
          setNotice(`Privileges for ${targetUser.name} updated to ${newRole}.`);
          fetchUsers();
          setTimeout(() => setNotice(''), 4000);
        } else {
          setError(res.message || 'Operation failed');
          setTimeout(() => setError(''), 4000);
        }
        setConfirmModal({ isOpen: false, title: '', message: '', action: null });
      }
    });
  };

  const handleToggleStatus = async (targetUser) => {
    const isSelf = targetUser.email === currentUser?.email || targetUser.isSuperAdmin;
    if (isSelf) {
      setError('Safety Guard: You cannot deactivate your own administrative account.');
      setTimeout(() => setError(''), 4500);
      return;
    }

    const uId = targetUser.userId || targetUser._id;
    const res = await userService.toggleStatus(uId);
    if (res.success) {
      setNotice(`User ${targetUser.name} status updated.`);
      fetchUsers();
      setTimeout(() => setNotice(''), 4000);
    } else {
      setError(res.message || 'Action restricted');
      setTimeout(() => setError(''), 4000);
    }
  };

  const handleDeleteUser = (targetUser) => {
    const isSelf = targetUser.email === currentUser?.email || targetUser.isSuperAdmin;
    if (isSelf) {
      setError('Safety Guard: You cannot delete your own administrative account.');
      setTimeout(() => setError(''), 4500);
      return;
    }

    setConfirmModal({
      isOpen: true,
      title: `Confirm Deletion: ${targetUser.name}`,
      message: `Warning: This will permanently delete the operator account for ${targetUser.name} (${targetUser.email}). This action cannot be undone.`,
      action: async () => {
        const uId = targetUser.userId || targetUser._id;
        const res = await userService.delete(uId);
        if (res.success) {
          setNotice(`Account for ${targetUser.name} deleted.`);
          fetchUsers();
          setTimeout(() => setNotice(''), 4000);
        } else {
          setError(res.message || 'Failed to delete');
          setTimeout(() => setError(''), 4000);
        }
        setConfirmModal({ isOpen: false, title: '', message: '', action: null });
      }
    });
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      (u.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.title || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{
            fontSize: '1.65rem',
            fontWeight: '800',
            color: 'var(--text-primary)',
            letterSpacing: '-0.025em',
            lineHeight: 1.2
          }}>
            Operator & User Governance Directory
          </h1>
          <p style={{
            fontSize: '0.88rem',
            color: 'var(--text-muted)',
            marginTop: '4px'
          }}>
            Role-based access control (RBAC), operator permissions, and account governance
          </p>
        </div>

        <button onClick={() => setShowAddModal(true)} className="btn btn-primary" style={{ padding: '9px 18px' }}>
          <Plus size={16} /> Add New Operator
        </button>
      </div>

      {notice && (
        <div style={{
          padding: '12px 18px',
          background: 'var(--status-normal-bg)',
          border: '1px solid var(--status-normal-border)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--status-normal)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.88rem',
          fontWeight: '600'
        }}>
          <CheckCircle size={18} /> {notice}
        </div>
      )}

      {error && (
        <div style={{
          padding: '12px 18px',
          background: 'var(--status-critical-bg)',
          border: '1px solid var(--status-critical-border)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--status-critical)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.88rem',
          fontWeight: '600'
        }}>
          <AlertTriangle size={18} /> {error}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="white-card" style={{ padding: '16px 22px', display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="form-input"
            placeholder="Search by name, email address, or professional title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '38px', fontSize: '0.84rem' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Filter Role:</span>
          <select
            className="form-select"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            style={{ width: '140px', fontSize: '0.82rem' }}
          >
            <option value="ALL">All Roles</option>
            <option value="ADMIN">Administrators</option>
            <option value="USER">Operators</option>
          </select>
        </div>
      </div>

      {/* Users Directory Table Card */}
      <div className="white-card" style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              Registered System Operators
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Showing {filteredUsers.length} of {users.length} active platform accounts
            </p>
          </div>
          <span style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--color-primary)', backgroundColor: 'var(--color-primary-subtle)', padding: '4px 10px', borderRadius: '4px' }}>
            {users.filter(u => u.status === 'ACTIVE').length} Active Accounts
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
            <thead>
              <tr style={{ height: '40px', borderBottom: '1px solid var(--border-divider)' }}>
                <th style={{ padding: '10px 14px', color: 'var(--text-muted)', fontWeight: '700', fontSize: '0.74rem', textTransform: 'uppercase' }}>Operator Name</th>
                <th style={{ padding: '10px 14px', color: 'var(--text-muted)', fontWeight: '700', fontSize: '0.74rem', textTransform: 'uppercase' }}>Email Identifier</th>
                <th style={{ padding: '10px 14px', color: 'var(--text-muted)', fontWeight: '700', fontSize: '0.74rem', textTransform: 'uppercase' }}>Role Privilege</th>
                <th style={{ padding: '10px 14px', color: 'var(--text-muted)', fontWeight: '700', fontSize: '0.74rem', textTransform: 'uppercase' }}>Assigned Station</th>
                <th style={{ padding: '10px 14px', color: 'var(--text-muted)', fontWeight: '700', fontSize: '0.74rem', textTransform: 'uppercase' }}>Account Status</th>
                <th style={{ padding: '10px 14px', color: 'var(--text-muted)', fontWeight: '700', fontSize: '0.74rem', textTransform: 'uppercase' }}>Created Date</th>
                <th style={{ padding: '10px 14px', color: 'var(--text-muted)', fontWeight: '700', fontSize: '0.74rem', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => {
                const uId = u.userId || u._id;
                const isAdmin = u.role === 'ADMIN';
                const isActive = u.status === 'ACTIVE';
                const isSelf = u.email === currentUser?.email || u.isSuperAdmin;

                return (
                  <tr key={uId} style={{ height: '54px', borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{u.name}</div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{u.title || 'Observatory Staff'}</div>
                    </td>
                    <td style={{ padding: '12px 14px', color: 'var(--text-secondary)' }}>
                      {u.email}
                      {isSelf && (
                        <span style={{ marginLeft: '6px', fontSize: '0.68rem', padding: '2px 6px', borderRadius: '4px', backgroundColor: 'var(--color-primary-subtle)', color: 'var(--color-primary)', fontWeight: '700' }}>
                          You
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '0.72rem',
                        fontWeight: '700',
                        backgroundColor: isAdmin ? 'var(--status-critical-bg)' : 'var(--color-primary-subtle)',
                        color: isAdmin ? 'var(--status-critical)' : 'var(--color-primary)',
                        border: `1px solid ${isAdmin ? 'var(--status-critical-border)' : 'rgba(37,99,235,0.2)'}`
                      }}>
                        {isAdmin ? <Shield size={11} /> : <User size={11} />}
                        {isAdmin ? 'ADMINISTRATOR' : 'OPERATOR'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {u.assignedStation || 'Regional Network'}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontSize: '0.72rem',
                        fontWeight: '700',
                        color: isActive ? 'var(--status-normal)' : 'var(--status-critical)'
                      }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: isActive ? 'var(--status-normal)' : 'var(--status-critical)' }} />
                        {isActive ? 'ACTIVE' : 'SUSPENDED'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {u.createdDate || '2025-01-15'}
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                        {/* Promote / Demote */}
                        <button
                          onClick={() => handleRoleChange(u)}
                          className="btn btn-secondary"
                          style={{ padding: '4px 8px', fontSize: '0.72rem' }}
                          title={isAdmin ? 'Demote to Operator' : 'Promote to Admin'}
                          disabled={isSelf && isAdmin}
                        >
                          {isAdmin ? 'Demote' : 'Promote'}
                        </button>

                        {/* Toggle Status */}
                        <button
                          onClick={() => handleToggleStatus(u)}
                          className="btn btn-secondary"
                          style={{ padding: '4px 7px', fontSize: '0.72rem' }}
                          title={isActive ? 'Suspend Account' : 'Activate Account'}
                          disabled={isSelf}
                        >
                          <Power size={13} color={isActive ? 'var(--status-critical)' : 'var(--status-normal)'} />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDeleteUser(u)}
                          className="btn btn-secondary"
                          style={{ padding: '4px 7px', fontSize: '0.72rem', color: 'var(--status-critical)' }}
                          title="Delete User"
                          disabled={isSelf}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New System Operator"
        subtitle="Create an authorized observatory analyst account with role-based access"
        maxWidth="520px"
      >
        <form onSubmit={handleCreateUser}>
          <div className="form-group">
            <label className="form-label" style={{ fontWeight: '600', color: 'var(--text-primary)' }}>OPERATOR FULL NAME</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Dr. Rajesh Khanna"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontWeight: '600', color: 'var(--text-primary)' }}>EMAIL ADDRESS (SYSTEM IDENTIFIER)</label>
            <input
              type="email"
              className="form-input"
              placeholder="e.g. r.khanna@infrasound.org"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: '600', color: 'var(--text-primary)' }}>ROLE PERMISSIONS</label>
              <select className="form-select" value={newRole} onChange={(e) => setNewRole(e.target.value)}>
                <option value="USER">Standard Operator (View, Verify)</option>
                <option value="ADMIN">Administrator (Full Network Control)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontWeight: '600', color: 'var(--text-primary)' }}>TITLE / POSITION</label>
              <input
                type="text"
                className="form-input"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label className="form-label" style={{ fontWeight: '600', color: 'var(--text-primary)' }}>ASSIGNED MONITORING STATION</label>
            <select className="form-select" value={newStation} onChange={(e) => setNewStation(e.target.value)}>
              <option value="All Stations (Global Access)">All Stations (Global Access)</option>
              <option value="Station A · Bengaluru">Station A · Bengaluru</option>
              <option value="Station B · Hyderabad">Station B · Hyderabad</option>
              <option value="Station C · New Delhi">Station C · New Delhi</option>
              <option value="Station D · Pune">Station D · Pune</option>
              <option value="Station E · Mumbai">Station E · Mumbai</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Create Account
            </button>
          </div>
        </form>
      </Modal>

      {/* Confirmation Modal */}
      <Modal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, title: '', message: '', action: null })}
        title={confirmModal.title}
        maxWidth="460px"
      >
        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '20px' }}>
          {confirmModal.message}
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button
            type="button"
            onClick={() => setConfirmModal({ isOpen: false, title: '', message: '', action: null })}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={confirmModal.action}
            className="btn btn-primary"
          >
            Confirm Action
          </button>
        </div>
      </Modal>

    </div>
  );
};

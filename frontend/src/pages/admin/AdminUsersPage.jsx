import React, { useState, useEffect } from 'react';
import { Users, Search, Shield, UserCheck } from 'lucide-react';
import { adminService } from '../../services/api';
import { Badge } from '../../components/common/Badge';
import { Input } from '../../components/common/Input';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await adminService.getUsers();
        setUsers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 text-left pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-secondary/20">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" />
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight">
              User Access & Roles
            </h1>
          </div>
          <p className="text-xs text-text-muted mt-1">Manage user identities and platform permissions.</p>
        </div>

        <div className="w-full sm:w-64">
          <Input
            placeholder="Search users..."
            icon={Search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <LoadingSpinner label="Loading user registry..." />
      ) : (
        <div className="rounded-2xl border border-secondary/20 bg-[#0e0f18] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#151726] border-b border-secondary/20 text-purple-300 font-mono uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Email Address</th>
                  <th className="py-3 px-4">Assigned Role</th>
                  <th className="py-3 px-4">Scans Uploaded</th>
                  <th className="py-3 px-4">Account Status</th>
                  <th className="py-3 px-4">Date Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary/15">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-white flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-secondary/30 text-purple-300 flex items-center justify-center font-bold text-[10px]">
                        {u.name[0]}
                      </div>
                      <span>{u.name}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-text-muted">{u.email}</td>
                    <td className="py-3.5 px-4">
                      <Badge variant={u.role === 'ADMIN' ? 'secondary' : 'default'} size="sm">
                        {u.role}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-primary font-semibold">{u.scansCount}</td>
                    <td className="py-3.5 px-4">
                      <Badge variant="success" dot size="sm">{u.status}</Badge>
                    </td>
                    <td className="py-3.5 px-4 text-text-muted font-mono">{u.joined}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLiveQuery } from "dexie-react-hooks";
import { isLoggedIn, logoutUser } from "../lib/auth";
import OnlineComponent from "../components/onlineComponent";
import { Power } from "lucide-react";
import { db } from "../lib/db";

export default function Users() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const users = useLiveQuery(() => db.users.toArray(), []);

  useEffect(() => {
    if (users !== undefined) {
      setLoading(false);
    }
  }, [users]);

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = () => {
    logoutUser(navigate);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex flex-row justify-between mb-6 items-center">
        <OnlineComponent />
        <div
          className="flex flex-row gap-2 items-center cursor-pointer"
          onClick={handleLogout}
        >
          <Power size={16} /> Logout
        </div>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold">Users</h1>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading users...</div>
        </div>
      ) : !users || users.length === 0 ? (
        <div className="text-center p-8 border rounded-lg bg-gray-50">
          <p className="text-gray-500">0 users found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {users.map((user) => (
            <div
              key={user.id}
              className="p-4 border rounded-lg "
            >
              <div className="text-xs text-gray-500 mb-2">ID: {user.id}</div>
              <div className="text-sm text-gray-700">
                Name : {user.firstName} {user.lastName}
              </div>
              <div className="text-sm text-gray-700">Username : {user.username}</div>
              <div className="text-sm text-gray-700">Email : {user.email}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

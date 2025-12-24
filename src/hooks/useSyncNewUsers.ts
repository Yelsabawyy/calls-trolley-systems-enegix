import { useState, useEffect } from "react";
import { useOnlineNetwork } from "./useOnlineNetwork";
import { userAdapter } from "../lib/userAdaptor";
import { db } from "../lib/db";
import { decryptFromDTN } from "../lib/crypto";

export const useSyncNewUsers = (adapter = userAdapter) => {
  const isOnline = useOnlineNetwork();
  const [wasOffline, setWasOffline] = useState<boolean>(false);

  const [message, setMessage] = useState<string>('');

  const syncNewUsers = async () => {
    if (!isOnline) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/sync-users`
      );
      const data = await res.json();
      const userData = await decryptFromDTN(
        data.data.d,
        data.data.t,
        data.data.n
      );
      const adapted = JSON.parse(userData).map(adapter);
      setMessage(`+${adapted.length} New users sync`)
      await db.users.bulkPut(adapted);
    } catch (err) {
      console.error("Sync failed:", err);
    }
  };

  useEffect(() => {
    if (!isOnline) return;
    const interval = setInterval(() => {
      syncNewUsers();
    }, 60000);

    
    return () => clearInterval(interval);
  }, [isOnline]);

  useEffect(() => {
    if (isOnline && wasOffline) {
      syncNewUsers();
      setWasOffline(false);
    } else if (!isOnline) {
      setWasOffline(true);
    }
  }, [isOnline, wasOffline]);

  return { message };
};

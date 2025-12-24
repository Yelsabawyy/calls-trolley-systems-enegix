import { useState, useEffect } from "react";
import { userAdapter } from "../lib/userAdaptor";
import { decryptFromDTN } from "../lib/crypto";
import { db } from "../lib/db";

export const useSyncAllUsers = (adapter = userAdapter) => {
  const [loading, setLoading] = useState<boolean>(true);

  const DEFAULT_MAX_PAGES = 10;
  const DEFAULT_MAX_RECORDS = 1000;

  const syncAllUsers = async (
    maxPages = DEFAULT_MAX_PAGES,
    maxRecords = DEFAULT_MAX_RECORDS
  ) => {
    try {
      let page = 1;
      let allUsers = [];
      let totalRecords = 0;

      while (page <= maxPages && totalRecords < maxRecords) {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/users?page=${page}`
        );

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();

        const userData = await decryptFromDTN(
          data.data.d,
          data.data.t,
          data.data.n
        );

        const adaptedUsers = JSON.parse(userData).map(adapter);

        const remainingCapacity = maxRecords - totalRecords;
        if (adaptedUsers.length > remainingCapacity) {
          allUsers.push(...adaptedUsers.slice(0, remainingCapacity));
          totalRecords = maxRecords;
          break;
        } else {
          allUsers.push(...adaptedUsers);
          totalRecords += adaptedUsers.length;
        }

        page++;
      }
      if (allUsers.length > 0) {
        await db.users.bulkPut(allUsers);
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  useEffect(() => {
    const init = async () => {
      await syncAllUsers(DEFAULT_MAX_PAGES, DEFAULT_MAX_RECORDS);
    };
    init();
  }, []);

  return { loading };
};

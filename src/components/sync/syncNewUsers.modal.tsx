import { useState, useEffect } from "react";
import { useSyncNewUsers } from "../../hooks/useSyncNewUsers";

export default function SyncNewUsersModal() {
  const { message } = useSyncNewUsers();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [message]);

  if (!visible || !message) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <div className="bg-primary text-white px-6 sm:px-16 py-3 rounded-lg shadow-lg flex items-center space-x-3 animate-slide-in">
        <span className="font-medium">{message}</span>
      </div>
    </div>
  );
}

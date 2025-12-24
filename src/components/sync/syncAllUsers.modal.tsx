import { useSyncAllUsers } from "../../hooks/useSyncAllUsers";

export default function SyncAllUsersModal() {
  const {loading } = useSyncAllUsers();

  return loading &&(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl py-16 shadow-xl text-center w-11/12 max-w-md">
        <p className="text-gray-800  pb-8 text-lg font-black">Sync users</p>
        <div className="mb-3 animate-spin h-6 w-6 border-2 border-gray-300 border-t-primary rounded-full mx-auto" />
      </div>
    </div>
  );
}

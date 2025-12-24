import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/login";

import SyncAllUsersModal from "./components/sync/syncAllUsers.modal.tsx";
import SyncNewUsersModal from "./components/sync/syncNewUsers.modal.tsx";
import Users from "./pages/users.tsx";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/users" element={<Users />} />
      </Routes>
      
      <SyncAllUsersModal />
      <SyncNewUsersModal />
    </>
  );
}

import { useOnlineNetwork } from "../hooks/useOnlineNetwork";

export default function OnlineComponent() {
  const isOnline = useOnlineNetwork();
  return (
    <div className="mb-6">
      <div className="flex gap-4 text-sm">
        <span className={isOnline ? "text-green-600" : "text-red-600"}>
          {isOnline ? "● Online" : "● Offline"}
        </span>
      </div>
    </div>
  );
}

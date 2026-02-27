import { useEffect, useState } from "react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar } from "@heroui/react";
import { getCurrentUser } from "../../services/userService";
import { useNavigate } from "react-router-dom";

export default function NavUser() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getCurrentUser();
        setUser(response.data.data);
      } catch (error) {
        console.error("Gagal ambil user:", error);
      }
    };

    fetchUser();
  }, []);

  if (!user) {
    return <p className="text-white px-4 py-2">Loading...</p>;
  }

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
  <div
    className="
      flex items-center gap-3 px-3 md:px-4 py-2 rounded-2xl
      bg-white/5 backdrop-blur-md 
      border border-white/10 
      cursor-pointer hover:bg-white/20 transition
    "
  >
    {/* Text - Hidden di Mobile */}
    <div className="hidden md:flex flex-col text-left">
      <span className="text-white text-sm font-semibold capitalize">
        {user.username}
      </span>
      <span className="text-emerald-400 text-xs font-medium self-end">
        ● {user.status || "Active"}
      </span>
    </div>

    {/* Avatar - Selalu tampil */}
    <Avatar
      src={user.avatar || "https://i.pravatar.cc/150?img=3"}
      size="sm"
      className="border border-white/20 md:w-9 md:h-9"
    />
  </div>
</DropdownTrigger>

      <DropdownMenu
        aria-label="User menu"
        classNames={{
          base: "bg-slate-900 border border-white/10 shadow-xl rounded-xl p-2",
        }}
      >
        <DropdownItem
          key="profile"
          classNames={{
            base: "text-white data-[hover=true]:bg-slate-800 rounded-lg transition",
          }}
        >
          Profile
        </DropdownItem>

        <DropdownItem
          key="settings"
          classNames={{
            base: "text-white data-[hover=true]:bg-slate-800 rounded-lg transition",
          }}
        >
          Settings
        </DropdownItem>

        <DropdownItem
          key="logout"
          onPress={handleLogout}
          classNames={{
            base: `
              text-red-500
              data-[hover=true]:text-red-500
              data-[selectable=true]:text-red-500
              data-[hover=true]:bg-red-500/10
              rounded-lg transition
            `,
          }}
        >
          Log Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

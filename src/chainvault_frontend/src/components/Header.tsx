import { Avatar, Button } from "@tixia/design-system";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    console.log("logout");
    navigate("/");
  };
  return (
    <header className="fixed top-0 left-0 w-full z-20 bg-white border-b border-slate-200 h-16 flex items-center pl-16 pr-8 shadow-sm text-center justify-end">
      <div className="flex items-center gap-4">
        <Avatar shape="circle" size="medium" />
        <Button onClick={handleLogout} variant="outline-danger" rounded="full">
          Logout
        </Button>
      </div>
    </header>
  );
};

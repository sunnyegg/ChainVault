import { Avatar, Button, useToast } from "@tixia/design-system";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const handleLogout = () => {
    navigate("/");
    showToast({
      title: "Logout successful",
      description: "You have been logged out",
      variant: "success",
    });
  };
  return (
    <header className="fixed top-0 left-0 w-full z-20 bg-white border-b border-slate-200 h-16 flex items-center px-4 md:pl-16 md:pr-8 shadow-sm text-center justify-end">
      <div className="flex items-center gap-2 md:gap-4">
        <Avatar shape="circle" size="medium" />
        <Button onClick={handleLogout} variant="outline-danger" rounded="full" className="text-sm md:text-base">
          Logout
        </Button>
      </div>
    </header>
  );
};

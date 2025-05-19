import { Avatar, Button } from "@tixia/design-system";

export const Header = () => {
  const handleLogout = () => {
    console.log("logout");
  };
  return (
    <header className="fixed top-0 left-0 w-full z-20 bg-white border-b border-slate-200 h-16 flex items-center pl-16 pr-8 shadow-sm text-center">
      <h1 className="text-2xl font-bold text-slate-900 flex-1">Chain Vault</h1>
      <div className="flex items-center gap-4">
        <Avatar shape="circle" size="medium" />
        <Button onClick={handleLogout} variant="outline-danger" rounded="full">
          Logout
        </Button>
      </div>
    </header>
  );
};

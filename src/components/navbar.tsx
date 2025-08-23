import { SidebarTrigger } from "./ui/sidebar";

export const Navbar = () => {
  return (
    <>
      <div className="fixed top-0 bg-background/30 backdrop-blur-md w-full h-16 border-b flex items-center px-4 gap-4 z-10">
        <SidebarTrigger />

        <p className="font-medium">PresensiGo</p>
      </div>
    </>
  );
};

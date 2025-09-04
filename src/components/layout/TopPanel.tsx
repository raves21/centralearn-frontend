import { ChevronDown } from "lucide-react";
import { useCurrentUser } from "../../services/auth/api/queries";
import { Navigate } from "@tanstack/react-router";
import { useEffect } from "react";
import Logo from "../shared/Logo";

export default function TopPanel() {
  const { data: currentUser } = useCurrentUser();

  if (!currentUser) return <Navigate to="/login" replace />;

  useEffect(() => {
    console.log(currentUser);
  }, []);

  return (
    <div className="px-3 h-[9dvh] bg-main-bg fixed top-0 left-0 w-full flex items-center justify-between">
      <Logo />
      <div className="flex items-center gap-3 h-full mr-3 group">
        <div className="rounded-full overflow-hidden aspect-square h-[60%]">
          <img
            src="https://as2.ftcdn.net/jpg/01/78/45/89/1000_F_178458935_IKeoXYjUSDLSeX5YrSOqZLd1cTepNjbV.jpg"
            className="size-full"
          />
        </div>
        <div className="flex flex-col">
          <p className="font-medium text-gray-800">
            {currentUser.firstName} {currentUser.lastName}
          </p>
          <p className="text-gray-500">{currentUser.roles[0]}</p>
        </div>
        <ChevronDown className="stroke-gray-500 ml-4 group-hover:stroke-gray-800 size-5" />
      </div>
    </div>
  );
}

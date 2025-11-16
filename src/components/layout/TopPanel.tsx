import { ChevronDown } from "lucide-react";
import { useCurrentUser } from "../../domains/auth/api/queries";
import { Navigate } from "@tanstack/react-router";
import Logo from "../shared/Logo";

type Props = {
  type: "admin-panel" | "lms";
};

export default function TopPanel({ type }: Props) {
  const { data: currentUser } = useCurrentUser();

  if (!currentUser) return <Navigate to="/login" replace />;

  return (
    <div className="px-3 h-[9dvh] fixed top-0 z-50 left-0 max-h-[90px] bg-main-bg w-full flex items-center justify-between">
      <Logo type={type} />
      <div className="flex items-center h-full gap-3 mr-3 group">
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
          <p className="text-main-text">{currentUser.roles[0]}</p>
        </div>
        <ChevronDown className="ml-4 stroke-main-text group-hover:stroke-gray-800 size-5" />
      </div>
    </div>
  );
}

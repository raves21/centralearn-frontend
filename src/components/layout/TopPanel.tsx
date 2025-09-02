import { ChevronDown, Loader } from "lucide-react";
import { useCurrentUser } from "../../services/auth/api/queries";
import { Navigate } from "@tanstack/react-router";
import { useEffect } from "react";

export default function TopPanel() {
  const { data: currentUser } = useCurrentUser();

  if (!currentUser) return <Navigate to="/login" replace />;

  useEffect(() => {
    console.log(currentUser);
  }, []);

  return (
    <div className="px-3 h-[10%] bg-main-bg absolute top-0 left-0 w-full flex items-center justify-between">
      <div className="flex items-center justify-center gap-2">
        <Loader className="size-8 stroke-mainaccent" />
        <p className="text-2xl font-semibold">CentraLearn</p>
      </div>
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

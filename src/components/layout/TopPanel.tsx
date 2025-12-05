import { ChevronDown } from "lucide-react";
import { useCurrentUser } from "../../domains/auth/api/queries";
import { Navigate, useMatchRoute, useNavigate } from "@tanstack/react-router";
import Logo from "../shared/Logo";
import RoleBasedComponent from "../shared/RoleBasedComponent";
import { cn } from "@/lib/utils";
import { useGeneralStore } from "@/utils/stores/useGeneralStore";

type Props = {
  type: "admin-panel" | "lms";
};

export default function TopPanel({ type }: Props) {
  const { data: currentUser } = useCurrentUser();
  const navigate = useNavigate();
  const matchRoute = useMatchRoute();
  const isAdminPanelRoute = matchRoute({ to: "/admin-panel", fuzzy: true });

  const topPanelPointerEventsNone = useGeneralStore(
    (state) => state.topPanelPointerEventsNone
  );

  if (!currentUser) return <Navigate to="/login" replace />;

  return (
    <div
      className={cn(
        "px-3 h-[9dvh] fixed top-0 z-50 left-0 max-h-[90px] bg-main-bg w-full flex items-center justify-between",
        {
          "pointer-events-none": topPanelPointerEventsNone,
        }
      )}
    >
      <Logo type={type} />
      <div className="flex items-center h-full gap-6">
        <RoleBasedComponent
          adminComponent={
            <button
              onClick={() => {
                if (isAdminPanelRoute) {
                  navigate({ to: "/lms/classes" });
                } else {
                  navigate({ to: "/admin-panel/dashboard" });
                }
              }}
              className="rounded-lg px-3 py-2 border-mainaccent border text-black hover:text-white hover:bg-mainaccent transition-colors"
            >
              {isAdminPanelRoute ? "Go to LMS" : "Go to Admin"}
            </button>
          }
        />
        <div className="flex items-center gap-3 mr-3 group h-full">
          <div className="flex items-center h-full gap-3">
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
          </div>
          <ChevronDown className="ml-4 stroke-main-text group-hover:stroke-gray-800 size-5" />
        </div>
      </div>
    </div>
  );
}

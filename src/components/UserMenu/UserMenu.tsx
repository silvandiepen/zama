import React from "react";
import { useAuth } from "@/store/auth";
import { useNavigate } from "react-router-dom";
import { useBemm } from "@/utils/bemm";
import { ContextMenu } from "@/components/ContextMenu/ContextMenu";
import { Icon } from "@/components/Icon/Icon";
import "./user-menu.scss";

type Props = { onOpenSettings?: () => void };

export const UserMenu: React.FC<Props> = ({ onOpenSettings }) => {
  const { user, signout } = useAuth();
  const navigate = useNavigate();
  const bemm = useBemm("user-menu");

  if (!user) return null;

  const initials = (user.name || "U")
      .trim()
      .split(" ")
      .map((p: string) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  return (
    <div className={bemm("")}>
      <ContextMenu
        align="right"
        renderTrigger={({ triggerProps }) => (
          <button className={bemm("button")} {...triggerProps}>
            <span className={bemm("avatar")} aria-hidden>
              {user.isGuest ? (
                <img src="/ghost.png" alt="" />
              ) : (
                initials
              )}
            </span>
            <span className={bemm("name")}>
              {user.isGuest ? "Guest" : user.name || "User"}
            </span>
          </button>
        )}
        items={[
          {
            label: "Settings",
            icon: <Icon name="settings" />,
            onSelect: () => {
              if (onOpenSettings) onOpenSettings();
              else navigate("/settings");
            },
          },
          {
            label: "Logout",
            icon: <Icon name="arrow-right" />,
            onSelect: () => {
              signout();
              navigate("/signin");
            },
          },
        ]}
      />
    </div>
  );
};

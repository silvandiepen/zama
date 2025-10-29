import React, { useState } from "react";
import { Button } from "@/components/Button";
import { Colors } from "@/types";
import { TextInput } from "@/components/Input/TextInput";
import { PasswordInput } from "@/components/Input/PasswordInput";
import { useToast } from "@/store/toast";
import { useAuth } from "@/store/auth";
import { useNavigate } from "react-router-dom";
import { useBemm } from "../../utils/bemm";

/**
 * Login form component that handles user authentication with email/password fields
 * and provides a guest login option.
 * @returns {JSX.Element} The rendered login form component.
 */
export const LoginForm: React.FC = () => {
  const { signin, signinGuest } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const bemm = useBemm("auth");

  /**
   * Handles the login form submission by validating the email field and
   * attempting to sign in the user. Shows toast notifications for validation errors.
   * @returns {void}
   */
  const onLogin = () => {
    if (!email.trim()) {
      addToast({
        title: "Email required",
        message: "Please enter your email",
        variant: "warning",
      });
      return;
    }
    const name = email.split("@")[0] || "User";
    signin(name);
    navigate("/dashboard");
  };

  return (
    <>
      <div className={bemm("fields")}>
        <TextInput
          id="email"
          type="email"
          label="Email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <PasswordInput
          id="password"
          label="Password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className={bemm("buttons")}>
        <Button color={Colors.PRIMARY} onClick={onLogin}>
          Login
        </Button>
        <Button
          color={Colors.SECONDARY}
          variant="outline"
          onClick={() => {
            signinGuest();
            navigate("/dashboard");
          }}
        >
          Continue as Guest
        </Button>
      </div>
    </>
  );
};

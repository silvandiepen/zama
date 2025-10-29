import React, { useState } from "react";
import { Button } from "@/components/Button";
import { Colors } from "@/types";
import { TextInput } from "@/components/Input/TextInput";
import { PasswordInput } from "@/components/Input/PasswordInput";
import { useToast } from "@/store/toast";
import { useAuth } from "@/store/auth";
import { useNavigate } from "react-router-dom";
import { useBemm } from "../../utils/bemm";

type Props = { onBackToLogin?: () => void };

export const RegisterForm: React.FC<Props> = ({ onBackToLogin }) => {
  const { signin } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const bemm = useBemm("auth");

  const onRegister = () => {
    if (!email.trim() || !name.trim()) {
      addToast({
        title: "Missing info",
        message: "Please enter name and email",
        variant: "warning",
      });
      return;
    }
    addToast({
      title: "Account created",
      message: `Welcome, ${name}!`,
      variant: "success",
    });
    signin(name);
    navigate("/dashboard");
  };

  return (
    <>
      <div className={bemm("fields")}>
        <TextInput
          id="name"
          label="Name"
          placeholder="Jane Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
        <Button color={Colors.PRIMARY} onClick={onRegister}>
          Create Account
        </Button>
        <Button
          color={Colors.SECONDARY}
          variant="outline"
          onClick={onBackToLogin}
        >
          Back to Login
        </Button>
      </div>
    </>
  );
};

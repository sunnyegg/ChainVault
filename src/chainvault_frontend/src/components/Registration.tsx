import { Card, Input, Text, Button } from "@tixia/design-system";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
export const Registration = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const handleLogin = () => {
    const payload = {
      username: input.username,
      password: input.password,
    };
    console.log(payload);
    navigate("/app");
  };

  const handleSignUp = () => {
    const payload = {
      username: input.username,
      email: input.email,
      password: input.password,
      confirmPassword: input.confirmPassword,
    };
    console.log(payload);
    navigate("/app");
  };

  const handleSubmit = () => {
    if (isLogin) handleLogin();
    else handleSignUp();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const REGISTRATION_TEXT = {
    title: isLogin ? "Login" : "Sign up",
    action: isLogin ? "Login" : "Sign up",
    direction: isLogin ? "Sign up" : "Login",
    helperText: isLogin ? "Don't have an account?" : "Already have an account?",
  };

  return (
    <Card
      className="min-h-screen flex items-center justify-center bg-slate-700"
      variant="ghost"
      rounded="none"
    >
      <Card className="grid gap-2 text-center w-full max-w-md bg-gray-50">
        <Text variant="heading2">{REGISTRATION_TEXT.title}</Text>
        <Input
          leftIcon="mdi:account"
          fullWidth
          variant="default"
          id="username"
          name="username"
          type="text"
          required
          placeholder="Username"
          value={input.username}
          onChange={handleChange}
        />
        {!isLogin && (
          <Input
            leftIcon="mdi:email"
            fullWidth
            variant="default"
            id="email"
            name="email"
            type="email"
            required
            placeholder="Email"
            value={input.email}
            onChange={handleChange}
          />
        )}
        <Input
          fullWidth
          leftIcon="mdi:lock"
          type="password"
          name="password"
          value={input.password}
          required
          placeholder="Password"
          onChange={handleChange}
        />
        {!isLogin && (
          <Input
            leftIcon="mdi:lock"
            fullWidth
            variant="default"
            name="confirmPassword"
            type="password"
            required
            placeholder="Confirm Password"
            value={input.confirmPassword}
            onChange={handleChange}
          />
        )}
        <Button
          type="submit"
          variant="primary"
          onClick={handleSubmit}
          rounded="full"
        >
          {REGISTRATION_TEXT.action}
        </Button>
        <div className="flex items-center justify-center">
          <Text className="text-gray-500" variant="caption">
            {REGISTRATION_TEXT.helperText}
          </Text>
          <Button size="sm" variant="link" onClick={() => setIsLogin(!isLogin)}>
            {REGISTRATION_TEXT.direction}
          </Button>
        </div>
      </Card>
    </Card>
  );
};

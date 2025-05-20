import { Card, Input, Text, Button } from "@tixia/design-system";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@tixia/design-system";
import { motion } from "framer-motion";
export const Registration = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogin = () => {
    const payload = {
      username: input.username,
      password: input.password,
    };
    console.log(payload);
    showToast({
      title: "Login successful",
      description: "You can now access your account",
      variant: "success",
    });
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
    showToast({
      title: "Sign up successful",
      description: "You can now login",
      variant: "success",
    });
    navigate("/login");
    setIsLogin(true);
  };

  const handleSubmit = () => {
    if (isLogin) handleLogin();
    else handleSignUp();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const REGISTRATION_TEXT = {
    title: isLogin ? "Login" : "Join ChainVault",
    action: isLogin ? "Login" : "Sign up",
    direction: isLogin ? "Sign up" : "Login",
    helperText: isLogin ? "Don't have an account?" : "Already have an account?",
  };

  return (
    <Card
      className="grid grid-cols2 min-h-screen items-center justify-center bg-[url('/bg.jpg')] bg-cover bg-start"
      variant="ghost"
      rounded="none"
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="m-0 md:ml-[80vh]"
      >
        <Card
          className="grid gap-2 text-center w-full max-w-md bg-gray-50 col-span-1"
        >
          <Text variant="subtitle1" className="text-primary">
            {REGISTRATION_TEXT.title}
          </Text>
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
            fullWidth
          >
            {REGISTRATION_TEXT.action}
          </Button>
          {!isLogin && (
            <div className="flex items-center justify-center gap-2">
              <Button
                fullWidth
                variant="outline-success"
                leftIcon="mdi:github"
                onClick={handleSubmit}
                rounded="full"
                className="text-xs"
              >
                Login with Github
              </Button>
              <Button
                fullWidth
                variant="outline-success"
                leftIcon="mdi:google"
                onClick={handleSubmit}
                rounded="full"
                className="text-xs truncate"
              >
                Login with Google
              </Button>
            </div>
          )}
          <div className="flex items-center justify-center">
            <Text className="text-gray-500" variant="caption">
              {REGISTRATION_TEXT.helperText}
            </Text>
            <Button
              size="sm"
              variant="link"
              onClick={() => setIsLogin(!isLogin)}
            >
              {REGISTRATION_TEXT.direction}
            </Button>
          </div>
        </Card>
      </motion.div>
    </Card>
  );
};

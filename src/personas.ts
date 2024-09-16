import { PersonaOptions } from "@nlux/react";
import assistantAvatar from "./assets/robot.png";
import userAvatar from "./assets/user.png";

export const personas: PersonaOptions = {
  assistant: {
    name: "Assistant",
    avatar: assistantAvatar,
    tagline: "Your helpful AI assistant",
  },
  user: {
    name: "User",
    avatar: userAvatar,
  },
};

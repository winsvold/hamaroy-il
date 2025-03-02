import { useEffect } from "react";

export const linkToFrontpage = () => {
  return {
    title: "Gå til forsiden",
    name: "redirect-to-frontpage", // localhost:3333/my-custom-tool
    icon: () => "🖥️",
    component: RedirectTool,
  };
};

const RedirectTool = () => {
  useEffect(() => {
    window.location.href = "/";
  }, []);

  return <div>Redirecting...</div>;
};

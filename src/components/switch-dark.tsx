"use client";
import { getCookie } from "cookies-next";
import { Button } from "./ui/button";
import { useEffect } from "react";

export function ChangeDarkMode() {
  useEffect(() => {
    async function set() {
      const cookie = getCookie("dark-mode");
      if (!cookie) {
        await fetch("/api/dark-mode", {
          method: "POST",
          body: JSON.stringify({ darkMode: false }),
        });
      }
    }
    set();

    return () => {};
  }, []);

  const toggleTheme = () => {
    async function set() {
      await fetch("/api/dark-mode", {
        method: "POST",
        body: JSON.stringify({
          darkMode: !document.body.classList.contains("dark"),
        }),
      });
    }
    set();
    document.body.classList.toggle("dark");
  };

  return (
    <>
      <Button
        className="hidden dark:block dark:bg-black text-white hover:bg-black"
        onClick={toggleTheme}
      >
        Dark
      </Button>
      <Button
        className="block text-black hover:bg-white bg-white dark:hidden "
        onClick={toggleTheme}
      >
        Light
      </Button>
    </>
  );
}

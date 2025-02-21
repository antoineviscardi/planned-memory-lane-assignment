import { ShareIcon } from "@heroicons/react/20/solid";
import Dropdown from "../lib/ui/Dropdown";
import { useState } from "react";

export default function ShareButton() {
  const [isCopied, setIsCopied] = useState(false);

  function handleCopyClick() {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1000);
  }
  return (
    <Dropdown
      align="right"
      button={
        <div className="rounded p-1.5 cursor-pointer hover:bg-blue-600 bg-blue-500 text-blue-600 transition border border-blue-600">
          <ShareIcon className="size-5 text-blue-50"></ShareIcon>
        </div>
      }
      content={
        <div className="flex flex-col gap-6 px-5 py-4">
          <div className="flex gap-6 truncate items-center border border-zinc-200 rounded p-2 pl-3">
            <span className="text-zinc-700">{window.location.href} </span>
            <button
              onClick={handleCopyClick}
              className="min-w-18 px-2 py-1 rounded cursor-pointer bg-blue-500 text-blue-50  hover:bg-blue-600 transition"
            >
              {isCopied ? "Copied!" : "Copy"}
            </button>
          </div>

          <div
            data-href="https://developers.facebook.com/docs/plugins/"
            data-layout=""
            data-size=""
            className="flex gap-2"
          >
            <a
              target="_blank"
              href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fplugins%2F&amp;src=sdkpreparse"
              className="fb-xfbml-parse-ignore flex flex-col gap-1 items-center text-sm"
            >
              <img
                alt="facebook logo"
                src="/src/assets/fb-logo.png"
                className="size-10"
              ></img>
              Facebook
            </a>
          </div>
        </div>
      }
    ></Dropdown>
  );
}

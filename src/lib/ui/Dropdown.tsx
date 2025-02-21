import { ReactNode, useRef, useState } from "react";

interface Props {
  button: ReactNode;
  content?: ReactNode;
  align?: "left" | "right";
}

export default function Dropdown({ button, content, align }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const contentElRef = useRef<HTMLDivElement>(null);

  function handleClick() {
    const newVal = !isOpen;
    setIsOpen(newVal);

    if (newVal) {
      // We want to register the close handler on next tick to avoid it running right away and closing the dropdown
      setTimeout(() => {
        window.addEventListener("click", closeIfClickOutside);
      }, 0);
    }
  }

  function closeIfClickOutside(ev: Event) {
    console.log("click");
    if (
      contentElRef.current &&
      !contentElRef.current.contains(ev.target as Node)
    ) {
      setIsOpen(false);
      window.removeEventListener("click", closeIfClickOutside);
    }
  }

  return (
    <div>
      <button onClick={handleClick}>{button}</button>
      <div className="relative">
        <div
          ref={contentElRef}
          className={`z-50 bg-white absolute top-1 border-zinc-300 border rounded shadow 
            ${isOpen ? "visible" : "hidden"} 
            ${align === "right" ? "right-0" : "left-0"}`}
        >
          {content}
        </div>
      </div>
    </div>
  );
}

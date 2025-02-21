import { ReactNode, useEffect, useRef } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ isOpen, onClose, children }: Props) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  // Handle opening/closing when isOpen changes
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) throw new Error("dialog should be present");

    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen]);

  // Handle closing when clicking outside
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) throw new Error("dialog should be present");

    const handleClick = (ev: MouseEvent) => {
      const dialogDimensions = dialog.getBoundingClientRect();
      if (
        ev.clientX < dialogDimensions.left ||
        ev.clientX > dialogDimensions.right ||
        ev.clientY < dialogDimensions.top ||
        ev.clientY > dialogDimensions.bottom
      ) {
        onClose();
      }
    };

    dialog.addEventListener("click", handleClick);
    return () => dialog.removeEventListener("click", handleClick);
  }, [onClose]);

  return (
    <dialog
      ref={dialogRef}
      className="bg-transparent backdrop:bg-black/50 absolute top-1/2 left-1/2 -translate-1/2"
    >
      <div>{children}</div>
    </dialog>
  );
}

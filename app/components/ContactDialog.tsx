"use client";
import { ButtonLabel } from "./ButtonLabel";

import { useEffect, useRef } from "react";
import { siteContent } from "../site-content";
import { Eyebrow } from "./Eyebrow";
import { ContactForm } from "./ContactForm";

export function ContactDialog() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const requestCloseRef = useRef<() => void>(() => undefined);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const modal = dialog;
    let closeTimer: number | undefined;
    let openFrame: number | undefined;

    function requestClose() {
      if (!modal.open || modal.dataset.state === "closing") return;
      modal.dataset.state = "closing";
      const duration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 320;
      closeTimer = window.setTimeout(() => modal.close(), duration);
    }

    requestCloseRef.current = requestClose;

    function handleOpen(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const opener = target.closest<HTMLElement>("[data-open-contact]");
      if (!opener) return;
      event.preventDefault();
      if (modal.open) return;
      openerRef.current = opener;
      modal.dataset.state = "closed";
      modal.showModal();
      document.body.classList.add("modal-open");
      openFrame = window.requestAnimationFrame(() => {
        modal.dataset.state = "open";
      });
      window.setTimeout(() => modal.querySelector<HTMLElement>("input")?.focus(), 80);
    }

    function handleClose() {
      document.body.classList.remove("modal-open");
      if (openerRef.current && document.contains(openerRef.current)) {
        openerRef.current.focus();
      } else {
        document.querySelector<HTMLElement>(".menu-toggle")?.focus();
      }
      openerRef.current = null;
      modal.dataset.state = "closed";
    }

    function trapFocus(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        requestClose();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = Array.from(modal.querySelectorAll<HTMLElement>("button, input, select, textarea, [href], [tabindex]:not([tabindex='-1'])")).filter((element) => !element.hasAttribute("disabled"));
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    function handleCancel(event: Event) {
      event.preventDefault();
      requestClose();
    }

    function closeFromBackdrop(event: PointerEvent) {
      if (event.target === modal) requestClose();
    }

    document.addEventListener("click", handleOpen);
    modal.addEventListener("close", handleClose);
    modal.addEventListener("cancel", handleCancel);
    modal.addEventListener("keydown", trapFocus);
    modal.addEventListener("pointerdown", closeFromBackdrop);
    return () => {
      window.clearTimeout(closeTimer);
      window.cancelAnimationFrame(openFrame ?? 0);
      document.removeEventListener("click", handleOpen);
      modal.removeEventListener("close", handleClose);
      modal.removeEventListener("cancel", handleCancel);
      modal.removeEventListener("keydown", trapFocus);
      modal.removeEventListener("pointerdown", closeFromBackdrop);
      document.body.classList.remove("modal-open");
    };
  }, []);

  return (
    <dialog aria-labelledby="contact-dialog-title" className="contact-dialog" ref={dialogRef}>
      <div className="dialog-inner">
        <div className="dialog-top">
          <div>
            <Eyebrow>{siteContent.contact.eyebrow}</Eyebrow>
            <h2 id="contact-dialog-title">Start a conversation.</h2>
          </div>
          <button aria-label="Close contact form" className="dialog-close" onClick={() => requestCloseRef.current()} type="button">
            <ButtonLabel>×</ButtonLabel>
          </button>
        </div>
        <ContactForm idPrefix="modal-contact" variant="modal" />
      </div>
    </dialog>
  );
}

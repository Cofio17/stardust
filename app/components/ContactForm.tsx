"use client";

import { AnimatePresence, motion } from "motion/react";
import { Arrow } from "./Arrow";
import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";

type ContactFormProps = {
  variant: "inline" | "modal";
  idPrefix: string;
};

type FormValues = {
  name: string;
  email: string;
  company: string;
  focus: string;
  message: string;
};

const initialValues: FormValues = {
  name: "",
  email: "",
  company: "",
  focus: "",
  message: ""
};

const focusOptions = ["A website", "A web app or portal", "An AI product", "Automation or integrations", "CRM and data", "Maintenance or SEO", "Not sure yet"];

type CustomSelectProps = {
  describedBy?: string;
  id: string;
  onChange: (value: string) => void;
  value: string;
};

function CustomSelect({ describedBy, id, onChange, value }: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(() => Math.max(0, focusOptions.indexOf(value)));
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listboxId = `${id}-listbox`;

  useEffect(() => {
    if (!open) return;

    function closeOnOutsidePress(event: PointerEvent) {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", closeOnOutsidePress);
    return () => document.removeEventListener("pointerdown", closeOnOutsidePress);
  }, [open]);

  function openMenu() {
    const selectedIndex = focusOptions.indexOf(value);
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
    setOpen(true);
  }

  function selectOption(option: string) {
    onChange(option);
    setOpen(false);
    buttonRef.current?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
        event.preventDefault();
        openMenu();
      }
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((current) => (current + 1) % focusOptions.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) => (current - 1 + focusOptions.length) % focusOptions.length);
    } else if (event.key === "Home") {
      event.preventDefault();
      setActiveIndex(0);
    } else if (event.key === "End") {
      event.preventDefault();
      setActiveIndex(focusOptions.length - 1);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectOption(focusOptions[activeIndex]);
    } else if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === "Tab") {
      setOpen(false);
    }
  }

  return (
    <div className={`custom-select${open ? " is-open" : ""}`} ref={rootRef}>
      <button
        aria-activedescendant={open ? `${id}-option-${activeIndex}` : undefined}
        aria-controls={listboxId}
        aria-describedby={describedBy}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={`custom-select-trigger${value ? "" : " is-placeholder"}`}
        id={id}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={handleKeyDown}
        ref={buttonRef}
        role="combobox"
        type="button"
      >
        <span>{value || "Choose one"}</span>
        <span aria-hidden="true" className="custom-select-chevron" />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.ul
            animate={{ opacity: 1, scale: 1, y: 0 }}
            aria-label="What do you need?"
            className="custom-select-menu"
            exit={{ opacity: 0, scale: 0.98, y: -6 }}
            id={listboxId}
            initial={{ opacity: 0, scale: 0.98, y: -6 }}
            role="listbox"
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
            {focusOptions.map((option, index) => (
              <li
                aria-selected={value === option}
                className={`${index === activeIndex ? "is-active" : ""}${value === option ? " is-selected" : ""}`}
                id={`${id}-option-${index}`}
                key={option}
                onClick={() => selectOption(option)}
                onMouseEnter={() => setActiveIndex(index)}
                role="option"
              >
                <span>{option}</span>
                {value === option ? <span aria-hidden="true">✓</span> : null}
              </li>
            ))}
          </motion.ul>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export function ContactForm({ variant, idPrefix }: ContactFormProps) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  function update(field: keyof FormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSubmitted(false);
  }

  function validate() {
    const nextErrors: Partial<Record<keyof FormValues, string>> = {};
    if (!values.name.trim()) nextErrors.name = "Please add your name.";
    if (!values.email.trim()) nextErrors.email = "Please add your work email.";
    else if (!/^\S+@\S+\.\S+$/.test(values.email)) nextErrors.email = "Please check the email format.";
    if (!values.company.trim()) nextErrors.company = "Please add your company.";
    if (!values.focus) nextErrors.focus = "Please choose one option.";
    if (!values.message.trim()) nextErrors.message = "Please tell us a little about the project.";
    return nextErrors;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      setSubmitted(true);
    }
  }

  const fieldId = (name: string) => `${idPrefix}-${name}`;

  return (
    <form className={`contact-form ${variant === "modal" ? "contact-form-modal" : ""}`} noValidate onSubmit={handleSubmit}>
      <div className="field field-name">
        <label htmlFor={fieldId("name")}>Name</label>
        <input aria-describedby={errors.name ? `${fieldId("name")}-error` : undefined} id={fieldId("name")} onChange={(event) => update("name", event.target.value)} value={values.name} />
        <span className="field-error" id={`${fieldId("name")}-error`}>{errors.name}</span>
      </div>
      <div className="field field-email">
        <label htmlFor={fieldId("email")}>Work email</label>
        <input aria-describedby={errors.email ? `${fieldId("email")}-error` : undefined} id={fieldId("email")} onChange={(event) => update("email", event.target.value)} type="email" value={values.email} />
        <span className="field-error" id={`${fieldId("email")}-error`}>{errors.email}</span>
      </div>
      <div className="field field-company">
        <label htmlFor={fieldId("company")}>Company</label>
        <input aria-describedby={errors.company ? `${fieldId("company")}-error` : undefined} id={fieldId("company")} onChange={(event) => update("company", event.target.value)} value={values.company} />
        <span className="field-error" id={`${fieldId("company")}-error`}>{errors.company}</span>
      </div>
      <div className="field field-focus">
        <label htmlFor={fieldId("focus")}>What do you need?</label>
        <CustomSelect
          describedBy={errors.focus ? `${fieldId("focus")}-error` : undefined}
          id={fieldId("focus")}
          onChange={(value) => update("focus", value)}
          value={values.focus}
        />
        <span className="field-error" id={`${fieldId("focus")}-error`}>{errors.focus}</span>
      </div>
      <div className="field field-message">
        <label htmlFor={fieldId("message")}>Tell us what you are trying to build or fix</label>
        <textarea aria-describedby={errors.message ? `${fieldId("message")}-error` : undefined} id={fieldId("message")} onChange={(event) => update("message", event.target.value)} value={values.message} />
        <span className="field-error" id={`${fieldId("message")}-error`}>{errors.message}</span>
      </div>
      {submitted ? <p className="form-success" role="status">Prototype only - no message was sent.</p> : null}
      <div className="form-actions">
        <button className="button button-lime" type="submit">
          Start the conversation <Arrow />
        </button>
        <span className="form-note">We’ll keep this first step focused and useful.</span>
      </div>
    </form>
  );
}

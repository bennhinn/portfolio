"use client";

import { useState, type FormEvent } from "react";

type Phase = "idle" | "sending" | "sent" | "error";
type Feedback = { phase: Phase; message: string };

const inquiryTypes = [
  "A software project",
  "A job opportunity",
  "Design & creative work",
  "Collaboration",
  "Something else",
] as const;

export default function Contact() {
  const [feedback, setFeedback] = useState<Feedback>({
    phase: "idle",
    message: "",
  });
  const [length, setLength] = useState(0);
  const isSending = feedback.phase === "sending";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSending) return;

    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    const fields = new FormData(form);
    const payload = {
      name: String(fields.get("name") || "").trim(),
      email: String(fields.get("email") || "").trim(),
      category: String(fields.get("category") || ""),
      message: String(fields.get("message") || "").trim(),
      website: String(fields.get("website") || ""),
    };

    setFeedback({ phase: "sending", message: "Sending your message…" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      let data: { error?: string } = {};
      try {
        data = await response.json();
      } catch {
        // A successful response may not contain JSON.
      }

      if (!response.ok) {
        throw new Error(
          data.error || "Your message could not be sent. Please try again later."
        );
      }

      setFeedback({
        phase: "sent",
        message: "Message delivered. Thank you for reaching out!",
      });
      form.reset();
      setLength(0);
    } catch (error) {
      setFeedback({
        phase: "error",
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again later.",
      });
    }
  }

  return (
    <section
      id="contact"
      className="lgc-contact"
      aria-labelledby="contact-heading"
    >
      {/* Color sits BEHIND the glass so backdrop-filter can refract it. */}
      <div className="lgc-ambient" aria-hidden="true">
        <span className="lgc-ambient-orb lgc-ambient-orb--one" />
        <span className="lgc-ambient-orb lgc-ambient-orb--two" />
        <span className="lgc-ambient-orb lgc-ambient-orb--three" />
        <span className="lgc-ambient-streak" />
      </div>

      <div className="lgc-container">
        <div className="lgc-meta">
          <span className="lgc-meta-section">
            <span className="lgc-status-dot" aria-hidden="true" />
            04 / CONTACT
          </span>
          <span>GOOD IDEAS START WITH A CONVERSATION</span>
        </div>

        <div className="lgc-layout">
          <div className="lgc-intro">
            <span className="lgc-kicker">
              AVAILABLE FOR MEANINGFUL WORK <span aria-hidden="true">✦</span>
            </span>

            <h2 id="contact-heading">
              Have a project
              <br />
              in <em>mind?</em>
            </h2>

            <p className="lgc-lead">
              Let’s turn an idea into something useful, memorable, and well built.
            </p>
            <p className="lgc-description">
              Whether you’re hiring, collaborating, or bringing a product to life,
              I’d love to hear what you’re working on.
            </p>

            <div className="lgc-services" aria-label="Ways we can work together">
              <span>Software development</span>
              <span>Technical opportunities</span>
              <span>Creative collaboration</span>
            </div>

            <div className="lgc-github">
              <span className="lgc-github-rule" aria-hidden="true" />
              <div>
                <strong>Want to explore my code first?</strong>
                <a
                  href="https://github.com/bennhinn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Explore GitHub <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
          </div>

          <div className="lgc-stage">
            <div className="lgc-stage-effects" aria-hidden="true">
              <span className="lgc-stage-glow lgc-stage-glow--cyan" />
              <span className="lgc-stage-glow lgc-stage-glow--violet" />
              <span className="lgc-stage-glow lgc-stage-glow--pink" />
              <span className="lgc-light-ribbon lgc-light-ribbon--one" />
              <span className="lgc-light-ribbon lgc-light-ribbon--two" />
            </div>

            <div className="lgc-panel">
              <div className="lgc-panel-content">
                <div className="lgc-panel-topline">
                  <span>OPEN CHANNEL / 001</span>
                  <span aria-hidden="true">✳</span>
                </div>

                <div className="lgc-form-header">
                  <span className="lgc-mail-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="5" width="18" height="14" rx="3" stroke="currentColor" strokeWidth="1.5" />
                      <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </span>
                  <div>
                    <p className="lgc-eyebrow">DIRECT LINE</p>
                    <h3>Get in touch.</h3>
                    <p className="lgc-form-subtitle">
                      Tell me a little about what you have in mind.
                    </p>
                  </div>
                </div>

                <form
                  className="lgc-form"
                  onSubmit={submit}
                  aria-label="Send a message to Bennhinn"
                  aria-busy={isSending}
                >
                  <div className="lgc-field-row">
                    <div className="lgc-field">
                      <label htmlFor="contact-name">Your name <span>*</span></label>
                      <input
                        id="contact-name"
                        name="name"
                        autoComplete="name"
                        required
                        minLength={2}
                        maxLength={100}
                        placeholder="What should I call you?"
                        disabled={isSending}
                      />
                    </div>
                    <div className="lgc-field">
                      <label htmlFor="contact-email">Email address <span>*</span></label>
                      <input
                        id="contact-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        maxLength={254}
                        placeholder="you@example.com"
                        disabled={isSending}
                      />
                    </div>
                  </div>

                  <div className="lgc-field">
                    <label htmlFor="contact-category">
                      What brings you here? <span>*</span>
                    </label>
                    <div className="lgc-select-wrap">
                      <select
                        id="contact-category"
                        name="category"
                        required
                        defaultValue=""
                        disabled={isSending}
                      >
                        <option value="" disabled>Choose an inquiry type</option>
                        {inquiryTypes.map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="lgc-field">
                    <div className="lgc-label-row">
                      <label htmlFor="contact-message">Your message <span>*</span></label>
                      <small>{length}/1500</small>
                    </div>
                    <textarea
                      id="contact-message"
                      name="message"
                      required
                      minLength={10}
                      maxLength={1500}
                      rows={5}
                      placeholder="Tell me about the idea, the challenge, or the opportunity…"
                      onChange={(event) => setLength(event.target.value.length)}
                      disabled={isSending}
                    />
                  </div>

                  <div className="lgc-honeypot" aria-hidden="true">
                    <label htmlFor="contact-website">Leave blank</label>
                    <input
                      id="contact-website"
                      name="website"
                      type="text"
                      autoComplete="off"
                      tabIndex={-1}
                    />
                  </div>

                  <button
                    className={`lgc-submit${feedback.phase === "sent" ? " is-delivered" : ""}`}
                    type="submit"
                    disabled={isSending}
                  >
                    <span>{isSending ? "Sending…" : "Send message"}</span>
                    <span className="lgc-submit-arrow" aria-hidden="true">
                      <img
                        src="/images/contact-glass-arrow.webp"
                        width="48"
                        height="48"
                        alt=""
                        draggable={false}
                      />
                    </span>
                  </button>

                  <p
                    className={`lgc-feedback${feedback.phase === "error" ? " is-error" : ""}${feedback.phase === "sent" ? " is-success" : ""}`}
                    role="status"
                    aria-live="polite"
                    aria-atomic="true"
                  >
                    {feedback.message || "Your details are used only to respond to your inquiry."}
                  </p>
                </form>
              </div>
            </div>

            <span className="lgc-floating-arrow" aria-hidden="true">
              <img
                src="/images/contact-glass-arrow.webp"
                width="110"
                height="110"
                alt=""
                draggable={false}
              />
            </span>
          </div>
        </div>

        <footer className="lgc-footer">
          <a className="lgc-footer-brand" href="#home">BM<span>.</span></a>
          <span>Designed &amp; built with purpose.</span>
          <a href="#home">Back to top ↑</a>
          <span>© {new Date().getFullYear()} Bennhinn Mwangi</span>
        </footer>
      </div>
    </section>
  );
}

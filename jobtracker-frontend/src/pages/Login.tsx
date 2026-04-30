import { useState } from "react";
import type { FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import API from "../api/axios";

type AuthMode = "login" | "register";

const defaultRegisterForm = {
  name: "",
  email: "",
  password: "",
};

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registerForm, setRegisterForm] = useState(defaultRegisterForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [messageTone, setMessageTone] = useState<"error" | "success">("error");

  if (localStorage.getItem("token")) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    setMessageTone("error");

    try {
      const response = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      setErrorMessage(
        axios.isAxiosError(error)
          ? (error.response?.data?.message ??
            "We couldn't sign you in. Check your credentials and try again.")
          : "We couldn't sign you in. Check your credentials and try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    setMessageTone("error");

    try {
      await API.post("/auth/register", registerForm);
      setMode("login");
      setEmail(registerForm.email);
      setPassword(registerForm.password);
      setRegisterForm(defaultRegisterForm);
      setErrorMessage("Account created. You can sign in now.");
      setMessageTone("success");
    } catch (error) {
      console.error(error);
      setErrorMessage(
        axios.isAxiosError(error)
          ? (error.response?.data?.message ??
            "Registration failed. Try a different email or check the backend.")
          : "Registration failed. Try a different email or check the backend.",
      );
      setMessageTone("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <section className="auth-hero">
        <p className="eyebrow">Built for job hunts with momentum</p>
        <h1>Keep every application moving.</h1>
        <p className="auth-copy">
          Organize the companies you apply to, track every interview stage, and
          stay focused on what needs attention next.
        </p>

        <div className="auth-stats">
          <div className="stat-card">
            <strong>1 dashboard</strong>
            <span>See your whole pipeline at a glance.</span>
          </div>
          <div className="stat-card">
            <strong>4 stages</strong>
            <span>Applied, interview, offer, rejected.</span>
          </div>
          <div className="stat-card">
            <strong>Fast setup</strong>
            <span>Create an account and start tracking in minutes.</span>
          </div>
        </div>
      </section>

      <section className="auth-panel">
        <div className="tab-row">
          <button
            className={`tab-button ${mode === "login" ? "active" : ""}`}
            onClick={() => {
              setMode("login");
              setErrorMessage("");
              setMessageTone("error");
            }}
            type="button"
          >
            Login
          </button>
          <button
            className={`tab-button ${mode === "register" ? "active" : ""}`}
            onClick={() => {
              setMode("register");
              setErrorMessage("");
              setMessageTone("error");
            }}
            type="button"
          >
            Register
          </button>
        </div>

        <div className="auth-card">
          <h2>{mode === "login" ? "Welcome back" : "Create your account"}</h2>
          <p className="subtle">
            {mode === "login"
              ? "Sign in to manage your application pipeline."
              : "Start tracking your job search with your own private dashboard."}
          </p>

          {errorMessage ? (
            <div className={`banner ${messageTone === "success" ? "banner-success" : "banner-error"}`}>
              {errorMessage}
            </div>
          ) : null}

          {mode === "login" ? (
            <form className="stack" onSubmit={handleLogin}>
              <label className="field">
                <span>Email</span>
                <input
                  className="input"
                  placeholder="you@example.com"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </label>

              <label className="field">
                <span>Password</span>
                <input
                  className="input"
                  placeholder="Your password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </label>

              <button className="button" disabled={isSubmitting} type="submit">
                {isSubmitting ? "Signing in..." : "Login"}
              </button>
            </form>
          ) : (
            <form className="stack" onSubmit={handleRegister}>
              <label className="field">
                <span>Name</span>
                <input
                  className="input"
                  placeholder="Dimash"
                  value={registerForm.name}
                  onChange={(event) =>
                    setRegisterForm((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  required
                />
              </label>

              <label className="field">
                <span>Email</span>
                <input
                  className="input"
                  placeholder="you@example.com"
                  type="email"
                  value={registerForm.email}
                  onChange={(event) =>
                    setRegisterForm((current) => ({
                      ...current,
                      email: event.target.value,
                    }))
                  }
                  required
                />
              </label>

              <label className="field">
                <span>Password</span>
                <input
                  className="input"
                  placeholder="Create a password"
                  type="password"
                  value={registerForm.password}
                  onChange={(event) =>
                    setRegisterForm((current) => ({
                      ...current,
                      password: event.target.value,
                    }))
                  }
                  required
                />
              </label>

              <button className="button" disabled={isSubmitting} type="submit">
                {isSubmitting ? "Creating account..." : "Register"}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}

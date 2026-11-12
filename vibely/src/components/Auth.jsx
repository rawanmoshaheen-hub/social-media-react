
import { useState } from "react";
import {
  Heart,
  LockKeyhole,
  Mail,
  UserRound,
  Eye,
  EyeOff,
  CalendarDays,
} from "lucide-react";
import { apiRequest, saveToken } from "../api";

export default function Auth({ onAuthSuccess }) {
  const [mode, setMode] = useState("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
    gender: "",
  });

  const isSignup = mode === "signup";

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (isSignup) {
      const usernamePattern = /^[a-z0-9_]{3,30}$/;
      const passwordPattern =
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

      const username = form.username.trim().toLowerCase();

      if (!usernamePattern.test(username)) {
        setError(
          "اسم المستخدم يجب أن يكون من 3 إلى 30 حرفًا، باستخدام حروف إنجليزية صغيرة أو أرقام أو _ فقط."
        );
        return;
      }

      if (!passwordPattern.test(form.password)) {
        setError(
          "كلمة المرور يجب أن تكون 8 أحرف على الأقل، وتحتوي على حرف كبير وحرف صغير ورقم ورمز خاص."
        );
        return;
      }

      if (form.password !== form.confirmPassword) {
        setError("كلمتا المرور غير متطابقتين.");
        return;
      }

      if (!form.dateOfBirth || !form.gender) {
        setError("من فضلك أدخلي تاريخ الميلاد والنوع.");
        return;
      }
    }

    setLoading(true);

    try {
      const endpoint = isSignup
        ? "/users/signup"
        : "/users/signin";

      const body = isSignup
        ? {
            name: form.name.trim(),
            username: form.username.trim().toLowerCase(),
            email: form.email.trim(),
            password: form.password,
            rePassword: form.confirmPassword,
            dateOfBirth: form.dateOfBirth,
            gender: form.gender,
          }
        : {
            email: form.email.trim(),
            password: form.password,
          };

      const result = await apiRequest(endpoint, {
        method: "POST",
        body: JSON.stringify(body),
      });

      const data = result?.data;
      const token = data?.token ?? data?.accessToken;

      if (!token) {
        throw new Error(
          isSignup
            ? "تم إرسال الطلب، لكن لم يصل رمز الدخول من السيرفر. راجعي استجابة الـ API."
            : "لم يتم العثور على رمز الدخول في استجابة تسجيل الدخول."
        );
      }

      saveToken(token);
      onAuthSuccess(data);
    } catch (err) {
      setError(
        err.message || "حصل خطأ، حاولي مرة تانية."
      );
    } finally {
      setLoading(false);
    }
  }

  function switchMode(nextMode) {
    setMode(nextMode);
    setError("");
    setShowPassword(false);

    setForm({
      name: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      dateOfBirth: "",
      gender: "",
    });
  }

  return (
    <main className="auth-page">
      <div className="auth-decoration auth-decoration-one" />
      <div className="auth-decoration auth-decoration-two" />

      <section className="auth-card">
        <div className="auth-brand">
          <div className="auth-logo">
            <Heart size={27} fill="white" />
          </div>

          <h1>
            Vibely<span>.</span>
          </h1>

          <p>Your little corner of the internet.</p>
        </div>

        <div className="auth-tabs">
          <button
            type="button"
            className={!isSignup ? "selected" : ""}
            onClick={() => switchMode("signin")}
          >
            Sign In
          </button>

          <button
            type="button"
            className={isSignup ? "selected" : ""}
            onClick={() => switchMode("signup")}
          >
            Sign Up
          </button>
        </div>

        <div className="auth-heading">
          <h2>
            {isSignup
              ? "Create your account"
              : "Welcome back!"}
          </h2>

          <p>
            {isSignup
              ? "Join your circle and start sharing."
              : "Sign in to continue to your circle."}
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {isSignup && (
            <>
              <label htmlFor="auth-name">Full name</label>

              <div className="auth-input-wrap">
                <UserRound size={18} />

                <input
                  id="auth-name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  autoComplete="name"
                  required
                />
              </div>

              <label htmlFor="auth-username">Username</label>

              <div className="auth-input-wrap">
                <span className="auth-at">@</span>

                <input
                  id="auth-username"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="e.g. rawan_moshaheen"
                  autoComplete="username"
                  pattern="[a-zA-Z0-9_]{3,30}"
                  title="Use 3–30 English letters, numbers, or underscores."
                  required
                />
              </div>
            </>
          )}

          <label htmlFor="auth-email">
            {isSignup ? "Email address" : "Email or username"}
          </label>

          <div className="auth-input-wrap">
            <Mail size={18} />

            <input
              id="auth-email"
              name="email"
              type={isSignup ? "email" : "text"}
              value={form.email}
              onChange={handleChange}
              placeholder={
                isSignup
                  ? "you@example.com"
                  : "Email or username"
              }
              autoComplete={isSignup ? "email" : "username"}
              required
            />
          </div>

          {isSignup && (
            <>
              <label htmlFor="auth-dateOfBirth">
                Date of birth
              </label>

              <div className="auth-input-wrap">
                <CalendarDays size={18} />

                <input
                  id="auth-dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={form.dateOfBirth}
                  onChange={handleChange}
                  autoComplete="bday"
                  max={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>

              <label htmlFor="auth-gender">Gender</label>

              <div className="auth-input-wrap">
                <select
                  id="auth-gender"
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </>
          )}

          <label htmlFor="auth-password">Password</label>

          <div className="auth-input-wrap">
            <LockKeyhole size={18} />

            <input
              id="auth-password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete={
                isSignup ? "new-password" : "current-password"
              }
              minLength={isSignup ? 8 : 1}
              required
            />

            <button
              type="button"
              className="auth-show-password"
              onClick={() =>
                setShowPassword((value) => !value)
              }
              aria-label={
                showPassword ? "Hide password" : "Show password"
              }
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>

          {isSignup && (
            <>
              <label htmlFor="auth-confirm-password">
                Confirm password
              </label>

              <div className="auth-input-wrap">
                <LockKeyhole size={18} />

                <input
                  id="auth-confirm-password"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat your password"
                  autoComplete="new-password"
                  minLength={8}
                  required
                />
              </div>
            </>
          )}

          {error && (
            <div className="auth-error" role="alert">
              {error}
            </div>
          )}

          <button
            className="auth-submit"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : isSignup
                ? "Create Account"
                : "Sign In"}
          </button>
        </form>

        <p className="auth-switch">
          {isSignup
            ? "Already have an account?"
            : "New to Vibely?"}{" "}

          <button
            type="button"
            onClick={() =>
              switchMode(isSignup ? "signin" : "signup")
            }
          >
            {isSignup ? "Sign in" : "Create account"}
          </button>
        </p>

        <p className="auth-footer">
          Made for moments worth sharing 💜
        </p>
      </section>
    </main>
  );
}

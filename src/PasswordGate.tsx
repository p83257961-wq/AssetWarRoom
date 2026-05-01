import React, { useState, useEffect } from "react";

// SHA-256("840515")
const PASSWORD_HASH = "687370827457f52884991b0fa9e82c130f177db49fce87876bd7a89f50209361";
const STORAGE_KEY = "awr_auth_v1";

async function sha256Hex(input) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

const PasswordGate = ({ children }) => {
  const [authed, setAuthed] = useState(false);
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY) === "1") {
      setAuthed(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const hash = await sha256Hex(pwd);
      if (hash === PASSWORD_HASH) {
        sessionStorage.setItem(STORAGE_KEY, "1");
        setAuthed(true);
      } else {
        setError("密碼錯誤，請再試一次");
        setPwd("");
      }
    } catch (err) {
      setError("驗證失敗，請重新整理頁面");
    } finally {
      setLoading(false);
    }
  };

  if (authed) return React.createElement(React.Fragment, null, children);

  return React.createElement(
    "div",
    {
      style: {
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        fontFamily: "system-ui, -apple-system, sans-serif",
      },
    },
    React.createElement(
      "form",
      {
        onSubmit: handleSubmit,
        style: {
          background: "#fff",
          padding: "40px 36px",
          borderRadius: 12,
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          width: "100%",
          maxWidth: 360,
        },
      },
      React.createElement(
        "h1",
        { style: { margin: 0, marginBottom: 8, fontSize: 24, color: "#0f172a" } },
        "資產戰情室"
      ),
      React.createElement(
        "p",
        { style: { margin: 0, marginBottom: 24, color: "#64748b", fontSize: 14 } },
        "請輸入密碼以進入系統"
      ),
      React.createElement("input", {
        type: "password",
        value: pwd,
        onChange: (e) => setPwd(e.target.value),
        placeholder: "請輸入密碼",
        autoFocus: true,
        style: {
          width: "100%",
          padding: "12px 14px",
          fontSize: 16,
          border: "1px solid #cbd5e1",
          borderRadius: 8,
          outline: "none",
          boxSizing: "border-box",
          marginBottom: 12,
        },
      }),
      error
        ? React.createElement(
            "div",
            { style: { color: "#dc2626", fontSize: 13, marginBottom: 12 } },
            error
          )
        : null,
      React.createElement(
        "button",
        {
          type: "submit",
          disabled: loading || !pwd,
          style: {
            width: "100%",
            padding: "12px",
            fontSize: 15,
            fontWeight: 600,
            color: "#fff",
            background: loading || !pwd ? "#94a3b8" : "#0f172a",
            border: "none",
            borderRadius: 8,
            cursor: loading || !pwd ? "not-allowed" : "pointer",
          },
        },
        loading ? "驗證中..." : "進入"
      )
    )
  );
};

export default PasswordGate;

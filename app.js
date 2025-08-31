// app.js
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ⛳️ Your project values (use the ones you already have)
const supabase = createClient(
  "https://lqpxjyjzvabtpfdxxpjo.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxcHhqeWp6dmFidHBmZHh4cGpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1ODgxMDMsImV4cCI6MjA3MjE2NDEwM30.LZ5HWNh_smPcBg7cDKj3SPvs-0uPewLfXkjoNHNIGYE"
);

// Elements
const step2 = document.getElementById("step2");
const step3 = document.getElementById("step3");
const verificationForm = document.getElementById("verification-form");
const verifyError = document.getElementById("verify-error");

// Helpers
async function getPassphrase() {
  const { data, error } = await supabase
    .from("settings")
    .select("value")
    .eq("key", "student_passphrase")
    .single();

  if (error) {
    console.error("Failed to fetch passphrase:", error);
    return null;
  }
  return (data?.value || "").trim();
}

// --- Step 2: Verification ---
verificationForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("school-email").value.trim().toLowerCase();
  const pass = document.getElementById("passphrase").value.trim();

  const validPassphrase = await getPassphrase();
  if (!validPassphrase) {
    verifyError.textContent = "⚠️ Could not load passphrase. Try again later.";
    verifyError.style.display = "block";
    return;
  }

  if (pass !== validPassphrase) {
    verifyError.textContent = "❌ Incorrect passphrase. Try again.";
    verifyError.style.display = "block";
    return;
  }

  // Success → show signup/login
  verifyError.style.display = "none";
  step2.classList.add("student-hidden");
  step3.classList.remove("student-hidden");

  // Auto-fill email
  document.getElementById("signup-email").value = email;
  document.getElementById("login-email").value = email;
});

// --- Signup ---
document.getElementById("signup-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const first = document.getElementById("signup-first").value.trim();
  const last = document.getElementById("signup-last").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value.trim();

  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) {
    alert("Signup failed: " + error.message);
    return;
  }

  // If email confirmation is ON, there may be no session yet.
  // We’ll try to insert the profile only if we actually have a session/user.
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData?.user?.id || data?.user?.id;

  if (userId) {
    const { error: profileError } = await supabase.from("students").insert([{
      user_id: userId,
      first_name: first,
      last_name: last
    }]);
    if (profileError) {
      console.warn("Profile insert deferred (likely RLS / not logged in yet):", profileError.message);
      // Not fatal—user can finish profile after login.
    }
  }

  alert("Account created ✅ Check your email if confirmation is required.");
  window.location.href = "dashboard.html";
});

// --- Login ---
document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value.trim();

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    alert("Login failed: " + error.message);
    return;
  }
  window.location.href = "dashboard.html";
});

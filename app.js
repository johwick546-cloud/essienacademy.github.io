import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// 🔑 Replace with your Supabase project details
const supabase = createClient(
  "https://lqpxjyjzvabtpfdxxpjo.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
);

// Step elements
const step2 = document.getElementById("step2");
const step3 = document.getElementById("step3");
const verificationForm = document.getElementById("verification-form");
const verifyError = document.getElementById("verify-error");

// Fetch passphrase from Supabase
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
  return data.value;
}

// Verification step
verificationForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("school-email").value.toLowerCase().trim();
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
  step2.classList.add("hidden");
  step3.classList.remove("hidden");

  // Auto-fill email
  document.getElementById("signup-email").value = email;
  document.getElementById("login-email").value = email;
});

// Signup form
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

  // Save extra profile
  const { error: profileError } = await supabase.from("students").insert([{
    user_id: data.user.id,
    first_name: first,
    last_name: last
  }]);

  if (profileError) {
    alert("Failed to save profile: " + profileError.message);
  } else {
    alert("Account created ✅");
    window.location.href = "dashboard.html";
  }
});

// Login form
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

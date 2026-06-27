"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import NextLink from "next/link";

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$/;

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") ?? "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // Evaluaciones en tiempo real
  const hasMinLength = newPassword.length >= 8;
  const hasUpperCase = /[A-Z]/.test(newPassword);
  const hasLowerCase = /[a-z]/.test(newPassword);
  const hasNumber = /\d/.test(newPassword);
  const hasSpecialChar = /[^a-zA-Z\d]/.test(newPassword);

  const isPasswordValid = hasMinLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!isPasswordValid) {
      setErrorMsg("La contraseña no cumple con todos los requisitos de seguridad.");
      setStatus("error");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg("Las contraseñas no coinciden.");
      setStatus("error");
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch("/api/password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error ?? "Ocurrió un error.");
        setStatus("error");
        return;
      }

      setStatus("done");
      setTimeout(() => router.push("/admin/login"), 3000);
    } catch {
      setErrorMsg("No se pudo conectar. Intenta de nuevo.");
      setStatus("error");
    }
  };

  if (!token) {
    return (
      <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center space-y-3">
        <span className="material-symbols-outlined text-red-400 text-3xl">link_off</span>
        <p className="text-sm font-bold text-red-700">Enlace inválido</p>
        <p className="text-xs text-red-600 font-semibold">
          Este enlace no es válido. Solicita uno nuevo desde la página de inicio de sesión.
        </p>
        <NextLink
          href="/admin/forgot-password"
          className="inline-block mt-2 text-xs font-bold text-primary hover:underline"
        >
          Solicitar nuevo enlace
        </NextLink>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {status === "error" && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-xs p-3.5 rounded-xl flex items-start gap-2 font-semibold">
          <span className="material-symbols-outlined text-base mt-0.5 shrink-0">error</span>
          <span>{errorMsg}</span>
        </div>
      )}

      {/* New Password */}
      <div className="flex flex-col">
        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
          Nueva contraseña
        </label>
        <div className="relative flex items-center bg-slate-50 border border-slate-100 rounded-xl focus-within:border-primary/40 focus-within:ring-1 focus-within:ring-primary/40 transition-all px-4 py-3">
          <span className="material-symbols-outlined text-slate-400 mr-3 text-lg leading-none">lock</span>
          <input
            type={showNew ? "text" : "password"}
            required
            disabled={status === "loading" || status === "done"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Introduce la contraseña"
            className="w-full bg-transparent border-none focus:outline-none focus:ring-0 p-0 text-slate-800 text-sm font-semibold placeholder:text-slate-400/80"
          />
          <button
            type="button"
            onClick={() => setShowNew(!showNew)}
            className="text-slate-400 hover:text-slate-600 transition-colors ml-2 flex items-center focus:outline-none"
          >
            <span className="material-symbols-outlined text-lg leading-none">
              {showNew ? "visibility_off" : "visibility"}
            </span>
          </button>
        </div>
      </div>

      {/* Requisitos de seguridad (Feedback Visual Interactivo) */}
      {newPassword && (
        <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-3.5 space-y-2">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Requisitos de seguridad:</p>
          <ul className="space-y-1.5 text-xs font-semibold text-slate-500 list-none p-0 m-0">
            <li className="flex items-center gap-2">
              <span className={`material-symbols-outlined text-base ${hasMinLength ? "text-green-500" : "text-slate-300"}`}>
                {hasMinLength ? "check_circle" : "radio_button_unchecked"}
              </span>
              <span className={hasMinLength ? "text-green-600 line-through opacity-70" : ""}>Mínimo 8 caracteres</span>
            </li>
            <li className="flex items-center gap-2">
              <span className={`material-symbols-outlined text-base ${hasUpperCase ? "text-green-500" : "text-slate-300"}`}>
                {hasUpperCase ? "check_circle" : "radio_button_unchecked"}
              </span>
              <span className={hasUpperCase ? "text-green-600 line-through opacity-70" : ""}>Al menos una letra mayúscula</span>
            </li>
            <li className="flex items-center gap-2">
              <span className={`material-symbols-outlined text-base ${hasLowerCase ? "text-green-500" : "text-slate-300"}`}>
                {hasLowerCase ? "check_circle" : "radio_button_unchecked"}
              </span>
              <span className={hasLowerCase ? "text-green-600 line-through opacity-70" : ""}>Al menos una letra minúscula</span>
            </li>
            <li className="flex items-center gap-2">
              <span className={`material-symbols-outlined text-base ${hasNumber ? "text-green-500" : "text-slate-300"}`}>
                {hasNumber ? "check_circle" : "radio_button_unchecked"}
              </span>
              <span className={hasNumber ? "text-green-600 line-through opacity-70" : ""}>Al menos un número</span>
            </li>
            <li className="flex items-center gap-2">
              <span className={`material-symbols-outlined text-base ${hasSpecialChar ? "text-green-500" : "text-slate-300"}`}>
                {hasSpecialChar ? "check_circle" : "radio_button_unchecked"}
              </span>
              <span className={hasSpecialChar ? "text-green-600 line-through opacity-70" : ""}>Al menos un símbolo (ej. @, $, !, %, *)</span>
            </li>
          </ul>
        </div>
      )}

      {/* Confirm Password */}
      <div className="flex flex-col">
        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
          Confirmar contraseña
        </label>
        <div className="relative flex items-center bg-slate-50 border border-slate-100 rounded-xl focus-within:border-primary/40 focus-within:ring-1 focus-within:ring-primary/40 transition-all px-4 py-3">
          <span className="material-symbols-outlined text-slate-400 mr-3 text-lg leading-none">lock_clock</span>
          <input
            type={showConfirm ? "text" : "password"}
            required
            disabled={status === "loading" || status === "done"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repite la contraseña"
            className="w-full bg-transparent border-none focus:outline-none focus:ring-0 p-0 text-slate-800 text-sm font-semibold placeholder:text-slate-400/80"
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="text-slate-400 hover:text-slate-600 transition-colors ml-2 flex items-center focus:outline-none"
          >
            <span className="material-symbols-outlined text-lg leading-none">
              {showConfirm ? "visibility_off" : "visibility"}
            </span>
          </button>
        </div>
      </div>

      {status === "done" ? (
        <div className="bg-green-50 border border-green-100 rounded-2xl p-5 text-center space-y-2">
          <span className="material-symbols-outlined text-green-500 text-3xl">check_circle</span>
          <p className="text-sm font-bold text-green-700">¡Contraseña actualizada!</p>
          <p className="text-xs text-green-600 font-semibold">
            Redirigiendo al inicio de sesión...
          </p>
        </div>
      ) : (
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full bg-primary hover:bg-primary/90 disabled:opacity-60 text-white font-bold py-3.5 px-6 rounded-full text-sm transition-all active:scale-[0.98] shadow-md shadow-primary/10 flex items-center justify-center gap-2 cursor-pointer border-none"
        >
          {status === "loading" ? (
            <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
          ) : (
            <>
              <span className="material-symbols-outlined text-lg leading-none">key</span>
              Guardar nueva contraseña
            </>
          )}
        </button>
      )}
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 p-8 md:p-10 space-y-6">

          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-primary text-2xl">key</span>
            </div>
            <h1 className="font-headline text-2xl font-extrabold text-slate-800 tracking-tight">
              Nueva contraseña
            </h1>
            <p className="text-sm text-slate-400 font-semibold leading-relaxed">
              Elige una contraseña segura para tu cuenta de DELLCOM.
            </p>
          </div>

          <Suspense fallback={<div className="text-center text-sm text-slate-400 py-4">Cargando...</div>}>
            <ResetPasswordForm />
          </Suspense>

          {/* Back Link */}
          <div className="text-center pt-2">
            <NextLink
              href="/admin/login"
              className="text-xs font-bold text-slate-400 hover:text-slate-700 transition-colors inline-flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm leading-none">arrow_back</span>
              Volver al inicio de sesión
            </NextLink>
          </div>
        </div>
      </div>
    </div>
  );
}

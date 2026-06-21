export const detectFileType = (name: string, url: string): "programa" | "driver" | "excel" | "link" => {
  const n = name.toLowerCase();
  const u = url.toLowerCase();

  if (
    n.endsWith(".pdf") || u.includes(".pdf") || n.includes(" pdf") ||
    n.endsWith(".xlsx") || n.endsWith(".xls") || n.endsWith(".csv") ||
    u.includes(".xlsx") || u.includes(".xls") || u.includes(".csv") ||
    n.includes("excel") || n.includes("planilla") || n.includes("documento") || n.includes("ficha tecnica")
  ) {
    return "excel";
  }

  if (
    n.includes("driver") || n.includes("controlador") || n.includes("drv") ||
    u.includes("driver") || u.includes("controlador") || u.includes("drv") ||
    n.endsWith(".inf") || u.includes(".inf")
  ) {
    return "driver";
  }

  if (
    n.endsWith(".exe") || n.endsWith(".msi") || u.includes(".exe") || u.includes(".msi") ||
    n.includes("setup") || n.includes("install") || n.includes("utility") || n.includes("utilities") ||
    n.includes("programa") || n.includes("aplicacion") || n.includes("anydesk") || n.includes("soporte")
  ) {
    return "programa";
  }

  if (u.startsWith("http://") || u.startsWith("https://")) {
    return "link";
  }

  return "programa";
};

export const formatDate = (dateStr: string | null): string => {
  if (!dateStr) return "Sin fecha";
  const date = new Date(dateStr);
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const getLicenseUrgency = (dateStr: string | null): "ok" | "warning" | "expired" => {
  if (!dateStr) return "ok";
  const expiration = new Date(dateStr);
  const today = new Date();
  const diffTime = expiration.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "expired";
  if (diffDays <= 10) return "warning";
  return "ok";
};

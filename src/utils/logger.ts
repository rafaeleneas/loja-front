type LogContext = Record<string, unknown>;

function formatContext(context?: LogContext): LogContext | undefined {
  if (!context || Object.keys(context).length === 0) return undefined;
  return context;
}

function normalizeError(error: unknown): LogContext | undefined {
  if (!error) return undefined;
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message
    };
  }

  return {
    error
  };
}

function logWithConsole(method: "info" | "warn" | "error", message: string, context?: LogContext): void {
  const payload = formatContext(context);
  if (payload) {
    console[method](`[loja-front] ${message}`, payload);
    return;
  }

  console[method](`[loja-front] ${message}`);
}

export const logger = {
  info(message: string, context?: LogContext): void {
    if (!import.meta.env.DEV) return;
    logWithConsole("info", message, context);
  },

  warn(message: string, context?: LogContext): void {
    logWithConsole("warn", message, context);
  },

  error(message: string, error?: unknown, context?: LogContext): void {
    logWithConsole("error", message, {
      ...formatContext(context),
      ...normalizeError(error)
    });
  }
};

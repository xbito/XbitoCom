type LogLevel = 'info' | 'warn' | 'error';

function getTimestamp(): string {
  return new Date().toISOString();
}

function getLevelColor(level: LogLevel): string {
  switch (level) {
    case 'info':
      return 'color: #22c55e; font-weight: 600;';
    case 'warn':
      return 'color: #f59e0b; font-weight: 600;';
    case 'error':
      return 'color: #ef4444; font-weight: 700;';
    default:
      return 'color: white;';
  }
}

export function logStage(level: LogLevel, stage: string, message: string, meta?: unknown): void {
  const prefix = `[${getTimestamp()}] [${stage}]`;
  const style = getLevelColor(level);

  if (meta !== undefined) {
    console.log(`%c${prefix} ${message}`, style, meta);
    return;
  }

  console.log(`%c${prefix} ${message}`, style);
}

export function logInfo(stage: string, message: string, meta?: unknown): void {
  logStage('info', stage, message, meta);
}

export function logWarn(stage: string, message: string, meta?: unknown): void {
  logStage('warn', stage, message, meta);
}

export function logError(stage: string, message: string, meta?: unknown): void {
  logStage('error', stage, message, meta);
}

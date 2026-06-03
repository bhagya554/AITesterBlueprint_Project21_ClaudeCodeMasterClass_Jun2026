/**
 * Layer 2 - Core/Utils
 * Tiny structured logger. Keeps test output greppable and timestamped.
 */
type Level = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

function emit(level: Level, scope: string, msg: string): void {
  const ts = new Date().toISOString();
  // eslint-disable-next-line no-console
  console.log(`[${ts}] [${level}] [${scope}] ${msg}`);
}

export class Logger {
  constructor(private readonly scope: string) {}

  info(msg: string): void {
    emit('INFO', this.scope, msg);
  }

  warn(msg: string): void {
    emit('WARN', this.scope, msg);
  }

  error(msg: string): void {
    emit('ERROR', this.scope, msg);
  }

  debug(msg: string): void {
    if (process.env.DEBUG) emit('DEBUG', this.scope, msg);
  }
}

export const createLogger = (scope: string): Logger => new Logger(scope);

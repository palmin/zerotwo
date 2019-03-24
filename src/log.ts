import { app, remote } from 'electron';
import fs from 'fs';
import { join } from 'lodash';
import moment from 'moment';
import path from 'path';

enum Logs {
  STDOUT = 'stdoutLogFileName',
  ERROR = 'errorLogFileName',
  WARNING = 'warningLogFileName',
}

enum Severity {
  LOG = 'log',
  WARNING = 'warn',
  ERROR = 'error',
}

interface ILog {
  stdoutLogFileName: string;
  errorLogFileName: string;
  warningLogFileName: string;
}

class Log {
  private readonly stdoutLogFileName: string;
  private readonly errorLogFileName: string;
  private readonly warningLogFileName: string;
  private readonly app: Electron.App;

  constructor(options: ILog) {
    this.stdoutLogFileName = options.stdoutLogFileName;
    this.errorLogFileName = options.errorLogFileName;
    this.warningLogFileName = options.warningLogFileName;

    // This is the instance of the Electron app
    this.app = !remote ? app : remote.app;

    this.checkLogPaths();
  }

  public log(severity: Severity, categories: string[], ...data: any): void {
    const joinedCategories: string[] = [severity, ...categories];
    console[severity](joinedCategories, ...data);

    let logMode = Logs.STDOUT;
    switch (severity) {
      case Severity.ERROR:
        logMode = Logs.ERROR;
        break;
      case Severity.WARNING:
        logMode = Logs.WARNING;
        break;
      default:
        break;
    }

    this.writeToLog(logMode, joinedCategories, data);
  }

  public getLogSeverity(): Severity {
    return Severity.LOG;
  }

  public getErrorSeverity(): Severity {
    return Severity.ERROR;
  }

  public getWarnSeverity(): Severity {
    return Severity.WARNING;
  }

  private writeToLog(logFile: Logs, categories: string[], ...data: any) {
    const currentDate = moment();
    const formattedTime = currentDate.format('YYYYMMDD/HHmmss');
    const formattedLog = `${formattedTime}: [${join(categories)}] ${join(data, '')}\r\n`;
    fs.appendFileSync(this.getPathOf(logFile), formattedLog);
  }

  private getPathOf(logFile: Logs) {
    const logDir = this.app.getPath('userData');

    return path.join(logDir, this[logFile]);
  }

  private checkLogPaths(): void {
    // Each Log file is created if not yet existing
    if (!fs.existsSync(this.getPathOf(Logs.STDOUT))) {
      fs.appendFileSync(this.getPathOf(Logs.STDOUT), '');
      this.writeToLog(Logs.STDOUT, ['initialize', 'main'], 'Log started.');
    }

    if (!fs.existsSync(this.getPathOf(Logs.ERROR))) {
      fs.appendFileSync(this.getPathOf(Logs.ERROR), '');
      this.writeToLog(Logs.ERROR, ['initialize', 'main'], 'Log started.');
    }

    if (!fs.existsSync(this.getPathOf(Logs.WARNING))) {
      fs.appendFileSync(this.getPathOf(Logs.WARNING), '');
      this.writeToLog(Logs.WARNING, ['initialize', 'main'], 'Log started.');
    }
  }
}

export default new Log({
  stdoutLogFileName: process.env.VUE_APP_STDOUT_LOG_FILENAME as string,
  errorLogFileName: process.env.VUE_APP_ERROR_LOG_FILENAME as string,
  warningLogFileName: process.env.VUE_APP_WARNING_LOG_FILENAME as string,
});

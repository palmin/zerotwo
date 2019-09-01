// import { app, remote } from 'electron';
// import fs from 'fs';
// import { join } from 'lodash';
// import moment from 'moment';
// import path from 'path';

/**
 * @enum Logs
 * @description contains the keys to the Log-Interface
 */
enum Logs {
  STDOUT = 'stdoutLogFileName',
  ERROR = 'errorLogFileName',
  WARNING = 'warningLogFileName',
}

/**
 * @enum Severity
 * @description contains the function name to the console class
 */
enum Severity {
  LOG = 'log',
  WARNING = 'warn',
  ERROR = 'error',
}

/**
 * @interface ILog
 * @description descrtibes the file names of each log file
 */
interface ILog {
  stdoutLogFileName: string;
  errorLogFileName: string;
  warningLogFileName: string;
}

/**
 * @class Log
 */
class Log {
  /**
   * @private
   * @readonly
   * @var {string} stdoutLogFileName contains the file name of the standard out logs
   */
  private readonly stdoutLogFileName: string;

  /**
   * @private
   * @readonly
   * @var {string} errorLogFileName contains the file name of the error logs
   */
  private readonly errorLogFileName: string;

  /**
   * @private
   * @readonly
   * @var {string} warningLogFileName contains the file name of the warning logs
   */
  private readonly warningLogFileName: string;

  /**
   * @private
   * @readonly
   * @var {string} app contains the instance of the current electron app
   */
  // private readonly app: Electron.App;

  /**
   * @constructor
   * @param {ILog} options contains the options for the logger
   */
  constructor(options: ILog) {
    this.stdoutLogFileName = options.stdoutLogFileName;
    this.errorLogFileName = options.errorLogFileName;
    this.warningLogFileName = options.warningLogFileName;

    // This is the instance of the Electron app
    // this.app = !remote ? app : remote.app;

    // Checks the paths of each log file
    // and creates the file if it doesn't exist yet
    // this.checkLogPaths();
  }

  /**
   * @method log
   * @param {Severity} severity contains the severity level
   * @param {string[]} categories contains the categories of the current log position
   * @param {any} data contains all the remaining parameters
   * @returns {void}
   */
  public log(severity: Severity, categories: string[], ...data: any): void {
    const joinedCategories: string[] = [severity, ...categories];
    console[severity](joinedCategories, ...data);

    // let logMode = Logs.STDOUT;
    // switch (severity) {
    //   case Severity.ERROR:
    //     logMode = Logs.ERROR;
    //     break;
    //   case Severity.WARNING:
    //     logMode = Logs.WARNING;
    //     break;
    //   default:
    //     break;
    // }

    // this.writeToLog(logMode, joinedCategories, data);
  }

  /**
   * @method getLogSeverity
   * @returns {Severity} the LOG severity level
   */
  public getLogSeverity(): Severity {
    return Severity.LOG;
  }

  /**
   * @method getErrorSeverity
   * @returns {Severity} the ERROR severity level
   */
  public getErrorSeverity(): Severity {
    return Severity.ERROR;
  }

  /**
   * @method getWarnSeverity
   * @returns {Severity} the WARNING severity level
   */
  public getWarnSeverity(): Severity {
    return Severity.WARNING;
  }

  /**
   * @private
   * @method writeToLog
   * @param {Logs} logFile the key of {this} Logger instance
   * @param {string[]} categories the categories of log action
   * @param {any} data the remaining parameters
   */
  // private writeToLog(logFile: Logs, categories: string[], ...data: any) {
  //   // const currentDate = moment();
  //   // const formattedTime = currentDate.format('YYYYMMDD/HHmmss');
  //   // const formattedLog = `${formattedTime}: [${join(categories)}] ${join(data, '')}\r\n`;
  //   // fs.appendFileSync(this.getPathOf(logFile), formattedLog);
  // }

  /**
   * @private
   * @method getPathOf
   * @param logFile the key of {this} Logger instance's log mode
   * @returns {string} the complete path of the log mode
   */
  // private getPathOf(logFile: Logs): string {
  //   // const logDir = this.app.getPath('userData');

  //   // return path.join(logDir, this[logFile]);

  //   return '';
  // }

  /**
   * @private
   * @method checkLogPaths
   * @description Creates app's log files if not yet existing
   * @returns {void}
   */
  // private checkLogPaths(): void {
  //   // Each Log file is created if not yet existing
  //   if (!fs.existsSync(this.getPathOf(Logs.STDOUT))) {
  //     fs.appendFile(this.getPathOf(Logs.STDOUT), '', (err) => {
  //       if (err) {
  //         return;
  //       }

  //       this.writeToLog(Logs.STDOUT, ['initialize', 'main'], 'Log started.');
  //     });
  //   }

  //   if (!fs.existsSync(this.getPathOf(Logs.ERROR))) {
  //     fs.appendFile(this.getPathOf(Logs.ERROR), '', (err) => {
  //       if (err) {
  //         return;
  //       }

  //       this.writeToLog(Logs.ERROR, ['initialize', 'main'], 'Log started.');
  //     });
  //   }

  //   if (!fs.existsSync(this.getPathOf(Logs.WARNING))) {
  //     fs.appendFile(this.getPathOf(Logs.WARNING), '', (err) => {
  //       if (err) {
  //         return;
  //       }
  //       // TODO: Write Error handler for this kind of file writing error!
  //       this.writeToLog(Logs.WARNING, ['initialize', 'main'], 'Log started.');
  //     });
  //   }
  // }
}

export default new Log({
  stdoutLogFileName: process.env.VUE_APP_STDOUT_LOG_FILENAME as string,
  errorLogFileName: process.env.VUE_APP_ERROR_LOG_FILENAME as string,
  warningLogFileName: process.env.VUE_APP_WARNING_LOG_FILENAME as string,
});

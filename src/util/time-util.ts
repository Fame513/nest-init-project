export class TimeUtil {
  static getUnixTime(): number {
    return Math.floor(Date.now() / 1000);
  }
}

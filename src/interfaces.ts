export interface IWatchFileSystem {
  watch(
    files: string[],
    dirs: string[],
    missing: string[],
    startTime: number,
    options: any,
    callback: WatchFileSystemCallback,
    callbackUndelayed: () => void,
  ): void;
}

// include or not
export type WatchFileSystemFilter = (file: string) => boolean;

export type WatchFileSystemCallback = (
  error: Error | null,
  filesModified?: string[],
  dirsModified?: string[],
  missingModified?: string[],
  fileTimestamps?: { [key: string]: number },
  dirTimestamps?: { [key: string]: number },
) => void;

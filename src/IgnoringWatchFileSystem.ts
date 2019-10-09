import { IWatchFileSystem, WatchFileSystemCallback, WatchFileSystemFilter } from './interfaces';

export class IgnoringWatchFileSystem {
  constructor(
    private readonly wfs: IWatchFileSystem,
    private readonly filter: WatchFileSystemFilter,
    private readonly debug: any,
  ) {}

  public watch(
    files: string[],
    dirs: string[],
    missing: string[],
    startTime: number,
    options: any,
    callback: WatchFileSystemCallback,
    callbackUndelayed: () => void,
  ) {
    const includedFiles: string[] = [];
    const includedDirs: string[] = [];
    const excludedFiles: string[] = [];
    const excludedDirs: string[] = [];
    separate(this.filter, files, includedFiles, excludedFiles);
    separate(this.filter, dirs, includedDirs, excludedDirs);

    if (this.debug.enabled) {
      this.debug(`files:${stringifyList(files)}\ndirs:${stringifyList(dirs)}\nmissing:${stringifyList(missing)}`);
      this.debug(
        `includedFiles:${stringifyList(includedFiles)}\nincludedDirs:${stringifyList(
          includedDirs,
        )}\nexcludedFiles:${stringifyList(excludedFiles)}\nexcludedDirs:${stringifyList(excludedDirs)}`,
      );
    }

    return this.wfs.watch(
      includedFiles,
      includedDirs,
      missing,
      startTime,
      options,
      (error, filesModified, dirsModified, missingModified, fileTimestamps, dirTimestamps) => {
        if (error != null) {
          callback(error);
          return;
        }

        for (const p of excludedFiles) {
          fileTimestamps![p] = 1;
        }

        for (const p of excludedDirs) {
          dirTimestamps![p] = 1;
        }

        callback(null, filesModified, dirsModified, missingModified, fileTimestamps, dirTimestamps);
      },
      callbackUndelayed,
    );
  }
}

function separate(filter: WatchFileSystemFilter, list: string[], included: string[], excluded: string[]) {
  for (const file of list) {
    (filter(file) ? included : excluded).push(file);
  }
}

function stringifyList(list: string[]) {
  return `\n  ${list
    .map(it => (it.startsWith(process.cwd()) ? it.substring(process.cwd().length + 1) : it))
    .join(',\n  ')}`;
}

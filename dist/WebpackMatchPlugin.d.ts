import { Compiler } from "webpack";

declare module "webpack-match-plugin" {
  export class WatchFilterPlugin {
    private readonly filter;
    private readonly debug;
    constructor(filter: WatchFileSystemFilter, debug: any);
    apply(compiler: Compiler): void;
  }
  export type WatchFileSystemFilter = (file: string) => boolean;
  export type WatchFileSystemCallback = (error: Error | null, filesModified?: Array<string>, dirsModified?: Array<string>, missingModified?: Array<string>, fileTimestamps?: {
    [key: string]: number;
  }, dirTimestamps?: {
    [key: string]: number;
  }) => void;
}
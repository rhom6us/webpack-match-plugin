import { Compiler } from 'webpack';
import { IgnoringWatchFileSystem } from './IgnoringWatchFileSystem';
import { WatchFileSystemFilter } from './interfaces';
export class WatchFilterPlugin {
  constructor(private readonly filter: WatchFileSystemFilter, private readonly debug: any) {}
  public apply(compiler: Compiler) {
    compiler.hooks.afterEnvironment.tap('WatchFilterPlugin', () => {
      (compiler as any).watchFileSystem = new IgnoringWatchFileSystem(
        (compiler as any).watchFileSystem,
        this.filter,
        this.debug,
      );
    });
  }
}

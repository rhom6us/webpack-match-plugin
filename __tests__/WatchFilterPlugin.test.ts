import { WatchFilterPlugin } from '../src/WatchFilterPlugin';

test('My Greeter', () => {
    expect(new WatchFilterPlugin(file => true, null)).toBeDefined()
});
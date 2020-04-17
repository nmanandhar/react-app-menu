import expect from 'expect';
import {Keys} from "../index";

describe('Keys', () => {
    it('should trim keys', () => {
        expect(Keys.ctrl('  a  ')).toStrictEqual(['ctrl', 'a']);
        expect(Keys.alt('  A  ')).toStrictEqual(['alt', 'A']);
        expect(Keys.shift('F11  ')).toStrictEqual(['shift', 'F11']);
        expect(Keys.ctrlAlt('^')).toStrictEqual(['ctrl', 'alt', '^']);
        expect(Keys.ctrlAltShift(' F5 ')).toStrictEqual(['ctrl', 'alt', 'shift', 'F5']);
        expect(Keys.altShift(' F5 ')).toStrictEqual(['alt', 'shift', 'F5']);
        expect(Keys.ctrlShift(' F5 ')).toStrictEqual(['ctrl', 'shift', 'F5']);
    });
});

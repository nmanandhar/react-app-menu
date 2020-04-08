import React from 'react';
import {mount} from 'enzyme';
import {Menu} from '../src/menu/Menu';
import {MenuBar} from '../src/menu/MenuBar';
import sinon from 'sinon';

describe('HotKeys', () => {
    it('pressing hotKeys should invoke menu handler', function () {
        let onFileOpen = sinon.spy();

        const menuBarWrapper = mount(<MenuBar>
            <Menu label={'Open File'} hotKeys={["Ctrl", "O"]} onSelect={onFileOpen}/>
        </MenuBar>);

        document.dispatchEvent(new KeyboardEvent('keydown', {key: 'o', ctrlKey: true}));

        menuBarWrapper.unmount();

        sinon.assert.calledOnce(onFileOpen);
    });
});
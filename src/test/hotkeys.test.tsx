import React, {ReactElement} from 'react';
import {mount, ReactWrapper} from 'enzyme';
import {Menu} from '../menu/Menu';
import {MenuBar} from '../menu/MenuBar';
import sinon, {SinonSpy} from 'sinon';
import prettier from 'prettier';
import expect from 'expect';
import {CLASS_MENU_HOTKEY, CLASS_MENU_HOTKEY_DISABLED} from "../utils/constants";

type AppProps = { disableMenu: boolean };


describe('HotKeys', () => {
    let wrapper: ReactWrapper;
    let menuCallback: SinonSpy;
    let menubarCallback: SinonSpy;

    const mountComponent = (elm: ReactElement): ReactWrapper => {
        wrapper = mount(elm);
        return wrapper;
    };


    beforeEach(() => {
        // @ts-ignore
        wrapper = undefined;
        menuCallback = sinon.spy();
        menubarCallback = sinon.spy((menuKey) => {
        });
    });

    afterEach(() => {
        wrapper && wrapper.unmount();
    });

    const expectHotkeyToBeDisabled = () => {
        expect(wrapper.contains(<span className={`${CLASS_MENU_HOTKEY}`}>Ctrl O</span>)).toBe(false);
        expect(wrapper.contains(<span className={`${CLASS_MENU_HOTKEY} ${CLASS_MENU_HOTKEY_DISABLED}`}>Ctrl O</span>))
            .toBe(true);
    };

    const expectHotkeyToBeEnabled = () => {
        expect(wrapper.contains(<span className={`${CLASS_MENU_HOTKEY}`}>Ctrl O</span>)).toBe(true);
        expect(wrapper.contains(<span className={`${CLASS_MENU_HOTKEY} ${CLASS_MENU_HOTKEY_DISABLED}`}>Ctrl O</span>))
            .toBe(false);
    };


    it('should invoke onSelect prop of Menu when triggered', function () {
        mountComponent(<MenuBar>
            <Menu label={'Open File'} hotKeys={["Ctrl", "O"]} onSelect={menuCallback}/>
        </MenuBar>);

        sinon.assert.notCalled(menubarCallback);
        triggerHotKey();
        sinon.assert.calledOnce(menuCallback);
    });

    it('should invoke the onSelect prop of MenuBar if onSelect if menu has no onSelect prop', () => {
        mountComponent(<MenuBar onSelect={menubarCallback}>
            <Menu menuKey={'menuKeyOpenFile'} label={'Open File'} hotKeys={["Ctrl", "O"]}/>
        </MenuBar>);

        expectHotkeyToBeEnabled();
        triggerHotKey();

        sinon.assert.calledWith(menubarCallback, 'menuKeyOpenFile');

    });

    it('should show hotkey as disabled when no callbacks can be registered', () => {
        mountComponent(
            <MenuBar>
                <Menu label={'Open File'} hotKeys={["Ctrl", "O"]}/>
            </MenuBar>
        );

        expectHotkeyToBeDisabled();

    });


    it('should not be invoked for disabled menus', () => {
        mountComponent(
            <MenuBar>
                <Menu disabled={true} label={'Open File'} hotKeys={["Ctrl", "O"]} onSelect={menuCallback}/>
            </MenuBar>
        );

        expectHotkeyToBeDisabled();

        triggerHotKey();
        triggerHotKey();

        sinon.assert.notCalled(menubarCallback);
    });

    it('should not be invoked after menu transitions to disabled state', () => {
        type AppProps = { disableMenu: boolean };
        const TestApp: React.FC<AppProps> = ({disableMenu}) => (
            <MenuBar>
                <Menu disabled={disableMenu} label={'Open File'} hotKeys={["Ctrl", "O"]} onSelect={menubarCallback}/>
            </MenuBar>
        );

        mountComponent(<TestApp disableMenu={false}/>);
        expectHotkeyToBeEnabled();

        triggerHotKey();
        sinon.assert.calledOnce(menubarCallback);
        menubarCallback.resetHistory();

        wrapper.setProps({disableMenu: true});
        expectHotkeyToBeDisabled();

        triggerHotKey();
        triggerHotKey();

        sinon.assert.notCalled(menubarCallback);

    });

    it('should be invoked after menu transitions from disabled to enabled state', () => {

        const TestApp: React.FC<AppProps> = ({disableMenu}) => (
            <MenuBar>
                <Menu disabled={disableMenu} label={'Open File'} hotKeys={["Ctrl", "O"]} onSelect={menubarCallback}/>
            </MenuBar>
        );

        wrapper = mountComponent(<TestApp disableMenu={true}/>);
        expectHotkeyToBeDisabled();

        triggerHotKey();
        sinon.assert.notCalled(menubarCallback);

        // enable the menu again
        wrapper.setProps({disableMenu: false});
        expectHotkeyToBeEnabled();

        triggerHotKey();
        triggerHotKey();
        sinon.assert.calledTwice(menubarCallback);
    });

    it('should not be invoked after MenuBar is unmounted', () => {

        mountComponent(<MenuBar>
            <Menu label={'Open File'} hotKeys={["Ctrl", "O"]} onSelect={menubarCallback}/>
        </MenuBar>);

        triggerHotKey();
        sinon.assert.calledOnce(menubarCallback);


        wrapper.unmount();
        menubarCallback.resetHistory();

        triggerHotKey();
        triggerHotKey();
        sinon.assert.notCalled(menubarCallback);

        // @ts-ignore
        wrapper = null;
    });
});


function triggerHotKey() {
    document.dispatchEvent(new KeyboardEvent('keydown', {key: 'o', ctrlKey: true}));
}

function html(wrapper: ReactWrapper) {
    console.log(nice(wrapper.html()));
}

function nice(str: string): string {
    return prettier.format(str, {semi: false, parser: "html"});
}
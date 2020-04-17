import React from 'react';
import Enzyme, {ReactWrapper} from "enzyme";
import {MenuBar} from "../menu/MenuBar";
import {Menu} from "../menu/Menu";
import {Keys} from "../utils/Keys";
import sinon, {SinonSpy} from "sinon";
import {HOTKEY, HOTKEY_DISABLED, HOTKEY_INVISIBLE, LABEL, LABEL_CONTAINER} from "../utils/classNames";
import expect from 'expect';
import {getMenuLabelContainer} from "./testUtils";

const ctrlAlt = Keys.ctrlAlt;
const ctrl = Keys.ctrl;
const ctrlShift = Keys.ctrlShift;

describe('Hotkeys', () => {
    let onSelect_menuBar: SinonSpy;
    let onSelect_menu: SinonSpy;
    const _mountedComponents: Enzyme.ReactWrapper[] = [];
    const mount = (component: React.ReactElement) => {
        let wrapper = Enzyme.mount(component);
        _mountedComponents.push(wrapper);
        return wrapper;
    };

    beforeEach(() => {
        onSelect_menuBar = sinon.spy();
        onSelect_menu = sinon.spy();
    });

    afterEach(() => {
        let wrapper = _mountedComponents.pop();
        while (wrapper) {
            try {
                wrapper.unmount();
            } catch (e) {
            }
            wrapper = _mountedComponents.pop();
        }
    });


    describe('should not display', () => {
        it('for root menu', () => {
            let menubar = mount(<MenuBar onSelect={onSelect_menuBar}>
                <Menu label={'File'} menuId={'File'} hotKeys={ctrlAlt('F')}>
                    <Menu label={'New'} menuId={'New'} hotKeys={ctrlAlt('N')}/>
                </Menu>
            </MenuBar>);

            expect(hotKeyDisplayed(menubar, 'File')).toBe(false);
            expect(hotKeyDisplayed(menubar, 'New')).toBe(true);
        });

        it('when enableHotKeys is false', () => {
            let menubar = mount(<MenuBar onSelect={onSelect_menuBar} enableHotKeys={false}>
                <Menu label={'File'}>
                    <Menu label={'New'} menuId={'New'} hotKeys={ctrlAlt('N')}/>
                </Menu>
            </MenuBar>);

            expect(hotKeyDisplayed(menubar, 'New')).toBe(false);


            let menubar2 = mount(<MenuBar onSelect={onSelect_menuBar} enableHotKeys={true}>
                <Menu label={'File'}>
                    <Menu label={'New'} menuId={'New'} hotKeys={ctrlAlt('N')}/>
                </Menu>
            </MenuBar>);

            menubar2.setProps({enableHotKeys: false});
            expect(hotKeyDisplayed(menubar2, 'New')).toBe(false);
        });
    });


    describe('should display', () => {
        it('when enableHotKeys is true', () => {
            let menubar = mount(
                <MenuBar enableHotKeys={true} onSelect={onSelect_menuBar}>
                    <Menu label={'File'}>
                        <Menu label={'New'} menuId={'New'} hotKeys={ctrlAlt('N')}/>
                    </Menu>
                </MenuBar>
            );

            expect(hotKeyDisplayed(menubar, 'New')).toBe(true);
            expect(hotKeyDisabled(menubar, 'New')).toBe(false);

            let menubar2 = mount(
                <MenuBar enableHotKeys={false} onSelect={onSelect_menuBar}>
                    <Menu label={'File'}>
                        <Menu label={'New'} menuId={'New'} hotKeys={ctrlAlt('N')}/>
                    </Menu>
                </MenuBar>
            );
            menubar2.setProps({enableHotKeys: true});
            expect(hotKeyDisplayed(menubar2, 'New')).toBe(true);
            expect(hotKeyDisabled(menubar2, 'New')).toBe(false);
        });
    });

    describe('should be disabled', () => {
        it('when no callbacks can be registered', () => {
            let menubar = mount(
                <MenuBar>
                    <Menu label={'File'}>
                        <Menu label={'New'} hotKeys={ctrlAlt('N')}/>
                    </Menu>
                </MenuBar>
            );

            expect(hotKeyDisplayed(menubar, 'New')).toBe(true);
            expect(hotKeyDisabled(menubar, 'New')).toBe(true);


            const App = ({onNewSelect}: { onNewSelect: () => void }) => (
                <MenuBar>
                    <Menu label={'File'}>
                        <Menu label={'New'} hotKeys={ctrlAlt('N')} onSelect={onNewSelect}/>
                    </Menu>
                </MenuBar>
            );

            let app = mount(
                <App onNewSelect={onSelect_menu}/>
            );

            app.setProps({onNewSelect: undefined});
            expect(hotKeyDisabled(app, 'New')).toBe(true);
        });
    });


    describe('should not trigger', () => {
        it('for root menus', () => {
            mount(<MenuBar>
                <Menu label={'File'} menuId={'File'} hotKeys={ctrlAlt('F')} onSelect={onSelect_menu}/>
            </MenuBar>);

            trigger(ctrlAlt('F'));
            sinon.assert.notCalled(onSelect_menu);
        });

        it('for hidden menus', () => {
            const App = ({show}: { show: boolean }) => (
                <MenuBar>
                    <Menu label={'File'}>
                        <Menu show={show} label={'New'} hotKeys={ctrlAlt('N')} onSelect={onSelect_menu}/>
                    </Menu>
                </MenuBar>
            );

            //initially hidden
            mount(<App show={false}/>);
            trigger((ctrlAlt('N')));
            sinon.assert.notCalled(onSelect_menu);

            //initially visible but later changed to hidden
            let app = mount(<App show={true}/>);
            app.setProps({show: false});
            trigger((ctrlAlt('N')));
            sinon.assert.notCalled(onSelect_menu);
        });

        it('for unMounted menus', () => {
            const App = ({show}: { show: boolean }) => (
                <MenuBar>
                    <Menu label={'File'}>
                        {show && <Menu label={'New'} hotKeys={ctrlAlt('N')} onSelect={onSelect_menu}/>}
                    </Menu>
                </MenuBar>
            );

            let app = mount(<App show={true}/>);
            app.setProps({show: false});

            trigger(ctrlAlt('N'));
            sinon.assert.notCalled(onSelect_menu);
        });

        it('for disabled menus', () => {
            const App = ({disable}: { disable: boolean }) => (
                <MenuBar>
                    <Menu label={'File'}>
                        <Menu disabled={disable} label={'New'} hotKeys={ctrlAlt('N')} onSelect={onSelect_menu}/>
                    </Menu>
                </MenuBar>
            );

            mount(<App disable={true}/>);

            trigger(ctrlAlt('N'));
            sinon.assert.notCalled(onSelect_menu);

            let app = mount(<App disable={false}/>);
            app.setProps({disable: true});
            trigger(ctrlAlt('N'));
            sinon.assert.notCalled(onSelect_menu);
        });

        it('for previous hotKey when hotKey prop is changed', () => {
            const App = ({hotKey}: { hotKey: string[] }) => (
                <MenuBar>
                    <Menu label={'File'}>
                        <Menu label={'New'} hotKeys={hotKey} onSelect={onSelect_menu}/>
                    </Menu>
                </MenuBar>
            );

            let app = mount(<App hotKey={ctrl('N')}/>);
            app.setProps({hotKey: ctrlAlt('N')});

            trigger(ctrl('N'));
            sinon.assert.notCalled(onSelect_menu);

            trigger(ctrlAlt('N'));
            sinon.assert.calledOnce(onSelect_menu);
        });

        it('when Menubar.enableHotKeys is false', () => {
            const App = ({enableHotKey}: { enableHotKey: boolean }) => (
                <MenuBar enableHotKeys={enableHotKey}>
                    <Menu label={'File'}>
                        <Menu label={'New'} hotKeys={ctrlAlt('N')} onSelect={onSelect_menu}/>
                    </Menu>
                </MenuBar>
            );

            mount(<App enableHotKey={false}/>);
            trigger(ctrlAlt('N'));
            sinon.assert.notCalled(onSelect_menu);


            let app = mount(<App enableHotKey={true}/>);
            app.setProps({enableHotKey: false});
            trigger(ctrlAlt('N'));
            sinon.assert.notCalled(onSelect_menu);
        });

        it('when MenuBar is unmounted', () => {
            let menuBar = mount(<MenuBar enableHotKeys={true}>
                <Menu label={'File'}>
                    <Menu label={'New'} hotKeys={ctrlAlt('N')} onSelect={onSelect_menu}/>
                </Menu>
            </MenuBar>);

            menuBar.unmount();
            trigger(ctrlAlt('N'));
            sinon.assert.notCalled(onSelect_menu);
        });

        it('for menus that have no onSelect handler and no menuId', () => {
            mount(<MenuBar onSelect={onSelect_menuBar}>
                <Menu label={'File'}>
                    <Menu label={'New'} hotKeys={ctrlAlt('N')}/>
                </Menu>
            </MenuBar>);

            trigger(ctrlAlt('N'));

            sinon.assert.notCalled(onSelect_menuBar);
        });

        it('for menus not rendered within MenuBar', () => {
            mount(<Menu label={'File'}>
                <Menu label={'New'} hotKeys={ctrlAlt('N')} onSelect={onSelect_menu}/>
            </Menu>);

            trigger(ctrlAlt('N'));
            sinon.assert.notCalled(onSelect_menu);
        });

    });

    describe('should trigger', () => {

        it('for both lowercase and uppercase key', () => {
            mount(<MenuBar>
                <Menu label={'File'}>
                    <Menu label={'New'} hotKeys={ctrlAlt('N')} onSelect={onSelect_menu}/>
                </Menu>
            </MenuBar>);
            trigger(ctrlAlt('n'));
            trigger(ctrlAlt('N'));
            sinon.assert.calledTwice(onSelect_menu);
        });


        it('for new hotKey when hotKey prop is changed', () => {
            const App = ({hotKey}: { hotKey: string[] }) => (
                <MenuBar>
                    <Menu label={'File'}>
                        <Menu label={'New'} hotKeys={hotKey} onSelect={onSelect_menu}/>
                    </Menu>
                </MenuBar>
            );
            let app = mount(<App hotKey={ctrl('n')}/>);

            app.setProps({hotKey: ctrlShift('N')})

            trigger(ctrl('n'));
            sinon.assert.notCalled(onSelect_menu);

            trigger(ctrlShift('N'));
            sinon.assert.calledOnce(onSelect_menu);
        });
    });


    describe('when triggered', () => {
        it('should invoke onSelect callback of  menus that that have an onSelect handler', () => {
            mount(<MenuBar>
                <Menu label={'File'}>
                    <Menu label={'New'} hotKeys={ctrlAlt('N')} onSelect={onSelect_menu}/>
                </Menu>
            </MenuBar>);

            trigger(ctrlAlt('N'));
            sinon.assert.calledOnce(onSelect_menu);
        });


        it('should invoke onSelect callback of Menubar with menuId for menus that have menuId but not onSelect hander', () => {
            mount(<MenuBar onSelect={onSelect_menuBar}>
                <Menu label={'File'}>
                    <Menu label={'New'} menuId={'New'} hotKeys={ctrlAlt('N')}/>
                </Menu>
            </MenuBar>);

            trigger(ctrlAlt('N'));

            sinon.assert.calledOnce(onSelect_menuBar);
            sinon.assert.calledWith(onSelect_menuBar, "New");
        });

        it('should not invoke onSelect callback of Menubar if a onSelect handler is present in Menubar', () => {
            mount(<MenuBar onSelect={onSelect_menuBar}>
                <Menu label={'File'}>
                    <Menu label={'New'} menuId={'New'} hotKeys={ctrlAlt('N')} onSelect={onSelect_menu}/>
                </Menu>
            </MenuBar>);

            trigger(ctrlAlt('N'));
            sinon.assert.calledOnce(onSelect_menu);
            sinon.assert.notCalled(onSelect_menuBar);
        });

        it('should log a message to console when no handlers are found', () => {
            //never occurs
        });
    });

    describe('invalid hotKeys', () => {
        it('hotkeys with just modifiers are invalid', () => {
            let menuBar = mount(<MenuBar onSelect={onSelect_menuBar}>
                <Menu label={'File'}>
                    <Menu label={'New'} menuId={'New'} hotKeys={['ctrl']} onSelect={onSelect_menu}/>
                </Menu>
            </MenuBar>);

            expect(hotKeyDisabled(menuBar, 'New'));

            document.dispatchEvent(new KeyboardEvent('keydown', {
                key: 'Control',
                ctrlKey: true,
            }));

            sinon.assert.notCalled(onSelect_menu);
        });

        it('hotKeys with no modifiers are invalid', () => {
            let menuBar = mount(<MenuBar onSelect={onSelect_menuBar}>
                <Menu label={'File'}>
                    <Menu label={'New'} menuId={'New'} hotKeys={['a']} onSelect={onSelect_menu}/>
                </Menu>
            </MenuBar>);

            expect(hotKeyDisabled(menuBar, 'New'));

            document.dispatchEvent(new KeyboardEvent('keydown', {key: 'a'}));

            sinon.assert.notCalled(onSelect_menu);
        });

        it('hotKeys with multiple keys are invalid', () => {
            let menuBar = mount(<MenuBar onSelect={onSelect_menuBar}>
                <Menu label={'File'}>
                    <Menu label={'New'} menuId={'New'} hotKeys={['ctrl', 'a', 'b']} onSelect={onSelect_menu}/>
                </Menu>
            </MenuBar>);
            expect(hotKeyDisabled(menuBar, 'New'));

        });

        it('passing null to hotKeys does not break the app', () => {
            let hotKeys: string[] | undefined = undefined;
            // @ts-ignore
            hotKeys = null;

            let menuBar = mount(<MenuBar onSelect={onSelect_menuBar}>
                <Menu label={'File'}>
                    <Menu label={'New'} menuId={'New'} hotKeys={hotKeys} onSelect={onSelect_menu}/>
                </Menu>
            </MenuBar>);

            let menuLabelContainer = getMenuLabelContainer(menuBar, 'New');
            let html = menuLabelContainer?.html();
            expect(html).toEqual('<div class="reactAppMenubar--menu--labelContainer"><span class="reactAppMenubar--menu--icon reactAppMenubar--menu--icon-left"></span><span class="reactAppMenubar--menu--label">New</span></div>')
        });

    });

    describe('duplicate hotkeys', () => {
        it('should log a warning on console', () => {
            let warn = sinon.spy(console, "warn");
            try {
                let menuBar = mount(<MenuBar onSelect={onSelect_menuBar}>
                    <Menu label={'File'}>
                        <Menu label={'New'} menuId={'New'} hotKeys={ctrlAlt('N')} onSelect={onSelect_menu}/>
                        <Menu label={'New'} menuId={'New Folder'} hotKeys={ctrlAlt('n')} onSelect={onSelect_menu}/>
                    </Menu>
                </MenuBar>);

                expect(hotKeyDisplayed(menuBar, 'New'));
                expect(hotKeyDisplayed(menuBar, 'new Folder'));


                sinon.assert.calledOnce(warn);
                sinon.assert.calledWith(warn, 'Duplicate hotkey ctrl+alt+n. One of your hotkeys might not trigger');
            } finally {
                warn.restore();
            }
        });
    });
});

const trigger = (hotKey: string[]) => {
    let keys = hotKey.slice().map(key => key.toLowerCase());
    let ctrl = keys.indexOf("ctrl") > -1;
    let alt = keys.indexOf("alt") > -1;
    let shift = keys.indexOf("shift") > -1;

    keys = keys.filter(k => ["ctrl", "alt", "shift"].indexOf(k) < 0);
    if (keys.length !== 1) {
        throw new Error('Invalid hotkey');
    }

    document.dispatchEvent(new KeyboardEvent('keydown', {
        key: keys[0],
        ctrlKey: ctrl,
        altKey: alt,
        shiftKey: shift
    }));
};
const hotKeyDisplayed = (wrapper: ReactWrapper, menu: string): boolean => {
    let hotKeyEl = getHotKeyElementWrapper(wrapper, menu);
    if (hotKeyEl && !hotKeyEl.hasClass(HOTKEY_INVISIBLE)) {
        return true;
    }
    return false;
};
const hotKeyDisabled = (wrapper: ReactWrapper, menu: string): boolean => {
    let hotKeyEl = getHotKeyElementWrapper(wrapper, menu);
    if (hotKeyEl && hotKeyEl.hasClass(HOTKEY)) {
        if (hotKeyEl.hasClass(HOTKEY_DISABLED)) {
            return true;
        } else {
            return false;
        }
    }
    throw new Error('Hot key is not present');
};


const getHotKeyElementWrapper = (wrapper: ReactWrapper, menu: string) => {
    let hotKeyWrapper: ReactWrapper | undefined;
    wrapper.find(`.${LABEL_CONTAINER}`).forEach(labelContainer => {
        if (labelContainer.find(`.${LABEL}`).text() === menu) {
            hotKeyWrapper = labelContainer.find(`.${HOTKEY}`);
        }
    });
    if (hotKeyWrapper && hotKeyWrapper.length === 1) {
        return hotKeyWrapper;
    }
    return null;
};

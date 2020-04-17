import React from 'react';
import expect from 'expect';
import enzyme, {ReactWrapper} from 'enzyme';
import {Keys, Menu, MenuBar} from "..";
import {HOTKEY, HOTKEY_INVISIBLE, ICON, LABEL_CONTAINER, MENU} from "../utils/classNames";
import {activeMenu, cleanUp, getIconElement, mount, selectorRootMenu, selectorSubMenu, tryFocus} from "./testUtils";
import sinon, {SinonSpy} from "sinon";

describe('Menu', () => {
    afterEach(() => {
        cleanUp();
    });

    describe('show prop', () => {
        it('should not render menu when false', () => {
            let wrapper = mount(
                <MenuBar>
                    <Menu label={'Menu1'} show={false}/>
                </MenuBar>
            );
            expect(wrapper.find(`.${MENU}`).length).toBe(0);
        });

        it('should render menu when true', () => {
            let wrapper = mount(<MenuBar>
                <Menu label={'Menu1'} show={true}/>
            </MenuBar>);
            expect(wrapper.find(`.${MENU}`).length).toBe(1);
        });

    });

    describe('checked prop', () => {
        it('should render a checked icon when true', () => {
            let wrapper = mount(<MenuBar checkedIcon={"☑"}>
                <Menu label={'Root'}>
                    <Menu label={'Submenu'} checked={true}/>
                </Menu>
            </MenuBar>);
            let icon = wrapper.find(`.${ICON}`);
            expect(icon.text()).toBe("☑");
        });


        it('should have priority when both checked and icon props are set', () => {
            let wrapper = mount(<MenuBar checkedIcon={"☑"}>
                <Menu label={'RootMenu'}>
                    <Menu label={'Submenu'} checked={true} icon={"MyIcon"}/>
                </Menu>
            </MenuBar>);
            let icon = wrapper.find(`.${ICON}`);
            expect(icon.text()).toBe("☑");
        });
    });

    describe('icon', () => {
        it('can be text', () => {
            let menuBar = mount(<MenuBar>
                <Menu label={'File'}>
                    <Menu label={'Open'} icon='[]'/>
                </Menu>
            </MenuBar>);

            let icon = getIconElement(menuBar, 'Open');
            expect(icon?.html()).toBe(
                '<span class="reactAppMenubar--menu--icon reactAppMenubar--menu--icon-left">[]</span>')
        });

        it('can be present on root menu', () => {
            let menuBar = mount(<MenuBar>
                <Menu icon={'?'} label={'File'}>
                    <Menu label={'Open'} icon='[]'/>
                </Menu>
            </MenuBar>);

            expect(getIconElement(menuBar, 'File')?.html()).toBe(
                '<span class="reactAppMenubar--menu--icon reactAppMenubar--menu--icon-root">?</span>')
        });

        it('can be react node', () => {
            const MyIcon = () => <div>MyIcon</div>;

            let menuBar = mount(<MenuBar>
                <Menu label={'File'}>
                    <Menu label={'Open'} icon={<MyIcon/>}/>
                </Menu>
            </MenuBar>);

            expect(getIconElement(menuBar, 'Open')?.html()).toBe(
                '<span class="reactAppMenubar--menu--icon reactAppMenubar--menu--icon-left"><div>MyIcon</div></span>');
        });

        it('should render invisible hotKeys if some sibling menus have hotKeys ', () => {
            let menuBar = mount(<MenuBar>
                <Menu label={'File'}>
                    <Menu label={'Open'} menuId={'Open'}/>
                    <Menu label={'Recent'}>
                        <Menu label={'Files'} hotKeys={Keys.alt('F')}/>
                        <Menu label={'Folders'} hotKeys={Keys.ctrlAltShift('F')}/>
                        <Menu label={'Notebooks'}/>
                        <Menu label={'More'}>
                            <Menu label={'Stats'}/>
                        </Menu>
                    </Menu>
                </Menu>
            </MenuBar>);

            let hotKeyFiles = menuBar.find(`Menu[label='Files']`).find(`.${HOTKEY}`);
            expect(hotKeyFiles.hasClass(HOTKEY_INVISIBLE)).toBe(false);
            expect(hotKeyFiles.text()).toBe('alt+F');

            let hotKeyFolders = menuBar.find(`Menu[label='Folders']`).find(`.${HOTKEY}`);
            expect(hotKeyFolders.hasClass(HOTKEY_INVISIBLE)).toBe(false);
            expect(hotKeyFolders.text()).toBe('ctrl+alt+shift+F');

            let hotKeyNotebooks = menuBar.find(`Menu[label='Notebooks']`).find(`.${HOTKEY}`);
            expect(hotKeyNotebooks.hasClass(HOTKEY_INVISIBLE)).toBe(true);
            expect(hotKeyNotebooks.text()).toBe('ctrl+alt+shift+F');

            let hotKeyMore = menuBar.find(`Menu[label='More']`).find(`.${HOTKEY}`);
            expect(hotKeyMore.hasClass(HOTKEY_INVISIBLE)).toBe(true);
            expect(hotKeyMore.text()).toBe('ctrl+alt+shift+F');
        });
    });

    it('should not be rendered if not placed within MenuBar', () => {
        let wrapper = enzyme.mount(<Menu label={'File'}>
            <Menu label={'New'}/>
        </Menu>);

        expect(wrapper.html()).toBe(null);
    });

    describe('clicking on menus', () => {
        let onSelect_menuBar: SinonSpy;
        let onSelect_menu: SinonSpy;

        const div = document.createElement('div');
        document.body.appendChild(div);

        const mountOptions = {attachTo: div};

        beforeEach(() => {
            onSelect_menuBar = sinon.spy();
            onSelect_menu = sinon.spy();
        });

        const _selector = (menu: string): string => {
            switch (menu) {
                case "File":
                    return selectorRootMenu(1);
                case "Open":
                    return _selector("File") + selectorSubMenu(1);
                case 'Recent':
                    return _selector("File") + selectorSubMenu(2);

                default:
                    throw new Error(`Unrecognized menu  ${menu}`);
            }
        };

        const focusOnMenu = (menu: string) => {
            tryFocus(document.querySelector(_selector(menu)));
        };

        const clickOnMenu = (wrapper: ReactWrapper, menu: string) => {
            wrapper.find(`Menu[label="${menu}"]`).find(`.${LABEL_CONTAINER}`).first()
                .simulate('click');
        };

        it('should clear focus on menu when clicked on leaf menus', () => {
            let menuBar = mount(<MenuBar>
                    <Menu label={'File'}>
                        <Menu label={'Open'} onSelect={onSelect_menu}/>
                        <Menu label={'Recent'}>
                            <Menu label={'File1'}/>
                        </Menu>
                    </Menu>
                </MenuBar>
                , mountOptions);

            focusOnMenu('Open');
            expect(activeMenu()).toBe('Open');
            clickOnMenu(menuBar, 'Open');
            expect(activeMenu()).toBe(null);
        });

        it('should remain focused when clicked on leaf menu that is disabled', () => {
            let menuBar = mount(<MenuBar>
                    <Menu label={'File'}>
                        <Menu label={'Open'} disabled={true} onSelect={onSelect_menu}/>
                        <Menu label={'Recent'}>
                            <Menu label={'File1'}/>
                        </Menu>
                    </Menu>
                </MenuBar>
                , mountOptions);

            focusOnMenu('Open');
            expect(activeMenu()).toBe('Open');
            clickOnMenu(menuBar, 'Open');
            expect(activeMenu()).toBe('Open');
        });


        it('should remain focused on menu if clicked on parent menu', () => {
            let menuBar = mount(<MenuBar>
                    <Menu label={'File'}>
                        <Menu label={'Open'} onSelect={onSelect_menu}/>
                        <Menu label={'Recent'}>
                            <Menu label={'File1'}/>
                        </Menu>
                    </Menu>
                </MenuBar>
                , mountOptions);

            focusOnMenu('Recent');
            clickOnMenu(menuBar, 'Recent');
            expect(activeMenu()).toBe('Recent');
        });

        it('should trigger onSelect handler of menu if present', () => {
            let menuBar = mount(<MenuBar>
                    <Menu label={'File'}>
                        <Menu label={'Open'} onSelect={onSelect_menu}/>
                        <Menu label={'Recent'}>
                            <Menu label={'File1'}/>
                        </Menu>
                    </Menu>
                </MenuBar>
                , mountOptions);

            clickOnMenu(menuBar, 'Open');
            sinon.assert.calledOnce(onSelect_menu);
        });

        it('should trigger onSelect handler of MenuBar with menuId if handler is not present in Menu', () => {
            let menuBar = mount(<MenuBar onSelect={onSelect_menuBar}>
                    <Menu label={'File'}>
                        <Menu label={'Open'} menuId={'Open'}/>
                        <Menu label={'Recent'}>
                            <Menu label={'File1'}/>
                        </Menu>
                    </Menu>
                </MenuBar>
                , mountOptions);

            clickOnMenu(menuBar, 'Open');
            sinon.assert.calledOnce(onSelect_menuBar);
            sinon.assert.calledWith(onSelect_menuBar, 'Open');
        });

        it('should not trigger onSelect handler of MenuBar Menu has its own handler', () => {
            let menuBar = mount(<MenuBar onSelect={onSelect_menuBar}>
                    <Menu label={'File'}>
                        <Menu label={'Open'} menuId={'Open'} onSelect={onSelect_menu}/>
                        <Menu label={'Recent'}>
                            <Menu label={'File1'}/>
                        </Menu>
                    </Menu>
                </MenuBar>
                , mountOptions);

            clickOnMenu(menuBar, 'Open');
            sinon.assert.calledOnce(onSelect_menu);
            sinon.assert.notCalled(onSelect_menuBar);
        });

        it('should not trigger onSelect handler on root menu', () => {
            let menuBar = mount(<MenuBar onSelect={onSelect_menuBar}>
                    <Menu label={'File'} menuId={'File'} onSelect={onSelect_menu}/>
                </MenuBar>
                , mountOptions);

            clickOnMenu(menuBar, 'File');
            sinon.assert.notCalled(onSelect_menu);
            sinon.assert.notCalled(onSelect_menuBar);
        });

        it('should not trigger onSelect handler on menu that have child menus', () => {
            let menuBar = mount(<MenuBar onSelect={onSelect_menuBar}>
                    <Menu label={'File'}>
                        <Menu label={'Recent'} menuId={'Recent'} onSelect={onSelect_menu}>
                            <Menu label={'File1'}/>
                        </Menu>
                    </Menu>
                </MenuBar>
                , mountOptions);

            clickOnMenu(menuBar, 'Recent');
            sinon.assert.notCalled(onSelect_menu);
            sinon.assert.notCalled(onSelect_menuBar);
        });

        it('should log a warning to console if no handlers are present', () => {
            let menuBar = mount(<MenuBar>
                    <Menu label={'File'}>
                        <Menu label={'Open'}/>
                    </Menu>
                </MenuBar>
                , mountOptions);
            let consoleWarn = sinon.spy(console, "warn");
            try {
                clickOnMenu(menuBar, 'Open');
                sinon.assert.calledOnce(consoleWarn);
                sinon.assert.calledWith(consoleWarn, 'No handlers found for menu Open');
            } finally {
                consoleWarn.restore();
            }
        });
    });
});

import React from 'react';
import {Menu, MenuBar, Separator} from "..";
import {MENUBAR} from "../utils/classNames";
import expect from 'expect';
import {Key} from "../utils/hotKeys";
import {activeMenu, cleanUp, mount, selectorRootMenu, selectorSubMenu, tryFocus} from "./testUtils";
import {ReactWrapper} from "enzyme";

/**
 *  Menu for testing keyboard navigation
 * ----------------------------------------------------------------------------
 *  (F)ile               (E)dit      (M)isc            (H)elp
 *      New >               ~Copy~      ~Tools~             About
 *          ~Notebook~       Paste
 *          Note             Undo
 *          ~Folder~
 *          Diagram
 *      Open
 *          ~Recent~
 * -----------------------------------------------------------------------------
 */
const TestMenu = <MenuBar>
    <Menu label={'File'} focusKey={"F"}>
        <Menu label={'New'}>
            <Menu label={'Notebook'} disabled={true}/>
            <Menu label={'Note'}/>
            <Separator/>
            <Menu label={'Folder'} disabled={true}/>
            <Menu label={'Diagram'}/>
        </Menu>
        <Menu label={'Open'}>
            <Menu label={'Recent Notes'} disabled={true}/>
        </Menu>
    </Menu>
    <Menu label={'Edit'} focusKey={"E"}>
        <Menu label={'Copy'} disabled={true}/>
        <Menu label={'Paste'}/>
        <Menu label={'Undo'}/>
    </Menu>
    <Menu label={'Misc'} focusKey={"M"}>
        <Menu label={'Tools'} disabled={true}/>
    </Menu>
    <Menu label={'Help'} focusKey={"H"}>
        <Menu disabled={false} label={'About'}/>
    </Menu>
</MenuBar>;


describe('Keyboard Navigation (Default props)', () => {
    let wrapper: ReactWrapper;
    const div = document.createElement('div');
    document.body.appendChild(div);

    beforeEach(() => {
        wrapper = mount(TestMenu, {attachTo: div});
    });

    afterEach(() => {
        cleanUp();
    });

    const key = (key: string): void => {
        wrapper.find(`.${MENUBAR}`).simulate('keyDown', {key});
    };

    describe('When top menu is active', () => {
        describe('UP key', () => {
            it('should activate the last child menu', () => {
                focusOnMenu('File');
                key(Key.UP);
                expect(activeMenu()).toBe('Open');

                focusOnMenu('Edit');
                key(Key.UP);
                expect(activeMenu()).toBe('Undo');
            });

            it('should keep the menu activated if no active child menus are present', () => {
                focusOnMenu('Misc');
                key(Key.UP);
                expect(activeMenu()).toBe('Misc');
            });
        });
        describe('DOWN key', () => {
            it('should activate first child menu that is not disabled', () => {
                focusOnMenu('File');
                key(Key.DOWN);
                expect(activeMenu()).toBe('New');

                focusOnMenu('Edit');
                key(Key.DOWN);
                expect(activeMenu()).toBe('Paste');
            });

            it('should keep thee menu activated if no active child menu present', () => {
                focusOnMenu('Misc');

                key(Key.DOWN);
                expect(activeMenu()).toBe('Misc');
            });
        });
        describe('RIGHT key', () => {
            it('should activate the next top menu to the right', () => {
                focusOnMenu('File');
                key(Key.RIGHT);
                expect(activeMenu()).toBe('Edit');

                key(Key.RIGHT);
                expect(activeMenu()).toBe('Misc');
            });

            it('should have no effect if the current menu is the rightmost menu', () => {
                focusOnMenu('Help');
                key(Key.RIGHT);
                key(Key.RIGHT);
                expect(activeMenu()).toBe('Help');
            });
        });

        describe('LEFT key', () => {
            it('should activate the next top menu to the left', () => {
                focusOnMenu('Help');
                key(Key.LEFT);
                expect(activeMenu()).toBe('Misc');

                key(Key.LEFT);
                expect(activeMenu()).toBe('Edit');
            });

            it('should have no effect if the current menu is the leftmost menu', () => {
                focusOnMenu('File');
                key(Key.LEFT);
                expect(activeMenu()).toBe('File');
            });
        });

        describe('ESC key', () => {
            it('should deactive the menu', () => {
                focusOnMenu('Help');
                expect(activeMenu()).toBe('Help');
                key(Key.ESC);
                expect(activeMenu()).toBe(null);
            });

        });
    });

    describe('When subMenu is active', () => {
        describe('DOWN key', () => {
            it('should move to next menu that is not disabled', () => {
                focusOnMenu('New');
                key(Key.DOWN);
                expect(activeMenu()).toBe('Open');

                focusOnMenu('Note');
                expect(activeMenu()).toBe('Note');
                key(Key.DOWN);
                expect(activeMenu()).toBe('Diagram');
            });

            it('should cycle back to the top menu after there are no more menu items below', () => {
                focusOnMenu('New');
                key(Key.DOWN);
                expect(activeMenu()).toBe('Open');

                key(Key.DOWN);
                expect(activeMenu()).toBe('New');


                focusOnMenu('Note');
                expect(activeMenu()).toBe('Note');
                key(Key.DOWN);
                expect(activeMenu()).toBe('Diagram');
                key(Key.DOWN);
                expect(activeMenu()).toBe('Note');
            });
        });

        describe('UP key', () => {
            it('should move to previous menu that is not disabled', () => {
                focusOnMenu('Diagram');
                key(Key.UP);
                expect(activeMenu()).toBe('Note');
            });

            it('should cycle back to the bottom menu after there are no more menu items below', () => {
                focusOnMenu('Diagram');
                key(Key.UP);
                expect(activeMenu()).toBe('Note');
                key(Key.UP);
                expect(activeMenu()).toBe('Diagram');

            });
        });

        describe('RIGHT key', () => {
            it('should move to the subMenu item if available', () => {
                focusOnMenu("New");
                key(Key.RIGHT);
                expect(activeMenu()).toBe('Note');
            });

            it('should move to next root menu i not subMenu is available', () => {
                focusOnMenu('Note');
                key(Key.RIGHT);
                expect(activeMenu()).toBe('Edit');

                focusOnMenu('Open');
                key(Key.RIGHT);
                expect(activeMenu()).toBe('Edit');
            });

            it('should keep the current menu focused if there is no subMenu and there are no further root menus', () => {
                focusOnMenu('About');
                key(Key.RIGHT);
                expect(activeMenu()).toBe('About');
            });

        });

        describe('LEFT key', () => {
            it('should focus on the parent menu', () => {
                focusOnMenu('Note');
                key(Key.LEFT);
                expect(activeMenu()).toBe('New');
            });

            it('should focus on the next left top Menu if the parent is the root menu', () => {
                focusOnMenu('Paste');
                key(Key.LEFT);
                expect(activeMenu()).toBe('File');
            });

            it('should stay focussed on the current menu if the parent is leftmost root menu', () => {
                focusOnMenu('Open');
                key(Key.LEFT);
                expect(activeMenu()).toBe("Open");
            });
        });

        describe('ESC key', () => {
            it('should close the menu', () => {
                focusOnMenu('Note');
                expect(activeMenu()).toBe('Note');
                key(Key.ESC);
                expect(activeMenu()).toBe(null);

            });
        });
    });


});

/**
 * Activate (focus) the menu with the provided menu
 */
const focusOnMenu = (menu: string) => {
    tryFocus(document.querySelector(_selector(menu)));
};

const _selector = (menu: string): string => {
    switch (menu) {
        case "File":
            return selectorRootMenu(1);
        case "New":
            return _selector("File") + selectorSubMenu(1);
        case "Note":
            return _selector("New") + selectorSubMenu(2);
        case "Diagram":
            return _selector("New") + selectorSubMenu(4);
        case "Open":
            return _selector("File") + selectorSubMenu(2);
        case "Edit":
            return selectorRootMenu(2);
        case "Paste":
            return _selector("Edit") + selectorSubMenu(2);
        case "Undo":
            return _selector("Edit") + selectorSubMenu(3);
        case "Misc":
            return selectorRootMenu(3);
        case "Tools":
            return _selector("Misc") + selectorSubMenu(1);
        case "Help":
            return selectorRootMenu(4);
        case "About":
            return _selector("Help") + selectorSubMenu(1);
        default:
            throw Error('Unknown menu ' + menu);
    }
};

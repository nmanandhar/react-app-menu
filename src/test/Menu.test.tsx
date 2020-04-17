import React from 'react';
import expect from 'expect';
import enzyme from 'enzyme';
import {Menu, MenuBar} from "..";
import {ICON, MENU} from "../utils/classNames";
import {cleanUp, getIcon, mount} from "./testUtils";

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

            let icon = getIcon(menuBar, 'Open');
            expect(icon?.html()).toBe(
                '<span class="reactAppMenubar--menu--icon reactAppMenubar--menu--icon-left">[]</span>')
        });

        it('can be present on root menu', () => {
            let menuBar = mount(<MenuBar>
                <Menu icon={'?'} label={'File'}>
                    <Menu label={'Open'} icon='[]'/>
                </Menu>
            </MenuBar>);

            expect(getIcon(menuBar, 'File')?.html()).toBe(
                '<span class="reactAppMenubar--menu--icon reactAppMenubar--menu--icon-root">?</span>')
        });

        it('can be react node', () => {
            const MyIcon = () => <div>MyIcon</div>

            let menuBar = mount(<MenuBar>
                <Menu label={'File'}>
                    <Menu label={'Open'} icon={<MyIcon/>}/>
                </Menu>
            </MenuBar>);

            expect(getIcon(menuBar, 'Open')?.html()).toBe(
                '<span class="reactAppMenubar--menu--icon reactAppMenubar--menu--icon-left"><div>MyIcon</div></span>')

        });
    });

    it('should not be rendered if not placed within MenuBar', () => {
        let wrapper = enzyme.mount(<Menu label={'File'}>
            <Menu label={'New'}/>
        </Menu>);

        expect(wrapper.html()).toBe(null);
    });
});

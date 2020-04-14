import React from 'react';
import expect from 'expect';
import enzyme from 'enzyme';
import {Menu, MenuBar} from "..";
import {ICON} from "../utils/classNames";


describe('Menu', () => {
    describe('show prop', () => {
        it('should not render menu when false', () => {
            let wrapper = enzyme.shallow(<Menu label={'Menu1'} show={false}/>);
            expect(wrapper.html()).toBeNull();
        });

        it('should render menu when true', () => {
            let wrapper = enzyme.shallow(<Menu label={'Menu1'} show={true}/>);
            expect(wrapper.html()).not.toBeNull();
        });

        it('should render menu when not set', () => {
            let wrapper = enzyme.shallow(<Menu label={'Menu1'} show={true}/>);
            expect(wrapper.html()).not.toBeNull();
        });
    });

    describe('checked prop', () => {
        it('should render a checked icon when true', () => {
            let wrapper = enzyme.mount(<MenuBar checkedIcon={"☑"}>
                <Menu label={'Root'}>
                    <Menu label={'Submenu'} checked={true}/>
                </Menu>
            </MenuBar>);
            try {
                let icon = wrapper.find(`.${ICON}`);
                expect(icon.text()).toBe("☑");
            } finally {
                wrapper.unmount();
            }
        });
        it('should have priority when both checked and icon props are set', () => {
            let wrapper = enzyme.mount(<MenuBar checkedIcon={"☑"}>
                <Menu label={'RootMenu'}>
                    <Menu label={'Submenu'} checked={true} icon={"MyIcon"}/>
                </Menu>
            </MenuBar>);
            try {
                let icon = wrapper.find(`.${ICON}`);
                expect(icon.text()).toBe("☑");
            } finally {
                wrapper.unmount();
            }
        });

    });
});

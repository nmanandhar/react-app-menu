# react-app-menu 
*A simple desktop like menu bar with hotkey and keyboard navigation*

![BuildStatus](https://travis-ci.org/nmanandhar/react-app-menu.svg?branch=master)
![Dependencies](https://david-dm.org/nmanandhar/react-app-menu.svg)
![CodeCoverage](https://codecov.io/gh/nmanandhar/react-app-menu/branch/master/graphs/badge.svg?branch=master)
[![Maintainability](https://api.codeclimate.com/v1/badges/eace77d971daafc7d6dc/maintainability)](https://codeclimate.com/github/nmanandhar/react-app-menu/maintainability)

- [Introduction](#introduction)
- [Installation](#installation)
- [Browser Support](#browser-support)
- [Usage](#usage)
- [Props](#props)
	- [MenuBar](#menubar)
	- [Menu](#menu)


##Introduction
React App Menu is a simple React component that renders navigation menu similar to desktop applications with support for hotkeys and keyboard navigation.
It aims to do most things through css alone and relies on javascript only when absolutely necessary

##Installation
```npm
npm install react-app-menu
```

## Browser Support
This component relies on the css pseudo selector focus-within to open menus. This should work on Chrome and Firefox out of the box. For 
browsers that don't support the focus-within pseduo selector (notably IE and version of Edge prior to Edge 79), you will need to include a small
polyfill [focus-within-polyfill](https://github.com/matteobad/focus-within-polyfill)

To use the polyfill, you can either
1. Include the following script tag `<script src='https://unpkg.com/focus-within-polyfill/dist/focus-within-polyfill.js'></script>`
2. Install and import the [focus-within-polyfill](https://github.com/matteobad/focus-within-polyfill)

This polyfill will only kick in for browsers that don't support the focus-within polyfill and adds a listener for blur and focus
events and adds a .focus-within class as necessary.


## Usage
Simply import MenuBar and Menu and start composing your menu. A css is also provided in `dist/styles/react-app-menu.css`
which you need to include for the menus to render properly.

![react-app-menu-demo](https://user-images.githubusercontent.com/9746042/79097656-fe5c4580-7d7f-11ea-983d-bfafda1c4da3.gif)

```tsx
import React from 'react';
import {Keys, Menu, MenuBar, Separator} from 'react-app-menu';
import {AiFillFolderOpen, FaPencilAlt, FaRegFile, FiBook, GoSearch, MdSettings} from "react-icons/all";
import 'react-app-menu/dist/styles/react-app-menu.css'


type MenuBarDemoState = {
    showToolbar: boolean;
    showTooltips: boolean;
}

export class MenuBarDemo extends React.Component<any, MenuBarDemoState> {
    constructor(props: any) {
        super(props);
        this.handleMenuSelect = this.handleMenuSelect.bind(this);
        this.onNewFolderSelect = this.onNewFolderSelect.bind(this);
        this.state = {
            showToolbar: true,
            showTooltips: false
        }
    }

    render() {
        return (
            <>
                <div style={{background: '#FBFBFB', borderBottom: '1px solid rgb(218, 220, 224)'}}>
                    <MenuBar onSelect={this.handleMenuSelect}>
                        <Menu label='File' focusKey={"F"}>
                            <Menu label='New'>
                                <Menu menuId='NewNotebook' label='Notebook' icon={<FiBook/>}/>
                                <Menu menuId="NewNote" label='Note' icon={<FaRegFile/>} hotKeys={Keys.ctrlAlt('N')}/>
                                <Separator/>
                                <Menu label="Folder" icon={<AiFillFolderOpen/>} hotKeys={Keys.ctrlAlt("F")}
                                      onSelect={this.onNewFolderSelect}/>
                            </Menu>
                            <Menu label='Settings' icon={<MdSettings/>} hotKeys={Keys.altShift("S")}/>
                        </Menu>
                        <Menu label='Edit' focusKey='E'>
                            <Menu menuId='search' label='Search' icon={<GoSearch/>} hotKeys={Keys.ctrlShift('F')}/>
                            <Menu menuId='undo' label='Undo' hotKeys={Keys.ctrl('Z')}/>
                            <Menu menuId='rename' label='Rename' icon={<FaPencilAlt/>} hotKeys={Keys.shift('F6')}/>
                        </Menu>
                        <Menu label='View' focusKey='V'>
                            <Menu menuId='toolbar' label='Toolbars' checked={this.state.showToolbar}
                                  hotKeys={Keys.ctrlAlt("T")}/>
                            <Menu menuId='statusBar' label='StatusBar'/>
                            <Menu menuId='toolTips' label='Tooltips' checked={this.state.showTooltips}
                                  hotKeys={Keys.ctrlAltShift("T")}/>
                        </Menu>
                    </MenuBar>
                </div>
            </>
        );
    }

    handleMenuSelect(menuId: string): void {
        switch (menuId) {
            case 'toolbar':
                this.setState((oldState) => {
                    return {showToolbar: !oldState.showToolbar}
                });
                break;
            case 'toolTips':
                this.setState((oldState) => {
                    return {showTooltips: !oldState.showTooltips}
                });
            default:
                console.log(`menu selected ${menuId}`)
        }
    }

    onNewFolderSelect(): void {
        console.log('New Folder !!!');
    }
}
```

## Props

## MenuBar
Menubar should be the container of all menus. It provides some options that are common to all menus.
It is also responsible for registering keyboard event handlers for navigation and hotkeys

| Prop             | type                  | Required |         DefaultValue | Description                                                                                                                                           |
| ---------------- | --------------------- | :------: | -------------------: | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| onSelect         | (menuId:string)=>void |          |                      | A function that is called with the menuId of the menu that was clicked.<br/> This function is only called when the menu does not have its own handler |
| expandIcon       | string / ReactNode    |          | MdKeyboardArrowRight | The icon to be displayed to indicate that a menu has submenus                                                                                         |
| checkedIcon      | string/ ReactNode     |          |                    ✔ | The icon to be displayed on a menu that has checked=true                                                                                              |
| hotkeys          | boolean               |          |                 true | Set it to false if you don't require hotkeys functionality                                                                                            |
| openMenusOnHover | boolean               |          |                false | Set it to true to open menus by hovering over them                                                                                                    |
| className        | string                |          |                      | Extra css class to add to the markup for menubar                                                                                                      |

## Menu

| Prop     | type               | Required | DefaultValue | Description                                                                                                                                                                          |
| -------- | ------------------ | :------: | -----------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| menuId   | string             |          |              | An identifier that uniquely identifies the menu. If a menu does not have its own select handler, then the select handler of the parent menuBar is called with the menuId             |
| label    | string / ReactNode |   true   |              | The text label for the menu                                                                                                                                                          |
| icon     | string / ReactNode |          |              | The icon to be displayed on a menu                                                                                                                                                   |
| onSelect | ()=>void           |          |              | A callback function to be called when this menu is clicked or its associated hotkey is pressed<br>If not provided, clicks are delegated to MenuBar onSelect                          |
| hotKeys  | Array\<string\>    |          |              | Hotkeys are used to trigger the action for the menu. Hotkeys should be an array of form ['Ctrl','Alt','F']. You can use the Keys helper to generate this, for eg Keys.ctrlAlt('F')   |
| checked  | boolean            |          |              | A menu that has checked true will display a checkedIcon                                                                                                                              |
| show     | boolean            |          |         true | Set to false to hide this menu                                                                                                                                                       |
| disabled | boolean            |          |        false | Set to true to disable this menu    
# react-app-menu 
*A simple desktop like menu bar with hotkey and keyboard navigation*

![BuildStatus](https://travis-ci.org/nmanandhar/react-app-menu.svg?branch=master)
![Dependencies](https://david-dm.org/nmanandhar/react-app-menu.svg)
![CodeCoverage](https://codecov.io/gh/nmanandhar/react-app-menu/branch/master/graphs/badge.svg?branch=master)


React App Menu is a simple React component that renders navigaton menu similar to desktop applications with support for hotkeys and keyboard navigation. This component 
mainatins zero state and all styling and positioning is done through CSS leading to simple and extremely small component,

## Features
Small (< 25 kb unminified)
zero dependencies
Trigger menu using keys
Keyboard navigation

## Demo

![react-app-menu](https://user-images.githubusercontent.com/9746042/79006487-01391980-7b79-11ea-8cc9-b79e2476b287.gif)


```npm
npm i react-app-menu
```

``` typescript jsx
import {MenuBar,Menu,Separator} from 'react-app-menu';

const App = () => (
    <MenuBar onSelect={this.handleMenuSelect}>
        <Menu label={'File'} focusKey={"F"}>
            <Menu label={'New'}>
                <Menu label={'Notebook'} menuKey={'NewNotebook'} hotKeys={Keys.ctrlAlt('N')}/>
                <Menu label={'Note'} menuKey={"NewNote"} checked={true}/>
                <Separator/>
                <Menu label={"Folder"} hotKeys={Keys.ctrlAlt("F")} onSelect={this.onNewFolderSelect}/>
            </Menu>
            <Menu label={'Open'}>
                <Menu label={'Recent Notes'} disabled={true} menuKey={'OpenRecent'}/>
            </Menu>
        </Menu>
        <Menu label={'Edit'} focusKey={"E"}>
            <Menu label={'Undo'} hotKeys={Keys.ctrlShift('Z')} menuKey={'Undo'}/>
        </Menu>
        <Menu label={'Help'} focusKey={"H"}>
            <Menu label={'About'}/>
        </Menu>
    </MenuBar>
)
```


# react-app-menu
A simple desktop like menu bar with hotkey and keyboard navigation


# TODO

1. Update this documentation

1. Write Tests to verify that
    * When menu is not visible its hotkeys should not fire
    * When menu is disabled its hotkeys should not fire
    * When menu is unmounted its hotkeys should not fire
    * When a menu that is not visible changes to visible its hotkeys should fire
    * When a menu that is initially disabled changes state to enabled its hotkeys should fire
    * When a menubar is unmounted no hotkeys should fire
    * When a menubar is remounted its hotkeys should fire
    * Clicking on a disabled menubar does not fire its action
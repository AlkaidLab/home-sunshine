---
description: Install Foundation Sunshine and Moonlight, pair your devices with a PIN, and verify video, audio, and input on your first local stream.
prev: false
next: false
---

# Your first stream

Your game runs on a Windows PC. Sunshine sends its video and audio to a phone, tablet, TV, or another computer, while Moonlight sends your input back. This guide calls the Windows PC the **host** and your playing device the **client**.

Welcome to Foundation Sunshine and the companion Moonlight clients. This guide covers [Foundation Sunshine 2026.1011](https://github.com/AlkaidLab/foundation-sunshine/releases/tag/v2026.1011.150654.%E6%9D%82%E9%B1%BC), [Android V+ 12.13.0](https://github.com/qiin2333/moonlight-vplus/releases/tag/v12.13.0), and [PC V+ 6.5.0](https://github.com/qiin2333/moonlight-qt/releases/tag/v6.5.0). Follow the steps below to get video, audio, and input working on your local network. Then enable advanced features supported by your apps, operating systems, and hardware.

::: info Translation availability
English chapters are being added. Links marked **中文** open the Chinese manual. Search covers the current language; switch to 简体中文 to search all Chinese chapters. The language menu opens the documentation home in the selected language.
:::

<ManualDiagram kind="streaming" />

## 1. Prepare your devices

- A Windows PC that can run the game locally, with Sunshine installed and Windows signed in.
- A phone, tablet, TV, or computer with a compatible Moonlight client.
- Both devices on the same home network. Connect the host by Ethernet if possible and keep wireless clients near the router.

For the first test, use a physical monitor. For a headless host, install and select [ZakoDisplay (中文)](../../server/display.md). Check [system and network requirements (中文)](../../getting-started/requirements.md) before installing. Test remote access, HDR, high frame rates, and display switching individually after the basic stream works.

## 2. Install and open Sunshine

1. Open the [Foundation Sunshine release page](https://github.com/AlkaidLab/foundation-sunshine/releases/latest) on the host PC.
2. Download the installer whose name ends in `WindowsInstaller.exe`. Use the default installation path for your first setup. Keep the Zako Display Driver component if you need a virtual display.
3. Open the Foundation Sunshine desktop control panel from its Windows shortcut. Use the setup wizard to select the language, GPU, and display to stream.
4. Check that the service is running and the selected display is available. Use the desktop GUI’s display settings or device center for additional components.

<figure class="manual-figure">
  <ScreenshotFocus :source-width="1280" :regions="[[210, 190, 855, 280]]">
    <img src="../../assets/manual/sunshine-setup-gpu.webp" alt="Foundation Sunshine GPU selection step with the adapter set to Automatic and a Next button; interface shown in Chinese" width="1280" height="800" loading="lazy" decoding="async" />
  </ScreenshotFocus>
  <figcaption>GPU selection example (Foundation Sunshine 2026.1015.51059, replayed interface state). Start with Automatic. Open the image to see the full wizard; its interface is in Chinese.</figcaption>
</figure>

The desktop control panel is the main management interface. The optional browser WebUI is available at `https://localhost:47990` on the host. It manages Sunshine; it does not show the streamed desktop. See [WebUI login and certificate handling (中文)](../../server/index.md#使用浏览器管理).

## 3. Install a client

Use the [client selection guide (中文)](../../clients/index.md) to choose a client for your device. Allow local network access when requested. Android uses an APK; Windows offers an installer; Apple and HarmonyOS devices use the project’s release channel or app store.

## 4. Add the host and enter the PIN

<ManualDiagram kind="pairing" />

1. Open Moonlight, wait for the host to appear, and select it.
2. When Moonlight displays a pairing PIN, open the **PIN** page in Sunshine on the host.
3. Enter the PIN shown by Moonlight and send it. If requested, give the client a recognizable device name.
4. Return to Moonlight. Confirm that the host is unlocked and its application list is visible.

<figure class="manual-figure manual-figure-compact">
  <ScreenshotFocus :source-width="1108" :regions="[[315, 0, 480, 220]]">
    <img src="../../assets/manual/sunshine-pin.webp" alt="Sunshine host pairing form with empty PIN and device-name fields and a Send button; interface shown in Chinese" width="1108" height="319" loading="lazy" decoding="async" />
  </ScreenshotFocus>
  <figcaption>Host pairing form (Foundation Sunshine 2026.1015.51059), also used by the desktop control panel. Enter the current PIN from Moonlight. Pair only devices you trust: a paired client can control your host.</figcaption>
</figure>

If discovery fails, press `Win + R` on the host, enter `cmd`, and run:

```text
ipconfig
```

Find the **IPv4 address** of the active Ethernet or WLAN adapter and add it manually in Moonlight. Replace the example `192.168.1.100` with the host’s actual address. Use the host address, rather than `localhost` or the complete management URL.

For further checks, see [connection and pairing troubleshooting (中文)](../../troubleshooting/connection.md).

## 5. Start with settings that are easy to verify

Use these client settings while leaving host encoding and capture on their defaults:

| Setting                                   | Starting point                                      |
| ----------------------------------------- | --------------------------------------------------- |
| Resolution                                | 1920 × 1080, or 1280 × 720 for a smaller screen     |
| Frame rate                                | 60 FPS                                              |
| Bitrate                                   | 10–20 Mbps; start at 10 Mbps on an unstable network |
| Video codec                               | Automatic; try H.264 for compatibility problems     |
| HDR                                       | Off; verify SDR first                               |
| Audio                                     | Stereo / Opus                                       |
| Frame generation, upscaling, enhancements | Off initially                                       |

These settings help you verify the basic connection. Once it works, adjust one setting at a time for your device and network using the [video quality guide (中文)](../../clients/settings.md).

## 6. Open Desktop and check three things

Select **Desktop** in Moonlight, then verify:

1. **Video:** the host desktop is visible and moving a window updates the picture.
2. **Input:** mouse, touch, or controller input reaches the host.
3. **Audio:** audio playing on the host can be heard on the client.

If Desktop is missing, see [restore the built-in application (中文)](../../server/apps.md#先连接-desktop). If only a game shows a black screen, return to Desktop to isolate the problem.

## 7. Disconnect, then tune your setup

Save your game before disconnecting through the client. **Disconnecting may leave the game running.** To close it, quit inside the game or explicitly use the client’s end-application action.

Android V+ 12.13 distinguishes pausing and quitting a stream; the quit behavior can also be configured. See [stream menu and exit behavior (中文)](../../clients/android.md#串流菜单与退出).

If using a virtual display or display switching, check that Windows restores the expected layout after the session. Displays may remain active for other streaming sessions.

Next, explore [features and platform support (中文)](../../getting-started/features.md), [add games (中文)](../../server/apps.md), [set up HDR (中文)](../../server/hdr.md), or [configure remote access (中文)](../../server/network.md).

## References

- [Foundation Sunshine project](https://github.com/AlkaidLab/foundation-sunshine)
- [Moonlight V+ first connection guide](https://github.com/qiin2333/moonlight-vplus/blob/master/docs/GETTING_STARTED.md)

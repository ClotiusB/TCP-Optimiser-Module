# TCP_Optimiser_Module
A Magisk/KernelSU/APatch module to change tcp congestion algorithm based on current active internet type and some network enhancements.

## Supported Frameworks
- **Magisk** - Native module support
- **KernelSU** - Native module support with WebUI
- **APatch** - Native module support with WebUI compatibility

# Why?
In certain kernels, TCP Congestion Algorithm BBR might be enabled. Or you want to enable certain algorithm or settings based on what interface you are using. I observed that in my kernel, when I use WiFi, BBR performs better whereas on mobile data CUBIC performs better.

# Features
1. Set TCP Congestion Algorithm based on interface (Wi-Fi/Cellular).
2. Auto Change TCP Congestion Algorithm on interface change.
3. Set initcwnd and initrwnd value to max.
4. Cross-framework compatibility (Magisk/KernelSU/APatch).

# How to use
1. Install the module via your preferred framework (Magisk, KernelSU, or APatch).
2. It creates 2 files `wlan_{algo}` and `rmnet_data_{algo}` in module folder.
3. Reboot device.
4. Basic Functionality of module must run normally on boot.

# Tuning Module by files [/data/adb/modules/tcp_optimiser]
1. TCP Congestion Algorithm can be changed for given interface by editing `{algo}` part of file name. `wlan_{algo}` for Wi-Fi and `rmnet_data_{algo}` for Cellular.
2. Create an empty file named `initcwnd_initrwnd` to set initcwnd and initrwnd value to max values.
3. Create an empty file named `kill_connections` to kill all connections during switch. [Be careful!]
4. Create an empty file named `force_apply` to apply changes immediately.

# Tuning Module by WebUI
All the module settings can be controlled using Module WebUI in KernelSU and APatch, or KsuWebUIStandalone app for Magisk.

## Features of WebUI:
- Real-time interface and algorithm monitoring
- Easy algorithm switching for Wi-Fi and Cellular
- Toggle killconnections, initcwnd/initrwnd settings
- View module logs and status

## Note:
1. `{algo}` in filename can be any TCP congestion algorithm (cubic, bbr, reno, etc.).
2. Default algorithm is **cubic** for **cellular**.
3. Default algorithm is **bbr** if exists for **WiFi**. Else **cubic**.
4. There is an option to kill current TCP connections during algorithm change. This will stop downloads, uploads or other ongoing connections. So apps affected might need to be restarted.
5. Algorithm is applied only if present in kernel.
6. Module logs are present in `/data/adb/modules/tcp_optimiser/service.log`.
7. Framework detection is automatic - module works on Magisk, KernelSU, and APatch seamlessly.

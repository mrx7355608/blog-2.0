---
title: "Display servers VS Desktop environments VS Window managers"
date: "1-8-2025" # follows mm-dd-yyyy format
tags: ["Xorg", "i3wm", "Linux", "Archlinux"]
summary: "In the world of Linux and other Unix-like operating systems, the terms \"display server,\" \"desktop environment,\" and \"window manager\" are often used interchangeably, but they each refer to distinct components of the graphical user interface (GUI). In this blog we will go over their differences to better understand them"
---

# Display Server
A display server is a program that renders UI on our screens. It uses a display protocol to communicate with its clients. Due to display servers we are able to use our systems with GUI.
A display client can be any device capable of rendering graphics, like a monitor or a desktop environment. 
There are three very famouse display servers in Linux environment:
1. Xorg
2. Wayland
3. MIR (now replaced by Wayland)

# XORG
Xorg is a free and open-sourced display server that provides a way to render GUI on the screen. It uses X11 display server protocol of **X Window System** to communicate with display clients.
Xorg provides basic rendering and lacks some features like transparency and vsync. This is where the compositors come into play. The display client communicates with the display server which then send data to the compositor and after getting response from the compositor, the display server renders the GUI.
X Window System was introduced in 1984 to allow rendering graphics over a network. It uses a client/server model that allows X Window System to not only render graphics over a network but also on our local machines. X Window System became a standard for Unix and Unix like Operating systems.

# Wayland
Wayland is not necessarily a display server like Xorg as it provides a way for its clients to communicate directly with the compositor instead of going through the display server which we used to do in Xorg display server.


# Desktop Environments
A desktop environment like Gnome, KDE, XFCE, etc are kindof packages that contain pre-built softwares for a many day to day uses of a computer. They use widget toolkits to draw and handle I/O like GTK for Gnome, Qt for KDE, etc.
Desktop environments use display servers to draw GUI on the screen

# Window managers
A window manager is a software that controls the placement of windows in the underlying display environment. They allow you to minimize, maximize, open, close resize, and move applications. Different window managers are built different like i3wm that places windows in a tiling fashion while MS Window's window manager stacks applications on top of each other.

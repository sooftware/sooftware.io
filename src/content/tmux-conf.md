---
title: 'tmux - conf'
author: [Soohwan Kim]
tags: [toolkit, environment]
image: img/tmux.png
date: '2024-02-15T10:00:00.000Z'
draft: false
---

# tmux - conf

Tmux 설정을 위한 tmux configuraion 기록

- `~/.tmux.conf` 

```shell
set-option -g default-command "tmux-shell-wrapper"
# Make shift+arrows, ctrl+arrows etc work in Vim.
set -g xterm-keys on

# See if this fixes slow ESC issues.

# http://unix.stackexchange.com/questions/23138/esc-key-causes-a-small-delay-in-terminal-due-to-its-alt-behavior
set -s escape-time 0

# Start window and pane indices at 1.
set -g base-index 1
set -g pane-base-index 1

# Status bar styling and content.
set -g status-bg black
set -g status-fg white
set -g status-left '#S '

# Show keyboard layout in prompt, assuming some script writes it to that path;
# it's "/User/…" instead of "~" so VMs can read from their symlinked OS X host home directory.
set -g status-right '#(cat /Users/$USER/.keyboard_layout 2> /dev/null) | #22T | %H:%M %d-%b-%y'
set -g status-right-length 60
set -g status-interval 2

# Highlight the active window in the status bar.
set-window-option -g window-status-current-bg yellow
set-window-option -g window-status-current-fg black

# Don't prompt to kill panes/windows.
bind-key x kill-pane
bind-key & kill-window

# Cycle panes.
bind b select-pane -t :.+
bind C-b select-pane -t :.+

# More intuitive split-window mappings.
bind "'" split-window -h
bind - split-window -v

# Maximize pane, e.g. for copying.
bind-key z resize-pane -Z

# Switch pane and zoom
# https://twitter.com/tskogberg/status/792025881573199872
bind C-z select-pane -t :.+ \; resize-pane -Z

# Reload tmux conf.
unbind r
bind r source-file ~/.tmux.conf\; display "Reloaded conf."

# http://robots.thoughtbot.com/tmux-copy-paste-on-os-x-a-better-future
# Use vim keybindings in copy mode
setw -g mode-keys vi

# Unbork my iTerm ctrl+1 etc mappings in tmux 2.1
# https://github.com/tmux/tmux/issues/159
set -g assume-paste-time 0
```

```
$ tmux source ~/.tmux.conf
```

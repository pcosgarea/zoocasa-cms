# Zoocasa CMS

## Windows Setup Steps

> This section only applies if you're using Windows.

1. Install [Git Bash](https://git-scm.com/install/windows)
1. Launch Git Bash
1. Complete the remaining steps under "Common Setup Steps" by running commands in your Git Bash terminal

## Common Setup Steps

> Run these commands in a terminal.
>
> On Windows, use Git Bash. On Mac, use Terminal or iTerm2.

1. Install Node Version Manager: `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.4/install.sh | bash`
1. Install Node.js: `nvm install node`
1. Navigate to the CMS folder. For example, if you unzipped it to your downloads folder: `cd /c/Users/<username>/Downloads/zoocasa-cms`
1. Run the CMS: `npm run dev`
1. Your terminal should print a URL starting with `http://localhost...`. Open that URL in your web browser to try out the CMS!

## Development Setup with Claude Code

> Before starting development, first complete the setup steps above.

### Windows

Open the Command Prompt app and run `curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd && del install.cmd`. You'll use the Git Bash app in the steps following this one.

### Mac

Open the Terminal or iTerm app and run `curl -fsSL https://claude.ai/install.sh | bash`. You'll use the Terminal or iTerm app in the steps following this one.

> If you want a terminal app that's a bit nicer than Mac's default Terminal, [iTerm2](https://iterm2.com/) is pretty great.

### Common Steps

1. Sign up for a Github account
1. Create a new SSH key by running this command (replacing "username@zoocasa.com") in Git Bash, Terminal, or iTerm: `ssh-keygen -t ed25519 -C "username@zoocasa.com"`
1. Copy the key to your clipboard
    - Mac (Terminal/iTerm): `pbcopy < ~/.ssh/id_ed25519.pub`
    - Windows (Git Bash): `cat ~/.ssh/id_ed25519.pub | clip`
1. Add the key to your Github [SSH settings](https://github.com/settings/keys)
    1. "New SSH key"
    1. Use any title you want (e.g., "Zoocasa work laptop")
    1. Paste in the key you copied to your clipboard
1. Set up `git` on your computer:
    1. `git config --global user.name "Your Name"`
    1. `git config --global user.email "username@zoocasa.com"`
1. Download the project to your computer
    - `mkdir ~/Projects && cd ~/Projects && git clone git@github.com:pcosgarea/zoocasa-cms.git`
1. Install [VS Code](https://code.visualstudio.com/download)
1. Start VS Code, open the "zoocasa-cms" folder, and install the "Claude Code for VS Code" extension (left side bar -> boxes icon)
1. Refer back to `README.md` under the "Resuming Development with Claude Code" section

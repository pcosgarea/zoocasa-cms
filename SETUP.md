# Zoocasa CMS

## Windows Setup Steps

> This section only applies if you're using Windows.

1. Install [Git Bash](https://git-scm.com/install/windows)
1. Launch Git Bash
1. Complete the remaining steps under "Common Setup Steps" by running commands in your Git Bash terminal

## Common Setup Setps

> Run these commands in a `bash` terminal.

1. Install Node Version Manager: `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.4/install.sh | bash`
1. Install Node.js: `nvm install node`
1. Navigate to the CMS folder. For example, if you unzipped it to your downloads folder: `cd /c/Users/<username>/Downloads/zoocasa-cms`
1. Run the database using Prisma: `npx prisma dev`
1. Once the database is running, press `h` to view the database URL, and then copy it to you clipboard
1. Set the `DATABASE_URL` in `.env.local` to the URL you copied to the clipboard
1. In a new terminal window or tab, run the CMS: `npm run dev`
1. Your terminal should print a URL starting with `http://localhost...`. Open that URL in your web browser to try out the CMS!

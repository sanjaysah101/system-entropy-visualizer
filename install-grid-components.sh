#!/usr/bin/env bash
# Script to import all Tron components from The Grid

echo "🎮 Installing Tron-specific components from The Grid..."

# Tron-specific components
pnpm dlx shadcn@latest add "https://thegridcn.com/r/tron-cinematic-hud.json"
pnpm dlx shadcn@latest add "https://thegridcn.com/r/tron-data-card.json"
pnpm dlx shadcn@latest add "https://thegridcn.com/r/tron-hud.json"
pnpm dlx shadcn@latest add "https://thegridcn.com/r/tron-map.json"
pnpm dlx shadcn@latest add "https://thegridcn.com/r/tron-movie-ui.json"
pnpm dlx shadcn@latest add "https://thegridcn.com/r/tron-status-bar.json"
pnpm dlx shadcn@latest add "https://thegridcn.com/r/tron-theme-dossier.json"
pnpm dlx shadcn@latest add "https://thegridcn.com/r/tron-timer.json"
pnpm dlx shadcn@latest add "https://thegridcn.com/r/tron-video-player.json"

# 3D components
pnpm dlx shadcn@latest add "https://thegridcn.com/r/tron-god-avatar.json"
pnpm dlx shadcn@latest add "https://thegridcn.com/r/tron-grid.json"
pnpm dlx shadcn@latest add "https://thegridcn.com/r/tron-tunnel.json"

# Effect components
pnpm dlx shadcn@latest add "https://thegridcn.com/r/circuit-background.json"
pnpm dlx shadcn@latest add "https://thegridcn.com/r/glow-container.json"
pnpm dlx shadcn@latest add "https://thegridcn.com/r/grid-floor.json"
pnpm dlx shadcn@latest add "https://thegridcn.com/r/scanlines.json"

# Theme components
pnpm dlx shadcn@latest add "https://thegridcn.com/r/theme-provider.json"
pnpm dlx shadcn@latest add "https://thegridcn.com/r/theme-switcher.json"
pnpm dlx shadcn@latest add "https://thegridcn.com/r/tron-intensity-switcher.json"

# Core UI components (with Tron styling)
pnpm dlx shadcn@latest add "https://thegridcn.com/r/button.json"
pnpm dlx shadcn@latest add "https://thegridcn.com/r/card.json"
pnpm dlx shadcn@latest add "https://thegridcn.com/r/input.json"
pnpm dlx shadcn@latest add "https://thegridcn.com/r/badge.json"
pnpm dlx shadcn@latest add "https://thegridcn.com/r/alert.json"
pnpm dlx shadcn@latest add "https://thegridcn.com/r/separator.json"
pnpm dlx shadcn@latest add "https://thegridcn.com/r/progress.json"
pnpm dlx shadcn@latest add "https://thegridcn.com/r/tabs.json"

echo "✅ Component installation complete!"
echo "📝 Next steps:"
echo "  1. Copy globals.css from The Grid for Tron styles"
echo "  2. Set up theme provider in your layout.tsx"
echo "  3. Start building your dashboard!"

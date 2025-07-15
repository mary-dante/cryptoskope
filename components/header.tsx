"use client"

import { ThemeToggle } from "./theme-toggle"
import { Button } from "./ui/button"
import { 
  BarChart3Icon, 
  BellIcon, 
  BookmarkIcon, 
  GlobeIcon, 
  LayoutGridIcon, 
  Search, 
  UserRoundIcon, 
  WalletIcon,
  LogOutIcon,
  GithubIcon,
  TwitterIcon
} from "lucide-react"
import { Input } from "./ui/input"
import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { cryptos } from "@/lib/mockData"
import React from "react"
import { useWallet } from "@/hooks/useWallet"
import { WalletPopup } from "./wallet-popup"
import { signIn, signOut, useSession } from "next-auth/react"

export function Header() {
  const [search, setSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { account, isConnecting, error, connectWallet, toggleWalletMenu, isOpen } = useWallet();
  const { data: session } = useSession();

  const filtered = search.trim()
    ? cryptos.filter(c =>
        c.name.toLowerCase().includes(search.trim().toLowerCase()) ||
        c.symbol.toLowerCase().includes(search.trim().toLowerCase())
      ).slice(0, 6)
    : [];

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (highlighted >= 0 && filtered[highlighted]) {
        window.open(`https://www.coingecko.com/en/coins/${filtered[highlighted].id}`, "_blank");
        setShowSuggestions(false);
        return;
      }
      if (search.trim()) {
        const query = search.trim().toLowerCase();
        const match = cryptos.find(
          c => c.symbol.toLowerCase() === query || c.name.toLowerCase() === query
        );
        if (match) {
          window.open(`https://www.coingecko.com/en/coins/${match.id}`, "_blank");
        } else {
          window.open(`https://www.coingecko.com/en/search?query=${encodeURIComponent(search)}`, "_blank");
        }
        setShowSuggestions(false);
      }
    } else if (e.key === "ArrowDown") {
      setHighlighted(h => Math.min(h + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      setHighlighted(h => Math.max(h - 1, 0));
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setShowSuggestions(true);
    setHighlighted(-1);
  };

  const handleSuggestionClick = (id: string) => {
    window.open(`https://www.coingecko.com/en/coins/${id}`, "_blank");
    setShowSuggestions(false);
  };

  const handleWalletClick = () => {
    if (account) {
      toggleWalletMenu();
    } else {
      connectWallet();
    }
  };

  // Hide suggestions when clicking outside
  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-7xl px-4 flex h-16 items-center gap-4">
        <div className="flex items-center gap-2 md:gap-3">
          <a href="/" className="flex items-center gap-2 md:gap-3">
            <img src="/logo.png" alt="CryptoSkope Logo" className="h-8 w-8" />
            <span className="font-semibold text-lg hidden sm:inline-block">CryptoSkope</span>
          </a>
        </div>
        
        <nav className="hidden md:flex items-center gap-6 flex-1">
          <div className="flex items-center gap-6">
            <a href="/theta" className="text-sm font-medium transition-colors text-muted-foreground hover:text-primary">
              Theta OHLC
            </a>
            <a href="/coin/dex" className="text-sm font-medium transition-colors text-muted-foreground hover:text-primary">
              DEX Explorer
            </a>
            <a href="/news" className="text-sm font-medium transition-colors text-muted-foreground hover:text-primary">
              News
            </a>
          </div>
        </nav>

        <div className="ml-auto flex items-center gap-4">
          <div className="relative hidden md:flex items-center">
            <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              ref={inputRef}
              type="search"
              placeholder="Search coins..."
              className="pl-8 md:w-[200px] lg:w-[280px] bg-muted"
              value={search}
              onChange={handleChange}
              onKeyDown={handleSearch}
              onFocus={() => setShowSuggestions(true)}
              autoComplete="off"
            />
            {showSuggestions && filtered.length > 0 && (
              <div className="absolute top-full left-0 w-full bg-card border border-border rounded-md shadow-lg z-50 mt-1 max-h-64 overflow-y-auto">
                {filtered.map((coin, idx) => (
                  <div
                    key={coin.id}
                    className={`flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-muted ${highlighted === idx ? 'bg-muted' : ''}`}
                    onMouseDown={() => handleSuggestionClick(coin.id)}
                    onMouseEnter={() => setHighlighted(idx)}
                  >
                    <img src={coin.iconUrl} alt={coin.symbol} className="w-5 h-5 rounded-full" />
                    <span className="font-medium">{coin.name}</span>
                    <span className="text-xs text-muted-foreground ml-auto">{coin.symbol}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-1 md:gap-2">
            <div className="relative">
              <Button 
                size="sm" 
                variant="outline" 
                className="rounded-full flex items-center gap-2 px-3"
                onClick={handleWalletClick}
                disabled={isConnecting}
              >
                <WalletIcon className="h-5 w-5" />
                <span>
                  {isConnecting 
                    ? "Connecting..." 
                    : account 
                      ? `${account.slice(0, 6)}...${account.slice(-4)}`
                      : "Connect Wallet"
                  }
                </span>
              </Button>
              {isOpen && <WalletPopup />}
            </div>
            <ThemeToggle />
            {session ? (
              <Button 
                size="icon" 
                variant="ghost" 
                className="rounded-full"
                onClick={() => signOut()}
              >
                <img
                  src={session.user?.image || ""}
                  alt={session.user?.name || ""}
                  className="w-6 h-6 rounded-full"
                />
                <span className="sr-only">Sign out</span>
              </Button>
            ) : null}
          </div>
        </div>
        
        <Button className="md:hidden" size="icon" variant="outline">
          <LayoutGridIcon className="h-5 w-5" />
          <span className="sr-only">Menu</span>
        </Button>
      </div>
    </header>
  )
}
"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/context/auth-provider"
import {
  CalendarCheck2,
  Home,
  LayoutDashboard,
  LogIn,
  Menu,
  Phone,
  UserCircle,
  UserPlus,
  Users,
  X,
} from "lucide-react"

import {
  mainNavLinks,
  secondaryNavLinks,
} from "@/config/nav-links"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"

import LanguageCurrencySelector from "./language-currency-selector"
import { Logo } from "@/components/logo"

const MainHeader = () => (
  <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div className="container flex h-14 items-center">
      <div className="mr-4 hidden md:flex">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Logo />
        </Link>
        <MainNav />
      </div>
      <MobileNav />
      <div className="flex flex-1 items-center justify-end space-x-2">
        <LanguageCurrencySelector />
        <AuthActions />
      </div>
    </div>
  </header>
)

const MainNav = () => {
  const pathname = usePathname()
  return (
    <nav className="flex items-center space-x-6 text-sm font-medium">
      {mainNavLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname === link.href ? "text-foreground" : "text-foreground/60"
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  )
}

const AuthActions = () => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-20" />
      </div>
    )
  }

  return (
    <>
      {user ? (
        <UserMenu user={user} />
      ) : (
        <div className="hidden items-center gap-2 md:flex">
          <Button asChild variant="outline" size="sm">
            <Link href="/signin">Sign In</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/signup">Register</Link>
          </Button>
        </div>
      )}
    </>
  )
}

const UserMenu = ({ user }: { user: any }) => {
  const { signOut } = useAuth()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={user.photoURL || "/images/default-avatar.png"}
              alt={user.displayName || "User"}
            />
            <AvatarFallback>
              {user.displayName ? user.displayName.charAt(0) : "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user.displayName}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile">
            <span className="flex items-center">
              <UserCircle className="mr-2 h-4 w-4" />
              Profile
            </span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard">
            <span className="flex items-center">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Partner Dashboard
            </span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/bookings">
            <span className="flex items-center">
              <CalendarCheck2 className="mr-2 h-4 w-4" />
              Bookings
            </span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/community-forum-demo">
            <span className="flex items-center">
              <Users className="mr-2 h-4 w-4" />
              Community Forum
            </span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/contact-support">
            <span className="flex items-center">
              <Phone className="mr-2 h-4 w-4" />
              Contact Support
            </span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut} className="text-destructive">
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const MobileNav = () => {
  const { user } = useAuth()

  return (
    <Sheet>
      <SheetTrigger
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "md:hidden"
        )}
      >
        <span>
          <Menu />
          <span className="sr-only">Toggle Menu</span>
        </span>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-xs">
        <nav className="flex h-full flex-col gap-6 text-lg font-medium">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-semibold"
            >
              <Logo />
              <span className="sr-only">Roam-Free</span>
            </Link>
            <SheetClose
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" })
              )}
            >
              <span>
                <X />
                <span className="sr-only">Close</span>
              </span>
            </SheetClose>
          </div>
          <Separator />
          {user ? (
            <div className="flex flex-1 flex-col justify-between">
              <div className="flex flex-col gap-2">
                <SheetClose asChild>
                  <Link href="/dashboard">
                    <span className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-muted">
                      <LayoutDashboard className="h-4 w-4" />
                      Partner Dashboard
                    </span>
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="/profile">
                    <span className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-muted">
                      <UserCircle className="h-4 w-4" />
                      Profile
                    </span>
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="/bookings">
                    <span className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-muted">
                      <CalendarCheck2 className="h-4 w-4" />
                      Bookings
                    </span>
                  </Link>
                </SheetClose>
              </div>
              <div>
                <Separator className="my-4" />
                <SheetClose asChild>
                  <Link href="/contact-support">
                    <span className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-muted">
                      <Phone className="h-4 w-4" />
                      Contact Support
                    </span>
                  </Link>
                </SheetClose>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <SheetClose asChild>
                <Link href="/signin">
                  <span className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-muted">
                    <LogIn className="h-4 w-4" />
                    Sign In
                  </span>
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link href="/signup">
                  <span className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-muted">
                    <UserPlus className="h-4 w-4" />
                    Register
                  </span>
                </Link>
              </SheetClose>
            </div>
          )}

          <Separator />
          <div className="flex flex-col gap-2">
            {secondaryNavLinks.map((link) => (
              <SheetClose asChild key={link.href}>
                <Link href={link.href}>
                  <span className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-foreground/70 hover:bg-muted hover:text-foreground">
                    {link.icon}
                    {link.label}
                  </span>
                </Link>
              </SheetClose>
            ))}
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  )
}

export { MainHeader }

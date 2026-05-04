import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth-context";
import { Shield, LogOut, LayoutDashboard, Map as MapIcon, User } from "lucide-react";
import { Button } from "./ui";

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [location] = useLocation();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-gradient-to-br from-primary to-secondary p-1.5 rounded-lg shadow-md group-hover:shadow-primary/30 transition-all">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-orange-600">
            FireAlert GM
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              {user?.isAdmin ? (
                <Link href="/admin" className={`text-sm font-medium transition-colors hover:text-primary ${location === '/admin' ? 'text-primary' : 'text-muted-foreground'}`}>
                  <span className="flex items-center gap-1"><LayoutDashboard className="w-4 h-4" /> Admin Console</span>
                </Link>
              ) : (
                <Link href="/dashboard" className={`text-sm font-medium transition-colors hover:text-primary ${location === '/dashboard' ? 'text-primary' : 'text-muted-foreground'}`}>
                  <span className="flex items-center gap-1"><MapIcon className="w-4 h-4" /> My Reports</span>
                </Link>
              )}
              
              <div className="h-6 w-px bg-border mx-2 hidden sm:block"></div>
              
              <div className="hidden sm:flex items-center gap-2 text-sm font-medium">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <User className="w-4 h-4" />
                </div>
                <span>{user?.fullName}</span>
              </div>

              <Button variant="ghost" size="sm" onClick={logout} className="text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                <LogOut className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Log in
              </Link>
              <Link href="/register">
                <Button size="sm">Report Emergency</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
    </div>
  );
}

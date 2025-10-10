import { NavLink, useNavigate } from 'react-router-dom';
import { ShoppingBag, UserCog, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppContext } from '@/context/AppContext';
import { Button } from './ui/button';

const Header = () => {
  const { session, signOut } = useAppContext();
  const navigate = useNavigate();
  const activeLinkClass = "text-primary";
  const defaultLinkClass = "transition-colors hover:text-primary";

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <NavLink to="/" className="mr-6 flex items-center space-x-2">
          <ShoppingBag className="h-6 w-6" />
          <span className="font-bold">Digi-Store</span>
        </NavLink>
        <nav className="flex items-center space-x-6 text-sm font-medium">
          <NavLink
            to="/"
            className={({ isActive }) => cn(defaultLinkClass, isActive && activeLinkClass)}
          >
            Store
          </NavLink>
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-4">
          {session ? (
            <Button variant="ghost" size="icon" onClick={handleSignOut}>
              <LogOut className="h-5 w-5" />
              <span className="sr-only">Sign Out</span>
            </Button>
          ) : (
            <NavLink
              to="/admin"
              className={({ isActive }) => cn(defaultLinkClass, isActive && activeLinkClass)}
            >
              <UserCog className="h-5 w-5" />
              <span className="sr-only">Admin Dashboard</span>
            </NavLink>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

import React, { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import './NavBar.css';

interface NavItem {
  id: string;
  label: string;
  href?: string;
  icon?: string;
  children?: NavItem[];
}

interface NavBarProps {
  logo?: {
    icon?: string;
    text: string;
  };
  menuItems: NavItem[];
  className?: string;
}

const NavBar: React.FC<NavBarProps> = ({
  logo = { icon: 'ri-database-2-fill', text: 'DataHub' },
  menuItems,
  className = ''
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<Set<string>>(new Set());
  const navRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click (mobile only)
  useEffect(() => {
    console.log('Closing menu on outside click');
    const handleClickOutside = (event: MouseEvent) => {
      if (
        navRef.current &&
        !navRef.current.contains(event.target as Node) &&
        isMenuOpen
      ) {
        setIsMenuOpen(false);
        setOpenDropdowns(new Set());
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(prev => {
      if (prev) {
        setOpenDropdowns(new Set());
      }
      return !prev;
    });
  };

  const toggleDropdown = (itemId: string) => {
    setOpenDropdowns(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const renderNavItem = (item: NavItem, level: number = 0): React.ReactNode => {
    const hasChildren = item.children && item.children.length > 0;
    const isDropdownOpen = openDropdowns.has(item.id);
    const isTopLevel = level === 0;

    if (hasChildren) {
      return (
        <li key={item.id} className="dropdown-item">
          <div 
            className="nav-link"
            onClick={() => toggleDropdown(item.id)}
          >
            {item.icon && <i className={item.icon}></i>}
            {item.label}
            <i className={`ri-arrow-down-s-line dropdown-arrow ${isDropdownOpen ? 'rotated' : ''}`}></i>
          </div>
          
          <ul className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`}>
            {item.children!.map(child => (
              <li key={child.id}>
                {renderNavItem(child, level + 1)}
              </li>
            ))}
          </ul>
        </li>
      );
    }

    if (isTopLevel) {
      return (
        <li key={item.id}>
          <NavLink
            to={item.href || '#'}
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
            onClick={() => {
              setIsMenuOpen(false);
              setOpenDropdowns(new Set());
            }}
          >
            {item.icon && <i className={item.icon}></i>}
            {item.label}
          </NavLink>
        </li>
      );
    }

    return (
      <NavLink
        to={item.href || '#'}
        className="dropdown-link"
        onClick={() => {
          setIsMenuOpen(false);
          setOpenDropdowns(new Set());
        }}
      >
        {item.icon && <i className={item.icon}></i>}
        {item.label}
      </NavLink>
    );
  };

  return (
    <header className={`header ${className}`}>
      <nav className="nav container" ref={navRef}>
        <div className="nav-data">
          <NavLink to="/" className="nav-logo">
            {logo.icon && <i className={logo.icon}></i>}
            {logo.text}
          </NavLink>
          
          <div 
            className={`nav-toggle ${isMenuOpen ? 'show-icon' : ''}`}
            onClick={toggleMenu}
          >
            <i className="ri-menu-line nav-burger"></i>
            <i className="ri-close-line nav-close"></i>
          </div>
        </div>

        <div className={`nav-menu ${isMenuOpen ? 'show-menu' : ''}`}>
          <ul className="nav-list">
            {menuItems.map(item => renderNavItem(item))}
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default NavBar;

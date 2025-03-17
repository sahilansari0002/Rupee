import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import NotificationBadge from './NotificationBadge';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  showProfile?: boolean;
  showNotification?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  title,
  showBack = false,
  showProfile = false,
  showNotification = false,
}) => {
  const navigate = useNavigate();
  
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-sm px-4 py-4 flex items-center justify-between"
    >
      <div className="flex items-center">
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            className="mr-3 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ArrowLeft size={20} />
          </button>
        )}
        <h1 className="text-xl font-semibold">{title}</h1>
      </div>
      
      <div className="flex items-center space-x-2">
        {showNotification && (
          <NotificationBadge />
        )}
        
        {showProfile && (
          <Link to="/profile" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <User size={20} />
          </Link>
        )}
      </div>
    </motion.header>
  );
};

export default Header;
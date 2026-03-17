import React from 'react';
import { Package, MapPin, Shield, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AccountCard = ({ icon, title, iconColor, bgColor, onClick }) => {
  const Icon = icon;
  return (
    <div 
      onClick={onClick}
      className="flex items-center gap-3 sm:gap-4 p-4 sm:p-6 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group"
    >
      <div className={`${bgColor} p-2 sm:p-3 rounded-lg flex items-center justify-center`}>
        <Icon className={`${iconColor} w-5 h-5 sm:w-6 sm:h-6`} />
      </div>
      <h3 className="font-semibold text-slate-900 text-base sm:text-lg">{title}</h3>
    </div>
  );
};

const Account = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const accountLinks = [
    {
      title: 'Your Orders',
      icon: Package,
      iconColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
      onClick: () => navigate('/order-tracking')
    },
    {
      title: 'Your Addresses',
      icon: MapPin,
      iconColor: 'text-red-600',
      bgColor: 'bg-red-50',
      onClick: () => navigate('/address')
    }
  ];

  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">Hello, {user.first_name || user.name}!</h1>
        <p className="text-slate-500 font-medium text-sm sm:text-base">{user.email}</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6 max-w-4xl">
        {accountLinks.map((link, index) => (
          <AccountCard 
            key={index}
            icon={link.icon}
            title={link.title}
            iconColor={link.iconColor}
            bgColor={link.bgColor}
            onClick={link.onClick}
          />
        ))}
      </div>
    </div>
  );
};

export default Account;

import React from 'react';
import { Package, MapPin, Shield, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AccountCard = ({ icon, title, iconColor, bgColor }) => {
  const Icon = icon;
  return (
    <div className="flex items-center gap-4 p-6 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group">
      <div className={`${bgColor} p-3 rounded-lg flex items-center justify-center`}>
        <Icon className={`${iconColor} w-6 h-6`} />
      </div>
      <h3 className="font-semibold text-slate-900 text-lg">{title}</h3>
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
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Your Addresses',
      icon: MapPin,
      iconColor: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Login & Security',
      icon: Shield,
      iconColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Contact us',
      icon: Phone,
      iconColor: 'text-amber-600',
      bgColor: 'bg-amber-50'
    }
  ];

  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Hello, {user.first_name || user.name}!</h1>
        <p className="text-slate-500 font-medium">{user.email}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-4xl">
        {accountLinks.map((link, index) => (
          <AccountCard 
            key={index}
            icon={link.icon}
            title={link.title}
            iconColor={link.iconColor}
            bgColor={link.bgColor}
          />
        ))}
      </div>
    </div>
  );
};

export default Account;

import React from 'react';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';

interface ContactItemData {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}

const data: ContactItemData[] = [
  {
    title: "Visit Us",
    subtitle: "Dharapuram, India",
    icon: (
      <MapPin className="w-6 h-6 text-gray-600 group-hover:text-primary transition-colors" />
    ),
  },
  {
    title: "Call Us",
    subtitle: "+91 9876543210",
    icon: (
      <Phone className="w-6 h-6 text-gray-600 group-hover:text-primary transition-colors" />
    ),
  },
  {
    title: "Working Hours",
    subtitle: "Mon - Sat: 10:00 AM - 7:00 PM",
    icon: (
      <Clock className="w-6 h-6 text-gray-600 group-hover:text-primary transition-colors" />
    ),
  },
  {
    title: "Mail Us",
    subtitle: "motozoop@gmail.com",
    icon: (
      <Mail className="w-6 h-6 text-gray-600 group-hover:text-primary transition-colors" />
    ),
  },
];

const FooterTop = () => {
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-8">
      {data.map((item, index) => (
        <div
          key={index}
          className="flex items-center gap-4 group cursor-pointer"
        >
          <div className="p-3 rounded-full bg-gray-100">{item.icon}</div>
          <div>
            <h4 className="text-lg font-semibold">{item.title}</h4>
            <p className="text-gray-600 text-sm">{item.subtitle}</p>
          </div>
        </div>
      ))}
    </div>
};

export default FooterTop;

import React, { useState } from 'react';
import AccountSummary from './AccountSummary';
import LinkGenerator from './LinkGenerator';
import GeneratedLinks from './GeneratedLinks';
import Image from 'next/image';
import { User } from 'lucide-react'
import { signOut } from '@/lib/firebase/firebaseUtils';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

interface DashboardInterfaceProps {
  user: any;
  accountBalance: number;
  onSignOut: () => void;
  onProfileClick: () => void;
  generatedLinks: Array<{childName: string, link: string, imageUrl: string}>;
  onGenerateLink: (childName: string, link: string) => void;
  onUpdateLinks: (links: Array<{childName: string, link: string, imageUrl: string}>) => void;
  existingChildNames: string[];
}

const DashboardInterface: React.FC<DashboardInterfaceProps> = ({
  user,
  accountBalance,
  onSignOut,
  onProfileClick,
  generatedLinks,
  onGenerateLink,
  onUpdateLinks,
  existingChildNames
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const defaultUserIcon = '/default-user-icon.png';
  const router = useRouter();

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-blue-100 p-4 text-black">
      <main className="container mx-auto max-w-4xl relative z-10">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <Image 
              src="/sproutfuture-logo.png" // Make sure to add your logo file to the public folder
              alt="SproutFuture Logo"
              width={50}
              height={50}
              className="mr-4"
            />
            <h1 className="text-3xl font-bold">SproutFuture Dashboard</h1>
          </div>
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-10 h-10 rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
            >
              <Image 
                src={user.photoURL || defaultUserIcon}
                alt="User profile"
                width={40}
                height={40}
                onError={(e) => {
                  e.currentTarget.src = defaultUserIcon;
                }}
              />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                  <button
                    onClick={onProfileClick}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                    role="menuitem"
                  >
                    Profile
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                    role="menuitem"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-8">
          <AccountSummary balance={accountBalance} />
          {generatedLinks && generatedLinks.length > 0 && (
            <GeneratedLinks 
              links={generatedLinks} 
              userId={user.uid} 
              onUpdateLinks={onUpdateLinks} 
            />
          )}
          <div className="mt-8">
            <LinkGenerator
              onGenerateLink={onGenerateLink}
              existingLinksCount={generatedLinks.length}
              existingChildNames={existingChildNames}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardInterface;

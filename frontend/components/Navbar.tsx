import Link from 'next/link';
import { ShoppingBag, MessageSquare, Menu } from 'lucide-react';
import { SignInButton, SignUpButton, UserButton, SignedIn, SignedOut, useUser } from '@clerk/nextjs';
import { useEffect } from 'react';
import api from '@/lib/api';

const Navbar = () => {
    const { user, isSignedIn } = useUser();

    useEffect(() => {
        if (isSignedIn && user) {
            const syncUser = async () => {
                try {
                    await api.post('/api/v1/user/sync', {
                        clerk_id: user.id,
                        email: user.primaryEmailAddress?.emailAddress,
                        first_name: user.firstName,
                        last_name: user.lastName
                    });
                } catch (error) {
                    console.error('Failed to sync user:', error);
                }
            };
            syncUser();
        }
    }, [isSignedIn, user]);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#030712]/50 backdrop-blur-xl">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-20">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="text-2xl font-black tracking-tighter hover:opacity-80 transition-opacity">
                            PRICE<span className="text-blue-500">WISE</span>
                        </Link>

                        <div className="hidden md:flex items-center gap-6">
                            <Link href="/products" className="text-sm font-medium text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                                <ShoppingBag className="w-4 h-4" /> Products
                            </Link>
                            <Link href="/chat" className="text-sm font-medium text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                                <MessageSquare className="w-4 h-4" /> AI Assistant
                            </Link>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <SignedOut>
                            <div className="hidden md:flex items-center gap-2">
                                <SignInButton mode="modal">
                                    <button className="px-5 py-2 rounded-full text-sm font-bold text-gray-300 hover:text-white transition-colors">
                                        Sign In
                                    </button>
                                </SignInButton>
                                <SignUpButton mode="modal">
                                    <button className="px-6 py-2.5 rounded-full text-sm font-bold bg-white text-black hover:bg-gray-200 transition-all shadow-lg active:scale-95">
                                        Join Free
                                    </button>
                                </SignUpButton>
                            </div>
                        </SignedOut>

                        <SignedIn>
                            <UserButton
                                appearance={{
                                    elements: {
                                        avatarBox: "w-10 h-10"
                                    }
                                }}
                            />
                        </SignedIn>

                        <button className="md:hidden p-2 text-gray-400 hover:text-white">
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

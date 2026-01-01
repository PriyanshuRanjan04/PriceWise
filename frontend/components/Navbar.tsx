import Link from 'next/link';

const Navbar = () => {
    return (
        <nav className="flex items-center justify-between p-4 bg-white shadow-md">
            <div className="text-xl font-bold">
                <Link href="/">PriceWise</Link>
            </div>
            <div className="flex gap-4">
                <Link href="/products" className="hover:text-blue-500">Products</Link>
                <Link href="/chat" className="hover:text-blue-500">AI Chat</Link>
            </div>
            <div>
                {/* Auth Placeholder */}
                <button className="px-4 py-2 bg-blue-600 text-white rounded">Login</button>
            </div>
        </nav>
    );
};

export default Navbar;

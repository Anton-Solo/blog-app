import GoogleLoginButton from "./GoogleLoginButton";
import Link from "next/link";

export default function Header() {
  return (
    <nav className="nav-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-2xl font-bold text-gray-900 tracking-tight">
              Blog
            </Link>
            <div className="flex gap-4">
              <Link 
                href="/create-post" 
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                  Create post
              </Link>
            </div>
          </div>
          <div>
            <GoogleLoginButton />
          </div>
        </div>
      </div>
    </nav>
  );
} 
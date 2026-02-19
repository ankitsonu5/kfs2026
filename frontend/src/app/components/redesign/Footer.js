import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import Image from "next/image";
import { FaInstagram, FaFacebookF } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="bg-white pt-20 pb-10 border-t border-gray-100">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-6">
            <Link
              href="/">
              <Image src="/kfslogo.webp"
                  alt="logo"
                  width={150}
                  height={60}
                  priority />
            </Link>
            <p  style={{paddingTop: "20px"}}
            className="text-gray-500 leading-relaxed">
            Fresh quality products delivered directly to your doorstep with
              love and care.  
            </p>
            <div className="flex gap-4">
              {/* Social Placeholder */}
              <div className="w-10 h-10 rounded-full bg-gray-100 hover:bg-green-100 flex items-center justify-center text-gray-600 hover:text-green-600 transition-colors cursor-pointer">
              <FaFacebookF />
              </div>
              <div className="w-10 h-10 rounded-full bg-gray-100 hover:bg-green-100 flex items-center justify-center text-gray-600 hover:text-green-600 transition-colors cursor-pointer">
              <FaXTwitter />
              </div>
              <div className="w-10 h-10 rounded-full bg-gray-100 hover:bg-green-100 flex items-center justify-center text-gray-600 hover:text-green-600 transition-colors cursor-pointer">
              <FaInstagram />
              </div>
            </div>
          </div>

          {/* Links 1 */}
          <div>
            <h4 className="text-lg font-bold text-gray-900 mb-6">Our Policy</h4>
            <ul className="space-y-4 text-gray-600">
              <li>
                <Link
                  href="#"
                  className="hover:text-green-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-green-600 transition-colors">
                  Term of Use
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-green-600 transition-colors">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-green-600 transition-colors">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h4 className="text-lg font-bold text-gray-900 mb-6">Company</h4>
            <ul className="space-y-4 text-gray-600">
              <li>
                <Link
                  href="/aboutus"
                  className="hover:text-green-600 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="contact"
                  className="hover:text-green-600 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-green-600 transition-colors">
                  Career
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-green-600 transition-colors">
                  Affiliates
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold text-gray-900 mb-6">Contact</h4>
            <ul className="space-y-4 text-gray-600">
              <li className="flex gap-3 items-center">
                <Phone className="w-4 h-4 text-green-600" />
                <span>+1 123 456 7890</span>
              </li>
              <li className="flex gap-3 items-center">
                <Mail className="w-4 h-4 text-green-600" />
                <span>support@xstore.com</span>
              </li>
              <li className="flex gap-3 items-center">
                <MapPin className="w-4 h-4 text-green-600" />
                <span>123 Market St, San Francisco, CA</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-gray-500 text-sm">
          <p>© 2026 KFS. All rights reserved.</p>
          <div className="flex gap-4">
            {/* Payment Icons */}
            <span>VISA</span>
            <span>MasterCard</span>
            <span>PayPal</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

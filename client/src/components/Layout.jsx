import Navbar from './Navbar';
import Footer from './Footer';
import WhatsAppButton from './WhatsAppButton';

// The fixed header is two rows tall: the emergency hotline strip (24px) plus
// the main nav bar (64px). Sticky sub-navs inside pages offset by the same
// 88px — keep the three numbers in sync if the header ever changes height.
export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <Navbar />
      <main className="min-h-[80vh] flex-1 pt-[88px]">{children}</main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

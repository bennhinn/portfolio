import './globals.css';
import '../components/creative/creative.css';
import '../components/about/aurora.css';
import '../components/projects/gertrudes.css';
import '../components/projects/thumbnails.css';
import '../components/projects/selected-work.css';
import './hero-mobile.css';
import type {Metadata,Viewport} from 'next';
export const viewport:Viewport={width:'device-width',initialScale:1,viewportFit:'cover'};
export const metadata:Metadata={title:'Bennhinn Mwangi — Software Developer & Creative Technologist',description:'Portfolio of Bennhinn Mwangi: software development, design, music, and creative technology.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}

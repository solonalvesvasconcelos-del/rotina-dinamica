import './globals.css';
export const metadata={title:'Rotina Dinâmica',description:'Sua escala, seus objetivos e seu dia em equilíbrio.',applicationName:'Rotina Dinâmica',manifest:'/manifest.webmanifest',appleWebApp:{capable:true,statusBarStyle:'default',title:'Rotina Dinâmica'},icons:{icon:'/icons/icon-192.png',apple:'/icons/icon-192.png'}};
export const viewport={width:'device-width',initialScale:1,viewportFit:'cover',themeColor:'#246652'};
export default function Layout({children}){return <html lang="pt-BR"><body>{children}</body></html>}

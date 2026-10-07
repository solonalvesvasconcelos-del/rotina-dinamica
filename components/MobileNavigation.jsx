'use client';
import {useEffect,useRef,useState} from 'react';
const shortcuts=[['Hoje','◉'],['Estudos','▤'],['Finanças','$']];
const more=['Escala','Planejamento','Uber','Academia','Metas','Histórico','Preferências'];
export default function MobileNavigation({tab,email,onSelect,onSignOut}) {
 const dialog=useRef(null),[installPrompt,setInstallPrompt]=useState(null),[help,setHelp]=useState(false),[menuOpen,setMenuOpen]=useState(false);
 useEffect(()=>{if(!menuOpen)return;const previous=document.body.style.overflow;document.body.style.overflow="hidden";return()=>{document.body.style.overflow=previous}},[menuOpen]);
 useEffect(()=>{const listener=e=>{e.preventDefault();setInstallPrompt(e)};const installed=()=>setInstallPrompt(null);window.addEventListener('beforeinstallprompt',listener);window.addEventListener('appinstalled',installed);return()=>{window.removeEventListener('beforeinstallprompt',listener);window.removeEventListener('appinstalled',installed)}},[]);
 function select(name){dialog.current?.close();onSelect(name)}
 async function install(){if(installPrompt){await installPrompt.prompt();await installPrompt.userChoice;setInstallPrompt(null)}else setHelp(!help)}
 return <div className="mobileNavigation"><div className="mobileBrand"><span className="logo" aria-hidden="true">r<span>•</span></span><b>rotina dinâmica</b></div>
 <nav className="mobileBottom" aria-label="Navegação principal no celular">{shortcuts.map(([name,icon])=><button key={name} aria-current={tab===name?'page':undefined} className={tab===name?'active':''} onClick={()=>select(name)}><span aria-hidden="true">{icon}</span>{name}</button>)}<button className={more.includes(tab)?'active':''} aria-haspopup="dialog" onClick={()=>{dialog.current.showModal();setMenuOpen(true)}}><span aria-hidden="true">☰</span>Mais</button></nav>
 <dialog onClose={()=>setMenuOpen(false)} ref={dialog} className="mobileMenu" aria-labelledby="mobile-menu-title" onClick={e=>{if(e.target===dialog.current){const rect=dialog.current.getBoundingClientRect();if(e.clientX<rect.left||e.clientX>rect.right||e.clientY<rect.top||e.clientY>rect.bottom)dialog.current.close()}}}>
 <div className="sectionHead"><h2 id="mobile-menu-title">Sua rotina</h2><button className="link" onClick={()=>dialog.current.close()} aria-label="Fechar menu">Fechar ✕</button></div><div className="mobileMenuLinks">{more.map(name=><button key={name} aria-current={tab===name?'page':undefined} onClick={()=>select(name)}>{name}</button>)}</div>
 <button className="link" onClick={install}>{installPrompt?'Instalar aplicativo':'Adicionar à tela inicial'}</button>{help&&<p role="status">No Android, abra o menu do navegador e escolha “Adicionar à tela inicial” ou “Instalar aplicativo”. No iPhone, abra no Safari, toque em Compartilhar e depois em “Adicionar à Tela de Início”. O sistema precisa de conexão para carregar e salvar dados.</p>}
 <p className="mobileEmail">{email}</p><button className="link" onClick={()=>{dialog.current.close();onSignOut()}}>Sair da conta</button></dialog></div>;
}

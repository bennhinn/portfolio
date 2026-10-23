const projects = {
 campus: {name:'Smart Campus',url:'https://smart-campus-service-portal.vercel.app/',host:'smart-campus-service-portal.vercel.app',caption:'Homepage preview'},
 youtube: {name:'LearnTube',url:'https://youtube-learning-app-one.vercel.app/',host:'youtube-learning-app-one.vercel.app',caption:'Sign-in preview'},
 umoja: {name:'Umoja+ Lifeline',url:'https://bennhinn.github.io/umoja-lifeline/',host:'bennhinn.github.io/umoja-lifeline',caption:'SOS prototype preview'},
};
export default function WebsiteThumbnail({project}:{project:keyof typeof projects}){
 const item=projects[project];
 return <a className={`website-thumbnail website-thumbnail-${project}`} href={item.url} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${item.name} — live website`}>
  <div className="website-thumbnail-bar" aria-hidden="true"><span className="website-window-dots"><i/><i/><i/></span><span>{item.host}</span><span>↗</span></div>
  <div className="website-thumbnail-viewport" aria-hidden="true"><iframe src={`/previews/${project}.html`} title={`${item.name} static preview`} loading="lazy" sandbox="" tabIndex={-1}/></div>
  <div className="website-thumbnail-caption" aria-hidden="true"><span>{item.caption}</span><span>Open site ↗</span></div>
 </a>;
}

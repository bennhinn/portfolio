import Hero from '../components/Hero';
import SelectedWork from '../components/SelectedWork';
import About from '../components/About';
import Contact from '../components/Contact';
import Creative from '../components/Creative';
export default function Page(){return <main>
  <Hero splineScene={process.env.NEXT_PUBLIC_SPLINE_SCENE_URL||undefined} cvUrl={process.env.NEXT_PUBLIC_CV_URL||undefined} contactHref="#contact"/>
  <SelectedWork />
  <About />
  <Creative />
  <Contact />
 </main>}

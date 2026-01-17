import Footer from '../components/site/Footer'
import AboutIBCSection from '../components/site/AboutIBCSection'
import MissionSection from '../components/site/MissionSection'

function AboutPage() {
    return (
        <>
            <h1>Welcome to the About Page</h1>
            <p>This is the main content area.</p>
            <AboutIBCSection/>
            <MissionSection/>
            <Footer/>
        </>
    )
}

export default AboutPage
import React from 'react';
import { Link } from 'react-router-dom';

const FeatureCard = ({ title, description, icon }: { title: string; description: string; icon: React.ReactNode }) => (
  <div className="bg-light-secondary dark:bg-dark-secondary p-8 rounded-xl shadow-lg text-center transition-transform hover:-translate-y-2 border border-light-border dark:border-dark-border">
    <div className="flex justify-center items-center mb-5 w-16 h-16 mx-auto bg-light dark:bg-dark rounded-full border border-light-border dark:border-dark-border">{icon}</div>
    <h3 className="text-xl font-bold font-heading mb-2">{title}</h3>
    <p className="text-gray-600 dark:text-gray-400 font-sans text-base">{description}</p>
  </div>
);

const TestimonialCard = ({ quote, author, title }: { quote: string; author: string; title: string; }) => (
    <div className="bg-light-secondary dark:bg-dark-secondary p-8 rounded-xl border border-light-border dark:border-dark-border">
        <p className="font-sans text-lg mb-6 text-gray-700 dark:text-gray-300">"{quote}"</p>
        <div>
            <p className="font-bold font-heading">{author}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        </div>
    </div>
);


const LandingPage = () => {
  return (
    <div className="space-y-24 md:space-y-32 animate-fade-in font-sans">
      <section className="text-center pt-10 md:pt-16">
        <h1 className="text-5xl md:text-7xl font-bold font-heading mb-6">
          Generate Stunning AI Images Instantly.
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-10">
          Unleash your creativity with our powerful AI. Create professional, high-quality images from text prompts in seconds. Minimalist. Fast. Secure.
        </p>
        <Link 
          to="/generate" 
          className="bg-accent-dark text-accent dark:bg-accent dark:text-accent-dark px-8 py-4 rounded-full font-bold text-lg hover:opacity-90 transition-all transform hover:scale-105 inline-block"
        >
          Start Generating for Free
        </Link>
         <p className="text-sm mt-4 text-gray-500">25 free credits on signup.</p>
      </section>

      <section>
        <h2 className="text-4xl font-bold font-heading mb-12 text-center">How It Works in 3 Easy Steps</h2>
        <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
                icon={<span className="text-2xl font-bold font-heading">1</span>}
                title="Describe Your Vision"
                description="Write a detailed text prompt describing the image you want to create."
            />
            <FeatureCard
                icon={<span className="text-2xl font-bold font-heading">2</span>}
                title="Generate Image"
                description="Our advanced AI model interprets your prompt and generates a unique image in seconds."
            />
            <FeatureCard
                icon={<span className="text-2xl font-bold font-heading">3</span>}
                title="Download & Use"
                description="Instantly download your high-resolution image. No watermarks, completely yours."
            />
        </div>
      </section>

      <section>
        <h2 className="text-4xl font-bold font-heading mb-12 text-center">Built for Creators Who Value Privacy</h2>
        <div className="grid md:grid-cols-3 gap-8 text-base">
          <FeatureCard 
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>}
            title="Advanced AI Model"
            description="Leverage state-of-the-art AI to produce breathtaking and highly detailed images."
          />
          <FeatureCard 
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>}
            title="Privacy First"
            description="We respect your privacy. No images or prompts are ever stored on our servers."
          />
          <FeatureCard 
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg>}
            title="Fast & Efficient"
            description="Our streamlined interface and powerful backend deliver images in record time."
          />
        </div>
      </section>
      
      <section>
        <h2 className="text-4xl font-bold font-heading mb-12 text-center">What Our Users Say</h2>
        <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard 
                quote="The black and white theme is so clean. It helps me focus on creating. The image quality is top-notch!"
                author="Alex R."
                title="Digital Artist"
            />
            <TestimonialCard 
                quote="Finally, a tool that respects my privacy. Not storing my prompts is a huge plus. The credit system is fair and simple."
                author="Samantha B."
                title="Content Creator"
            />
            <TestimonialCard 
                quote="As an admin, the dashboard is incredibly intuitive. Approving payments and managing users is straightforward and fast."
                author="Michael T."
                title="Studio Manager"
            />
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
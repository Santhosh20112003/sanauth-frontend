import { useEffect, useRef } from 'react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
  gradient?: string;
  delay?: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  title, 
  description, 
  icon, 
  gradient = "from-indigo-500 to-purple-500",
  delay = 0 
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setTimeout(() => {
          card.classList.add('animate-fade-in-up');
        }, delay * 1000);
        observer.unobserve(card);
      }
    }, { threshold: 0.1 });
    
    observer.observe(card);
    
    return () => {
      observer.unobserve(card);
    };
  }, [delay]);
  
  return (
    <div 
      ref={cardRef}
      className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 opacity-0"
    >
      {/* Icon with gradient background */}
      <div className={`w-16 h-16 bg-gradient-to-r ${gradient} rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      
      {/* Content */}
      <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-indigo-600 transition-colors">
        {title}
      </h3>
      <p className="text-gray-600 leading-relaxed">
        {description}
      </p>
      
      {/* Hover effect overlay */}
      <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>
    </div>
  );
};

export default FeatureCard;

import React from 'react';

const StepIndicator = ({ currentStep }) => {
    const steps = ["Verification", "Valuation", "Tokenization"];

    return (
        <div className="flex items-center justify-center w-full max-w-2xl mx-auto p-4">
            {steps.map((step, index) => (
                <React.Fragment key={step}>
                    <div className="flex flex-col items-center text-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                            currentStep > index + 1 ? 'bg-celestial-blue border-celestial-blue glow-cosmic' :
                            currentStep === index + 1 ? 'bg-celestial-blue border-celestial-blue glow-cosmic animate-pulse-glow' :
                            'border-stardust-dim bg-dark-matter'
                        }`}>
                            {currentStep > index + 1 ? (
                                <svg className="w-7 h-7 text-void-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                            ) : (
                                <span className={`font-data text-lg font-bold ${
                                    currentStep >= index + 1 ? 'text-void-black' : 'text-stardust-grey'
                                }`}>
                                    {index + 1}
                                </span>
                            )}
                        </div>
                        <p className={`mt-3 text-sm font-semibold uppercase tracking-wider ${
                            currentStep >= index + 1 ? 'text-white' : 'text-stardust-grey'
                        }`}>
                            {step}
                        </p>
                    </div>
                    {index < steps.length - 1 && (
                        <div className={`flex-1 h-1 mx-4 transition-all duration-500 ${
                            currentStep > index + 1 ? 'bg-celestial-blue' : 'bg-stardust-dim'
                        }`}></div>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

export default StepIndicator;

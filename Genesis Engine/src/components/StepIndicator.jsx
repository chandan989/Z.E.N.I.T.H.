import React from 'react';

const StepIndicator = ({ currentStep }) => {
    const steps = ["Verification", "Valuation", "Tokenization"];
    return (
        <div className="flex items-center justify-center w-full max-w-md mx-auto">
            {steps.map((step, index) => (
                <React.Fragment key={step}>
                    <div className="flex flex-col items-center text-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${currentStep >= index + 1 ? 'bg-celestial-blue border-celestial-blue' : 'border-gray-700'}`}>
                            {currentStep > index + 1 ? (<svg className="w-6 h-6 text-void-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>) : (<span className={`font-data font-bold ${currentStep >= index + 1 ? 'text-void-black' : 'text-stardust-grey'}`}>{index + 1}</span>)}
                        </div>
                        <p className={`mt-2 text-xs font-semibold uppercase tracking-wider ${currentStep >= index + 1 ? 'text-white' : 'text-stardust-grey'}`}>{step}</p>
                    </div>
                    {index < steps.length - 1 && (<div className={`flex-1 h-0.5 mx-4 transition-all duration-500 ${currentStep > index + 1 ? 'bg-celestial-blue' : 'bg-gray-800'}`}></div>)}
                </React.Fragment>
            ))}
        </div>
    );
};

export default StepIndicator;

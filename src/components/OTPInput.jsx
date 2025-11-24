import React, { useRef, useState } from 'react';

const OTPInput = ({ length = 6, onComplete, onChange }) => {
    const [otp, setOtp] = useState(new Array(length).fill(''));
    const inputRefs = useRef([]);

    const handleChange = (index, value) => {
        // Only allow numbers
        if (isNaN(value)) return;

        const newOtp = [...otp];
        // Take only the last character if multiple are pasted
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }

        // Call onChange to update parent component
        const otpString = newOtp.join('');
        if (onChange) {
            onChange(otpString);
        }

        // Call onComplete when all digits are filled
        if (otpString.length === length && !otpString.includes('')) {
            // Small delay to ensure state is updated
            setTimeout(() => onComplete(otpString), 100);
        }
    };

    const handleKeyDown = (index, e) => {
        // Handle backspace
        if (e.key === 'Backspace') {
            if (!otp[index] && index > 0) {
                // Move to previous input if current is empty
                inputRefs.current[index - 1]?.focus();
            }
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, length);

        if (isNaN(pastedData)) return;

        const newOtp = [...otp];
        for (let i = 0; i < pastedData.length; i++) {
            newOtp[i] = pastedData[i];
        }
        setOtp(newOtp);

        // Focus the next empty input or the last one
        const nextIndex = Math.min(pastedData.length, length - 1);
        inputRefs.current[nextIndex]?.focus();

        // Call onComplete if all digits are filled
        const otpString = newOtp.join('');
        if (otpString.length === length && !otpString.includes('')) {
            setTimeout(() => onComplete(otpString), 100);
        }
    };

    return (
        <div className="flex gap-2 justify-center">
            {otp.map((digit, index) => (
                <input
                    key={index}
                    ref={(ref) => (inputRefs.current[index] = ref)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-accent focus:ring-2 focus:ring-accent focus:outline-none transition-all"
                    autoFocus={index === 0}
                />
            ))}
        </div>
    );
};

export default OTPInput;

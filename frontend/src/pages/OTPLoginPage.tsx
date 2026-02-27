import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Phone, KeyRound, CheckCircle2, AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Step = 'phone' | 'otp' | 'success';

function generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export default function OTPLoginPage() {
    const [step, setStep] = useState<Step>('phone');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [generatedOTP, setGeneratedOTP] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [otpError, setOtpError] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);

    const validatePhone = (value: string) => {
        const digits = value.replace(/\D/g, '');
        if (!digits) return 'Please enter your mobile number.';
        if (digits.length < 10) return 'Please enter a valid 10-digit mobile number.';
        return '';
    };

    const handleSendOTP = async () => {
        const error = validatePhone(phone);
        if (error) {
            setPhoneError(error);
            return;
        }
        setPhoneError('');
        setIsSending(true);

        // Simulate a brief delay for "sending"
        await new Promise((res) => setTimeout(res, 800));

        const newOTP = generateOTP();
        setGeneratedOTP(newOTP);
        setOtp('');
        setOtpError('');
        setStep('otp');
        setIsSending(false);
    };

    const handleVerifyOTP = async () => {
        if (!otp.trim()) {
            setOtpError('Please enter the OTP.');
            return;
        }
        setIsVerifying(true);

        // Simulate brief verification delay
        await new Promise((res) => setTimeout(res, 600));

        if (otp.trim() === generatedOTP) {
            setOtpError('');
            setStep('success');
        } else {
            setOtpError('Incorrect OTP. Please try again.');
        }
        setIsVerifying(false);
    };

    const handleResend = async () => {
        setIsSending(true);
        await new Promise((res) => setTimeout(res, 600));
        const newOTP = generateOTP();
        setGeneratedOTP(newOTP);
        setOtp('');
        setOtpError('');
        setIsSending(false);
    };

    const handlePhoneKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSendOTP();
    };

    const handleOtpKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleVerifyOTP();
    };

    return (
        <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-background">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-gold/5 blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-brand-red/5 blur-3xl" />
            </div>

            <div className="relative w-full max-w-md">
                {/* Card */}
                <div className="bg-brand-surface border border-gold/20 rounded-2xl shadow-gold-sm overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-brand-dark to-brand-surface px-8 pt-8 pb-6 border-b border-gold/15">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center">
                                <Phone size={20} className="text-gold" />
                            </div>
                            <h1 className="font-brand text-2xl font-bold text-gold tracking-wider">
                                OTP Login
                            </h1>
                        </div>
                        <p className="text-foreground/60 text-sm font-body">
                            {step === 'phone' && 'Enter your mobile number to receive a one-time password.'}
                            {step === 'otp' && `OTP sent to +91 ${phone.replace(/\D/g, '')}`}
                            {step === 'success' && 'You have been successfully verified!'}
                        </p>
                    </div>

                    {/* Step indicator */}
                    <div className="flex items-center gap-0 px-8 pt-5">
                        {['phone', 'otp', 'success'].map((s, i) => (
                            <div key={s} className="flex items-center flex-1 last:flex-none">
                                <div
                                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-heading border-2 transition-all duration-300 ${
                                        step === s
                                            ? 'bg-gold border-gold text-brand-dark'
                                            : ['phone', 'otp', 'success'].indexOf(step) > i
                                            ? 'bg-gold/30 border-gold/50 text-gold'
                                            : 'bg-transparent border-gold/20 text-foreground/30'
                                    }`}
                                >
                                    {['phone', 'otp', 'success'].indexOf(step) > i ? '✓' : i + 1}
                                </div>
                                {i < 2 && (
                                    <div
                                        className={`flex-1 h-0.5 mx-1 transition-all duration-300 ${
                                            ['phone', 'otp', 'success'].indexOf(step) > i
                                                ? 'bg-gold/50'
                                                : 'bg-gold/15'
                                        }`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Content */}
                    <div className="px-8 py-6">
                        {/* Step 1: Phone Input */}
                        {step === 'phone' && (
                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="text-foreground/80 font-heading font-semibold text-sm tracking-wide">
                                        Mobile Number
                                    </Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50 font-body text-sm select-none">
                                            +91
                                        </span>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            placeholder="Enter Mobile Number"
                                            value={phone}
                                            onChange={(e) => {
                                                setPhone(e.target.value);
                                                if (phoneError) setPhoneError('');
                                            }}
                                            onKeyDown={handlePhoneKeyDown}
                                            maxLength={15}
                                            className={`pl-12 bg-brand-dark border-gold/25 text-foreground placeholder:text-foreground/35 focus:border-gold focus:ring-gold/20 font-body ${
                                                phoneError ? 'border-brand-red focus:border-brand-red' : ''
                                            }`}
                                        />
                                    </div>
                                    {phoneError && (
                                        <div className="flex items-center gap-2 text-brand-red text-xs font-body animate-in">
                                            <AlertCircle size={13} />
                                            {phoneError}
                                        </div>
                                    )}
                                </div>

                                <Button
                                    onClick={handleSendOTP}
                                    disabled={isSending}
                                    className="w-full bg-gold hover:bg-gold-light text-brand-dark font-heading font-bold tracking-wide transition-all duration-200 disabled:opacity-60"
                                >
                                    {isSending ? (
                                        <span className="flex items-center gap-2">
                                            <RefreshCw size={16} className="animate-spin" />
                                            Sending OTP...
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            <Phone size={16} />
                                            Send OTP
                                        </span>
                                    )}
                                </Button>
                            </div>
                        )}

                        {/* Step 2: OTP Input */}
                        {step === 'otp' && (
                            <div className="space-y-5">
                                {/* OTP Display Box */}
                                <div className="bg-gold/10 border border-gold/30 rounded-xl p-4 flex items-center gap-3">
                                    <KeyRound size={20} className="text-gold flex-shrink-0" />
                                    <div>
                                        <p className="text-foreground/60 text-xs font-body mb-0.5">Your OTP (for testing)</p>
                                        <p className="text-gold font-brand text-2xl font-bold tracking-[0.3em]">
                                            {generatedOTP}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="otp" className="text-foreground/80 font-heading font-semibold text-sm tracking-wide">
                                        Enter OTP
                                    </Label>
                                    <Input
                                        id="otp"
                                        type="text"
                                        placeholder="Enter OTP"
                                        value={otp}
                                        onChange={(e) => {
                                            setOtp(e.target.value.replace(/\D/g, '').slice(0, 6));
                                            if (otpError) setOtpError('');
                                        }}
                                        onKeyDown={handleOtpKeyDown}
                                        maxLength={6}
                                        className={`bg-brand-dark border-gold/25 text-foreground placeholder:text-foreground/35 focus:border-gold focus:ring-gold/20 font-body text-center text-xl tracking-[0.4em] ${
                                            otpError ? 'border-brand-red focus:border-brand-red' : ''
                                        }`}
                                    />
                                    {otpError && (
                                        <div className="flex items-center gap-2 text-brand-red text-xs font-body animate-in">
                                            <AlertCircle size={13} />
                                            {otpError}
                                        </div>
                                    )}
                                </div>

                                <Button
                                    onClick={handleVerifyOTP}
                                    disabled={isVerifying}
                                    className="w-full bg-gold hover:bg-gold-light text-brand-dark font-heading font-bold tracking-wide transition-all duration-200 disabled:opacity-60"
                                >
                                    {isVerifying ? (
                                        <span className="flex items-center gap-2">
                                            <RefreshCw size={16} className="animate-spin" />
                                            Verifying...
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            <CheckCircle2 size={16} />
                                            Verify
                                        </span>
                                    )}
                                </Button>

                                <div className="flex items-center justify-between pt-1">
                                    <button
                                        onClick={() => {
                                            setStep('phone');
                                            setOtp('');
                                            setOtpError('');
                                        }}
                                        className="flex items-center gap-1.5 text-xs text-foreground/50 hover:text-foreground/80 font-body transition-colors"
                                    >
                                        <ArrowLeft size={13} />
                                        Change number
                                    </button>
                                    <button
                                        onClick={handleResend}
                                        disabled={isSending}
                                        className="flex items-center gap-1.5 text-xs text-gold/70 hover:text-gold font-body transition-colors disabled:opacity-50"
                                    >
                                        {isSending ? (
                                            <RefreshCw size={13} className="animate-spin" />
                                        ) : (
                                            <RefreshCw size={13} />
                                        )}
                                        Resend OTP
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Success */}
                        {step === 'success' && (
                            <div className="space-y-5 text-center py-2">
                                <div className="flex justify-center">
                                    <div className="relative">
                                        <div className="w-20 h-20 rounded-full bg-gold/15 border-2 border-gold/40 flex items-center justify-center">
                                            <CheckCircle2 size={40} className="text-gold" />
                                        </div>
                                        <div className="absolute inset-0 rounded-full border-2 border-gold/20 animate-ping" />
                                    </div>
                                </div>
                                <div>
                                    <h2 className="font-brand text-xl font-bold text-gold mb-1 tracking-wide">
                                        Verified Successfully!
                                    </h2>
                                    <p className="text-foreground/60 text-sm font-body">
                                        Mobile number{' '}
                                        <span className="text-gold font-semibold">
                                            +91 {phone.replace(/\D/g, '')}
                                        </span>{' '}
                                        has been verified.
                                    </p>
                                </div>
                                <div className="flex flex-col gap-2 pt-2">
                                    <Link to="/">
                                        <Button className="w-full bg-gold hover:bg-gold-light text-brand-dark font-heading font-bold tracking-wide">
                                            Go to Home
                                        </Button>
                                    </Link>
                                    <button
                                        onClick={() => {
                                            setStep('phone');
                                            setPhone('');
                                            setOtp('');
                                            setGeneratedOTP('');
                                            setPhoneError('');
                                            setOtpError('');
                                        }}
                                        className="text-xs text-foreground/50 hover:text-foreground/80 font-body transition-colors py-1"
                                    >
                                        Verify another number
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {step !== 'success' && (
                        <div className="px-8 pb-6 text-center">
                            <p className="text-foreground/40 text-xs font-body">
                                By continuing, you agree to our{' '}
                                <span className="text-gold/60">Terms of Service</span>
                            </p>
                        </div>
                    )}
                </div>

                {/* Back to login link */}
                <div className="mt-5 text-center">
                    <Link
                        to="/login"
                        className="text-sm text-foreground/50 hover:text-gold font-body transition-colors inline-flex items-center gap-1.5"
                    >
                        <ArrowLeft size={14} />
                        Back to Login
                    </Link>
                </div>
            </div>
        </main>
    );
}

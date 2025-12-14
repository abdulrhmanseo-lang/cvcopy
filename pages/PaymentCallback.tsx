
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Plan } from '../types';
import { CheckCircle2, Loader2 } from 'lucide-react';

const PaymentCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { upgradePlan, user } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');

  useEffect(() => {
    const plan = searchParams.get('plan') as Plan;
    const statusParam = searchParams.get('status');

    if (!plan) {
      navigate('/');
      return;
    }

    if (statusParam === 'failed') {
      setStatus('error');
      setTimeout(() => navigate('/#pricing'), 3000);
      return;
    }

    const handleSuccess = async () => {
      // Simulate API call verification
      await new Promise(resolve => setTimeout(resolve, 2000));

      const amount = plan === 'basic' ? 29 : plan === 'pro' ? 49 : 199;
      const paymentId = 'pay_' + Math.random().toString(36).substr(2, 9);

      upgradePlan(plan, paymentId, amount);
      setStatus('success');

      setTimeout(() => navigate('/dashboard'), 2000);
    };

    handleSuccess();
  }, []);

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-4">
      <div className="bg-card border border-white/10 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
        {status === 'processing' && (
          <div className="py-8">
            <Loader2 size={48} className="text-primary animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">جاري تأكيد الدفع...</h2>
            <p className="text-gray-400">يرجى الانتظار ولا تغلق الصفحة</p>
          </div>
        )}

        {status === 'success' && (
          <div className="py-8 animate-fade-up">
            <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={32} />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">تم الدفع بنجاح!</h2>
            <p className="text-gray-400">تم ترقية باقتك. جاري توجيهك...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="py-8">
            <h2 className="text-xl font-bold text-red-500 mb-2">فشلت العملية</h2>
            <p className="text-gray-400">نعتذر، لم نتمكن من إتمام الدفع.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentCallback;

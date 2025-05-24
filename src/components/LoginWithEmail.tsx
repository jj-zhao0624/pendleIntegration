import { useState } from 'react';
import { useLoginWithEmail } from '@privy-io/react-auth';

const LoginWithEmail = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const { sendCode, loginWithCode } = useLoginWithEmail();

  const handleSendCode = async () => {
    try {
      await sendCode({ email });
      setCodeSent(true);
    } catch (error) {
      console.error('Error sending code:', error);
    }
  };

  const handleLogin = async () => {
    try {
      await loginWithCode({ code });
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <div className="login-container">
      <div className="email-input">
        <input
          type="email"
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.currentTarget.value)}
          value={email}
        />
        <button onClick={handleSendCode}>Send Code</button>
      </div>
      
      {codeSent && (
        <div className="code-input">
          <input
            type="text"
            placeholder="Enter verification code"
            onChange={(e) => setCode(e.currentTarget.value)}
            value={code}
          />
          <button onClick={handleLogin}>Login</button>
        </div>
      )}
    </div>
  );
};

export default LoginWithEmail;
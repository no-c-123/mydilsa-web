import HCaptcha from '@hcaptcha/react-hcaptcha';
import { forwardRef } from 'react';

const HcaptchaClient = forwardRef(function HcaptchaClient({ onVerify }, ref) {
  return (
    <HCaptcha
      sitekey="5e5a13de-7de4-44a0-9e6e-50a08246a446"
      onVerify={onVerify}
      ref={ref}
    />
  );
});

export default HcaptchaClient;

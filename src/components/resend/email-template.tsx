import * as React from 'react';

interface EmailTemplateProps {
  firstName: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({ firstName }) => (
  <div>
    <h1>Welcome, {firstName}!</h1>
    <p>Please click the link below to reset your password</p>
    <a href="https://www.google.com">Reset Password</a>
  </div>
);

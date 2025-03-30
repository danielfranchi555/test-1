import * as React from 'react';

interface EmailTemplateProps {
  resetLink: string;
  userName: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({ resetLink, userName }) => (
  <div>
    <h1>Reset Password</h1>
    <p>Hello {userName},</p>
    <p>Please click the link below to reset your password</p>
    <a href={resetLink}>Reset Password</a>
  </div>
);

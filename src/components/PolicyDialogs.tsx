import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { X } from "lucide-react";

export const PolicyDialogs = () => {
  const privacyPolicyContent = `Privacy Policy

Effective Date: December 5, 2024
Last Updated: December 7, 2024

1. Introduction
Welcome to Gambix ("we," "us," or "our"). Your privacy is important to us, and we are committed to safeguarding your personal information. This Privacy Policy explains how we collect, use, disclose, and protect your data when you interact with our website and services. It applies globally, including compliance with laws such as the General Data Protection Regulation (GDPR) in the European Union and the California Consumer Privacy Act (CCPA) in the United States.

By accessing or using our website, you agree to the terms of this Privacy Policy. If you do not agree, please discontinue use of our website.

2. Information We Collect
We may collect the following types of information from you:

A. Information You Provide Directly
Personal Information: Name, email address, and any other information you provide when joining our waitlist, referring others, or otherwise interacting with our website.
Communication Data: When you contact us, we may collect details of your message, attachments, and contact information.
B. Information Collected Automatically
Device Information: IP address, browser type, operating system, device type, and other technical details.
Usage Data: Pages visited, time spent on our site, links clicked, and other website activity details.
Cookies and Similar Technologies: We use cookies, web beacons, and other tracking tools to enhance your experience and analyze site performance. For more details, see our Cookie Policy.
C. Referral Information
If you participate in our referral program, we collect information on the referrals you generate, including referral links and the associated interactions.
D. Third-Party Data
Information received from social media platforms or other third parties if you interact with us through those channels.
3. How We Use Your Information
We use your information for the following purposes:

A. Service Delivery
To manage your waitlist position.
To facilitate referral tracking and rewards.
To send updates regarding our launch and services.
B. Communication
To respond to inquiries, provide support, and send necessary service updates.
C. Marketing and Personalization
To deliver promotional materials, offers, and content tailored to your interests. You can opt-out of these communications at any time.
D. Analytics and Improvements
To monitor site performance, analyze usage trends, and improve our website and services.
E. Legal and Compliance
To comply with applicable laws, regulations, and legal processes, and to protect against fraud or other illegal activities.
4. Sharing Your Information
We do not sell your personal information. We may share your data in the following circumstances:

A. Service Providers
With trusted third-party vendors who assist us in operating our website, such as hosting providers, analytics tools, email marketing services, and referral tracking platforms.
B. Legal Obligations
If required by law or in response to valid requests by public authorities (e.g., court orders, subpoenas).
C. Business Transfers
In connection with a merger, acquisition, or sale of assets, where your data may be transferred as part of the business assets.
D. Consent
With your explicit consent, for purposes not covered in this Privacy Policy.
5. Data Security
We implement appropriate technical and organizational measures to ensure your personal information is secure, including encryption, firewalls, and access controls. However, no method of transmission over the Internet is completely secure, and we cannot guarantee absolute security.

6. Your Rights
Depending on your location, you may have the following rights regarding your personal data:

A. GDPR (EU/EEA Residents)
Right to Access: Obtain a copy of your personal data.
Right to Rectification: Request correction of inaccurate data.
Right to Erasure: Request deletion of your data (“Right to be Forgotten”).
Right to Restrict Processing: Limit how your data is processed.
Right to Data Portability: Receive your data in a structured, machine-readable format.
Right to Object: Object to certain types of processing, including direct marketing.
Right to Withdraw Consent: If we rely on your consent to process data, you may withdraw it at any time.
B. CCPA/CPRA (California Residents)
Right to Know: Request details about the data we collect, use, and share.
Right to Delete: Request deletion of your personal data.
Right to Opt-Out: Opt-out of the sale or sharing of your personal information.
Right to Non-Discrimination: We will not discriminate against you for exercising your rights.
C. Exercising Your Rights
To exercise any of these rights, please contact us at info@gambixit.com. We may require verification of your identity before fulfilling your request.

7. International Data Transfers
If you are accessing our services from outside the United States, your information may be transferred to and stored on servers in the United States or other jurisdictions. We take appropriate safeguards to ensure your data is handled securely and in compliance with applicable laws.

8. Retention of Data
We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required or permitted by law.

9. Cookies and Tracking
We use cookies and similar technologies to collect information and improve your experience. You can manage your cookie preferences through your browser settings or by using tools provided on our website.

10. Updates to This Privacy Policy
We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. Any updates will be posted on this page with a new "Last Updated" date. We encourage you to review this policy regularly to stay informed.

11. Contact Us
If you have any questions or concerns about this Privacy Policy, please contact us at:

Email: info@gambixit.com
Mailing Address:
Gambix
5000 Thayer Center
Oakland, MD 21550`;

  const cookiePolicyContent = `Cookie Policy
Effective Date: December 7, 2024

This Cookie Policy explains how Gambix ("we," "us," or "our") uses cookies and similar tracking technologies on our website to enhance your experience and improve our services.

1. What Are Cookies?
Cookies are small text files that are stored on your device when you visit a website. They help us recognize your device, remember your preferences, and provide a more personalized browsing experience.

2. Types of Cookies We Use
We use the following types of cookies:

A. Essential Cookies
These cookies are necessary for the basic functioning of our website and cannot be turned off in our systems. They allow you to navigate the site and use its features.

B. Performance and Analytics Cookies
These cookies help us understand how visitors interact with our website by collecting information about pages visited, time spent on the site, and any errors encountered. All data collected is aggregated and anonymized.

C. Functionality Cookies
These cookies allow the website to remember your preferences (e.g., language settings) and provide enhanced features.

D. Marketing Cookies
These cookies are used to track your activity across websites to deliver relevant advertisements and measure the effectiveness of our marketing campaigns.

3. How You Can Manage Cookies
You can control or delete cookies through your browser settings. Note that disabling cookies may affect the functionality of our website. Instructions for managing cookies can be found in your browser's help documentation.

4. Changes to This Policy
We may update this Cookie Policy from time to time. Any updates will be posted on this page with a new "Effective Date."`;

  const termsContent = `Terms of Service

Last updated: December 5, 2024

1. Acceptance of Terms
By accessing and using Gambix's website and services, you agree to be bound by these Terms of Service.

2. Waitlist Program
- Joining the waitlist does not guarantee access to our platform
- Your position may change based on referrals and other factors
- We reserve the right to modify the waitlist program

3. Referral Program
- You must not use spam or automated methods to generate referrals
- We may void referrals that violate our policies
- Rewards are subject to availability

4. User Conduct
You agree to:
- Provide accurate information
- Not manipulate the referral system
- Respect other users

5. Intellectual Property
All content on this website is our property and protected by copyright laws.

6. Limitation of Liability
We are not liable for any damages arising from your use of our service.

7. Modifications
We may modify these terms at any time. Continued use constitutes acceptance of changes.

8. Contact
For any questions about these terms, please contact legal@gambix.com`;

  return (
    <div className="flex gap-4">
      <Dialog>
        <DialogTrigger className="hover:text-white/70">Privacy Policy</DialogTrigger>
        <DialogContent className="max-w-2xl bg-black/90 backdrop-blur-lg border-[#9b87f5]/20">
          <DialogHeader>
            <div className="flex justify-between items-center">
              <DialogTitle className="text-2xl font-bold text-white">Privacy Policy</DialogTitle>
              <button className="text-[#9b87f5] hover:text-[#9b87f5]/80">
                <X className="h-5 w-5" />
              </button>
            </div>
            <DialogDescription>
              <div className="mt-4 max-h-[60vh] overflow-y-auto text-white/90 whitespace-pre-wrap pr-4">
                {privacyPolicyContent}
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger className="hover:text-white/70">Cookie Policy</DialogTrigger>
        <DialogContent className="max-w-2xl bg-black/90 backdrop-blur-lg border-[#9b87f5]/20">
          <DialogHeader>
            <div className="flex justify-between items-center">
              <DialogTitle className="text-2xl font-bold text-white">Cookie Policy</DialogTitle>
              <button className="text-[#9b87f5] hover:text-[#9b87f5]/80">
                <X className="h-5 w-5" />
              </button>
            </div>
            <DialogDescription>
              <div className="mt-4 max-h-[60vh] overflow-y-auto text-white/90 whitespace-pre-wrap pr-4">
                {cookiePolicyContent}
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger className="hover:text-white/70">Terms of Service</DialogTrigger>
        <DialogContent className="max-w-2xl bg-black/90 backdrop-blur-lg border-[#9b87f5]/20">
          <DialogHeader>
            <div className="flex justify-between items-center">
              <DialogTitle className="text-2xl font-bold text-white">Terms of Service</DialogTitle>
              <button className="text-[#9b87f5] hover:text-[#9b87f5]/80">
                <X className="h-5 w-5" />
              </button>
            </div>
            <DialogDescription>
              <div className="mt-4 max-h-[60vh] overflow-y-auto text-white/90 whitespace-pre-wrap pr-4">
                {termsContent}
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};
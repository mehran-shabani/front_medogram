# Security Policy

## 🔒 Supported Versions

We actively support and provide security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 2.x.x   | ✅ Full support    |
| 1.x.x   | ⚠️ Security fixes only |
| < 1.0   | ❌ No longer supported |

## 🚨 Reporting a Vulnerability

We take the security of Medogram seriously. If you believe you have found a security vulnerability, please report it to us as described below.

### 🔐 Private Disclosure Process

For sensitive security issues, please **DO NOT** create a public GitHub issue. Instead:

1. **Email us directly**: Send details to `security@medogram.ir`
2. **Use our security form**: [Security Report Form](https://medogram.ir/security-report)
3. **Encrypted communication**: Use our PGP key for sensitive information

### 📧 What to Include

When reporting a vulnerability, please include:

- **Type of issue** (e.g., XSS, SQL injection, authentication bypass)
- **Full paths** of source file(s) related to the vulnerability
- **Location** of the affected source code (tag/branch/commit or direct URL)
- **Step-by-step instructions** to reproduce the issue
- **Proof-of-concept or exploit code** (if possible)
- **Impact** of the issue, including how an attacker might exploit it

### ⏱️ Response Timeline

- **Acknowledgment**: Within 48 hours of receiving your report
- **Initial assessment**: Within 5 business days
- **Regular updates**: Every 7 days until resolution
- **Resolution**: Varies based on complexity and severity

### 🏆 Responsible Disclosure

We follow responsible disclosure practices:

1. **Investigation**: We investigate and verify the reported vulnerability
2. **Fix development**: We develop and test a fix
3. **Coordinated release**: We release the fix and security advisory
4. **Public disclosure**: After users have had time to update (typically 90 days)

### 🎖️ Recognition

We believe in recognizing security researchers who help us improve our security:

- **Hall of Fame**: Public recognition on our security page (with your permission)
- **CVE credit**: Proper attribution in CVE records
- **Swag**: Medogram security researcher merchandise
- **Bug bounty**: Monetary rewards for qualifying vulnerabilities (program details TBD)

## 🛡️ Security Measures

### Current Security Features

- **Authentication**: Multi-factor authentication support
- **Authorization**: Role-based access control
- **Data encryption**: TLS 1.3 for data in transit
- **Input validation**: Comprehensive input sanitization
- **CSRF protection**: Built-in CSRF tokens
- **XSS prevention**: Content Security Policy (CSP)
- **Dependency scanning**: Automated vulnerability scanning
- **Security headers**: Comprehensive security headers

### Security Best Practices

We follow industry security best practices:

- **OWASP Top 10**: Regular assessment against OWASP guidelines
- **Secure coding**: Security-focused development practices
- **Regular audits**: Periodic security assessments
- **Dependency updates**: Automated dependency vulnerability monitoring
- **Security training**: Regular security training for development team

## 🔍 Vulnerability Categories

### High Priority
- Authentication bypass
- Privilege escalation
- Data exposure/leakage
- Remote code execution
- SQL injection

### Medium Priority
- Cross-site scripting (XSS)
- Cross-site request forgery (CSRF)
- Insecure direct object references
- Security misconfigurations

### Low Priority
- Information disclosure (non-sensitive)
- Denial of service (DoS)
- Rate limiting issues

## 📋 Security Checklist for Contributors

When contributing code, please ensure:

- [ ] Input validation is implemented
- [ ] Authentication is properly handled
- [ ] Authorization checks are in place
- [ ] Sensitive data is properly protected
- [ ] Error messages don't leak information
- [ ] Dependencies are up to date
- [ ] Security tests are included

## 🚫 Out of Scope

The following are generally considered out of scope:

- Social engineering attacks
- Physical attacks
- Denial of service attacks
- Issues in third-party services we don't control
- Vulnerabilities requiring physical access
- Issues in outdated browsers or operating systems
- Self-XSS attacks
- Clickjacking on pages with no sensitive actions

## 📞 Contact Information

- **Security email**: security@medogram.ir
- **General contact**: info@medogram.ir
- **Website**: https://medogram.ir
- **Security page**: https://medogram.ir/security

## 🔑 PGP Key

For encrypted communications, use our PGP key:

```
-----BEGIN PGP PUBLIC KEY BLOCK-----
[PGP Key would go here]
-----END PGP PUBLIC KEY BLOCK-----
```

Key ID: `[Key ID]`
Fingerprint: `[Fingerprint]`

---

**Last updated**: December 2024
**Version**: 1.0

Thank you for helping keep Medogram and our users safe! 🛡️
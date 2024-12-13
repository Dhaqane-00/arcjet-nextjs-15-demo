# Arcjet Security Demo

A comprehensive demo showcasing Arcjet's security features for web applications. This project demonstrates various security implementations using Arcjet's powerful security suite.

## 🛡️ Features Demonstrated

### 1. Shield WAF Protection

- Protection against SQL injection attacks
- Cross-Site Scripting (XSS) prevention
- Common web attack mitigation
- Real-time threat detection and blocking

### 2. Bot Detection

- Advanced bot traffic identification
- Legitimate bot allowlisting
- Automated threat detection
- Protection against scraping and automated attacks

### 3. Rate Limiting

- Token bucket algorithm implementation
- Flexible rate limiting rules
- Protection against DDoS attacks
- Customizable rate limit thresholds

### 4. Sensitive Info Protection

- PII (Personally Identifiable Information) detection
- Data leak prevention
- Sensitive data masking
- Compliance support

### 5. Signup Protection

- Form abuse prevention
- Bot registration blocking
- Disposable email detection
- Account takeover protection

## 🚀 Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Arcjet Security Suite
- Lucide Icons

## 🛠️ Getting Started

1. Clone the repository:

```bash
git clone https://github.com/yourusername/arcjet-security-demo.git
```

2. Install dependencies:

```bash
cd arcjet-security-demo
npm install
```

3. Set up your Arcjet credentials:
   Create a `.env.local` file and add your Arcjet API key:

```bash
ARCJET_API_KEY=your_api_key_here
```

4. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🔒 Implementation Details

Each security feature is implemented in its own route:

- `/api/arcjet/shield` - WAF Protection
- `/api/arcjet/bot-detection` - Bot Detection
- `/api/arcjet/rate-limit` - Rate Limiting
- `/api/arcjet/sensitive-info` - Sensitive Info Protection
- `/api/arcjet/signup-protection` - Signup Protection

## 📚 Documentation & Resources

- [Arcjet Documentation](https://docs.arcjet.com)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🎓 Learn More

This demo was created as part of the [Zero To Full Stack Hero 2.0](https://www.papareact.com/course) course by Sonny Sangha.

### Follow Sonny for more content:

- [YouTube Channel](https://www.youtube.com/sonnysangha)
- [PAPA React](https://www.papareact.com)
- [Twitter/X](https://twitter.com/sonnysangha)

## 🚀 Deployment

The project can be easily deployed on Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/arcjet-security-demo)

Remember to set up your environment variables in your Vercel project settings.

## 🤝 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⭐️ Show your support

If you found this project helpful, please give it a ⭐️ on GitHub!

---

Built with ❤️ by [Your Name] | Tutorial by [Sonny Sangha](https://www.youtube.com/sonnysangha)

# ChainX

A modern automation platform that connects your favorite apps and services. Built with scalability and extensibility in mind.

## ✨ Features

- 🔗 Connect multiple apps and services
- 🤖 Automated workflow creation
- 📧 Gmail integration
- 💌 Email automation
- 🔐 Secure OAuth2 authentication
- 🌐 RESTful API
- 🚀 Real-time processinggit clone https://github.com/SwarnenduG07/chainx.git
cd chainx

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, TailwindCSS, TypeScript
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL, Prisma ORM
- **Message Queue**: Apache Kafka
- **Authentication**: JWT, OAuth2
- **Infrastructure**: Docker,
- **CI/CD**: GitHub Actions
- [Prettier](https://prettier.io) for code formatting

## 📁 Project Structure

```bash
chainx/
├── apps/
│   ├── web/                 # Next.js frontend
│   ├── primary-backend/     # Main API server
│   ├── processor/           # Kafka message processor
│   ├── worker/             # Background job worker
│   └── hooks/              # Webhook handlers
├── packages/
│   ├── db/                 # Prisma database package
│   ├── ui/                 # Shared UI components
│   ├── config-eslint/      # ESLint configuration
│   ├── config-typescript/  # TypeScript configuration
│   └── config-tailwind/    # TailwindCSS configuration

```
## Prerequisites
Node.js 20+
pnpm 9+
Docker (optional)

Run the following command:


## 1 Clone the repository
```bash
git clone https://github.com/SwarnenduG07/chainx.git
cd chainx
```

## 2 Install dependencies
```
pnpm install
```
## 3 Setup env's
```
# Databse url = DATABASE_URL=postgresql://user:password@localhost:5432/chainx
# SendGrid Configuration
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your_new_sendgrid_api_key
SMTP_FROM=your_new_verified_sender@domain.com

# JWT Configuration
JWT_SECRET=generate_strong_random_secret
FRONTEND_URL=http://localhost:3000

# Google Cloud/Gmail Configuration
GMAIL_TOPIC_NAME=projects/your-new-project-id/topics/gmail-topic
PUBSUB_SUBSCRIPTION=projects/your-new-project-id/subscriptions/gmail-subscription
GMAIL_CLIENT_ID=your_new_gmail_client_id
GMAIL_CLIENT_SECRET=your_new_gmail_client_secret
GMAIL_REDIRECT_URI=http://localhost:3002/api/v1/trigger/gmail/callback

```

## Start development server

```
pnpm run dev

```
## 🔧 Development Commands
```
pnpm build          # Build all apps and packages
pnpm dev            # Start development servers
pnpm test          # Run tests
pnpm lint          # Run linting
pnpm type-check    # Run type checking
```

 ## 📐 Architecture
 ```
 graph TD
    A[Web Frontend] --> B[API Gateway]
    B --> C[Primary Backend]
    C --> D[PostgreSQL]
    C --> E[Kafka]
    E --> F[Processor]
    F --> G[Worker]
 ```
## 🤝 Contributing
### 1 Fork the Repo
### 2 Create your feature branch (git checkout -b feature/amazing-feature)
### 3  Commit your changes (git commit -m 'feat: add amazing feature')
### 4  Push to the branch (git push origin feature/amazing-feature)
### 5 Open a Pull Request With a good description  

 ## 🙏 Acknowledgments
Turborepo\
Next.js\
Express\
Prisma\
kafka\
gmail-api\
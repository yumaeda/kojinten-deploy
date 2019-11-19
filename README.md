# Kojinten CDK

## Sync the server time

```bash
sudo ntpdate time.apple.com
```

## Setup NVM

### 1. Install Node Version Manager

```bash
brew update
brew install nvm
```

### 2. Setup Environment Variables

Add below to `~/.bash_profile`.

```bash
export NVM_DIR=~/.nvm
source $(brew --prefix nvm)/nvm.sh
```

### 3. Install Node

```bash
nvm install stable
nvm use stable
```

&nbsp;

## CDK

### 1. Install aws-cdk
```bash
npm install -g aws-cdk
```

### 2. Initialize CDK App
```bash
mkdir HelloWorld
cd HelloWorld
cdk init --language typescript
```

### 3. Add the Amazon EC2 and Amazon ECS Packages
```bash
npm install @aws-cdk/aws-ec2 @aws-cdk/aws-ecs @aws-cdk/aws-ecs-patterns @aws-cdk/aws-rds
```

### 4. Build the app and confirm that it creates an empty stack.
```bash
npm run build
cdk synth
```

### 5. Deploy
```bash
cdk deploy
```

### 6. Destroy
```bash
cdk destroy
```

&nbsp;

# Reference
https://github.com/aws/aws-cdk/blob/master/packages/%40aws-cdk/aws-secretsmanager/test/test.secret.ts

# Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template

1. Install Node.js
https://nodejs.org/en/

2. Install aws-cdk
```bash
npm install -g aws-cdk
```

3. Initialize CDK App
```bash
mkdir HelloWorld
cd HelloWorld
cdk init --language typescript
```

4. Add the Amazon EC2 and Amazon ECS Packages
```bash
npm install @aws-cdk/aws-ec2 @aws-cdk/aws-ecs @aws-cdk/aws-ecs-patterns
```

5. Build the app and confirm that it creates an empty stack.
```bash
npm run build
cdk synth
```

6. Deploy
```bash
cdk deploy
```

7. Destroy
```bash
cdk destroy
```

# Reference
https://docs.aws.amazon.com/en_pv/cdk/latest/guide/ecs_example.html

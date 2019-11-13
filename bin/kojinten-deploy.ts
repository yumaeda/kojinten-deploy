import 'source-map-support/register';
import { App, Stack } from '@aws-cdk/core';
import { Vpc } from '@aws-cdk/aws-ec2'
import { Cluster, ContainerImage } from '@aws-cdk/aws-ecs'
import { ApplicationLoadBalancedFargateService } from '@aws-cdk/aws-ecs-patterns'
import { RDSStack } from '../lib/rds-stack'
import { Route53Stack } from '../lib/route53-stack'

const app = new App();
const stack = new Stack(app, 'KojintenDeployStack')
const vpc = new Vpc(stack, 'prod-kojinten-vpc', { maxAzs: 2 })
const cluster = new Cluster(stack, 'prod-kojinten', { vpc })
const image = ContainerImage.fromRegistry('yumaeda/kojinten')

// Create a load-balanced Fargate service and make it public
const alb = new ApplicationLoadBalancedFargateService(stack, 'KojintenApiService', {
    cluster,
    cpu: 256,
    desiredCount: 1,
    taskImageOptions: { image },
    memoryLimitMiB: 512,
    publicLoadBalancer: true
})

new Route53Stack(app, 'Route53Stack', alb.loadBalancer)
new RDSStack(app, 'RDSStack', vpc)

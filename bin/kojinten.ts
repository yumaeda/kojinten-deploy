import 'source-map-support/register';
import { App } from '@aws-cdk/core';
import { ALBFargateStack } from '../lib/alb-fargate-stack'
import { ClusterStack } from '../lib/cluster-stack'
import { RDSStack } from '../lib/rds-stack'
import { Route53Stack } from '../lib/route53-stack'
import { VpcStack } from '../lib/vpc-stack'

const app = new App()

// Must be deployed first.
const vpcStack = new VpcStack(app, 'VpcStack')
const vpc = vpcStack.vpc

// Must be deployed after VpcStack.
const clusterStack = new ClusterStack(app, 'ClusterStack', vpc)
const albFargateStack = new ALBFargateStack(app, 'ALBFargateStack', clusterStack.cluster)
new Route53Stack(app, 'Route53Stack', albFargateStack.loadBalancer)

// Must be deployed after VpcStack.
new RDSStack(app, 'RDSStack', vpc)

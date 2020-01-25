import 'source-map-support/register'
import { App } from '@aws-cdk/core'
import { APIFargateServiceStack } from '../lib/api-fargate-service-stack'
import { FrontFargateServiceStack } from '../lib/front-fargate-service-stack'
import { ClusterStack } from '../lib/cluster-stack'
import { RDSStack } from '../lib/rds-stack'
import { Route53Stack } from '../lib/route53-stack'
import { VpcStack } from '../lib/vpc-stack'
import { SecretsManagerStack } from '../lib/secrets-manager-stack'

const app = new App()

const vpcStack = new VpcStack(app, 'VpcStack')
const vpc = vpcStack.vpc

const clusterStack = new ClusterStack(app, 'ClusterStack', vpc)
const apiFargateServiceStack = new APIFargateServiceStack(app, 'APIFargateServiceStack', clusterStack.cluster)
const frontFargateServiceStack = new FrontFargateServiceStack(app, 'FrontFargateServiceStack', clusterStack.cluster)
new Route53Stack(app, 'Route53Stack', frontFargateServiceStack.loadBalancer)

const rdsStack = new RDSStack(app, 'RDSStack', vpc)
// new SecretsManagerStack(app, 'SecretsManagerStack', rdsStack.dbInstance.instanceIdentifier)

app.synth()

import { Construct, Stack, StackProps } from '@aws-cdk/core'
import { Vpc } from '@aws-cdk/aws-ec2'
import { Cluster, ContainerImage } from '@aws-cdk/aws-ecs'
import { ApplicationLoadBalancedFargateService } from '@aws-cdk/aws-ecs-patterns'

export class KojintenDeployStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props)

        // ECS Cluster
        const cluster = new Cluster(this, 'prod-kojinten', {
            vpc: new Vpc(this, 'prod-kojinten-vpc', {
                maxAzs: 2
            })
        })

        // Create a load-balanced Fargate service and make it public
        new ApplicationLoadBalancedFargateService(this, 'KojintenApiService', {
            cluster,
            cpu: 256,
            desiredCount: 1,
            taskImageOptions: { image: ContainerImage.fromRegistry("yumaeda/kojinten") },
            memoryLimitMiB: 512,
            publicLoadBalancer: true
        })
    }
}

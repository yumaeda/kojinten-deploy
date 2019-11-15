import { Construct, Stack, StackProps } from '@aws-cdk/core'
import { Cluster, ContainerImage } from '@aws-cdk/aws-ecs'
import { ApplicationLoadBalancedFargateService } from '@aws-cdk/aws-ecs-patterns'
import { ILoadBalancerV2 } from '@aws-cdk/aws-elasticloadbalancingv2'

export class ALBFargateStack extends Stack {
    readonly loadBalancer: ILoadBalancerV2

    constructor(scope: Construct, id: string, cluster: Cluster, props?: StackProps) {
        super(scope, id, props)

        // Create a load-balanced Fargate service and make it public
        const image = ContainerImage.fromRegistry('yumaeda/kojinten')
        const albSvc = new ApplicationLoadBalancedFargateService(this, 'KojintenApiService', {
            cluster,
            cpu: 256,
            desiredCount: 1,
            taskImageOptions: { image },
            memoryLimitMiB: 512,
            publicLoadBalancer: true
        })

        this.loadBalancer = albSvc.loadBalancer
    }
}

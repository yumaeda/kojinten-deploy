import { Construct, Stack, StackProps } from '@aws-cdk/core'
import { Vpc } from '@aws-cdk/aws-ec2'
import { Cluster } from '@aws-cdk/aws-ecs'

export class ClusterStack extends Stack {
    readonly cluster: Cluster

    constructor(scope: Construct, id: string, vpc: Vpc, props?: StackProps) {
        super(scope, id, props)

        this.cluster = new Cluster(this, 'kojinten-cluster', { vpc })
    }
}

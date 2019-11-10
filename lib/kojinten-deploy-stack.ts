import {
    InstanceClass,
    InstanceSize,
    InstanceType,
    SubnetType,
    Vpc
} from '@aws-cdk/aws-ec2'

import {
    Construct,
    RemovalPolicy,
    SecretValue,
    Stack,
    StackProps
} from '@aws-cdk/core'

import { Cluster, ContainerImage } from '@aws-cdk/aws-ecs'
import { ApplicationLoadBalancedFargateService } from '@aws-cdk/aws-ecs-patterns'
import { DatabaseInstance, DatabaseInstanceEngine } from '@aws-cdk/aws-rds'

export class KojintenDeployStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props)

        // Initialize VPC, ECS cluster, and Docker image.
        const vpc = new Vpc(this, 'prod-kojinten-vpc', { maxAzs: 2 })
        const cluster = new Cluster(this, 'prod-kojinten', { vpc })
        const image = ContainerImage.fromRegistry('yumaeda/kojinten')

        // Create a load-balanced Fargate service and make it public
        new ApplicationLoadBalancedFargateService(this, 'KojintenApiService', {
            cluster,
            cpu: 256,
            desiredCount: 1,
            taskImageOptions: { image },
            memoryLimitMiB: 512,
            publicLoadBalancer: true
        })

        // Create a DB insttance.
        const dbInstance = new DatabaseInstance(this, 'RDS', {
            deletionProtection: false,
            engine: DatabaseInstanceEngine.MARIADB,
            instanceClass: InstanceType.of(InstanceClass.BURSTABLE2, InstanceSize.SMALL),
            instanceIdentifier: 'kojinten',
            masterUsername: 'admin',
            removalPolicy: RemovalPolicy.DESTROY,
            vpc,
            vpcPlacement: { subnetType: SubnetType.PUBLIC }
        });

        // Allow connections on default port from any IPV4
        dbInstance.connections.allowDefaultPortFromAnyIpv4()
    }
}

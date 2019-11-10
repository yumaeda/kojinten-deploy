import { Construct, RemovalPolicy, SecretValue, Stack, StackProps } from '@aws-cdk/core'
import { Vpc, InstanceType, InstanceClass, InstanceSize } from '@aws-cdk/aws-ec2'
import { Cluster, ContainerImage } from '@aws-cdk/aws-ecs'
import { ApplicationLoadBalancedFargateService } from '@aws-cdk/aws-ecs-patterns'
import { DatabaseInstance, DatabaseInstanceEngine } from '@aws-cdk/aws-rds'

export class KojintenDeployStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props)

        // VPC
        const vpc = new Vpc(this, 'prod-kojinten-vpc', {
            maxAzs: 2
        })

        // ECS Cluster
        const cluster = new Cluster(this, 'prod-kojinten', { vpc })

        // Create a load-balanced Fargate service and make it public
        new ApplicationLoadBalancedFargateService(this, 'KojintenApiService', {
            cluster,
            cpu: 256,
            desiredCount: 1,
            taskImageOptions: { image: ContainerImage.fromRegistry("yumaeda/kojinten") },
            memoryLimitMiB: 512,
            publicLoadBalancer: true
        })

        // Create a DB insttance.
        const dbInstance = new DatabaseInstance(this, 'RDS', {
            deletionProtection: false,
            removalPolicy: RemovalPolicy.DESTROY,
            engine: DatabaseInstanceEngine.MARIADB,
            instanceClass: InstanceType.of(InstanceClass.BURSTABLE2, InstanceSize.SMALL),
            instanceIdentifier: 'kojinten',
            masterUsername: 'admin',
            masterUserPassword: new SecretValue('P@ssw0rd'),
            vpc
        });

        // Allow connections on default port from any IPV4
        dbInstance.connections.allowDefaultPortFromAnyIpv4()
    }
}

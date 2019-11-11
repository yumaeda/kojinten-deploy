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
import { ARecord, PublicHostedZone, RecordTarget } from '@aws-cdk/aws-route53'
import { LoadBalancerTarget } from '@aws-cdk/aws-route53-targets'

export class KojintenDeployStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props)

        // Initialize VPC, ECS cluster, and Docker image.
        const vpc = new Vpc(this, 'prod-kojinten-vpc', { maxAzs: 2 })
        const cluster = new Cluster(this, 'prod-kojinten', { vpc })
        const image = ContainerImage.fromRegistry('yumaeda/kojinten')
        const zone = new PublicHostedZone(this, 'HostedZone', {
            zoneName: 'wine-producer.com'
        })

        // Create a load-balanced Fargate service and make it public
        const alb = new ApplicationLoadBalancedFargateService(this, 'KojintenApiService', {
            cluster,
            cpu: 256,
            desiredCount: 1,
            taskImageOptions: { image },
            memoryLimitMiB: 512,
            publicLoadBalancer: true
        })

        new ARecord(this, 'AliasRecord', {
            zone,
            target: RecordTarget.fromAlias(new LoadBalancerTarget(alb.loadBalancer))
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

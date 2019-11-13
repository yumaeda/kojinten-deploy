import { Construct, RemovalPolicy, Stack, StackProps } from '@aws-cdk/core'
import { InstanceClass, InstanceSize, InstanceType, SubnetType, Vpc } from '@aws-cdk/aws-ec2'
import { DatabaseInstance, DatabaseInstanceEngine } from '@aws-cdk/aws-rds'

export class RDSStack extends Stack {
    constructor(scope: Construct, id: string, vpc: Vpc, props?: StackProps) {
        super(scope, id, props)

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

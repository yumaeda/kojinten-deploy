import { Construct, RemovalPolicy, Stack, StackProps } from '@aws-cdk/core'
import { InstanceClass, InstanceSize, InstanceType, SubnetType, IVpc } from '@aws-cdk/aws-ec2'
import { DatabaseInstanceFromSnapshot, DatabaseInstanceEngine } from '@aws-cdk/aws-rds'

export class RDSStack extends Stack {
    readonly dbInstance: DatabaseInstanceFromSnapshot

    constructor(scope: Construct, id: string, vpc: IVpc, props?: StackProps) {
        super(scope, id, props)

        // Create a DB insttance.
        this.dbInstance = new DatabaseInstanceFromSnapshot(this, 'RDS', {
            deletionProtection: false,
            engine: DatabaseInstanceEngine.MARIADB,
            generateMasterUserPassword: true,
            instanceClass: InstanceType.of(InstanceClass.BURSTABLE2, InstanceSize.SMALL),
            instanceIdentifier: 'kojinten',
            snapshotIdentifier: 'kojinten-20191117',
            masterUsername: 'admin',
            removalPolicy: RemovalPolicy.DESTROY,
            vpc,
            vpcPlacement: { subnetType: SubnetType.PUBLIC }
        });

        // Allow connections on default port from any IPV4
        this.dbInstance.connections.allowDefaultPortFromAnyIpv4()
    }
}

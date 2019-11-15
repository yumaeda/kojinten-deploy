import { Construct, Stack, StackProps } from '@aws-cdk/core'
import { Vpc } from '@aws-cdk/aws-ec2'

export class VpcStack extends Stack {
    readonly vpc: Vpc

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props)

        this.vpc = new Vpc(this, 'kojinten-vpc', { maxAzs: 2 })
    }
}

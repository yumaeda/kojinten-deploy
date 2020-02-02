import { Construct, RemovalPolicy, Stack, StackProps } from '@aws-cdk/core'
import { Anyone, PolicyStatement } from '@aws-cdk/aws-iam'
import { Bucket } from '@aws-cdk/aws-s3'

export class S3Stack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props)

        const bucket = new Bucket(this, 'S3Bucket', {
            bucketName: 'kojinten',
            removalPolicy: RemovalPolicy.DESTROY
        })
        bucket.addToResourcePolicy(new PolicyStatement({
            actions: ['s3:GetObject'],
            resources: [bucket.arnForObjects('*')],
            principals: [new Anyone()]
        }))
    }
}

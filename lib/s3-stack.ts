import { Construct, RemovalPolicy, Stack, StackProps } from '@aws-cdk/core'
import { Anyone, PolicyStatement } from '@aws-cdk/aws-iam'
import { Bucket } from '@aws-cdk/aws-s3'

export class S3Stack extends Stack {
    readonly bucket: Bucket

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props)

        this.bucket = new Bucket(this, 'S3Bucket', {
            bucketName: 'cdn.tokyo-hideaway.com',
            removalPolicy: RemovalPolicy.DESTROY
        })
        this.bucket.addToResourcePolicy(new PolicyStatement({
            actions: ['s3:GetObject'],
            resources: [this.bucket.arnForObjects('*')],
            principals: [new Anyone()]
        }))
    }
}

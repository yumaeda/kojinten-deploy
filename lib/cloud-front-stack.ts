import { Construct, Stack, StackProps } from '@aws-cdk/core'
import { CloudFrontWebDistribution, SecurityPolicyProtocol, SSLMethod, ViewerCertificate } from '@aws-cdk/aws-cloudfront'
import { Certificate } from '@aws-cdk/aws-certificatemanager'
import { Bucket } from '@aws-cdk/aws-s3'

export class CloudFrontStack extends Stack {
    constructor(scope: Construct, id: string, sourceBucket: Bucket, props?: StackProps) {
        super(scope, id, props)

        new CloudFrontWebDistribution(this, 'CloudFront', {
            originConfigs: [{
              s3OriginSource: { s3BucketSource: sourceBucket },
              behaviors: [{ isDefaultBehavior: true }]
            }]
        })
    }
}

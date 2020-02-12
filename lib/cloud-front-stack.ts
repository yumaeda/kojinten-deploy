import { Construct, Stack, StackProps } from '@aws-cdk/core'
import { CloudFrontWebDistribution, SecurityPolicyProtocol, SSLMethod, ViewerCertificate } from '@aws-cdk/aws-cloudfront'
import { Certificate } from '@aws-cdk/aws-certificatemanager'
import { Bucket } from '@aws-cdk/aws-s3'

export class CloudFrontStack extends Stack {
    constructor(scope: Construct, id: string, sourceBucket: Bucket, props?: StackProps) {
        super(scope, id, props)

        const certificateArn = 'arn:aws:acm:us-east-1:823135059493:certificate/00439ffb-ad01-497e-a9af-df4098249ae5'
        new CloudFrontWebDistribution(this, 'CloudFront', {
            originConfigs: [{
              s3OriginSource: { s3BucketSource: sourceBucket },
              behaviors: [{ isDefaultBehavior: true }]
            }],
            viewerCertificate: ViewerCertificate.fromAcmCertificate(
                Certificate.fromCertificateArn(this, 'Certificate', certificateArn),
                {
                    aliases: ['tokyo-hideaway.com', 'www.tokyo-hideaway.com'],
                    securityPolicy: SecurityPolicyProtocol.TLS_V1,
                    sslMethod: SSLMethod.SNI
                }
            )
        })
    }
}

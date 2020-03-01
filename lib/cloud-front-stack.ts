import { Construct, CfnOutput, Stack, StackProps } from '@aws-cdk/core'
import { CloudFrontWebDistribution, SecurityPolicyProtocol, SSLMethod, ViewerCertificate } from '@aws-cdk/aws-cloudfront'
import { Certificate } from '@aws-cdk/aws-certificatemanager'
import { Bucket } from '@aws-cdk/aws-s3'
import { CnameRecord, PublicHostedZone, RecordTarget } from '@aws-cdk/aws-route53'

export class CloudFrontStack extends Stack {
    constructor(scope: Construct, id: string, sourceBucket: Bucket, props?: StackProps) {
        super(scope, id, props)

        const hostedZoneId = 'Z2H02ZWJT2N1X8'
        const zoneName = 'tokyo-hideaway.com'
        const cdnAlias = `cdn.${zoneName}`
        const zone = PublicHostedZone.fromHostedZoneAttributes(this, id, { zoneName, hostedZoneId })
        const certificateArn = 'arn:aws:acm:us-east-1:823135059493:certificate/28f984da-1950-4343-b347-773e991e9de4'
        let cf = new CloudFrontWebDistribution(this, 'CloudFront', {
            originConfigs: [{
              s3OriginSource: { s3BucketSource: sourceBucket },
              behaviors: [{ isDefaultBehavior: true }]
            }],
            viewerCertificate: ViewerCertificate.fromAcmCertificate(
                Certificate.fromCertificateArn(this, 'Certificate', certificateArn),
                {
                    aliases: [cdnAlias],
                    securityPolicy: SecurityPolicyProtocol.TLS_V1,
                    sslMethod: SSLMethod.SNI
                }
            )
        })
        new CfnOutput(this, "CloudFront Domain", {value: cf.domainName});
        new CnameRecord(this, 'CnameRecord', {
            recordName: cdnAlias,
            zone,
            domainName: cf.domainName 
        })
    }
}

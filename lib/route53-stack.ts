import { Construct, Stack, StackProps } from '@aws-cdk/core'
import { ARecord, PublicHostedZone, RecordTarget } from '@aws-cdk/aws-route53'
import { LoadBalancerTarget } from '@aws-cdk/aws-route53-targets'
import { ILoadBalancerV2 } from '@aws-cdk/aws-elasticloadbalancingv2'

export class Route53Stack extends Stack {
    constructor(scope: Construct, id: string, recordName: string, elb: ILoadBalancerV2, props?: StackProps) {
        super(scope, id, props)

        const hostedZoneId = 'Z2H02ZWJT2N1X8'
        const zone = PublicHostedZone.fromHostedZoneAttributes(this, id, { zoneName: recordName, hostedZoneId })
        new ARecord(this, 'AliasRecord', {
            zone,
            recordName,
            target: RecordTarget.fromAlias(new LoadBalancerTarget(elb))
        })
    }
}

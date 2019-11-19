import { Construct, Stack, StackProps } from '@aws-cdk/core'
import { ISecretAttachmentTarget, Secret, AttachmentTargetType } from '@aws-cdk/aws-secretsmanager'

export class SecretsManagerStack extends Stack {
    readonly secret: Secret

    constructor(scope: Construct, id: string, rdsId: string, props?: StackProps) {
        super(scope, id, props)

        const target: ISecretAttachmentTarget = {
            asSecretAttachmentTarget: () => ({
                targetId: rdsId,
                targetType: AttachmentTargetType.INSTANCE
            })
        }

        this.secret = new Secret(this, 'KojintenSecret', {
            generateSecretString: {
                secretStringTemplate: JSON.stringify({
                    username: 'admin',
                    password: '' 
                }),
                generateStringKey: 'password'
            }
        })

        this.secret.addTargetAttachment('AttachedSecret', { target })
    }
}
